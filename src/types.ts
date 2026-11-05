export type Language = 'uz' | 'ru';

export type DifficultyLevel = 'basic' | 'intermediate' | 'advanced';

export type OptionLetter = 'A' | 'B' | 'C' | 'D';

export type QualificationTier =
  | 'not_qualified'      // 0-49: Mos emas / Не соответствует
  | 'needs_development'  // 50-64: Rivojlanish talab etiladi / Требуется развитие
  | 'qualified'          // 65-79: Mos keladi / Соответствует
  | 'high_level'         // 80-89: Yuqori daraja / Высокий уровень
  | 'talent_pool';       // 90-100: Kadrlar zaxirasi / Кадровый резерв

export interface Question {
  id: string;
  orderIndex: number; // 1 to 10 within level
  level: DifficultyLevel;
  categoryUz: string;
  categoryRu: string;
  questionUz: string;
  questionRu: string;
  optionsUz: Record<OptionLetter, string>;
  optionsRu: Record<OptionLetter, string>;
  correctOption: OptionLetter;
  normativeRefUz: string;
  normativeRefRu: string;
}

export interface CandidateInfo {
  fullName: string;
  position: string;
  siteObject: string;
  phone: string;
  level: DifficultyLevel;
}

export interface QuestionEvaluation {
  questionId: string;
  orderIndex: number;
  selectedOption: OptionLetter | null;
  correctOption: OptionLetter;
  isCorrect: boolean;
  pointsEarned: number;
}

export interface Submission {
  id: string;
  candidateName: string;
  position: string;
  siteObject: string;
  phone: string;
  level: DifficultyLevel;
  answers: Record<string, OptionLetter>;
  score: number; // 0 to 100
  correctCount: number;
  totalQuestions: number;
  pointsPerQuestion: number;
  durationSeconds: number;
  qualificationTier: QualificationTier;
  submittedAt: string; // ISO string
}

export type AppView = 'candidate' | 'results' | 'keys' | 'questions';
