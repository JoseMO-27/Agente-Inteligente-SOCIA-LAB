import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

// Default documents in the RAG memory base
const PRELOADED_DOCUMENTS = [
  {
    id: "ebc-2006",
    title: "Estándares Básicos de Competencias (EBC) - Ciencias Sociales",
    type: "Ministerio de Educación Nacional (MEN)",
    year: 2006,
    size: "2.4 MB",
    summary: "Establece los criterios públicos sobre saberes, relaciones espaciales-ambientales, ético-políticas e históricas."
  },
  {
    id: "dba-cs-v2",
    title: "Derechos Básicos de Aprendizaje (DBA) de Ciencias Sociales V2",
    type: "MEN / U. de Antioquia",
    year: 2016,
    size: "1.8 MB",
    summary: "Detalla los aprendizajes estructurantes para cada grado. Herramienta principal para estructurar secuencias didácticas de aula."
  },
  {
    id: "lineamientos-cs-2026",
    title: "Lineamientos Curriculares de Ciencias Sociales (Actualización 2026)",
    type: "MEN / U. de Antioquia - Hito Curricular",
    year: 2026,
    size: "4.2 MB",
    summary: "Se aparta de la mera memorización histórica e impulsa el pensamiento computacional, el análisis geográfico del territorio y la memoria histórica."
  },
  {
    id: "catedra-paz-1732",
    title: "Cátedra de la Paz (Decreto 1038 de 2015 & Ley 1732)",
    type: "Marco Prescriptivo Nacional",
    year: 2015,
    size: "1.1 MB",
    summary: "Establece la obligatoriedad de la Cátedra de la Paz, enfocada en cultura de paz, educación para la paz y desarrollo sostenible."
  },
  {
    id: "pei-institucional",
    title: "PEI - Institución Educativa Modelo (Ejemplo Integrado)",
    type: "Uso Local",
    year: 2025,
    size: "1.4 MB",
    summary: "Proyecto Educativo Institucional (PEI) alineado con enfoques socráticos, aprendizaje basado en problemas (ABP) y evaluación formativa (SIEE)."
  }
];

// Memory for uploaded custom file metadata
let uploadedDocuments = [...PRELOADED_DOCUMENTS];

