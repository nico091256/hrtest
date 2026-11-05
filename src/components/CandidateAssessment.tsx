import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock,
  FileCheck2,
  Printer,
  RotateCcw,
  TableProperties,
  UserCheck,
  XCircle,
} from 'lucide-react';
import {
  CandidateInfo,
  DifficultyLevel,
  Language,
  OptionLetter,
  QualificationTier,
  Question,
  Submission,
} from '../types';
import {
  evaluateTestAnswers,
  formatDuration,
  validateCandidateInfo,
} from '../utils/scoring';
import { getText } from '../utils/translations';

interface CandidateAssessmentProps {
  lang: Language;
  questions: Question[];
  onCompleteSubmission: (submission: Submission) => void;
  onNavigateToResults: () => void;
}

const POSITION_PRESETS = {
  uz: [
    'Monolit-beton uchastka ustasi',
    'Umumqurilish ishlari ustasi (Prorab)',
    'Armatura va payvandlash ustasi',
    'Pardozlash va fasad ishlari ustasi',
    'Muhandis-geodezist / Sifat nazoratchisi',
  ],
  ru: [
    'Мастер монолитно-бетонных работ',
    'Мастер общестроительных работ (Прораб)',
    'Мастер арматурных и сварочных работ',
    'Мастер отделочных и фасадных работ',
    'Инженер-геодезист / Контроль качества',
  ],
};

const SITE_PRESETS = [
  'Gardens Residence',
  'Boulevard Business Center',
  'Mirabad Avenue',
  'Invento International School',
  'Fonon Jewellery Factory',
];

