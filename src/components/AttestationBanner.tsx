import React, { useState } from 'react';
import { ChevronDown, ChevronUp, FileSpreadsheet } from 'lucide-react';
import { Language } from '../types';
import { getText } from '../utils/translations';

interface AttestationBannerProps {
  lang: Language;
}

export const AttestationBanner: React.FC<AttestationBannerProps> = ({ lang }) => {
  const [expanded, setExpanded] = useState(true);
  const t = getText(lang);

  return (
    <section
      aria-label={t.bannerTitle}
      className="bg-white border border-slate-200 rounded-lg overflow-hidden mb-6 no-print"
    >
      {/* Official Discover Invest dark blue header bar matching the specification document */}
      <div className="bg-[#1D4E78] text-white px-5 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <FileSpreadsheet className="w-4 h-4 text-sky-200 shrink-0" aria-hidden="true" />
          <h2 className="text-sm md:text-base font-bold tracking-wide truncate">
            {t.bannerTitle}
          </h2>
        </div>
        <button
          type="button"
          onClick={() => setExpanded((prev) => !prev)}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-sky-100 hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          aria-expanded={expanded}
        >
          <span>{expanded ? (lang === 'uz' ? 'Yig‘ish' : 'Свернуть') : (lang === 'uz' ? 'Mezonlarni ko‘rish' : 'Показать регламент')}</span>
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {expanded && (
        <div className="p-5 space-y-3 text-sm text-slate-800 leading-relaxed">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pb-3 border-b border-slate-100">
            <div className="space-y-1.5">
              <p className="font-medium text-slate-900">
                Три уровня сложности / Учта мураккаблик даражаси:{' '}
                <span className="font-semibold text-[#1D4E78]">Basic, Intermediate, Advanced.</span>
              </p>
              <p className="text-slate-700">
                {t.bannerScoring}
              </p>
              <p className="text-slate-600 text-xs">
                {t.bannerChoice}
              </p>
            </div>

            <div className="space-y-1.5">
              <p className="text-xs font-semibold text-slate-500">
                {lang === 'uz'
                  ? 'Rasmiy baholash shkalasi (0–100 ball):'
                  : 'Официальная шкала оценки (0–100 баллов):'}
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5 text-xs font-mono tabular-nums">
                <div className="p-2 rounded bg-red-50/70 border border-red-200/80 text-red-900">
                  <div className="font-bold">0–49</div>
                  <div className="font-sans text-[11px] text-red-800 leading-tight mt-0.5">
                    {lang === 'uz' ? 'Mos emas' : 'Не соотв.'}
                  </div>
                </div>
                <div className="p-2 rounded bg-amber-50/70 border border-amber-200/80 text-amber-900">
                  <div className="font-bold">50–64</div>
                  <div className="font-sans text-[11px] text-amber-800 leading-tight mt-0.5">
                    {lang === 'uz' ? 'Rivojlanish' : 'Развитие'}
                  </div>
                </div>
                <div className="p-2 rounded bg-sky-50/70 border border-sky-200/80 text-sky-900">
                  <div className="font-bold">65–79</div>
                  <div className="font-sans text-[11px] text-sky-800 leading-tight mt-0.5">
                    {lang === 'uz' ? 'Mos keladi' : 'Соответств.'}
                  </div>
                </div>
                <div className="p-2 rounded bg-emerald-50/70 border border-emerald-200/80 text-emerald-900">
                  <div className="font-bold">80–89</div>
                  <div className="font-sans text-[11px] text-emerald-800 leading-tight mt-0.5">
                    {lang === 'uz' ? 'Yuqori daraja' : 'Высокий ур.'}
                  </div>
                </div>
                <div className="p-2 rounded bg-teal-50/80 border border-teal-300 text-teal-950">
                  <div className="font-bold">90–100</div>
                  <div className="font-sans text-[11px] text-teal-900 leading-tight mt-0.5">
                    {lang === 'uz' ? 'Kadr zaxirasi' : 'Кадр. резерв'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <p className="text-xs text-slate-500">
            {t.bannerDisclaimer}
          </p>
        </div>
      )}
    </section>
  );
};
