export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'tutor';
  timestamp: Date;
  isHint?: boolean;
}

export interface StudentInfo {
  name: string;
  grade: string;
  region: string;
  subregion: string;
  level: 'Básico' | 'Intermedio' | 'Avanzado';
  score: number;
  streak: number;
  unlockedBadges: string[];
}

export interface RobotConfig {
  toneStyle: 'Conversational' | 'Formal';
  academicRigor: 'Permissive' | 'Academic Rigor';
  approach: 'Prioritizes chronology and causation' | 'Focuses on democracy and ethics' | 'Territorial and environmental focus';
}

export interface FrequentError {
  type: 'Conceptual' | 'Interpretativo' | 'Análisis Crítico';
  count: number;
  description: string;
  remedialTip: string;
}

export interface CompetenceScore {
  name: string;
  score: number;
  feedback: string;
}

export interface DocumentMeta {
  id: string;
  title: string;
  type: string;
  year: number;
  size: string;
  summary: string;
}

export interface StudentLog {
  id: string;
  date: string;
  topic: string;
  performance: 'Bajo' | 'Básico' | 'Alto' | 'Superior';
  comments: string;
}

export interface StudentGroup {
  id: string;
  name: string;
  averageScore: number;
  activeStudents: number;
  alertsCount: number;
}
