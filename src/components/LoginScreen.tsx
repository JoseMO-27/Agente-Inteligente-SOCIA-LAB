import React, { useState } from "react";
import { StudentInfo, RobotConfig } from "../types";

interface LoginScreenProps {
  onLogin: (role: 'estudiante' | 'docente' | 'administrador', studentInfo: StudentInfo) => void;
}

export default function LoginScreen({ onLogin }: LoginScreenProps) {
  const [activeTab, setActiveTab] = useState<'estudiante' | 'docente' | 'administrador'>('estudiante');
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [notification, setNotification] = useState<string | null>(null);

  // Preloaded Demo accounts to make testing instantaneous for the reviewer
  const credentials = {
    estudiante: { email: "mestrajose1327@gmail.com", name: "Jose Mestra", password: "123" },
    docente: { email: "docente@institucion.edu.co", name: "Dra. Helena Araujo", password: "123" },
    administrador: { email: "admin@institucion.edu.co", name: "Rectoría SociaLab", password: "123" }
  };

  const autofill = (role: 'estudiante' | 'docente' | 'administrador') => {
    setActiveTab(role);
    setEmail(credentials[role].email);
    setPassword(credentials[role].password);
    setNotification(`Autocompletado como ${role === "estudiante" ? "Estudiante" : role === "docente" ? "Docente" : "Admin"}. Haz clic en Iniciar Sesión.`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      setNotification("Por favor, ingresa tus credenciales.");
      return;
    }

    const currentCred = credentials[activeTab];
    // Allow any password of '123' for fast demo accessibility
    if (password === "123") {
      const studentInfo: StudentInfo = {
        name: activeTab === 'estudiante' ? currentCred.name : "Usuario",
        grade: "11°", // Default high school grade
        region: "Córdoba", // Default specialized Córdoba context
        subregion: "Montería",
        level: "Básico",
        score: 75,
        streak: 4,
        unlockedBadges: ["Pensador Crítico Córdoba", "Socrático Novato"]
      };
      onLogin(activeTab, studentInfo);
    } else {
      setNotification("Contraseña incorrecta. Utiliza la clave por defecto '123' para el prototipo.");
    }
  };

  return (
    <div className="academic-bg min-h-screen flex flex-col justify-between py-12 px-4 sm:px-6 lg:px-8 font-vietnam">
      <main className="flex-grow flex items-center justify-center">
        <div className="w-full max-w-[1000px] grid grid-cols-1 lg:grid-cols-2 bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-200">
          
          {/* Left Side: Visual/Context (Desktop Only) */}
          <div className="hidden lg:flex flex-col justify-center p-12 bg-primary text-white relative overflow-hidden">
            <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: "radial-gradient(circle, #fff 10%, transparent 11%)", backgroundSize: '12px 12px' }}></div>
            <div className="z-10 space-y-6">
              <div className="inline-flex items-center justify-center p-3 bg-white/10 rounded-xl backdrop-blur-sm border border-white/20">
                <span className="material-symbols-outlined text-accent text-3xl">school</span>
              </div>
              <h1 className="font-plus text-4xl font-extrabold tracking-tight">SOCIA-LAB Colombia</h1>
              <p className="text-gray-200 text-lg leading-relaxed">
                Empoderando la educación en ciencias sociales a través de la tutoría socrática inteligente, el análisis territorial y la colaboración académica.
              </p>
              
              <div className="pt-6 space-y-4 border-t border-white/10">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-accent">insights</span>
                  <span className="text-sm font-medium">Lógica adaptativa y análisis cognitivo</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-accent">map</span>
                  <span className="text-sm font-medium">Contextualización territorial (Montería y Córdoba)</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-accent">assignment_turned_in</span>
                  <span className="text-sm font-medium">Alineación curricular con los DBA y EBC del MEN</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Form Content */}
          <div className="p-8 sm:p-12 flex flex-col justify-center bg-white">
            <div className="text-center lg:text-left mb-8">
              <div className="lg:hidden mb-6 flex justify-center items-center gap-3">
                <span className="material-symbols-outlined text-primary text-4xl">school</span>
                <span className="font-plus text-3xl font-extrabold text-primary">SOCIA-LAB</span>
              </div>
              <h2 className="font-plus text-2xl font-bold text-[#1a1c1c] mb-1">Bienvenido de nuevo</h2>
              <p className="text-sm text-gray-500">Inicia sesión o selecciona una cuenta de demostración rápida.</p>
            </div>

            {/* Quick Autofill Buttons for Testing */}
            <div className="mb-6 p-3 bg-surface-bright rounded-xl border border-gray-100">
              <span className="text-xs font-semibold text-primary block mb-2">Ingreso Rápido de Prueba (Autocompletar):</span>
              <div className="grid grid-cols-3 gap-2">
                <button 
                  onClick={() => autofill('estudiante')}
                  className="px-2 py-1.5 text-xs font-medium rounded-lg bg-[#e0f2fe] text-primary hover:bg-[#bae6fd] transition-colors"
                >
                  Estudiante
                </button>
                <button 
                  onClick={() => autofill('docente')}
                  className="px-2 py-1.5 text-xs font-medium rounded-lg bg-[#f0fdf4] text-secondary hover:bg-[#dcfce7] transition-colors"
                >
                  Docente
                </button>
                <button 
                  onClick={() => autofill('administrador')}
                  className="px-2 py-1.5 text-xs font-medium rounded-lg bg-[#fffbeb] text-amber-800 hover:bg-[#fef3c7] transition-colors"
                >
                  Admin
                </button>
              </div>
            </div>

            {/* Role Tab Selector */}
            <div className="flex border-b border-gray-200 mb-6">
              <button
                type="button"
                onClick={() => setActiveTab('estudiante')}
                className={`flex-1 pb-3 text-sm font-bold border-b-2 text-center transition-all ${
                  activeTab === 'estudiante' ? 'border-primary text-primary' : 'border-transparent text-gray-400 hover:text-gray-600'
                }`}
              >
                ESTUDIANTE
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('docente')}
                className={`flex-1 pb-3 text-sm font-bold border-b-2 text-center transition-all ${
                  activeTab === 'docente' ? 'border-primary text-primary' : 'border-transparent text-gray-400 hover:text-gray-600'
                }`}
              >
                DOCENTE
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('administrador')}
                className={`flex-1 pb-3 text-sm font-bold border-b-2 text-center transition-all ${
                  activeTab === 'administrador' ? 'border-primary text-primary' : 'border-transparent text-gray-400 hover:text-gray-600'
                }`}
              >
                ADMIN
              </button>
            </div>

            {notification && (
              <div className="mb-4 p-3 bg-amber-50 border-l-4 border-amber-500 rounded text-xs text-amber-800 flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">info</span>
                <span>{notification}</span>
              </div>
            )}

            {/* Login Form */}
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider" htmlFor="email">Correo Institucional</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">mail</span>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={activeTab === 'estudiante' ? "mestrajose1327@gmail.com" : "nombre@institucion.edu.co"}
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all text-sm"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider" htmlFor="password">Contraseña</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">lock</span>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all text-sm"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="rounded border-gray-300 text-primary focus:ring-primary" defaultChecked />
                  <span className="text-gray-500">Recordarme</span>
                </label>
                <a href="#" className="font-bold text-primary hover:underline" onClick={() => setNotification("Prueba ingresando con la clave por defecto: '123'")}>
                  ¿Olvidaste tu contraseña?
                </a>
              </div>

              <button
                type="submit"
                className="w-full py-3 mt-2 bg-primary text-white font-bold rounded-xl hover:bg-[#002f3f] transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-lg">login</span>
                <span>Iniciar Sesión en SociaLab</span>
              </button>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center"><div class="w-full border-t border-gray-200"></div></div>
              <div className="relative flex justify-center text-xs"><span class="bg-white px-3 text-gray-400">o accede con</span></div>
            </div>

            <button 
              onClick={() => autofill(activeTab)}
              className="w-full flex items-center justify-center gap-2 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all font-semibold text-sm text-gray-700"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"></path>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
              </svg>
              <span>Acceso de Correo Institucional</span>
            </button>
          </div>

        </div>
      </main>

      <footer className="mt-8 text-center text-xs text-gray-400">
        <p>© 2026 SOCIA-LAB Colombia. Todos los derechos reservados.</p>
        <p className="mt-1">Ecosistema Académico para el Pensamiento Crítico y la Innovación Pedagógica.</p>
      </footer>
    </div>
  );
}
