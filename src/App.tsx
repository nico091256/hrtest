import React, { useEffect, useState } from 'react';
import { Lock, ShieldCheck } from 'lucide-react';
import { AppView, Language, Question, Submission } from './types';
import { INITIAL_QUESTIONS, INITIAL_SUBMISSIONS } from './data/seedData';
import { getText } from './utils/translations';
import { AttestationBanner } from './components/AttestationBanner';
import { CandidateAssessment } from './components/CandidateAssessment';
import { HrResultsView } from './components/HrResultsView';
import { CommissionKeysView } from './components/CommissionKeysView';
import { QuestionBankView } from './components/QuestionBankView';

const STORAGE_KEYS = {
  QUESTIONS: 'discover_invest_hr_questions_v2',
  SUBMISSIONS: 'discover_invest_hr_submissions_v2',
  LANG: 'discover_invest_hr_lang_v2',
  COMMISSION_UNLOCKED: 'discover_invest_hr_unlocked_v2',
};

const COMMISSION_PIN = '2026';

export default function App() {
  const [lang, setLang] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.LANG);
      return saved === 'ru' || saved === 'uz' ? saved : 'uz';
    } catch {
      return 'uz';
    }
  });

  const [activeView, setActiveView] = useState<AppView>('candidate');
  const [candidateResetKey, setCandidateResetKey] = useState(0);

  const [questions, setQuestions] = useState<Question[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.QUESTIONS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore storage errors
    }
    return INITIAL_QUESTIONS;
  });

  const [submissions, setSubmissions] = useState<Submission[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SUBMISSIONS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // ignore storage errors
    }
    return INITIAL_SUBMISSIONS;
  });

  const [commissionUnlocked, setCommissionUnlocked] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem(STORAGE_KEYS.COMMISSION_UNLOCKED) === 'true';
    } catch {
      return false;
    }
  });

  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.LANG, lang);
    } catch {
      // ignore
    }
  }, [lang]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.QUESTIONS, JSON.stringify(questions));
    } catch {
      // ignore
    }
  }, [questions]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SUBMISSIONS, JSON.stringify(submissions));
    } catch {
      // ignore
    }
  }, [submissions]);

  const t = getText(lang);

  const handleCompleteSubmission = (newSubmission: Submission) => {
    setSubmissions((prev) => [newSubmission, ...prev]);
  };

  const handleDeleteSubmission = (id: string) => {
    setSubmissions((prev) => prev.filter((s) => s.id !== id));
  };

  const handleSaveQuestion = (updated: Question) => {
    setQuestions((prev) => {
      const exists = prev.some((q) => q.id === updated.id);
      if (exists) {
        return prev.map((q) => (q.id === updated.id ? updated : q));
      }
      return [...prev, updated];
    });
  };

  const handleDeleteQuestion = (id: string) => {
    setQuestions((prev) => prev.filter((q) => q.id !== id));
  };

  const handleImportQuestions = (imported: Question[]) => {
    setQuestions(imported);
  };

  const handleResetDefaultQuestions = () => {
    setQuestions(INITIAL_QUESTIONS);
  };

  const handleStartNewTestClick = () => {
    setActiveView('candidate');
    setCandidateResetKey((prev) => prev + 1);
  };

  const handleUnlockCommission = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput.trim() === COMMISSION_PIN) {
      setCommissionUnlocked(true);
      setPinError(null);
      setPinInput('');
      try {
        sessionStorage.setItem(STORAGE_KEYS.COMMISSION_UNLOCKED, 'true');
      } catch {
        // ignore
      }
    } else {
      setPinError(t.pinError);
    }
  };

  const handleQuickUnlock = () => {
    setCommissionUnlocked(true);
    setPinError(null);
    setPinInput('');
    try {
      sessionStorage.setItem(STORAGE_KEYS.COMMISSION_UNLOCKED, 'true');
    } catch {
      // ignore
    }
  };

  const isHrProtectedView =
    activeView === 'results' ||
    activeView === 'keys' ||
    activeView === 'questions';

  return (
    <div id="top" className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* Strict 3-Zone Top Bar Contract */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 no-print">
        <div className="max-w-[1320px] mx-auto flex items-center justify-between gap-8">
          {/* Zone 1: Single text element wordmark */}
          <a
            href="#top"
            onClick={(e) => {
              e.preventDefault();
              setActiveView('candidate');
            }}
            className="text-lg font-extrabold tracking-tight text-[#1D4E78] whitespace-nowrap shrink-0"
          >
            {t.brandTitle}
          </a>

          {/* Zone 2: 4 concise single-line text navigation links */}
          <nav
            aria-label="Asosiy navigatsiya"
            className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600"
          >
            <a
              href="#candidate"
              onClick={(e) => {
                e.preventDefault();
                setActiveView('candidate');
              }}
              className={`py-1 transition-colors whitespace-nowrap shrink-0 border-b-2 ${
                activeView === 'candidate'
                  ? 'text-[#1D4E78] border-[#1D4E78] font-semibold'
                  : 'border-transparent hover:text-slate-900 hover:border-slate-300'
              }`}
            >
              {t.navCandidate}
            </a>
            <a
              href="#results"
              onClick={(e) => {
                e.preventDefault();
                setActiveView('results');
              }}
              className={`py-1 transition-colors whitespace-nowrap shrink-0 border-b-2 ${
                activeView === 'results'
                  ? 'text-[#1D4E78] border-[#1D4E78] font-semibold'
                  : 'border-transparent hover:text-slate-900 hover:border-slate-300'
              }`}
            >
              {t.navResults}
            </a>
            <a
              href="#keys"
              onClick={(e) => {
                e.preventDefault();
                setActiveView('keys');
              }}
              className={`py-1 transition-colors whitespace-nowrap shrink-0 border-b-2 ${
                activeView === 'keys'
                  ? 'text-[#1D4E78] border-[#1D4E78] font-semibold'
                  : 'border-transparent hover:text-slate-900 hover:border-slate-300'
              }`}
            >
              {t.navKeys}
            </a>
            <a
              href="#questions"
              onClick={(e) => {
                e.preventDefault();
                setActiveView('questions');
              }}
              className={`py-1 transition-colors whitespace-nowrap shrink-0 border-b-2 ${
                activeView === 'questions'
                  ? 'text-[#1D4E78] border-[#1D4E78] font-semibold'
                  : 'border-transparent hover:text-slate-900 hover:border-slate-300'
              }`}
            >
              {t.navQuestions}
            </a>
          </nav>

          {/* Zone 3: 1 primary action */}
          <div className="flex items-center shrink-0">
            <button
              type="button"
              onClick={handleStartNewTestClick}
              className="px-4 py-2 text-xs font-semibold text-white bg-[#1D4E78] hover:bg-[#163d5f] rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              {t.ctaStartNew}
            </button>
          </div>
        </div>
      </header>

      {/* Workspace Subbar: Mobile Navigation + Bilingual Switcher + Commission Lock Status */}
      <div className="bg-slate-100/80 border-b border-slate-200 px-6 py-2.5 no-print">
        <div className="max-w-[1320px] mx-auto flex flex-wrap items-center justify-between gap-3">
          {/* Mobile & Tablet Quick Navigation Tabs */}
          <div className="flex md:hidden items-center gap-1 overflow-x-auto">
            {(
              [
                ['candidate', t.navCandidate],
                ['results', t.navResults],
                ['keys', t.navKeys],
                ['questions', t.navQuestions],
              ] as Array<[AppView, string]>
            ).map(([viewKey, label]) => (
              <button
                key={viewKey}
                type="button"
                onClick={() => setActiveView(viewKey)}
                className={`px-2.5 py-1 text-xs font-medium rounded whitespace-nowrap shrink-0 cursor-pointer ${
                  activeView === viewKey
                    ? 'bg-[#1D4E78] text-white'
                    : 'text-slate-700 hover:bg-slate-200'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-2 text-xs text-slate-600">
            <span>HR Department & Engineering Attestation</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono tabular-nums">
              {questions.length} {lang === 'uz' ? 'savol' : 'вопросов'}
            </span>
            <span aria-hidden="true">·</span>
            <span className="font-mono tabular-nums">
              {submissions.length} {lang === 'uz' ? 'nomzod natijasi' : 'протоколов'}
            </span>
          </div>

          {/* Language Switcher & Commission Lock Toggle */}
          <div className="flex flex-wrap items-center justify-between sm:justify-end gap-2 w-full sm:w-auto sm:ml-auto">
            {commissionUnlocked && (
              <button
                type="button"
                onClick={() => {
                  setCommissionUnlocked(false);
                  try {
                    sessionStorage.removeItem(STORAGE_KEYS.COMMISSION_UNLOCKED);
                  } catch {
                    // ignore
                  }
                }}
                className="inline-flex items-center gap-1.5 text-xs text-emerald-800 hover:text-slate-900 cursor-pointer whitespace-nowrap shrink-0"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>
                  {lang === 'uz'
                    ? 'Komissiya rejimi (Yopish)'
                    : 'Режим комиссии (Закрыть)'}
                </span>
              </button>
            )}

            <div
              role="group"
              aria-label="Tilni tanlash / Выбор языка"
              className="flex items-center gap-1 p-0.5 bg-slate-200/80 rounded-md"
            >
              <button
                type="button"
                onClick={() => setLang('uz')}
                className={`px-2.5 py-1 text-xs font-semibold rounded transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  lang === 'uz'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                O‘zbekcha (O‘Z)
              </button>
              <button
                type="button"
                onClick={() => setLang('ru')}
                className={`px-2.5 py-1 text-xs font-semibold rounded transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  lang === 'ru'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Русский (РУ)
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Container */}
      <main className="flex-1 max-w-[1320px] w-full mx-auto px-4 sm:px-6 py-6">
        <AttestationBanner lang={lang} />

        {/* Candidate View */}
        {activeView === 'candidate' && (
          <CandidateAssessment
            key={candidateResetKey}
            lang={lang}
            questions={questions}
            onCompleteSubmission={handleCompleteSubmission}
            onNavigateToResults={() => {
              setCommissionUnlocked(true);
              setActiveView('results');
            }}
          />
        )}

        {/* Commission PIN Gate for HR Views */}
        {isHrProtectedView && !commissionUnlocked && (
          <div className="max-w-md mx-auto my-8 bg-white border border-slate-200 rounded-lg p-6 md:p-8 space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-md bg-[#1D4E78]/10 text-[#1D4E78] flex items-center justify-center shrink-0">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-base font-bold text-slate-900">
                  {t.commissionGateTitle}
                </h1>
                <p className="text-xs text-slate-500">
                  Discover Invest HR & Attestation Commission
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              {t.commissionGateDesc}
            </p>

            <form onSubmit={handleUnlockCommission} className="space-y-4">
              {pinError && (
                <div
                  role="alert"
                  className="p-3 rounded bg-red-50 border border-red-200 text-xs text-red-800"
                >
                  {pinError}
                </div>
              )}

              <div>
                <label
                  htmlFor="commission-pin-input"
                  className="block text-xs font-semibold text-slate-700 mb-1.5"
                >
                  PIN-kod
                </label>
                <input
                  id="commission-pin-input"
                  type="password"
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  placeholder={t.pinPlaceholder}
                  className="w-full px-3.5 py-2 text-sm font-mono bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1D4E78]"
                />
              </div>

              <div className="flex flex-col gap-2 pt-1">
                <button
                  type="submit"
                  className="w-full py-2.5 text-xs font-semibold text-white bg-[#1D4E78] hover:bg-[#163d5f] rounded-md transition-colors cursor-pointer"
                >
                  {t.unlockBtn}
                </button>
                <button
                  type="button"
                  onClick={handleQuickUnlock}
                  className="w-full py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors cursor-pointer"
                >
                  {t.quickUnlockBtn}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* HR Results Table View */}
        {activeView === 'results' && commissionUnlocked && (
          <HrResultsView
            lang={lang}
            submissions={submissions}
            questions={questions}
            onDeleteSubmission={handleDeleteSubmission}
            onStartNewCandidate={handleStartNewTestClick}
          />
        )}

        {/* Commission Answer Keys Sheet View */}
        {activeView === 'keys' && commissionUnlocked && (
          <CommissionKeysView lang={lang} questions={questions} />
        )}

        {/* Question Bank CRUD & Backup View */}
        {activeView === 'questions' && commissionUnlocked && (
          <QuestionBankView
            lang={lang}
            questions={questions}
            onSaveQuestion={handleSaveQuestion}
            onDeleteQuestion={handleDeleteQuestion}
            onImportQuestions={handleImportQuestions}
            onResetDefaultQuestions={handleResetDefaultQuestions}
          />
        )}
      </main>

      {/* Quiet Footer */}
      <footer className="bg-white border-t border-slate-200 px-6 py-4 mt-12 no-print">
        <div className="max-w-[1320px] mx-auto flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            Discover Invest — HR Department · Masterlar Attestatsiyasi / Аттестация Мастеров
          </div>
          <div>
            Basic · Intermediate · Advanced (10 × 10 = 100 ball)
          </div>
        </div>
      </footer>
    </div>
  );
}
