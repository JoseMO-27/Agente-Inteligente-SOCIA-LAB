import React, { useState, useEffect } from "react";
import LoginScreen from "./components/LoginScreen";
import StudentDashboard from "./components/StudentDashboard";
import SocraticChat from "./components/SocraticChat";
import TeacherPanel from "./components/TeacherPanel";
import { StudentInfo, RobotConfig, DocumentMeta } from "./types";
import { BookOpen, User, Sparkles, LogOut, LayoutDashboard, MessageSquareCode, Sliders, ShieldCheck } from "lucide-react";

export default function App() {
  const [userRole, setUserRole] = useState<'estudiante' | 'docente' | 'administrador' | null>(null);
  const [studentInfo, setStudentInfo] = useState<StudentInfo | null>(null);
  
  // Custom document storage managed via API or local State
  const [documents, setDocuments] = useState<DocumentMeta[]>([]);
  const [prefilledPrompt, setPrefilledPrompt] = useState<string | null>(null);

  // Active view tab
  const [activeTab, setActiveTab] = useState<string>("dashboard");

  // Global Socratic Robot instructions managed by the teacher or defaults
  const [robotConfig, setRobotConfig] = useState<RobotConfig>({
    toneStyle: "Conversational",
    academicRigor: "Academic Rigor",
    approach: "Prioritizes chronology and causation"
  });

  // Fetch documents from backend on mount
  const fetchDocuments = async () => {
    try {
      const res = await fetch("/api/documents");
      const result = await res.json();
      if (result.success) {
        setDocuments(result.data);
      }
    } catch (e) {
      console.error("Error fetching documents:", e);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleLogin = (role: 'estudiante' | 'docente' | 'administrador', info: StudentInfo) => {
    setUserRole(role);
    setStudentInfo(info);
    if (role === "docente") {
      setActiveTab("panel");
    } else if (role === "administrador") {
      setActiveTab("admin");
    } else {
      setActiveTab("dashboard");
    }
  };

  const handleLogout = () => {
    setUserRole(null);
    setStudentInfo(null);
    setPrefilledPrompt(null);
  };

  const handleUpdateStudentInfo = (newInfo: StudentInfo) => {
    setStudentInfo(newInfo);
  };

  const handleSelectPrompt = (promptText: string) => {
    setPrefilledPrompt(promptText);
  };

  const handleUploadDocument = async (title: string, content: string) => {
    try {
      const res = await fetch("/api/documents/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content })
      });
      const result = await res.json();
      if (result.success) {
        fetchDocuments();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleResetDocuments = async () => {
    try {
      const res = await fetch("/api/documents/reset", { method: "POST" });
      const result = await res.json();
      if (result.success) {
        fetchDocuments();
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (!userRole) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen flex flex-col justify-between bg-surface-bright text-[#1a1c1c] font-vietnam">
      
      {/* Top Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 py-4 px-4 sm:px-6 lg:px-8 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2.5">
          <span className="material-symbols-outlined text-primary text-3xl font-bold">school</span>
          <div>
            <h1 className="font-plus text-xl font-extrabold tracking-tight text-primary">SOCIA-LAB</h1>
            <p className="text-[10px] font-semibold text-gray-400 tracking-wider uppercase">Colombia • EdTech Inteligente</p>
          </div>
        </div>

        {/* User Status Bar & Logout */}
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2.5 pr-4 border-r border-gray-200">
            <div className="text-right">
              <span className="text-xs font-bold text-gray-700 block">
                {userRole === "estudiante" ? studentInfo?.name : userRole === "docente" ? "Dra. Helena Araujo (Docente)" : "Administrador"}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                Modo {userRole === "estudiante" ? "Estudiante" : userRole === "docente" ? "Panel Docente" : "Panel Admin"}
              </span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-primary-container text-white flex items-center justify-center font-bold text-sm">
              {userRole === "estudiante" ? "JM" : userRole === "docente" ? "HA" : "AD"}
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="p-2.5 rounded-xl bg-gray-50 hover:bg-rose-50 text-gray-500 hover:text-rose-600 border border-gray-100 transition-all flex items-center gap-2 text-xs font-bold active:scale-[0.98]"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Cerrar Sesión</span>
          </button>
        </div>
      </header>

      {/* Main Content Workspace */}
      <main className="flex-grow max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        
        {/* Toggle navigation header for student role */}
        {userRole === "estudiante" && (
          <div className="flex bg-white p-1 rounded-xl border border-gray-200 max-w-md mx-auto sm:mx-0 shadow-sm">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`flex-1 py-2.5 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                activeTab === "dashboard" ? "bg-primary text-white" : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Mi Progreso</span>
            </button>
            <button
              onClick={() => setActiveTab("chat")}
              className={`flex-1 py-2.5 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                activeTab === "chat" ? "bg-primary text-white" : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
            >
              <MessageSquareCode className="w-4 h-4" />
              <span>Tutor IA Socrático</span>
            </button>
          </div>
        )}

        {/* Unified View Router based on State */}
        <div className="animate-fade-in">
          {userRole === "estudiante" && activeTab === "dashboard" && studentInfo && (
            <StudentDashboard
              studentInfo={studentInfo}
              onUpdateInfo={handleUpdateStudentInfo}
              onSelectPrompt={handleSelectPrompt}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />
          )}

          {userRole === "estudiante" && activeTab === "chat" && studentInfo && (
            <SocraticChat
              studentInfo={studentInfo}
              robotConfig={robotConfig}
              documents={documents}
              prefilledPrompt={prefilledPrompt}
              clearPrefilledPrompt={() => setPrefilledPrompt(null)}
            />
          )}

          {userRole === "docente" && (
            <TeacherPanel
              documents={documents}
              onUploadDocument={handleUploadDocument}
              robotConfig={robotConfig}
              onUpdateRobotConfig={setRobotConfig}
              onResetDocuments={handleResetDocuments}
            />
          )}

          {userRole === "administrador" && (
            <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm space-y-6">
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-8 h-8 text-primary" />
                <div>
                  <h3 className="font-plus text-xl font-bold text-[#1a1c1c]">Panel de Auditoría de Sistemas y SIEE</h3>
                  <p className="text-xs text-gray-500">Configuración global e integridad del ecosistema educativo.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                <div className="p-5 bg-gray-50 border border-gray-100 rounded-xl space-y-3">
                  <span className="text-xs font-bold text-primary uppercase">Métricas Generales del Servidor</span>
                  <div className="space-y-2 text-xs text-gray-700">
                    <p><strong>Carga RAG:</strong> Activa ({documents.length} documentos indexados)</p>
                    <p><strong>Seguridad del Menor:</strong> BLOCK_MEDIUM_AND_ABOVE activo en todos los modelos.</p>
                    <p><strong>Persistencia:</strong> localStorage (Navegador) más base de datos temporal adaptativa activa.</p>
                    <p><strong>Alineación del Modelo:</strong> Gemini @google/genai con tsx server-side proxy.</p>
                  </div>
                </div>

                <div className="p-5 bg-gray-50 border border-gray-100 rounded-xl space-y-3">
                  <span className="text-xs font-bold text-primary uppercase">Acciones Administrativas Rápidas</span>
                  <div className="space-y-2">
                    <button 
                      onClick={handleResetDocuments}
                      className="w-full py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs font-bold rounded-lg transition-all"
                    >
                      Restablecer Toda la Base Documental RAG
                    </button>
                    <button 
                      onClick={() => setUserRole("docente")}
                      className="w-full py-2.5 bg-primary text-white text-xs font-bold rounded-lg hover:bg-[#002f3f] transition-all"
                    >
                      Ir al Panel Docente para Ajustar Prompt Socratico
                    </button>
                  </div>
                </div>
              </div>

              {/* Security Logs */}
              <div className="space-y-3">
                <h4 className="font-plus text-base font-bold text-[#1a1c1c]">Bitácora de Sesión Activa</h4>
                <div className="bg-gray-950 border border-gray-800 text-green-400 rounded-xl p-4 font-mono text-xs space-y-1">
                  <p className="text-gray-500">[INFO] 2026-05-27T16:39:51Z - SOCIA-LAB inicializado con éxito.</p>
                  <p className="text-gray-500">[INFO] Conectado a Gemini API mediante full-stack Express proxy segura.</p>
                  <p className="text-gray-500">[WARN] Alertas SIEE activas: 2 incidentes de detección de errores conceptuales en grado 11-A.</p>
                  <p className="text-gray-500">[INFO] RAG de documentos PEI e instructivos del MEN pre-compilado.</p>
                </div>
              </div>
            </div>
          )}
        </div>

      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-8 px-4 sm:px-6 lg:px-8 mt-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-center md:text-left">
            <span className="font-plus text-base font-bold text-primary">SOCIA-LAB Colombia</span>
            <p className="text-xs text-gray-400 mt-1">Ecosistema didáctico interactivo para ciencias sociales de básica y media.</p>
          </div>
          <div className="text-xs text-gray-400">
            <span>© 2026 SOCIA-LAB Colombia. Alineado con los Lineamientos del Ministerio de Educación Nacional de Colombia.</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