// Lazy-initialized Gemini AI client
let aiInstance: GoogleGenAI | null = null;
function getAi() {
  if (!aiInstance) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY no configurado. Por favor, añádelo en el panel de secretos.");
    }
    aiInstance = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        }
      }
    });
  }
  return aiInstance;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ extended: true, limit: "50mb" }));

  // API - check health
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", time: new Date() });
  });

  // API - get curriculum documents
  app.get("/api/documents", (req, res) => {
    res.json({ success: true, data: uploadedDocuments });
  });

  // API - handle document upload simulation
  app.post("/api/documents/upload", (req, res) => {
    const { title, type, content, year, size } = req.body;
    if (!title || !content) {
      return res.status(400).json({ success: false, error: "Título y contenido son requeridos." });
    }
    const newDoc = {
      id: "uploaded-" + Date.now(),
      title,
      type: type || "Documento Local Subido",
      year: year || 2026,
      size: size || "350 KB",
      summary: content.substring(0, 180) + "..."
    };
    uploadedDocuments.push(newDoc);
    res.json({ success: true, document: newDoc, message: "Documento cargado en la base de conocimientos RAG adaptativa." });
  });

  // API - Reset document base to default
  app.post("/api/documents/reset", (req, res) => {
    uploadedDocuments = [...PRELOADED_DOCUMENTS];
    res.json({ success: true, message: "Base de documentos curricular restablecida." });
  });

  // API - Chat pedagógico con lógica socrática, adaptativa, RAG y contextualizada en Colombia.
  app.post("/api/gemini/chat", async (req, res) => {
    try {
      const {
        messages,
        studentInfo,
        robotConfig,
        currentDocumentId
      } = req.body;

      // Extract details with fallback
      const studentName = studentInfo?.name || "Estudiante";
      const studentGrade = studentInfo?.grade || "8°";
      const studentRegion = studentInfo?.region || "Antioquia";
      const studentSubregion = studentInfo?.subregion || "N/A";
      const studentLevel = studentInfo?.level || "Básico"; // Básico, Intermedio, Avanzado

      const academicRigor = robotConfig?.academicRigor || "Academic Rigor";
      const toneStyle = robotConfig?.toneStyle || "Conversational";
      const pedagogicalAproach = robotConfig?.approach || "Prioritizes chronology and causation";

      // Build context from active document if selected
      const selectedDoc = uploadedDocuments.find(d => d.id === currentDocumentId);
      const documentContext = selectedDoc 
        ? `DOCUMENTO CURRICULAR ALINEADO (RAG activo): El tutor y el estudiante están enfocados en el documento institucional: "${selectedDoc.title}" (${selectedDoc.type}, ${selectedDoc.year}). Integra los conceptos, competencias o propósitos de este documento en las contrapreguntas socráticas.`
        : `DOCUMENTO CURRICULAR ALINEADO (RAG activo): El tutor está usando la alineación general de la Ley 115 (Ciencias Sociales), EBC de Ciencias Sociales nacionales, los DBA vigentes y los Lineamientos Nacionales actualizados de 2026.`;

      // Define specialized Colombian Socratic System prompt
      const socraticSystemInstruction = `
Eres SOCIA-LAB Colombia, un agente pedagógico inteligente experto y tutor socrático de Ciencias Sociales para estudiantes colombianos de educación básica y media.
Tu rol NO es responder preguntas de manera directa o proveer soluciones. Tu rol es actuar como un mediador socrático interactivo que acompaña al estudiante para que construya su propio aprendizaje crítico.

SIGUE ESTAS INSTRUCCIONES PEDAGÓGICAS ABSOLUTAS:
1. MÉTODO SOCRÁTICO:
   - NUNCA des respuestas conceptuales directas o explicaciones enciclopédicas completas.
   - En lugar de eso, responde con una contrapregunta guiadora, pistas conceptuales progresivas o un dilema ético/territorial que haga dudar al estudiante o lo invite a indagar.
   - Si el estudiante tiene un error conceptual, no le digas "está mal". Ofrece una pista de nivel 1 (definición implícita o analogía cotidiana) y pregúntale cómo se aplica esa pista a su caso.
   - Si su respuesta es superficial, aumenta intelectualmente la dificultad invitándolo a considerar variables adicionales (economía, geografía, actores sociales, etc.).
   - Si su respuesta es sólida y argumentada, felicítalo y profundiza introduciendo un dilema socio-ambiental o ético-político real.

2. CONTEXTUALIZACIÓN Y TERRITORIALIZACIÓN COLOMBIANA:
   - El estudiante actual es del departamento de: "${studentRegion}"${studentSubregion !== "N/A" ? `, municipio/zona: "${studentSubregion}"` : ""}.
   - Si el territorio es Montería o el departamento es Córdoba: de manera prioritaria y constante, contextualiza las preguntas y los problemas de Ciencias Sociales con ejemplos territoriales del Caribe colombiano, de la cuenca del Río Sinú, de la cultura y herencia Zenú (resguardos, trenzado de caña flecha), la ganadería extensiva, los conflictos por la tierra en el Bajo Sinú, o la historia regional del departamento de Córdoba.
   - Para otras regiones colombianas, utiliza casos geográficos y socioculturales de su territorio (ej. comunas de Medellín, páramos andinos, minería en el Pacífico, cultivos en el llano, etc.).

3. ADAPTACIÓN COGNITIVA POR GRADO Y NIVEL DETECTADO:
   - El estudiante de nombre "${studentName}" está en grado "${studentGrade}". Su nivel detectado es "${studentLevel}".
   - Si es Primaria (grados 4-5): Utiliza un lenguaje muy sencillo, empático, concreto, con ejemplos cotidianos (los parques del barrio, la junta de acción comunal, las tiendas). Limita las preguntas a una a la vez.
   - Si es Básica (grados 6-9): Traduce la interacción introduciendo análisis de causalidad histórica o geográfica. Invítalo a analizar relaciones de poder, recursos económicos locales y la Constitución de 1991.
   - Si es Media (grados 10-11): Conecta la teoría social directamente con las competencias ciudadanas (Pruebas Saber 11: Pensamiento Social, Interpretación de Perspectivas, Pensamiento Reflexivo). Genera debates que demanden posturas ético-políticas complejas, dilemas sobre distribución de recursos y Cátedra de la Paz.

4. CONFIGURACIÓN DEL DOCENTE ACTIVA:
   - Rigor Académico configurado: "${academicRigor}" (Ajusta la exigencia técnica según este valor).
   - Estilo de Tono: "${toneStyle}" (Usa un tono más riguroso o más cercano/conversacional según se especifique).
   - Enfoque Pedagógico activo: "${pedagogicalAproach}" (Enfoca tus intervenciones ya sea en la cronología y causalidad histórica, la democracia y ética ciudadana, o la geografía territorial y ambiental).

5. LÓGICA DE DETECCIÓN DE ERRORES:
   - Error Conceptual: El estudiante confunde conceptos básicos (ej: creer que el Bogotazo ocurrió en la Independencia). Debes retroceder amablemente e introducir una pista temporal.
   - Error de Interpretación: El estudiante analiza el problema desde una sola perspectiva simplista (ej: "los recursos naturales traen riqueza y ya"). Invítalo a ver el punto de vista de las comunidades locales vs el interés del estado.
   - Error de Análisis Crítico: El estudiante carece de razonamiento de causa-efecto. Guíalo con preguntas en cadena (¿Qué pasó antes? ¿Quiénes tomaron la decisión?).

6. RESTRICCIONES DE SEGURIDAD Y FILTRO TEMÁTICO:
   - Eres EXCLUSIVAMENTE un tutor de Ciencias Sociales. Si el estudiante intenta hacer preguntas de matemáticas, física rudimentaria, codificación informática, o temas ajenos al currículo, usa el filtro temático estricto: rechaza responder de forma lúdica y académica, y reconduce la conversación hacia el análisis social o ciudadano (ej: "¿Sabías que los cálculos estadísticos los usa el DANE para entender las necesidades de tu región? Volvamos a la geografía de tu municipio...").

INFORMACIÓN DE CONTEXTO ADICIONAL:
${documentContext}

RECUERDA: Habla directamente con ${studentName}. Utiliza un lenguaje estimulante, humano, pedagógico, motivador y 100% libre de "AI slop" o modismos de chat bot genérico. Escribe respuestas cortas o medianas (evita monólogos extensos) para mantener al estudiante interesado e interactuando activamente.
`;

      const ai = getAi();
      
      // Map frontend messages structure to Gemini SDK input
      // System instructions go inside optimal config parameter
      const contentsPayload = messages.map((m: any) => ({
        role: m.sender === "user" ? "user" as const : "model" as const,
        parts: [{ text: m.text }]
      }));

      const modelName = "gemini-3.5-flash";

      const apiResponse = await ai.models.generateContent({
        model: modelName,
        contents: contentsPayload,
        config: {
          systemInstruction: socraticSystemInstruction,
          temperature: 0.7,
          topP: 0.9,
          topK: 40
        }
      });

      const responseText = apiResponse.text || "Lo siento, no pude procesar la respuesta socrática. Por favor, intenta de nuevo.";

      // Mock real-time analysis of the latest user message to update analytics
      const lastUserMessage = messages[messages.length - 1]?.text || "";
      let detectedFeedback = "Analizando tu participación para la retroalimentación socrática...";
      let scoreIncrement = 2;
      let errorIndicator: string | null = null;

      if (lastUserMessage.length > 0) {
        const lowerMsg = lastUserMessage.toLowerCase();
        if (lowerMsg.includes("no se") || lowerMsg.includes("no sé") || lowerMsg.length < 8) {
          detectedFeedback = "Has dado una respuesta corta. ¡El tutor te dará una pista conceptual para guiarte!";
          scoreIncrement = 1;
        } else if (lowerMsg.includes("gobierno") || lowerMsg.includes("politica") || lowerMsg.includes("alcalde")) {
          detectedFeedback = "¡Excelente enfoque político! Analizas las relaciones institucionales del Estado.";
          scoreIncrement = 4;
        } else if (lowerMsg.includes("dinero") || lowerMsg.includes("pobre") || lowerMsg.includes("economia") || lowerMsg.includes("recursos")) {
          detectedFeedback = "¡Gran perspectiva económica! Conectas la geografía con los recursos territoriales.";
          scoreIncrement = 5;
        } else if (lowerMsg.includes("ambientes") || lowerMsg.includes("contamina") || lowerMsg.includes("rio") || lowerMsg.includes("río") || lowerMsg.includes("naturaleza")) {
          detectedFeedback = "Excelente consideración ambiental. Integrando la ecología en el pensamiento social.";
          scoreIncrement = 5;
        }
      }

      res.json({
        success: true,
        text: responseText,
        analysis: {
          feedback: detectedFeedback,
          scoreIncrement,
          errorIndicator
        }
      });

    } catch (e: any) {
      console.error(e);
      res.status(500).json({ success: false, error: e.message || "Error al procesar la solicitud con Gemini." });
    }
  });

  // Serve static files in production & configure Vite as middleware in development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[SOCIA-LAB Server] Servidor activo en puerto http://localhost:${PORT}`);
  });
}

startServer();
