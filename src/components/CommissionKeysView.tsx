import React, { useState } from 'react';
import { KeyRound, Printer } from 'lucide-react';
import { DifficultyLevel, Language, Question } from '../types';
import { getText } from '../utils/translations';

interface CommissionKeysViewProps {
  lang: Language;
  questions: Question[];
}

export const CommissionKeysView: React.FC<CommissionKeysViewProps> = ({
  lang,
  questions,
}) => {
  const t = getText(lang);
  const [selectedLevel, setSelectedLevel] = useState<DifficultyLevel | 'all'>(
    'basic'
  );

  const levelsToDisplay: DifficultyLevel[] =
    selectedLevel === 'all'
      ? ['basic', 'intermediate', 'advanced']
      : [selectedLevel];

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="bg-white border border-slate-200 rounded-lg p-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#1D4E78]">
            <KeyRound className="w-4 h-4" />
            <span>
              DISCOVER INVEST — КОМИССИЯ КАЛИТЛАРИ ВАРАҒИ / ЛИСТ КЛЮЧЕЙ КОМИССИИ
            </span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-900 mt-1">
            {t.keysTitle}
          </h1>
          <p className="text-sm text-slate-600 mt-1">{t.keysSubtitle}</p>
        </div>

        <div className="flex flex-wrap items-center gap-3 no-print">
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-md">
            {(
              ['basic', 'intermediate', 'advanced', 'all'] as Array<
                DifficultyLevel | 'all'
              >
            ).map((lvl) => (
              <button
                key={lvl}
                type="button"
                onClick={() => setSelectedLevel(lvl)}
                className={`px-3 py-1.5 text-xs font-medium rounded transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  selectedLevel === lvl
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

          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-[#1D4E78] hover:bg-[#163d5f] rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>{t.printKeysBtn}</span>
          </button>
        </div>
      </div>

      {/* Commission Key Sheets by Level */}
      {levelsToDisplay.map((lvl) => {
        const lvlQuestions = questions
          .filter((q) => q.level === lvl)
          .sort((a, b) => a.orderIndex - b.orderIndex);

        return (
          <div
            key={lvl}
            className="bg-white border border-slate-200 rounded-lg p-6 space-y-5"
          >
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  {t.levelTitle[lvl]}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  {lvlQuestions.length} {lang === 'uz' ? 'ta savol' : 'вопросов'} ·{' '}
                  {lang === 'uz'
                    ? 'Har bir to‘g‘ri kalit = 10 ball · Jami = 100 ball'
                    : 'Каждый верный ключ = 10 баллов · Всего = 100 баллов'}
                </p>
              </div>

              {/* Express 1..10 Matrix Strip for Commission */}
              <div className="flex flex-wrap items-center gap-1.5 font-mono text-xs tabular-nums">
                {lvlQuestions.map((q, idx) => (
                  <div
                    key={q.id}
                    className="px-2.5 py-1.5 rounded bg-slate-100 border border-slate-200 text-slate-900"
                  >
                    <span className="text-slate-500 mr-1">{idx + 1}:</span>
                    <span className="font-bold text-[#1D4E78]">
                      {q.correctOption}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="overflow-x-auto border border-slate-200 rounded-lg">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                    <th className="py-3 px-3.5 w-12 font-mono">№</th>
                    <th className="py-3 px-3.5 w-44">
                      {lang === 'uz' ? 'Bo‘lim / Mavzu' : 'Раздел / Категория'}
                    </th>
                    <th className="py-3 px-3.5">
                      {lang === 'uz'
                        ? 'Savol (O‘z / Ру) va To‘g‘ri javob matni'
                        : 'Вопрос (Уз / Ру) и формулировка верного ответа'}
                    </th>
                    <th className="py-3 px-3.5 w-24 text-center font-mono">
                      {lang === 'uz' ? 'Kalit' : 'Ключ'}
                    </th>
                    <th className="py-3 px-3.5 w-52">
                      {t.normativeBasisLabel}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {lvlQuestions.map((q, idx) => (
                    <tr key={q.id} className="hover:bg-slate-50/80">
                      <td className="py-3.5 px-3.5 font-mono font-bold text-slate-700 tabular-nums align-top">
                        {idx + 1}
                      </td>
                      <td className="py-3.5 px-3.5 align-top font-medium text-slate-800">
                        <div>{lang === 'uz' ? q.categoryUz : q.categoryRu}</div>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          {lang === 'uz' ? q.categoryRu : q.categoryUz}
                        </div>
                      </td>
                      <td className="py-3.5 px-3.5 align-top space-y-1.5">
                        <div className="font-semibold text-slate-900">
                          {lang === 'uz' ? q.questionUz : q.questionRu}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {lang === 'uz' ? q.questionRu : q.questionUz}
                        </div>
                        <div className="pt-1 text-emerald-800 font-medium">
                          ✓ [{q.correctOption}]{' '}
                          {lang === 'uz'
                            ? q.optionsUz[q.correctOption]
                            : q.optionsRu[q.correctOption]}
                        </div>
                      </td>
                      <td className="py-3.5 px-3.5 text-center align-top">
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded bg-[#1D4E78] text-white font-mono text-sm font-bold">
                          {q.correctOption}
                        </span>
                      </td>
                      <td className="py-3.5 px-3.5 align-top text-slate-600">
                        <div>
                          {lang === 'uz' ? q.normativeRefUz : q.normativeRefRu}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      })}
    </div>
  );
};
