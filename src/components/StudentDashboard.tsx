import React, { useState } from "react";
import { StudentInfo, FrequentError, CompetenceScore, StudentLog } from "../types";
import { Award, Compass, BookOpen, AlertCircle, RefreshCw, Layers, ArrowRight, MapPin, Sparkles, TrendingUp } from "lucide-react";

interface StudentDashboardProps {
  studentInfo: StudentInfo;
  onUpdateInfo: (info: StudentInfo) => void;
  onSelectPrompt: (promptText: string) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function StudentDashboard({
  studentInfo,
  onUpdateInfo,
  onSelectPrompt,
  activeTab,
  setActiveTab
}: StudentDashboardProps) {
  const [selectedRegion, setSelectedRegion] = useState(studentInfo.region);
  const [selectedSubregion, setSelectedSubregion] = useState(studentInfo.subregion);

  // Colombian regional setups and subregions (ideal for high-fidelity region-specific examples!)
  const departments = [
    { name: "Córdoba", subregions: ["Montería", "Bajo Sinú", "Alto Sinú", "San Jorge", "Sabanas"] },
    { name: "Antioquia", subregions: ["Medellín", "Urabá", "Oriente Antioqueño", "Bajo Cauca"] },
    { name: "Bogotá D.C.", subregions: ["Suba", "Kennedy", "Usaquén", "Ciudad Bolívar"] },
    { name: "Chocó", subregions: ["Quibdó", "Istmina", "Bahía Solano"] },
    { name: "Meta", subregions: ["Villavicencio", "La Macarena", "Ariari"] }
  ];

  const handleRegionChange = (deptName: string) => {
    setSelectedRegion(deptName);
    const found = departments.find(d => d.name === deptName);
    const firstSub = found ? found.subregions[0] : "General";
    setSelectedSubregion(firstSub);

    onUpdateInfo({
      ...studentInfo,
      region: deptName,
      subregion: firstSub
    });
  };

  const handleSubregionChange = (subName: string) => {
    setSelectedSubregion(subName);
    onUpdateInfo({
      ...studentInfo,
      subregion: subName
    });
  };

  // Modern clean mock data matching SIEE (Sistema de Evaluación Institucional)
  const competencies: CompetenceScore[] = [
    { name: "Pensamiento Social", score: 82, feedback: "Excelente dominio de la estructura constitucional (Constitución 1991) y de los mecanismos de participación ciudadana colombiana." },
    { name: "Análisis de Perspectivas", score: 68, feedback: "Nivel Intermedio. Logras identificar múltiples actores del conflicto agrario, pero requieres evaluar mejor la confiabilidad de las fuentes históricas antiguas." },
    { name: "Pensamiento Reflexivo-Sistémico", score: 74, feedback: "Buen análisis multicausal. Logras conectar el cambio climático y la deforestación de páramos con el impacto socio-económico local." }
  ];

  const frequentErrors: FrequentError[] = [
    {
      type: "Conceptual",
      count: 3,
      description: "Confusión temporal entre sucesos de la Independencia de la Nueva Granada y la hegemonía conservadora.",
      remedialTip: "Repasa la línea del tiempo interactiva en el Aula o pídele al tutor IA una analogía sobre orden cronológico."
    },
    {
      type: "Interpretativo",
      count: 5,
      description: "Dificultad para desglosar el sesgo político de una fuente primaria de la época de la Violencia (1948).",
      remedialTip: "Al leer noticias del Bogotazo, pregúntate primero: ¿Quién escribe este relato y qué intereses puede tener?"
    }
  ];

  const recentHistory: StudentLog[] = [
    { id: "log-1", date: "Hoy, 10:15 AM", topic: "El Bogotazo de 1948", performance: "Superior", comments: "Demostraste excelente análisis de causas inmediatas y consecuencias de mediano plazo en Bogotá y los santanderes." },
    { id: "log-2", date: "Ayer, 04:30 PM", topic: "Desplazamiento Forzado y Ley 1448", performance: "Básico", comments: "Identificaste las diferencias entre reparación material e integral, pero olvidaste el papel de la restitución." },
    { id: "log-3", date: "Hace 3 días", topic: "Diversidad de Páramos de Colombia", performance: "Alto", comments: "Lograste detallar cómo los proyectos de minería en Santander afectan la biodiversidad y el agua de la región." }
  ];

  // Pre-loaded Colombian socratic challenge prompts
  const academicPrompts = [
    {
      title: "Causa del Bogotazo",
      desc: "Analiza por qué el asesinato de Jorge Eliécer Gaitán desencadenó una violencia nacional.",
      prompt: "Explícame por qué se dio el Bogotazo de 1948 y cómo afectó al país.",
      icon: "bolt"
    },
    {
      title: "Cultura Zenú Córdoba",
      desc: "Examina el impacto de la ganadería extensiva sobre las tierras ancestrales del Sinú.",
      prompt: "Háblame de la cultura indígena Zenú del departamento de Córdoba, sus canales hidráulicos tradicionales y cuál es su conflicto territorial actual.",
      icon: "landscape"
    },
    {
      title: "Dilema de Minería",
      desc: "Toma una decisión crítica como alcalde sobre permitir la explotación minera en un páramo.",
      prompt: "Quiero analizar un dilema ético sobre la explotación de oro en páramos andinos tradicionales de Colombia contra el desarrollo económico local.",
      icon: "gavel"
    }
  ];

  const selectedDeptData = departments.find(d => d.name === selectedRegion);

  return (
    <div className="space-y-6">
      
      {/* Top Banner: Regional Setup & Quick Stats */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Welcome & Streak */}
        <div className="space-y-4">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#fef3c7] text-amber-800 mb-2">
              <Award className="w-3.5 h-3.5" />
              <span>Racha de {studentInfo.streak} días activos</span>
            </span>
            <h2 className="font-plus text-2xl font-extrabold text-[#1a1c1c]">Hola, {studentInfo.name} 👋</h2>
            <p className="text-sm text-gray-500 mt-1">Estudiante de {studentInfo.grade} grado de Educación Media.</p>
          </div>

          <div className="flex gap-2">
            {studentInfo.unlockedBadges.map((badge, idx) => (
              <span key={idx} className="px-2.5 py-1 text-xs bg-[#f3f4f6] text-[#40484d] font-semibold rounded-lg border border-gray-100 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-500" />
                {badge}
              </span>
            ))}
          </div>
        </div>

        {/* Colombian Territorialization Box */}
        <div className="bg-surface-bright rounded-xl p-4 border border-gray-100 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="w-4 h-4 text-primary" />
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Alineación Territorial</span>
            </div>
            <p className="text-xs text-gray-500 mb-3">Establece tu región para adaptar los ejemplos históricos y geográficos automáticamente.</p>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Departamento</label>
              <select 
                value={selectedRegion} 
                onChange={(e) => handleRegionChange(e.target.value)}
                className="w-full text-xs bg-white border border-gray-200 rounded-lg p-2 focus:ring-1 focus:ring-primary focus:border-primary"
              >
                {departments.map(d => (
                  <option key={d.name} value={d.name}>{d.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Municipio / Zona</label>
              <select 
                value={selectedSubregion} 
                onChange={(e) => handleSubregionChange(e.target.value)}
                className="w-full text-xs bg-white border border-gray-200 rounded-lg p-2 focus:ring-1 focus:ring-primary focus:border-primary"
              >
                {selectedDeptData ? selectedDeptData.subregions.map(sub => (
                  <option key={sub} value={sub}>{sub}</option>
                )) : <option value="General">General</option>}
              </select>
            </div>
          </div>
        </div>

        {/* Performance indicators */}
        <div className="flex flex-col justify-between">
          <div className="flex justify-between items-center bg-gray-50 p-3 rounded-xl border border-gray-100">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Rendimiento SIEE</span>
            </div>
            <span className="px-2.5 py-1 text-xs font-extrabold rounded-lg bg-[#dcfce7] text-emerald-800">
              DESEMPEÑO SUPERIOR
            </span>
          </div>

          <div className="p-3 bg-primary-container text-white rounded-xl flex items-center justify-between gap-4 mt-2">
            <div>
              <span className="text-[10px] uppercase font-bold opacity-85 block">Puntaje Global Promedio</span>
              <p className="font-plus text-xl font-extrabold text-secondary-fixed">88 / 100</p>
            </div>
            <div className="p-2 bg-white/10 rounded-lg">
              <TrendingUp className="w-5 h-5 text-secondary-fixed" />
            </div>
          </div>
        </div>

      </div>

      {/* Main Grid: Analytical Cards & Socratic Challenges */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: Analytics & Competence Chart (8/12 cols) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Competences & Progress Bars */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Compass className="w-5 h-5 text-primary" />
                <h3 className="font-plus text-lg font-bold text-[#1a1c1c]">Competencias Nacionales (Saber 11)</h3>
              </div>
              <span className="text-xs text-gray-400">Actualizado según reportes del Tutor IA</span>
            </div>

            <div className="space-y-4">
              {competencies.map((comp, idx) => (
                <div key={idx} className="space-y-1.5 p-4 rounded-xl hover:bg-gray-50 transition-colors border border-gray-100">
                  <div className="flex justify-between text-sm">
                    <span className="font-bold text-gray-700">{comp.name}</span>
                    <span className="font-bold text-primary">{comp.score}% (Alto)</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2.5">
                    <div 
                      className="bg-primary h-2.5 rounded-full transition-all duration-500" 
                      style={{ width: `${comp.score}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-on-surface-variant leading-relaxed mt-2">{comp.feedback}</p>
                </div>
              ))}
            </div>
          </div>

          {/* RAG & SIEE Recent Logs */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary" />
                <h3 className="font-plus text-lg font-bold text-[#1a1c1c]">Últimas Actividades Evaluadas (Formativa SIEE)</h3>
              </div>
              <span className="text-xs text-gray-400">Persistencia local activa</span>
            </div>

            <div className="divide-y divide-gray-100">
              {recentHistory.map((log) => (
                <div key={log.id} className="py-3 first:pt-0 last:pb-0 flex items-start gap-4">
                  <div className="mt-1 flex items-center justify-center p-2 bg-[#f0fdf4] text-emerald-800 rounded-lg">
                    <Award className="w-4 h-4" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-bold text-gray-700">{log.topic}</span>
                      <span className="text-[10px] font-bold text-gray-400 uppercase">{log.date}</span>
                    </div>
                    <p className="text-xs text-gray-500 leading-relaxed">{log.comments}</p>
                    <div className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#e0f2fe] text-primary mt-1">
                      Desempeño {log.performance}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Side: IA Recommendations & Socratic Sinuano/Córdoba Prompts (4/12 cols) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* AI Advisor Card */}
          <div className="bg-[#00475e] text-white rounded-2xl p-6 shadow-md relative overflow-hidden border border-primary-container">
            <div className="absolute top-0 right-0 p-3 opacity-10">
              <Sparkles className="w-32 h-32" />
            </div>
            <div className="relative z-10 space-y-4">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-accent animate-pulse">psychology</span>
                <span className="text-xs font-bold uppercase tracking-wider text-accent">Sugerencia del Tutor IA (SocioLab)</span>
              </div>
              
              <p className="text-sm leading-relaxed text-gray-100">
                "¡Muy bien, {studentInfo.name}! Tu racha de estudio muestra un gran avance. En tu región ({studentInfo.region}), estamos profundizando en los conflictos del territorio. Te sugiero iniciar el laboratorio socrático sobre la <strong>Reforma Agraria en Córdoba</strong> para aumentar tu competencia de Análisis de Perspectivas en un 12%."
              </p>

              <button 
                onClick={() => {
                  onSelectPrompt("Háblame de la cultura indígena Zenú del departamento de Córdoba, sus canales hidráulicos tradicionales y cuál es su conflicto territorial actual.");
                  setActiveTab("chat");
                }}
                className="w-full py-2.5 bg-accent text-[#00475e] font-bold text-xs rounded-xl hover:bg-white transition-all flex items-center justify-center gap-2"
              >
                <span>Iniciar este Laboratorio</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Socratic Challenges */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-4">
            <div>
              <h3 className="font-plus text-base font-bold text-[#1a1c1c]">Dilemas y Retos Curriculares</h3>
              <p className="text-xs text-gray-500 mt-1">Haz clic en un reto para que el Tutor IA comience la guía de pensamiento socrática.</p>
            </div>

            <div className="space-y-3">
              {academicPrompts.map((ap, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    onSelectPrompt(ap.prompt);
                    setActiveTab("chat");
                  }}
                  className="w-full text-left p-3.5 rounded-xl border border-gray-100 hover:border-primary hover:bg-surface-bright transition-all group flex gap-3 items-start"
                >
                  <div className="p-2 bg-gray-50 text-gray-500 group-hover:bg-primary-container group-hover:text-white rounded-lg transition-colors">
                    <span className="material-symbols-outlined text-sm">{ap.icon}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-gray-700 group-hover:text-primary transition-colors truncate">{ap.title}</p>
                    <p className="text-[10px] text-gray-500 leading-normal mt-0.5">{ap.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* SIEE Frequent Errors Alerts */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-amber-600" />
              <h3 className="font-plus text-base font-bold text-[#1a1c1c]">Foco de Alerta Pedagógica</h3>
            </div>

            <div className="space-y-3">
              {frequentErrors.map((err, idx) => (
                <div key={idx} className="p-3 bg-amber-50/50 border-l-4 border-amber-500 rounded-xl space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-amber-800 uppercase">Error {err.type}</span>
                    <span className="px-2 py-0.5 text-[9px] font-bold rounded bg-amber-100 text-amber-900">
                      Ocurrencias: {err.count}
                    </span>
                  </div>
                  <p className="text-xs text-gray-700 font-medium leading-relaxed">{err.description}</p>
                  <p className="text-[10px] text-[#40484d] leading-relaxed pt-1 border-t border-amber-200/50">
                    <strong className="text-amber-800">Sugerencia Curricular:</strong> {err.remedialTip}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
