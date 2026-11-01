/**
 * Definiciones canónicas de TypeScript para las entidades de dominio.
 * En espejo y sincronía exacta con server/internal/domain/models.go
 */

export interface Topic {
  id: string;
  title: string;
  description: string;
  category: string;
  icon: string;
}

export interface CheckOption {
  id: string;
  text: string;
}

export interface Check {
  id: string;
  question: string;
  options: CheckOption[];
  correctOptionId: string;
  explanation: string;
}

export interface Step {
  id: string;
  order: number;
  narrative: string;
  imageUrl?: string | null;
  check?: Check | null;
}

export interface Capsule {
  id: string;
  topicId: string;
  title: string;
  order: number;
  estimatedMinutes: number;
  steps: Step[];
}

export interface CheckAttempt {
  checkId: string;
  selectedOptionId: string;
  isCorrect: boolean;
  explanationShown: string;
}

export interface StreakState {
  totalDays: number;
  currentStreak: number;
  maxStreak: number;
  lastActiveDate?: string | null;
}
