import React, { useState, useEffect, useRef } from "react";
import { Message, StudentInfo, RobotConfig, DocumentMeta } from "../types";
import { Send, Sparkles, RefreshCw, AlertCircle, HelpCircle, FileText, Upload, BrainCircuit, User } from "lucide-react";

interface SocraticChatProps {
  studentInfo: StudentInfo;
  robotConfig: RobotConfig;
  documents: DocumentMeta[];
  prefilledPrompt: string | null;
  clearPrefilledPrompt: () => void;
}

export default function SocraticChat({
  studentInfo,
  robotConfig,
  documents,
  prefilledPrompt,
  clearPrefilledPrompt
}: SocraticChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "wel-1",
      text: `¡Hola, ${studentInfo.name}! Bienvenido a tu espacio de laboratorio socrático en SOCIA-LAB Colombia. Soy tu robot tutor IA de Ciencias Sociales. Hoy exploraremos el territorio, la ciudadanía o la historia desde tu región de ${studentInfo.region}. ¿De qué te gustaría hablar o qué dilema te gustaría explorar hoy?`,
      sender: "tutor",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedDocId, setSelectedDocId] = useState<string>("");
  const [hintCount, setHintCount] = useState(0);
  const [activeAnalysis, setActiveAnalysis] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Handle preset prompts triggered from dashboard
  useEffect(() => {
    if (prefilledPrompt) {
      handleSendMessage(prefilledPrompt);
      clearPrefilledPrompt();
    }
  }, [prefilledPrompt]);

  const handleSendMessage = async (textToSend: string) => {
    const finalMsg = textToSend.trim();
    if (!finalMsg) return;

    // Add user message
    const userMsg: Message = {
      id: "usr-" + Date.now(),
      text: finalMsg,
      sender: "user",
      timestamp: new Date()
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/gemini/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages,
          studentInfo,
          robotConfig,
          currentDocumentId: selectedDocId
        })
      });

      const result = await response.json();
      if (result.success) {
        const tutorMsg: Message = {
          id: "tut-" + Date.now(),
          text: result.text,
          sender: "tutor",
          timestamp: new Date()
        };
        setMessages(prev => [...prev, tutorMsg]);
        if (result.analysis) {
          setActiveAnalysis(result.analysis.feedback);
          if (result.analysis.errorIndicator) {
            setHintCount(prev => prev + 1);
          }
        }
      } else {
        throw new Error(result.error);
      }
    } catch (err: any) {
      console.error(err);
      const errorMsg: Message = {
        id: "tut-error-" + Date.now(),
        text: `Error de conexión: No se pudo contactar al servidor o el archivo nacional está indispuesto. Asegúrate de que el secreto GEMINI_API_KEY esté activo. Detalle: ${err.message || "Error Desconocido"}`,
        sender: "tutor",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(input);
  };

  // Preset triggers to expose the Socratic & Math filters clearly to the evaluator
  const triggerOffTopic = () => {
    handleSendMessage("¿Me ayudas a resolver la ecuación cuadrática x^2 - 5x + 6 = 0?");
  };

  const triggerBogotazo = () => {
    handleSendMessage("El Bogotazo fue solo una pelea sin importancia en Bogotá.");
  };

  const triggerMonteria = () => {
    handleSendMessage("¿Cómo influye la geografía de Montería y el río Sinú en la economía ganadera de Córdoba?");
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden grid grid-cols-1 lg:grid-cols-12 h-[calc(100vh-220px)] lg:h-[700px] font-vietnam">
      
      {/* Left Sidebar: Socratic settings and SIEE links (4/12 cols) */}
      <div className="lg:col-span-3 border-r border-gray-200 bg-gray-50 p-5 flex flex-col justify-between overflow-y-auto hidden lg:flex">
        <div className="space-y-6">
          
          {/* Active Context Status */}
          <div>
            <span className="text-[10px] font-bold text-primary uppercase tracking-wider block mb-1">Alineación de Aula</span>
            <h4 className="font-plus text-base font-bold text-[#1a1c1c]">Tutoría Socrática Activa</h4>
            <p className="text-xs text-gray-500 mt-1">El robot sigue las directrices del PEI y las competencias del MEN.</p>
          </div>

          {/* SIEE Document Alignment / RAG selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Documento de Apoyo (RAG)</label>
            <p className="text-[10px] text-gray-500">Selecciona el documento nacional o el PEI local que el tutor debe integrar a la sesión.</p>
            <select
              value={selectedDocId}
              onChange={(e) => setSelectedDocId(e.target.value)}
              className="w-full text-xs bg-white border border-gray-200 rounded-lg p-2.5 focus:ring-1 focus:ring-primary focus:border-primary text-gray-700 font-medium"
            >
              <option value="">Alineación General MEN (Saber 11)</option>
              {documents.map(doc => (
                <option key={doc.id} value={doc.id}>{doc.title}</option>
              ))}
            </select>
          </div>

          {/* Active Pedagogical Rules Overview */}
          <div className="p-3 bg-white border border-gray-100 rounded-xl space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-primary">
              <BrainCircuit className="w-4 h-4" />
              <span>Instrucciones Activas</span>
            </div>
            <ul className="space-y-1.5 text-[10px] text-[#40484d] list-disc list-inside">
              <li>No dar respuestas directas.</li>
              <li>Ajustar lenguaje al grado {studentInfo.grade}.</li>
              <li>Tono {robotConfig.toneStyle} activo.</li>
              <li>Rango SIEE: {studentInfo.level}.</li>
              <li>Enfoque: {robotConfig.approach}.</li>
            </ul>
          </div>

          {/* Real-time Cognitive Trace */}
          {activeAnalysis && (
            <div className="p-3 bg-[#e0f1f7]/50 rounded-xl border border-[#b2dbe9]/50 space-y-1">
              <span className="text-[10px] font-bold text-primary uppercase block">Rastreo Cognitivo SIEE</span>
              <p className="text-xs text-primary font-medium leading-normal">{activeAnalysis}</p>
            </div>
          )}

        </div>

        {/* Demo trigger helpers */}
        <div className="pt-4 border-t border-gray-200 space-y-2">
          <span className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Pruebas Rápidas del Tutor:</span>
          
          <button 
            onClick={triggerOffTopic}
            className="w-full text-left p-2 bg-rose-50 border border-rose-100 hover:bg-rose-100 rounded-lg text-[10px] text-rose-800 transition-colors flex items-center justify-between"
          >
            <span>Probar Filtro Temático (Ecuación)</span>
            <span className="material-symbols-outlined text-xs">arrow_forward</span>
          </button>

          <button 
            onClick={triggerBogotazo}
            className="w-full text-left p-2 bg-[#f0fdf4] border border-[#dcfce7] hover:bg-[#dcfce7] rounded-lg text-[10px] text-emerald-800 transition-colors flex items-center justify-between"
          >
            <span>Probar Detección de Error</span>
            <span className="material-symbols-outlined text-xs">arrow_forward</span>
          </button>

          <button 
            onClick={triggerMonteria}
            className="w-full text-left p-2 bg-[#fef3c7] border border-[#fef3c7] hover:bg-[#fef3c7] rounded-lg text-[10px] text-amber-800 transition-colors flex items-center justify-between"
          >
            <span>Probar Contexto Montería</span>
            <span className="material-symbols-outlined text-xs">arrow_forward</span>
          </button>
        </div>

      </div>

      {/* Right Side: Chat interaction area (9/12 cols) */}
      <div className="lg:col-span-9 flex flex-col justify-between h-full bg-surface-bright">
        
        {/* Chat Header */}
        <div className="px-6 py-4 bg-white border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-container text-white rounded-xl flex items-center justify-center">
              <span className="material-symbols-outlined text-xl text-secondary-fixed animate-pulse">android</span>
            </div>
            <div>
              <h3 className="font-plus text-sm font-bold text-[#1a1c1c]">Tutoría Socrática de Sociales</h3>
              <p className="text-[10px] text-gray-500">Alineado con {studentInfo.region} • Grado {studentInfo.grade}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span className="text-[10px] uppercase font-bold text-gray-400">Gemini Online</span>
            </div>
            <button
              onClick={() => {
                setMessages([
                  {
                    id: "wel-reset",
                    text: `¡Hola, ${studentInfo.name}! Tu sesión ha sido reiniciada. ¿Qué tema o problema de Ciencias Sociales colombianas conversaremos ahora? Recuerda que estamos configurados para enfocarnos en tu región de ${studentInfo.region}.`,
                    sender: "tutor",
                    timestamp: new Date()
                  }
                ]);
                setActiveAnalysis(null);
                setHintCount(0);
              }}
              className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 transition-all active:rotate-90 duration-300"
              title="Reiniciar chat"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Messages Body */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4 max-h-[calc(100vh-380px)] lg:max-h-[500px]">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex gap-3 max-w-[85%] ${
                m.sender === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
              }`}
            >
              {/* Avatar */}
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                m.sender === "user" ? "bg-accent/40 text-primary" : "bg-primary-container text-white"
              }`}>
                {m.sender === "user" ? (
                  <User className="w-4 h-4" />
                ) : (
                  <span className="material-symbols-outlined text-base">android</span>
                )}
              </div>

              {/* Bubble Body */}
              <div className="space-y-1">
                <div className={`p-4 rounded-2xl text-sm leading-relaxed ${
                  m.sender === "user"
                    ? "bg-primary text-white rounded-tr-none"
                    : "bg-white border border-gray-200 rounded-tl-none text-[#1a1c1c]"
                }`}>
                  <p>{m.text}</p>
                </div>
                <div className={`text-[9px] text-gray-400 px-1 ${m.sender === "user" ? "text-right" : "text-left"}`}>
                  {m.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex gap-3 max-w-[85%] mr-auto items-center">
              <div className="w-8 h-8 rounded-lg bg-primary-container text-white flex items-center justify-center animate-spin">
                <RefreshCw className="w-4 h-4" />
              </div>
              <div className="bg-white border border-gray-100 px-4 py-3 rounded-2xl rounded-tl-none text-xs text-gray-400 flex items-center gap-2">
                <span>El Tutor Socrático está analizando tu respuesta...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Form Footer */}
        <div className="p-4 bg-white border-t border-gray-200">
          <form onSubmit={handleFormSubmit} className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Explícame qué opinas o haz una consulta..."
              className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-primary focus:border-primary focus:bg-white transition-all"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="p-3 bg-primary text-white rounded-xl hover:bg-[#002f3f] transition-all disabled:opacity-50 flex items-center justify-center"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
          <div className="mt-2 text-[10px] text-gray-400 text-center flex items-center justify-center gap-1.5">
            <span className="material-symbols-outlined text-xs">lightbulb</span>
            <span>Estilo socrático: analiza con cuidado tu respuesta. SOCIA-LAB te guiará con más preguntas y pistas.</span>
          </div>
        </div>

      </div>

    </div>
  );
}
