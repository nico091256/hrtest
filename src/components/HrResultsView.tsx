import React, { useMemo, useState } from 'react';
import {
  CheckCircle2,
  Download,
  FileText,
  Printer,
  Search,
  Trash2,
  X,
  XCircle,
} from 'lucide-react';
import {
  DifficultyLevel,
  Language,
  QualificationTier,
  Question,
  Submission,
} from '../types';
import {
  evaluateTestAnswers,
  filterSubmissions,
  formatDuration,
  generateCsvContent,
} from '../utils/scoring';
import { getText } from '../utils/translations';

interface HrResultsViewProps {
  lang: Language;
  submissions: Submission[];
  questions: Question[];
  onDeleteSubmission: (id: string) => void;
  onStartNewCandidate: () => void;
}

export const HrResultsView: React.FC<HrResultsViewProps> = ({
  lang,
  submissions,
  questions,
  onDeleteSubmission,
  onStartNewCandidate,
}) => {
  const t = getText(lang);

  const [searchQuery, setSearchQuery] = useState('');
  const [levelFilter, setLevelFilter] = useState<DifficultyLevel | 'all'>('all');
  const [tierFilter, setTierFilter] = useState<QualificationTier | 'all'>('all');
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(
    null
  );

  const filteredSubmissions = useMemo(() => {
    return filterSubmissions(submissions, {
      searchQuery,
      levelFilter,
      tierFilter,
    });
  }, [submissions, searchQuery, levelFilter, tierFilter]);

  const tierCounts = useMemo(() => {
    const counts: Record<QualificationTier, number> = {
      not_qualified: 0,
      needs_development: 0,
      qualified: 0,
      high_level: 0,
      talent_pool: 0,
    };
    submissions.forEach((s) => {
      counts[s.qualificationTier] = (counts[s.qualificationTier] || 0) + 1;
    });
    return counts;
  }, [submissions]);

  const handleExportCsv = () => {
    const csvContent = generateCsvContent(filteredSubmissions, lang);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `discover-invest-attestation-${new Date()
      .toISOString()
      .slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getTierTextClass = (tier: QualificationTier) => {
    switch (tier) {
      case 'not_qualified':
        return 'text-red-700 font-semibold';
      case 'needs_development':
        return 'text-amber-700 font-semibold';
      case 'qualified':
        return 'text-sky-700 font-semibold';
      case 'high_level':
        return 'text-emerald-700 font-semibold';
      case 'talent_pool':
        return 'text-teal-800 font-bold';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Export Action */}
      <div className="bg-white border border-slate-200 rounded-lg p-6">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">
              {t.resultsTitle}
            </h1>
            <p className="text-sm text-slate-600 mt-1">{t.resultsSubtitle}</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleExportCsv}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-[#1D4E78] hover:bg-[#163d5f] rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>{t.exportCsvBtn}</span>
            </button>
          </div>
        </div>

        {/* 5-Tier Discover Invest Scale Distribution Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-5">
          <button
            type="button"
            onClick={() => setTierFilter('all')}
            className={`text-left p-3.5 rounded-md border transition-colors cursor-pointer ${
              tierFilter === 'all'
                ? 'bg-slate-900 text-white border-slate-900'
                : 'bg-slate-50 text-slate-800 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <div className="text-[11px] opacity-80">
              {lang === 'uz' ? 'Jami topshirganlar' : 'Всего кандидатов'}
            </div>
            <div className="text-2xl font-mono font-bold tabular-nums mt-1">
              {submissions.length}
            </div>
            <div className="text-[11px] opacity-75 mt-0.5">100% baza</div>
          </button>

          {(
            [
              'talent_pool',
              'high_level',
              'qualified',
              'needs_development',
              'not_qualified',
            ] as QualificationTier[]
          ).map((tier) => {
            const active = tierFilter === tier;
            return (
              <button
                key={tier}
                type="button"
                onClick={() =>
                  setTierFilter((prev) => (prev === tier ? 'all' : tier))
                }
                className={`text-left p-3.5 rounded-md border transition-colors cursor-pointer ${
                  active
                    ? 'bg-[#1D4E78] text-white border-[#1D4E78]'
                    : 'bg-white text-slate-800 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="text-[11px] font-mono tabular-nums opacity-75">
                  {t.tierRanges[tier]}
                </div>
                <div className="text-2xl font-mono font-bold tabular-nums mt-1">
                  {tierCounts[tier]}
                </div>
                <div className="text-xs font-medium truncate mt-0.5">
                  {t.tierNames[tier]}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Filters & High-Density Results Table */}
      <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative flex-1 min-w-[240px]">
            <Search
              className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2"
              aria-hidden="true"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.searchPlaceholder}
              aria-label={t.searchPlaceholder}
              className="w-full pl-10 pr-4 py-2 text-xs bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1D4E78]"
            />
          </div>

          {/* Segmented Level Filter */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-md">
            {(
              ['all', 'basic', 'intermediate', 'advanced'] as Array<
                DifficultyLevel | 'all'
              >
            ).map((lvl) => (
              <button
                key={lvl}
                type="button"
                onClick={() => setLevelFilter(lvl)}
                className={`px-3 py-1.5 text-xs font-medium rounded transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  levelFilter === lvl
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {lvl === 'all'
                  ? t.filterAllLevels
                  : lvl.charAt(0).toUpperCase() + lvl.slice(1)}
              </button>
            ))}
          </div>

          {(searchQuery || levelFilter !== 'all' || tierFilter !== 'all') && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setLevelFilter('all');
                setTierFilter('all');
              }}
              className="text-xs font-medium text-slate-600 hover:text-slate-900 underline cursor-pointer"
            >
              {t.clearFilterBtn}
            </button>
          )}
        </div>

        {filteredSubmissions.length === 0 ? (
          <div className="py-12 text-center border border-dashed border-slate-200 rounded-lg space-y-3">
            <p className="text-sm text-slate-600">{t.emptyResultsText}</p>
            <button
              type="button"
              onClick={onStartNewCandidate}
              className="px-4 py-2 text-xs font-semibold text-white bg-[#1D4E78] hover:bg-[#163d5f] rounded-md cursor-pointer"
            >
              {t.ctaStartNew}
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto border border-slate-200 rounded-lg">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                  <th className="py-3 px-4">
                    {lang === 'uz' ? 'Nomzod va Lavozim' : 'Сотрудник и должность'}
                  </th>
                  <th className="py-3 px-4">
                    {lang === 'uz' ? 'Ob’ekt · Telefon' : 'Объект · Телефон'}
                  </th>
                  <th className="py-3 px-4">
                    {lang === 'uz' ? 'Daraja' : 'Уровень'}
                  </th>
                  <th className="py-3 px-4 text-right font-mono">
                    {lang === 'uz' ? 'Javoblar' : 'Ответы'}
                  </th>
                  <th className="py-3 px-4 text-right font-mono">
                    {lang === 'uz' ? 'Ball (100)' : 'Балл (100)'}
                  </th>
                  <th className="py-3 px-4">
                    {lang === 'uz' ? 'Komissiya xulosasi' : 'Заключение шкалы'}
                  </th>
                  <th className="py-3 px-4 text-right">
                    {lang === 'uz' ? 'Amallar' : 'Действия'}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredSubmissions.map((sub) => (
                  <tr
                    key={sub.id}
                    className="hover:bg-slate-50/90 transition-colors"
                  >
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900">
                        {sub.candidateName}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        {sub.position}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-slate-800">{sub.siteObject}</div>
                      <div className="text-[11px] font-mono tabular-nums text-slate-500 mt-0.5">
                        {sub.phone} ·{' '}
                        {new Date(sub.submittedAt).toLocaleDateString(
                          lang === 'uz' ? 'uz-UZ' : 'ru-RU'
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono font-semibold text-slate-800 uppercase">
                      {sub.level}
                    </td>
                    <td className="py-3 px-4 text-right font-mono tabular-nums text-slate-700">
                      {sub.correctCount} / {sub.totalQuestions}
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-sm font-bold tabular-nums text-slate-900">
                      {sub.score}
                    </td>
                    <td className="py-3 px-4">
                      <div className={getTierTextClass(sub.qualificationTier)}>
                        {t.tierNames[sub.qualificationTier]}
                      </div>
                      <div className="text-[11px] font-mono tabular-nums text-slate-500">
                        {t.tierRanges[sub.qualificationTier]} ·{' '}
                        {formatDuration(sub.durationSeconds)}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setSelectedSubmission(sub)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-[#1D4E78] bg-slate-100 hover:bg-slate-200 rounded transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>{t.viewProtocolBtn}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => onDeleteSubmission(sub.id)}
                          aria-label={`${t.deleteRecordBtn} ${sub.candidateName}`}
                          className="p-1.5 text-slate-400 hover:text-red-600 rounded transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Candidate Attestation Protocol Modal */}
      {selectedSubmission && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-slate-900/60 flex items-center justify-center p-4 overflow-y-auto"
        >
          <div className="bg-white border border-slate-200 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6 md:p-8 space-y-6">
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-200">
              <div>
                <div className="text-xs font-bold text-[#1D4E78]">
                  DISCOVER INVEST — ATTESTATSIYA BAYONNOMASI / ПРОТОКОЛ АТТЕСТАЦИИ
                </div>
                <h2 className="text-xl font-bold text-slate-900 mt-1">
                  {selectedSubmission.candidateName}
                </h2>
                <div className="text-xs text-slate-600 mt-1">
                  {selectedSubmission.position} · {selectedSubmission.siteObject} ·{' '}
                  <span className="font-mono">{selectedSubmission.phone}</span> ·
                  Level: {selectedSubmission.level.toUpperCase()}
                </div>
              </div>

              <div className="flex items-center gap-2 no-print">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>{t.printProtocolBtn}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedSubmission(null)}
                  aria-label={t.cancelBtn}
                  className="p-1.5 text-slate-500 hover:text-slate-900 rounded cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Protocol Summary Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-lg bg-slate-50 border border-slate-200 text-xs">
              <div>
                <div className="text-slate-500">{t.totalScoreLabel}</div>
                <div className="text-2xl font-mono font-bold tabular-nums text-slate-900 mt-0.5">
                  {selectedSubmission.score} / 100
                </div>
              </div>
              <div>
                <div className="text-slate-500">{t.correctAnswersLabel}</div>
                <div className="text-2xl font-mono font-bold tabular-nums text-slate-900 mt-0.5">
                  {selectedSubmission.correctCount} /{' '}
                  {selectedSubmission.totalQuestions}
                </div>
              </div>
              <div>
                <div className="text-slate-500">{t.qualificationVerdictLabel}</div>
                <div
                  className={`text-base mt-1 ${getTierTextClass(
                    selectedSubmission.qualificationTier
                  )}`}
                >
                  {t.tierNames[selectedSubmission.qualificationTier]} (
                  {t.tierRanges[selectedSubmission.qualificationTier]})
                </div>
              </div>
            </div>

            {/* Detailed Question Evaluation Table */}
            {(() => {
              const lvlQuestions = questions
                .filter((q) => q.level === selectedSubmission.level)
                .sort((a, b) => a.orderIndex - b.orderIndex);
              const summary = evaluateTestAnswers(
                lvlQuestions,
                selectedSubmission.answers
              );

              return (
                <div className="overflow-x-auto border border-slate-200 rounded-lg">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                        <th className="py-2.5 px-3 w-10 font-mono">#</th>
                        <th className="py-2.5 px-3">
                          {lang === 'uz' ? 'Savol matni' : 'Текст вопроса'}
                        </th>
                        <th className="py-2.5 px-3 w-28 font-mono">
                          {t.candidateChoiceLabel}
                        </th>
                        <th className="py-2.5 px-3 w-28 font-mono">
                          {t.correctKeyLabel}
                        </th>
                        <th className="py-2.5 px-3 w-20 text-right font-mono">
                          {lang === 'uz' ? 'Ball' : 'Балл'}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {summary.evaluations.map((ev, i) => {
                        const q = lvlQuestions[i];
                        if (!q) return null;
                        return (
                          <tr key={q.id}>
                            <td className="py-2.5 px-3 font-mono tabular-nums text-slate-600">
                              {i + 1}
                            </td>
                            <td className="py-2.5 px-3">
                              <div className="font-medium text-slate-900">
                                {lang === 'uz' ? q.questionUz : q.questionRu}
                              </div>
                              <div className="text-[11px] text-slate-500 mt-0.5">
                                {lang === 'uz'
                                  ? q.normativeRefUz
                                  : q.normativeRefRu}
                              </div>
                            </td>
                            <td className="py-2.5 px-3 font-mono font-bold">
                              <span className="inline-flex items-center gap-1.5">
                                {ev.isCorrect ? (
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                ) : (
                                  <XCircle className="w-3.5 h-3.5 text-red-600" />
                                )}
                                <span>{ev.selectedOption ?? '—'}</span>
                              </span>
                            </td>
                            <td className="py-2.5 px-3 font-mono font-bold text-emerald-800">
                              {ev.correctOption}
                            </td>
                            <td className="py-2.5 px-3 text-right font-mono font-bold tabular-nums">
                              +{ev.pointsEarned}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              );
            })()}

            {/* Official Commission Signatures Block */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-slate-200 text-xs text-slate-600">
              <div>
                <div className="font-semibold text-slate-800">
                  {lang === 'uz'
                    ? 'Attestatsiya komissiyasi raisi:'
                    : 'Председатель аттестационной комиссии:'}
                </div>
                <div className="mt-6 border-b border-slate-300 pb-1">
                  _____________________ / Ф.И.О.
                </div>
              </div>
              <div>
                <div className="font-semibold text-slate-800">
                  {lang === 'uz'
                    ? 'HR departamenti mas’ul xodimi:'
                    : 'Представитель HR-департамента:'}
                </div>
                <div className="mt-6 border-b border-slate-300 pb-1">
                  _____________________ / Ф.И.О.
                </div>
              </div>
              <div>
                <div className="font-semibold text-slate-800">
                  {lang === 'uz' ? 'Nomzod / Xodim imzosi:' : 'Подпись сотрудника:'}
                </div>
                <div className="mt-6 border-b border-slate-300 pb-1">
                  _____________________ / {selectedSubmission.candidateName}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
