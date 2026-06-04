import React, { useState } from "react";
import { StudentInfo, RobotConfig, DocumentMeta, StudentGroup, StudentLog } from "../types";
import { Users, FileText, Sliders, Upload, TrendingUp, AlertTriangle, Play, HelpCircle, RefreshCw, Download } from "lucide-react";

interface TeacherPanelProps {
  documents: DocumentMeta[];
  onUploadDocument: (title: string, content: string) => void;
  robotConfig: RobotConfig;
  onUpdateRobotConfig: (config: RobotConfig) => void;
  onResetDocuments: () => void;
}

export default function TeacherPanel({
  documents,
  onUploadDocument,
  robotConfig,
  onUpdateRobotConfig,
  onResetDocuments
}: TeacherPanelProps) {
  const [docTitle, setDocTitle] = useState("");
  const [docContent, setDocContent] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);

  // Teacher groups list
  const groups: StudentGroup[] = [
    { id: "g1", name: "Grado 11° - Grupo A (Ciencias Sociales)", averageScore: 84, activeStudents: 32, alertsCount: 1 },
    { id: "g2", name: "Grado 11° - Grupo B (Cátedra de la Paz)", averageScore: 78, activeStudents: 29, alertsCount: 3 },
    { id: "g3", name: "Grado 10° - Grupo A (Geografía Económica)", averageScore: 71, activeStudents: 35, alertsCount: 5 }
  ];

  // Detailed student progress and alerts for the SIEE (Sistema de Evaluación)
  const students = [
    { id: "s1", name: "Jose Mestra", latestTopic: "El Bogotazo de 1948", score: 88, status: "Superior", alert: null },
    { id: "s2", name: "Maria Alvarez", latestTopic: "Reforma Agraria en Córdoba", score: 58, status: "Bajo", alert: "Caída del 25% en Coherencia Argumentativa - Dificultad en identificar causas históricas" },
    { id: "s3", name: "Carlos Ortega", latestTopic: "Constitución de 1991", score: 72, status: "Básico", alert: "Alerta: El estudiante asocia todas las normas al Alcalde y no a la Constitución." },
    { id: "s4", name: "Elizabeth Gomez", latestTopic: "Páramos y Cambio Climático", score: 81, status: "Alto", alert: null }
  ];

  const handleFileUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docTitle || !docContent) return;
    onUploadDocument(docTitle, docContent);
    setUploadSuccess(`¡Éxito! El documento "${docTitle}" ha sido procesado mediante el pipeline RAG y está listo para uso curricular en el chat.`);
    setDocTitle("");
    setDocContent("");
    setTimeout(() => setUploadSuccess(null), 5000);
  };

  const handleSliderChange = (key: keyof RobotConfig, value: any) => {
    onUpdateRobotConfig({
      ...robotConfig,
      [key]: value
    });
  };

  const handleExportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + ["Nombre,Tema Evaluado,Puntaje,Nivel SIEE,Alertas"].join(",") + "\n"
      + students.map(s => [s.name, s.latestTopic, s.score, s.status, s.alert || "Ninguna"].join(",")).join("\n");
      
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "Reporte_Estudiantes_SociaLab.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-5 rounded-2xl border border-gray-200 flex items-center justify-between shadow-sm">
          <div className="space-y-1">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Grupos a Cargo</span>
            <h4 className="font-plus text-2xl font-extrabold text-[#1a1c1c]">{groups.length} Salones</h4>
          </div>
          <div className="p-3 bg-primary-container text-white rounded-xl">
            <Users className="w-5 h-5 text-secondary-fixed" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 flex items-center justify-between shadow-sm">
          <div className="space-y-1">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Promedio de Competencias</span>
            <h4 className="font-plus text-2xl font-extrabold text-[#1a1c1c]">77.6% (Alto)</h4>
          </div>
          <div className="p-3 bg-emerald-100 text-emerald-800 rounded-xl">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 flex items-center justify-between shadow-sm">
          <div className="space-y-1">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Alertas Pedagógicas Activas</span>
            <h4 className="font-plus text-2xl font-extrabold text-amber-800">2 Estudiantes</h4>
          </div>
          <div className="p-3 bg-amber-100 text-amber-800 rounded-xl">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: Student Tracking List (7/12 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Groups list */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-4">
            <h3 className="font-plus text-lg font-bold text-[#1a1c1c]">Resumen de Grupos</h3>
            <div className="space-y-3">
              {groups.map(g => (
                <div key={g.id} className="p-4 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-between">
                  <div>
                    <span className="text-sm font-bold text-gray-700 block">{g.name}</span>
                    <span className="text-xs text-gray-500 mt-1">{g.activeStudents} alumnos activos</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-gray-400 uppercase">Puntaje SIEE</span>
                    <span className="font-plus text-lg font-extrabold text-primary block">{g.averageScore}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Student Detailed Performance & Alerts */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-plus text-lg font-bold text-[#1a1c1c]">Monitoreo de Estudiantes en Tiempo Real</h3>
              <button 
                onClick={handleExportCSV}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-primary hover:text-white hover:bg-primary border border-primary rounded-xl transition-all"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Exportar Reporte SIEE (CSV)</span>
              </button>
            </div>

            <div className="space-y-4">
              {students.map(student => (
                <div key={student.id} className="p-4 rounded-xl border border-gray-100 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-sm font-bold text-gray-700 block">{student.name}</span>
                      <span className="text-xs text-gray-500">{student.latestTopic}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold text-primary">{student.score} puntos</span>
                      <span className="text-[10px] uppercase font-bold text-gray-400 block">SociaLab Rank</span>
                    </div>
                  </div>

                  {student.alert ? (
                    <div className="p-3 bg-amber-50 rounded-lg text-xs text-amber-800 flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <span>{student.alert}</span>
                    </div>
                  ) : (
                    <div className="p-3 bg-emerald-50 rounded-lg text-xs text-emerald-800 flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                      <span>Participación fluida. Progreso socrático adecuado.</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Side: Socratic configs & document upload (5/12 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Custom prompt sliders */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-5">
            <div className="flex items-center gap-2">
              <Sliders className="w-5 h-5 text-primary" />
              <h3 className="font-plus text-base font-bold text-[#1a1c1c]">Configuración del Robot Socrático</h3>
            </div>
            
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Personaliza el nivel de exigencia, tono conversacional, y enfoque de investigación que el tutor de IA aplicará a los estudiantes de todos tus grupos en tiempo real.
            </p>

            <div className="space-y-4 pt-2">
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-[#40484d]">
                  <span>Rigor Académico</span>
                  <span className="text-primary">{robotConfig.academicRigor}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] text-gray-400">Flexible</span>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="1"
                    value={robotConfig.academicRigor === "Permissive" ? "0" : "1"}
                    onChange={(e) => handleSliderChange("academicRigor", e.target.value === "0" ? "Permissive" : "Academic Rigor")}
                    className="flex-1 accent-primary h-1.5 bg-gray-200 rounded-lg"
                  />
                  <span className="text-[10px] text-gray-400">Exigente</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-[#40484d]">
                  <span>Tono Conversacional</span>
                  <span className="text-primary">{robotConfig.toneStyle}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] text-gray-400">Formal</span>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="1"
                    value={robotConfig.toneStyle === "Formal" ? "0" : "1"}
                    onChange={(e) => handleSliderChange("toneStyle", e.target.value === "0" ? "Formal" : "Conversational")}
                    className="flex-1 accent-primary h-1.5 bg-gray-200 rounded-lg"
                  />
                  <span className="text-[10px] text-gray-400">Cercano</span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 block">Enfoque Pedagógico del Aula</label>
                <div className="space-y-2 pt-1">
                  <label className="flex items-center gap-2 text-xs font-medium text-gray-700 cursor-pointer">
                    <input 
                      type="radio" 
                      name="approach" 
                      value="Prioritizes chronology and causation"
                      checked={robotConfig.approach === "Prioritizes chronology and causation"}
                      onChange={(e) => handleSliderChange("approach", e.target.value)}
                      className="text-primary focus:ring-primary" 
                    />
                    <span>Prioriza Cronología y Causalidad</span>
                  </label>
                  <label className="flex items-center gap-2 text-xs font-medium text-gray-700 cursor-pointer">
                    <input 
                      type="radio" 
                      name="approach" 
                      value="Focuses on democracy and ethics"
                      checked={robotConfig.approach === "Focuses on democracy and ethics"}
                      onChange={(e) => handleSliderChange("approach", e.target.value)}
                      className="text-primary focus:ring-primary" 
                    />
                    <span>Enfoque en Democracia y Ética Ciudadana</span>
                  </label>
                  <label className="flex items-center gap-2 text-xs font-medium text-gray-700 cursor-pointer">
                    <input 
                      type="radio" 
                      name="approach" 
                      value="Territorial and environmental focus"
                      checked={robotConfig.approach === "Territorial and environmental focus"}
                      onChange={(e) => handleSliderChange("approach", e.target.value)}
                      className="text-primary focus:ring-primary" 
                    />
                    <span>Enfoque Territorial y Ambiental</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Live Prompt Preview Console (So the teacher sees the prompt changing live!) */}
            <div className="bg-gray-900 border border-gray-800 text-green-400 rounded-xl p-3 font-mono text-[9px] space-y-1 select-none">
              <span className="text-gray-500 font-bold block mb-1">PROMPT SISTEMA SOCRÁTICO ACTIVO:</span>
              <p className="truncate">// Tono: {robotConfig.toneStyle} | Rigor: {robotConfig.academicRigor}</p>
              <p className="truncate">// Enfoque: {robotConfig.approach}</p>
              <p className="text-gray-400 truncate">"...Eres SOCIA-LAB, tutor que motiva sin dar respuestas directas..."</p>
            </div>
          </div>

          {/* RAG Upload Curriculum Guides */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                <h3 className="font-plus text-base font-bold text-[#1a1c1c]">Documentos de la Institución (RAG)</h3>
              </div>
              <button 
                onClick={onResetDocuments}
                className="p-1 px-2.5 rounded bg-gray-100 hover:bg-gray-200 text-[10px] font-bold text-gray-500 transition-all flex items-center gap-1"
                title="Restablecer base de documentos"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Restablecer</span>
              </button>
            </div>

            <p className="text-xs text-gray-500 leading-normal">
              La IA lee estos documentos (PEI, SIEE, DBA, etc.) para formular preguntas socráticas contextualizadas según tu colegio.
            </p>

            <div className="max-h-[170px] overflow-y-auto space-y-2 border border-gray-100 p-2.5 rounded-xl bg-gray-50">
              {documents.map(doc => (
                <div key={doc.id} className="p-2.5 rounded-lg bg-white border border-gray-100 flex justify-between items-center gap-4">
                  <div className="min-w-0">
                    <span className="text-xs font-bold text-gray-700 block truncate">{doc.title}</span>
                    <span className="text-[10px] text-gray-400">{doc.type} • {doc.year}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-[#e0f2fe] text-primary shrink-0">
                    {doc.size}
                  </span>
                </div>
              ))}
            </div>

            {uploadSuccess && (
              <div className="p-3 bg-emerald-50 border-l-4 border-emerald-500 rounded text-[10px] text-emerald-800 leading-relaxed">
                {uploadSuccess}
              </div>
            )}

            {/* Custom document upload card */}
            <form onSubmit={handleFileUpload} className="space-y-3 pt-3 border-t border-gray-100">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-gray-500">Título del Documento Curricular</label>
                <input 
                  type="text" 
                  value={docTitle}
                  onChange={(e) => setDocTitle(e.target.value)}
                  placeholder="Ej: Plan del Área de Ciencias Sociales - 2026"
                  className="w-full text-xs bg-gray-50 border border-gray-200 rounded-lg p-2.5"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-gray-500">Contenido o Extracto</label>
                <textarea
                  rows={2}
                  value={docContent}
                  onChange={(e) => setDocContent(e.target.value)}
                  placeholder="Inserta aquí los lineamientos, modelo pedagógico, o especificaciones del SIEE del colegio..."
                  className="w-full text-xs bg-gray-50 border border-gray-200 rounded-lg p-2.5"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 bg-primary text-white font-bold text-xs rounded-xl hover:bg-[#002f3f] transition-all flex items-center justify-center gap-1.5"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Cargar a la base RAG de SociaLab</span>
              </button>
            </form>
          </div>

        </div>

      </div>

    </div>
  );
}