export const CandidateAssessment: React.FC<CandidateAssessmentProps> = ({
  lang,
  questions,
  onCompleteSubmission,
  onNavigateToResults,
}) => {
  const t = getText(lang);

  // Stage: 'intake' | 'testing' | 'completed'
  const [stage, setStage] = useState<'intake' | 'testing' | 'completed'>('intake');

  const [candidate, setCandidate] = useState<CandidateInfo>({
    fullName: '',
    position: '',
    siteObject: '',
    phone: '',
    level: 'basic',
  });
  const [validationError, setValidationError] = useState<string | null>(null);

  // Active test state
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, OptionLetter>>({});
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  const [completedSubmission, setCompletedSubmission] = useState<Submission | null>(null);

  const levelQuestions = useMemo(() => {
    return questions
      .filter((q) => q.level === candidate.level)
      .sort((a, b) => a.orderIndex - b.orderIndex);
  }, [questions, candidate.level]);

  // Timer during active test
  useEffect(() => {
    if (stage !== 'testing') return;
    const interval = window.setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => window.clearInterval(interval);
  }, [stage]);

  const handleQuickFillDemo = () => {
    setCandidate({
      fullName: lang === 'uz' ? 'Karimov Sardorbek Rustam o‘g‘li' : 'Каримов Сардорбек Рустамович',
      position: POSITION_PRESETS[lang][0],
      siteObject: 'Gardens Residence — 3-blok',
      phone: '+998 90 345 67 89',
      level: candidate.level,
    });
    setValidationError(null);
  };

  const handleStartTest = (e: React.FormEvent) => {
    e.preventDefault();
    const check = validateCandidateInfo(candidate);
    if (!check.valid) {
      setValidationError(t.validationError);
      return;
    }
    if (levelQuestions.length === 0) {
      setValidationError(
        lang === 'uz'
          ? 'Tanlangan darajada savollar mavjud emas.'
          : 'Для выбранного уровня нет вопросов.'
      );
      return;
    }
    setValidationError(null);
    setAnswers({});
    setCurrentIndex(0);
    setElapsedSeconds(0);
    setShowSubmitConfirm(false);
    setStage('testing');
  };

  const handleSelectOption = (questionId: string, option: OptionLetter) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: option,
    }));
  };

  const finalizeTest = () => {
    const evalSummary = evaluateTestAnswers(levelQuestions, answers);
    const newSubmission: Submission = {
      id: `sub-${Date.now()}`,
      candidateName: candidate.fullName.trim(),
      position: candidate.position.trim(),
      siteObject: candidate.siteObject.trim(),
      phone: candidate.phone.trim(),
      level: candidate.level,
      answers: { ...answers },
      score: evalSummary.score,
      correctCount: evalSummary.correctCount,
      totalQuestions: evalSummary.totalQuestions,
      pointsPerQuestion: evalSummary.pointsPerQuestion,
      durationSeconds: elapsedSeconds,
      qualificationTier: evalSummary.qualificationTier,
      submittedAt: new Date().toISOString(),
    };
    setCompletedSubmission(newSubmission);
    setShowSubmitConfirm(false);
    setStage('completed');
    onCompleteSubmission(newSubmission);
  };

  const handleRequestFinish = () => {
    const answeredCount = Object.keys(answers).length;
    if (answeredCount < levelQuestions.length) {
      setShowSubmitConfirm(true);
    } else {
      finalizeTest();
    }
  };

  const handleResetForNewCandidate = () => {
    setCandidate({
      fullName: '',
      position: '',
      siteObject: '',
      phone: '',
      level: 'basic',
    });
    setAnswers({});
    setCurrentIndex(0);
    setElapsedSeconds(0);
    setCompletedSubmission(null);
    setShowSubmitConfirm(false);
    setStage('intake');
  };

  const getTierColorClasses = (tier: QualificationTier) => {
    switch (tier) {
      case 'not_qualified':
        return 'bg-red-50 text-red-900 border-red-200';
      case 'needs_development':
        return 'bg-amber-50 text-amber-900 border-amber-200';
      case 'qualified':
        return 'bg-sky-50 text-sky-900 border-sky-200';
      case 'high_level':
        return 'bg-emerald-50 text-emerald-900 border-emerald-200';
      case 'talent_pool':
        return 'bg-teal-50 text-teal-950 border-teal-300';
    }
  };

  // ============================================================================
  // STAGE 1: CANDIDATE INTAKE FORM
  // ============================================================================
  if (stage === 'intake') {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-lg p-6 md:p-8">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-6 border-b border-slate-200">
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">
                {t.intakeTitle}
              </h1>
              <p className="text-sm text-slate-600 mt-1">
                {t.intakeSubtitle}
              </p>
            </div>
            <button
              type="button"
              onClick={handleQuickFillDemo}
              className="px-3.5 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              {t.quickFillDemoBtn}
            </button>
          </div>

          <form onSubmit={handleStartTest} className="space-y-6">
            {validationError && (
              <div
                role="alert"
                className="p-3.5 rounded-md bg-red-50 border border-red-200 text-xs font-medium text-red-800"
              >
                {validationError}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="md:col-span-2">
                <label
                  htmlFor="candidate-fullname"
                  className="block text-xs font-semibold text-slate-700 mb-1.5"
                >
                  {t.labelFullName} *
                </label>
                <input
                  id="candidate-fullname"
                  type="text"
                  value={candidate.fullName}
                  onChange={(e) =>
                    setCandidate((prev) => ({ ...prev, fullName: e.target.value }))
                  }
                  placeholder={t.placeholderFullName}
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1D4E78] focus:border-[#1D4E78]"
                />
              </div>

              <div>
                <label
                  htmlFor="candidate-position"
                  className="block text-xs font-semibold text-slate-700 mb-1.5"
                >
                  {t.labelPosition} *
                </label>
                <input
                  id="candidate-position"
                  type="text"
                  value={candidate.position}
                  onChange={(e) =>
                    setCandidate((prev) => ({ ...prev, position: e.target.value }))
                  }
                  placeholder={t.placeholderPosition}
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1D4E78] focus:border-[#1D4E78]"
                />
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {POSITION_PRESETS[lang].slice(0, 3).map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() =>
                        setCandidate((prev) => ({ ...prev, position: preset }))
                      }
                      className="text-[11px] text-slate-600 hover:text-[#1D4E78] underline decoration-slate-300 hover:decoration-[#1D4E78] cursor-pointer"
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label
                  htmlFor="candidate-site"
                  className="block text-xs font-semibold text-slate-700 mb-1.5"
                >
                  {t.labelSiteObject} *
                </label>
                <input
                  id="candidate-site"
                  type="text"
                  value={candidate.siteObject}
                  onChange={(e) =>
                    setCandidate((prev) => ({ ...prev, siteObject: e.target.value }))
                  }
                  placeholder={t.placeholderSiteObject}
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1D4E78] focus:border-[#1D4E78]"
                />
                <div className="flex flex-wrap gap-2 mt-2">
                  {SITE_PRESETS.slice(0, 3).map((site) => (
                    <button
                      key={site}
                      type="button"
                      onClick={() =>
                        setCandidate((prev) => ({ ...prev, siteObject: site }))
                      }
                      className="text-[11px] text-slate-600 hover:text-[#1D4E78] underline decoration-slate-300 hover:decoration-[#1D4E78] cursor-pointer"
                    >
                      {site}
                    </button>
                  ))}
                </div>
              </div>

              <div className="md:col-span-2">
                <label
                  htmlFor="candidate-phone"
                  className="block text-xs font-semibold text-slate-700 mb-1.5"
                >
                  {t.labelPhone} *
                </label>
                <input
                  id="candidate-phone"
                  type="text"
                  value={candidate.phone}
                  onChange={(e) =>
                    setCandidate((prev) => ({ ...prev, phone: e.target.value }))
                  }
                  placeholder={t.placeholderPhone}
                  className="w-full px-3.5 py-2.5 text-sm font-mono tabular-nums bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1D4E78] focus:border-[#1D4E78]"
                />
              </div>
            </div>

            {/* Level Selector */}
            <div className="pt-2">
              <span className="block text-xs font-semibold text-slate-700 mb-2.5">
                {t.labelLevel} *
              </span>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                {(['basic', 'intermediate', 'advanced'] as DifficultyLevel[]).map(
                  (lvl) => {
                    const isSelected = candidate.level === lvl;
                    const count = questions.filter((q) => q.level === lvl).length;
                    return (
                      <button
                        key={lvl}
                        type="button"
                        onClick={() =>
                          setCandidate((prev) => ({ ...prev, level: lvl }))
                        }
                        className={`text-left p-4 rounded-lg border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#1D4E78]/5 border-[#1D4E78] ring-1 ring-[#1D4E78]'
                            : 'bg-white border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-sm font-bold text-slate-900">
                            {lvl.charAt(0).toUpperCase() + lvl.slice(1)}
                          </span>
                          <span className="text-xs font-mono tabular-nums text-slate-500">
                            {count} {lang === 'uz' ? 'savol · 100 ball' : 'вопр. · 100 б.'}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                          {t.levelDesc[lvl]}
                        </p>
                      </button>
                    );
                  }
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 flex items-center justify-between gap-4">
              <div className="text-xs text-slate-500">
                <span>10 {lang === 'uz' ? 'ta savol' : 'вопросов'}</span>
                <span className="mx-1.5" aria-hidden="true">·</span>
                <span>{lang === 'uz' ? 'Har biri 10 ball' : 'По 10 баллов'}</span>
                <span className="mx-1.5" aria-hidden="true">·</span>
                <span>{lang === 'uz' ? 'Jami 100 ball' : 'Всего 100 баллов'}</span>
              </div>

              <button
                type="submit"
                className="px-6 py-3 text-sm font-semibold text-white bg-[#1D4E78] hover:bg-[#163d5f] rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                {t.startTestBtn}
              </button>
            </div>
          </form>
        </div>

        {/* Right Side: Instructions & Selected Level Details */}
        <aside className="lg:col-span-4 bg-white border border-slate-200 rounded-lg p-6 space-y-5">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              {t.levelTitle[candidate.level]}
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              {lang === 'uz'
                ? 'Attestatsiya tartibi va baholash mezonlari'
                : 'Регламент проведения аттестационного тестирования'}
            </p>
          </div>

          <div className="space-y-3 text-xs text-slate-700 border-t border-b border-slate-100 py-4">
            <div className="flex items-center justify-between">
              <span className="text-slate-500">
                {lang === 'uz' ? 'Savollar soni:' : 'Количество вопросов:'}
              </span>
              <span className="font-mono font-semibold tabular-nums text-slate-900">
                {levelQuestions.length} ta (A / B / C / D)
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">
                {lang === 'uz' ? '1 ta to‘g‘ri javob bahosi:' : 'Вес 1 правильного ответа:'}
              </span>
              <span className="font-mono font-semibold tabular-nums text-slate-900">
                10 {lang === 'uz' ? 'ball' : 'баллов'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">
                {lang === 'uz' ? 'Maksimal natija:' : 'Максимальный балл:'}
              </span>
              <span className="font-mono font-semibold tabular-nums text-[#1D4E78]">
                100 {lang === 'uz' ? 'ball' : 'баллов'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">
                {lang === 'uz' ? 'Minimal o‘tish chegarasi:' : 'Порог соответствия:'}
              </span>
              <span className="font-mono font-semibold tabular-nums text-emerald-700">
                65 {lang === 'uz' ? 'ball (7/10)' : 'баллов (7/10)'}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-xs font-semibold text-slate-900">
              {lang === 'uz'
                ? 'Daraja bo‘yicha qamrab olingan 10 ta savol mavzulari:'
                : '10 тем вопросов выбранного уровня сложности:'}
            </h3>
            <ul className="space-y-2 text-xs text-slate-600">
              {levelQuestions.map((q) => (
                <li key={q.id} className="flex items-baseline gap-2">
                  <span className="font-mono text-[11px] text-slate-400 tabular-nums">
                    {String(q.orderIndex).padStart(2, '0')}.
                  </span>
                  <span className="truncate">
                    {lang === 'uz' ? q.categoryUz : q.categoryRu}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    );
  }

  // ============================================================================
  // STAGE 2: INTERACTIVE TEST RUNNER
  // ============================================================================
  if (stage === 'testing') {
    const activeQuestion = levelQuestions[currentIndex];
    const answeredCount = Object.keys(answers).length;
    const selectedLetter = activeQuestion ? answers[activeQuestion.id] : undefined;

    return (
      <div className="space-y-6">
        {/* Test Runner Top Status Bar */}
        <div className="bg-white border border-slate-200 rounded-lg p-4 md:px-6 flex flex-wrap items-center justify-between gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="font-semibold text-slate-900">{candidate.fullName}</span>
              <span aria-hidden="true">·</span>
              <span>{candidate.position}</span>
              <span aria-hidden="true">·</span>
              <span>{candidate.siteObject}</span>
              <span aria-hidden="true">·</span>
              <span className="font-semibold text-[#1D4E78]">
                {candidate.level.toUpperCase()}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">{t.pointsNotice}</p>
          </div>

          <div className="flex items-center gap-6 shrink-0">
            <div className="text-right">
              <div className="text-[11px] text-slate-500">{t.answeredCountLabel}</div>
              <div className="text-sm font-mono font-bold tabular-nums text-slate-900">
                {answeredCount} / {levelQuestions.length}
              </div>
            </div>

            <div className="flex items-center gap-2 px-3 py-1.5 rounded bg-slate-100 text-slate-800 font-mono text-sm font-semibold tabular-nums">
              <Clock className="w-4 h-4 text-[#1D4E78]" aria-hidden="true" />
              <span>{formatDuration(elapsedSeconds)}</span>
            </div>
          </div>
        </div>

        {/* Question Navigator Bar (1..10) */}
        <div className="bg-white border border-slate-200 rounded-lg p-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            {levelQuestions.map((q, idx) => {
              const ans = answers[q.id];
              const isCurrent = idx === currentIndex;
              return (
                <button
                  key={q.id}
                  type="button"
                  onClick={() => setCurrentIndex(idx)}
                  aria-label={`${t.questionLabel} ${idx + 1}`}
                  className={`w-10 h-10 rounded-md font-mono text-xs font-semibold tabular-nums transition-colors flex flex-col items-center justify-center cursor-pointer ${
                    isCurrent
                      ? 'bg-[#1D4E78] text-white ring-2 ring-offset-1 ring-[#1D4E78]'
                      : ans
                      ? 'bg-emerald-50 text-emerald-900 border border-emerald-300 hover:bg-emerald-100'
                      : 'bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <span>{idx + 1}</span>
                  {ans && (
                    <span className="text-[10px] leading-none opacity-85">{ans}</span>
                  )}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={handleRequestFinish}
            className="px-4 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            {t.finishTestBtn}
          </button>
        </div>

        {/* Active Question Card */}
        {activeQuestion && (
          <div className="bg-white border border-slate-200 rounded-lg p-6 md:p-8 space-y-6">
            <div className="flex items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span className="font-mono font-bold text-[#1D4E78] tabular-nums">
                  {t.questionLabel} {currentIndex + 1} / {levelQuestions.length}
                </span>
                <span aria-hidden="true">·</span>
                <span className="font-medium text-slate-700">
                  {lang === 'uz' ? activeQuestion.categoryUz : activeQuestion.categoryRu}
                </span>
              </div>
              <span className="text-xs font-mono tabular-nums text-slate-500">
                10 {lang === 'uz' ? 'ball' : 'баллов'}
              </span>
            </div>

            <h2 className="text-lg md:text-xl font-semibold text-slate-900 leading-snug">
              {lang === 'uz' ? activeQuestion.questionUz : activeQuestion.questionRu}
            </h2>

            {/* Options A / B / C / D */}
            <div className="grid grid-cols-1 gap-3 pt-2">
              {(['A', 'B', 'C', 'D'] as OptionLetter[]).map((letter) => {
                const optionText =
                  lang === 'uz'
                    ? activeQuestion.optionsUz[letter]
                    : activeQuestion.optionsRu[letter];
                const isSelected = selectedLetter === letter;

                return (
                  <button
                    key={letter}
                    type="button"
                    onClick={() => handleSelectOption(activeQuestion.id, letter)}
                    className={`w-full text-left p-4 rounded-lg border transition-all flex items-start gap-4 cursor-pointer ${
                      isSelected
                        ? 'bg-[#1D4E78]/8 border-[#1D4E78] ring-1 ring-[#1D4E78]'
                        : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/70'
                    }`}
                  >
                    <span
                      className={`w-8 h-8 rounded flex items-center justify-center font-mono text-sm font-bold shrink-0 ${
                        isSelected
                          ? 'bg-[#1D4E78] text-white'
                          : 'bg-slate-100 text-slate-700 border border-slate-200'
                      }`}
                    >
                      {letter}
                    </span>
                    <span className="text-sm md:text-base text-slate-800 pt-1 leading-relaxed">
                      {optionText}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Bottom Navigation */}
            <div className="pt-6 border-t border-slate-200 flex items-center justify-between gap-4">
              <button
                type="button"
                disabled={currentIndex === 0}
                onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
                className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 disabled:pointer-events-none rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>{t.prevQuestionBtn}</span>
              </button>

              <div className="flex items-center gap-3">
                {currentIndex < levelQuestions.length - 1 ? (
                  <button
                    type="button"
                    onClick={() =>
                      setCurrentIndex((prev) =>
                        Math.min(levelQuestions.length - 1, prev + 1)
                      )
                    }
                    className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-[#1D4E78] hover:bg-[#163d5f] rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    <span>{t.nextQuestionBtn}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleRequestFinish}
                    className="inline-flex items-center gap-2 px-6 py-2.5 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    <FileCheck2 className="w-4 h-4" />
                    <span>{t.finishTestBtn}</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Unanswered Questions Confirmation Dialog */}
        {showSubmitConfirm && (
          <div
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center p-4"
          >
            <div className="bg-white border border-slate-200 rounded-lg max-w-md w-full p-6 space-y-4">
              <h3 className="text-base font-bold text-slate-900">
                {t.finishTestBtn}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {t.unansweredWarning} ({answeredCount} / {levelQuestions.length})
              </p>
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowSubmitConfirm(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md cursor-pointer"
                >
                  {t.cancelTestBtn}
                </button>
                <button
                  type="button"
                  onClick={finalizeTest}
                  className="px-4 py-2 text-xs font-semibold text-white bg-[#1D4E78] hover:bg-[#163d5f] rounded-md cursor-pointer"
                >
                  {t.confirmSubmitBtn}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ============================================================================
  // STAGE 3: COMPLETED RESULT & OFFICIAL VERDICT SHEET
  // ============================================================================
  if (stage === 'completed' && completedSubmission) {
    const evalSummary = evaluateTestAnswers(
      levelQuestions,
      completedSubmission.answers
    );

    return (
      <div className="space-y-6">
        <div className="bg-white border border-slate-200 rounded-lg p-6 md:p-8 space-y-6">
          {/* Header & Actions */}
          <div className="flex flex-wrap items-start justify-between gap-4 pb-6 border-b border-slate-200">
            <div>
              <div className="text-xs font-semibold text-[#1D4E78]">
                DISCOVER INVEST — ATTESTATSIYA BAYONNOMASI / ПРОТОКОЛ АТТЕСТАЦИИ
              </div>
              <h1 className="text-2xl font-bold text-slate-900 mt-1">
                {completedSubmission.candidateName}
              </h1>
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600 mt-1.5">
                <span>{completedSubmission.position}</span>
                <span aria-hidden="true">·</span>
                <span>{completedSubmission.siteObject}</span>
                <span aria-hidden="true">·</span>
                <span className="font-mono tabular-nums">{completedSubmission.phone}</span>
                <span aria-hidden="true">·</span>
                <span className="font-semibold text-slate-900">
                  Level: {completedSubmission.level.toUpperCase()}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 no-print">
              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>{t.printProtocolBtn}</span>
              </button>
              <button
                type="button"
                onClick={onNavigateToResults}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <TableProperties className="w-4 h-4" />
                <span>{t.openHrResultsBtn}</span>
              </button>
              <button
                type="button"
                onClick={handleResetForNewCandidate}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#1D4E78] hover:bg-[#163d5f] rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>{t.newCandidateBtn}</span>
              </button>
            </div>
          </div>

          {/* 3-Column Score & Qualification Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-lg bg-slate-50 border border-slate-200">
              <div className="text-xs font-medium text-slate-500">
                {t.totalScoreLabel}
              </div>
              <div className="text-3xl font-mono font-bold tabular-nums text-slate-900 mt-1">
                {completedSubmission.score}{' '}
                <span className="text-base font-normal text-slate-500">/ 100</span>
              </div>
              <div className="text-xs text-slate-500 mt-1 font-mono tabular-nums">
                {t.timeElapsedLabel}: {formatDuration(completedSubmission.durationSeconds)}
              </div>
            </div>

            <div className="p-5 rounded-lg bg-slate-50 border border-slate-200">
              <div className="text-xs font-medium text-slate-500">
                {t.correctAnswersLabel}
              </div>
              <div className="text-3xl font-mono font-bold tabular-nums text-slate-900 mt-1">
                {completedSubmission.correctCount}{' '}
                <span className="text-base font-normal text-slate-500">
                  / {completedSubmission.totalQuestions}
                </span>
              </div>
              <div className="text-xs text-slate-500 mt-1 font-mono tabular-nums">
                {completedSubmission.correctCount} × 10 = {completedSubmission.score}{' '}
                {lang === 'uz' ? 'ball' : 'баллов'}
              </div>
            </div>

            <div
              className={`p-5 rounded-lg border ${getTierColorClasses(
                completedSubmission.qualificationTier
              )}`}
            >
              <div className="text-xs font-medium opacity-80">
                {t.qualificationVerdictLabel} ({t.tierRanges[completedSubmission.qualificationTier]})
              </div>
              <div className="text-xl font-bold mt-1 flex items-center gap-2">
                <UserCheck className="w-5 h-5 shrink-0" />
                <span>{t.tierNames[completedSubmission.qualificationTier]}</span>
              </div>
              <p className="text-xs mt-2 leading-relaxed opacity-90">
                {t.tierRecommendations[completedSubmission.qualificationTier]}
              </p>
            </div>
          </div>

          {/* Interactive 5-Tier Discover Invest Scale Indicator */}
          <div className="pt-2">
            <div className="text-xs font-semibold text-slate-600 mb-2">
              {lang === 'uz'
                ? 'Discover Invest rasmiy attestatsiya shkalasi bo‘yicha o‘rni:'
                : 'Позиция кандидата на официальной шкале аттестации Discover Invest:'}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 font-mono text-xs tabular-nums">
              {(
                [
                  'not_qualified',
                  'needs_development',
                  'qualified',
                  'high_level',
                  'talent_pool',
                ] as QualificationTier[]
              ).map((tier) => {
                const isActive = completedSubmission.qualificationTier === tier;
                return (
                  <div
                    key={tier}
                    className={`p-3 rounded-md border transition-all ${
                      isActive
                        ? 'bg-[#1D4E78] text-white border-[#1D4E78] font-bold shadow-xs'
                        : 'bg-slate-50 text-slate-600 border-slate-200 opacity-75'
                    }`}
                  >
                    <div className="text-xs">{t.tierRanges[tier]}</div>
                    <div className="font-sans text-xs mt-0.5">
                      {t.tierNames[tier]}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Question-by-Question Breakdown Table */}
          <div className="pt-4">
            <h2 className="text-base font-bold text-slate-900 mb-3">
              {t.questionBreakdownTitle}
            </h2>
            <div className="overflow-x-auto border border-slate-200 rounded-lg">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                    <th className="py-3 px-3.5 w-12 font-mono">#</th>
                    <th className="py-3 px-3.5">
                      {lang === 'uz' ? 'Savol va Me’yoriy asos' : 'Вопрос и нормативная база'}
                    </th>
                    <th className="py-3 px-3.5 w-36">
                      {t.candidateChoiceLabel}
                    </th>
                    <th className="py-3 px-3.5 w-36">
                      {t.correctKeyLabel}
                    </th>
                    <th className="py-3 px-3.5 w-24 text-right font-mono">
                      {lang === 'uz' ? 'Ball' : 'Балл'}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {evalSummary.evaluations.map((ev, idx) => {
                    const q = levelQuestions[idx];
                    if (!q) return null;
                    const selectedText = ev.selectedOption
                      ? lang === 'uz'
                        ? q.optionsUz[ev.selectedOption]
                        : q.optionsRu[ev.selectedOption]
                      : t.noAnswerLabel;
                    const correctText =
                      lang === 'uz'
                        ? q.optionsUz[ev.correctOption]
                        : q.optionsRu[ev.correctOption];

                    return (
                      <tr key={q.id} className="hover:bg-slate-50/80">
                        <td className="py-3 px-3.5 font-mono font-semibold text-slate-700 tabular-nums align-top">
                          {idx + 1}
                        </td>
                        <td className="py-3 px-3.5 align-top">
                          <div className="font-medium text-slate-900 leading-snug">
                            {lang === 'uz' ? q.questionUz : q.questionRu}
                          </div>
                          <div className="text-[11px] text-slate-500 mt-1">
                            {lang === 'uz' ? q.categoryUz : q.categoryRu} ·{' '}
                            {lang === 'uz' ? q.normativeRefUz : q.normativeRefRu}
                          </div>
                        </td>
                        <td className="py-3 px-3.5 align-top">
                          <div className="flex items-start gap-1.5">
                            {ev.isCorrect ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                            ) : (
                              <XCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                            )}
                            <div>
                              <span className="font-mono font-bold text-slate-900">
                                {ev.selectedOption ?? '—'}
                              </span>
                              <p className="text-[11px] text-slate-600 line-clamp-2 mt-0.5">
                                {selectedText}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-3.5 align-top">
                          <span className="font-mono font-bold text-emerald-800">
                            {ev.correctOption}
                          </span>
                          <p className="text-[11px] text-slate-600 line-clamp-2 mt-0.5">
                            {correctText}
                          </p>
                        </td>
                        <td className="py-3 px-3.5 text-right font-mono font-bold tabular-nums align-top">
                          <span
                            className={
                              ev.isCorrect ? 'text-emerald-700' : 'text-red-600'
                            }
                          >
                            +{ev.pointsEarned}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};
