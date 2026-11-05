import {
  CandidateInfo,
  DifficultyLevel,
  OptionLetter,
  QualificationTier,
  Question,
  QuestionEvaluation,
  Submission,
} from '../types';

export const POINTS_PER_QUESTION = 10;
export const MAX_TOTAL_SCORE = 100;

/**
 * Classifies a 0-100 score according to the official Discover Invest attestation scale:
 * 0–49   — не соответствует / mos emas (not_qualified)
 * 50–64  — требуется развитие / rivojlanish talab etiladi (needs_development)
 * 65–79  — соответствует / mos keladi (qualified)
 * 80–89  — высокий уровень / yuqori daraja (high_level)
 * 90–100 — кадровый резерв / kadrlar zaxirasi (talent_pool)
 */
export function getQualificationTier(score: number): QualificationTier {
  const clamped = Math.max(0, Math.min(100, Math.round(score)));
  if (clamped <= 49) return 'not_qualified';
  if (clamped <= 64) return 'needs_development';
  if (clamped <= 79) return 'qualified';
  if (clamped <= 89) return 'high_level';
  return 'talent_pool';
}

export interface EvaluationSummary {
  score: number;
  correctCount: number;
  totalQuestions: number;
  pointsPerQuestion: number;
  qualificationTier: QualificationTier;
  evaluations: QuestionEvaluation[];
}

/**
 * Evaluates a candidate's answers against the level's questions.
 * Without a practical section, 10 questions × 10 points = 100 points total.
 * If question count differs from 10, scales proportionally to 100 max points.
 */
export function evaluateTestAnswers(
  levelQuestions: Question[],
  answers: Record<string, OptionLetter>
): EvaluationSummary {
  const sorted = [...levelQuestions].sort((a, b) => a.orderIndex - b.orderIndex);
  const totalQuestions = sorted.length;
  if (totalQuestions === 0) {
    return {
      score: 0,
      correctCount: 0,
      totalQuestions: 0,
      pointsPerQuestion: POINTS_PER_QUESTION,
      qualificationTier: 'not_qualified',
      evaluations: [],
    };
  }

  const pointsPerQuestion = totalQuestions === 10 ? 10 : Math.round((100 / totalQuestions) * 10) / 10;
  let correctCount = 0;

  const evaluations: QuestionEvaluation[] = sorted.map((q, idx) => {
    const selected = answers[q.id] ?? null;
    const isCorrect = selected !== null && selected === q.correctOption;
    if (isCorrect) {
      correctCount += 1;
    }
    return {
      questionId: q.id,
      orderIndex: q.orderIndex || idx + 1,
      selectedOption: selected,
      correctOption: q.correctOption,
      isCorrect,
      pointsEarned: isCorrect ? pointsPerQuestion : 0,
    };
  });

  const rawScore =
    totalQuestions === 10
      ? correctCount * 10
      : Math.round((correctCount / totalQuestions) * 100);

  const score = Math.max(0, Math.min(100, rawScore));
  const qualificationTier = getQualificationTier(score);

  return {
    score,
    correctCount,
    totalQuestions,
    pointsPerQuestion,
    qualificationTier,
    evaluations,
  };
}

export interface ValidationResult {
  valid: boolean;
  errorField?: 'fullName' | 'position' | 'siteObject' | 'phone';
}

export function validateCandidateInfo(info: CandidateInfo): ValidationResult {
  if (!info.fullName || info.fullName.trim().length < 3) {
    return { valid: false, errorField: 'fullName' };
  }
  if (!info.position || info.position.trim().length < 2) {
    return { valid: false, errorField: 'position' };
  }
  if (!info.siteObject || info.siteObject.trim().length < 2) {
    return { valid: false, errorField: 'siteObject' };
  }
  if (!info.phone || info.phone.trim().length < 5) {
    return { valid: false, errorField: 'phone' };
  }
  return { valid: true };
}

export function filterSubmissions(
  submissions: Submission[],
  options: {
    searchQuery?: string;
    levelFilter?: DifficultyLevel | 'all';
    tierFilter?: QualificationTier | 'all';
  }
): Submission[] {
  const query = (options.searchQuery ?? '').trim().toLowerCase();
  const levelFilter = options.levelFilter ?? 'all';
  const tierFilter = options.tierFilter ?? 'all';

  return submissions.filter((sub) => {
    if (levelFilter !== 'all' && sub.level !== levelFilter) return false;
    if (tierFilter !== 'all' && sub.qualificationTier !== tierFilter) return false;
    if (query.length > 0) {
      const hay = `${sub.candidateName} ${sub.position} ${sub.siteObject} ${sub.phone}`.toLowerCase();
      if (!hay.includes(query)) return false;
    }
    return true;
  });
}

export function formatDuration(seconds: number): string {
  const safe = Math.max(0, Math.floor(seconds));
  const mins = Math.floor(safe / 60);
  const secs = safe % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

export function generateCsvContent(submissions: Submission[], lang: 'uz' | 'ru'): string {
  const headers =
    lang === 'uz'
      ? ['ID', 'F.I.Sh.', 'Lavozim', "Ob'ekt", 'Telefon', 'Daraja', "To'g'ri javoblar", 'Ball (100)', 'Natija maqomi', 'Vaqt (sek)', 'Topshirilgan sana']
      : ['ID', 'Ф.И.О.', 'Должность', 'Объект', 'Телефон', 'Уровень', 'Правильных ответов', 'Балл (100)', 'Статус аттестации', 'Время (сек)', 'Дата сдачи'];

  const tierLabelsUz: Record<QualificationTier, string> = {
    not_qualified: 'Mos emas (0-49)',
    needs_development: 'Rivojlanish talab etiladi (50-64)',
    qualified: 'Mos keladi (65-79)',
    high_level: 'Yuqori daraja (80-89)',
    talent_pool: 'Kadrlar zaxirasi (90-100)',
  };

  const tierLabelsRu: Record<QualificationTier, string> = {
    not_qualified: 'Не соответствует (0-49)',
    needs_development: 'Требуется развитие (50-64)',
    qualified: 'Соответствует (65-79)',
    high_level: 'Высокий уровень (80-89)',
    talent_pool: 'Кадровый резерв (90-100)',
  };

  const escapeCsv = (val: string | number) => {
    const str = String(val ?? '');
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const rows = submissions.map((s) => [
    s.id,
    s.candidateName,
    s.position,
    s.siteObject,
    s.phone,
    s.level.toUpperCase(),
    `${s.correctCount}/${s.totalQuestions}`,
    s.score,
    lang === 'uz' ? tierLabelsUz[s.qualificationTier] : tierLabelsRu[s.qualificationTier],
    s.durationSeconds,
    new Date(s.submittedAt).toLocaleString(lang === 'uz' ? 'uz-UZ' : 'ru-RU'),
  ]);

  return '\uFEFF' + [headers.map(escapeCsv).join(','), ...rows.map((r) => r.map(escapeCsv).join(','))].join('\n');
}
