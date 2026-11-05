import React, { useRef, useState } from 'react';
import {
  Download,
  Edit3,
  Plus,
  RotateCcw,
  Trash2,
  Upload,
  X,
} from 'lucide-react';
import {
  DifficultyLevel,
  Language,
  OptionLetter,
  Question,
} from '../types';
import { getText } from '../utils/translations';

interface QuestionBankViewProps {
  lang: Language;
  questions: Question[];
  onSaveQuestion: (question: Question) => void;
  onDeleteQuestion: (id: string) => void;
  onImportQuestions: (imported: Question[]) => void;
  onResetDefaultQuestions: () => void;
}

export const QuestionBankView: React.FC<QuestionBankViewProps> = ({
  lang,
  questions,
  onSaveQuestion,
  onDeleteQuestion,
  onImportQuestions,
  onResetDefaultQuestions,
}) => {
  const t = getText(lang);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [levelFilter, setLevelFilter] = useState<DifficultyLevel>('basic');
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [importMessage, setImportMessage] = useState<string | null>(null);

  const filteredQuestions = questions
    .filter((q) => q.level === levelFilter)
    .sort((a, b) => a.orderIndex - b.orderIndex);

  const handleOpenAddModal = () => {
    const nextOrder = filteredQuestions.length + 1;
    setEditingQuestion({
      id: `${levelFilter}-${Date.now()}`,
      orderIndex: nextOrder,
      level: levelFilter,
      categoryUz: 'Qurilish me’yorlari va TB',
      categoryRu: 'Строительные нормы и ТБ',
      questionUz: '',
      questionRu: '',
      optionsUz: { A: '', B: '', C: '', D: '' },
      optionsRu: { A: '', B: '', C: '', D: '' },
      correctOption: 'B',
      normativeRefUz: 'SHNK 3.03.01',
      normativeRefRu: 'ШНК 3.03.01',
    });
  };

  const handleModalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingQuestion) return;
    if (
      !editingQuestion.questionUz.trim() ||
      !editingQuestion.questionRu.trim()
    ) {
      return;
    }
    onSaveQuestion(editingQuestion);
    setEditingQuestion(null);
  };

  const handleExportJson = () => {
    const jsonStr = JSON.stringify(questions, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `discover-invest-questions-${new Date()
      .toISOString()
      .slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(String(event.target?.result ?? '[]'));
        if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].questionUz) {
          onImportQuestions(parsed);
          setImportMessage(
            lang === 'uz'
              ? `${parsed.length} ta savol muvaffaqiyatli yuklandi.`
              : `Успешно загружено вопросов: ${parsed.length}.`
          );
        } else {
          setImportMessage(
            lang === 'uz'
              ? 'Fayl formati noto‘g‘ri.'
              : 'Неверный формат JSON-файла.'
          );
        }
      } catch {
        setImportMessage(
          lang === 'uz'
            ? 'JSON faylni o‘qishda xatolik.'
            : 'Ошибка чтения JSON-файла.'
        );
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="space-y-6">
      {/* Header & Backup Controls */}
      <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-slate-200">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">
              {t.questionsTitle}
            </h1>
            <p className="text-sm text-slate-600 mt-1">{t.questionsSubtitle}</p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleFileImport}
              className="hidden"
            />
            <button
              type="button"
              onClick={handleExportJson}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{t.exportJsonBtn}</span>
            </button>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>{t.importJsonBtn}</span>
            </button>
            <button
              type="button"
              onClick={onResetDefaultQuestions}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{t.resetDefaultBtn}</span>
            </button>
            <button
              type="button"
              onClick={handleOpenAddModal}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#1D4E78] hover:bg-[#163d5f] rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{t.addQuestionBtn}</span>
            </button>
          </div>
        </div>

        {importMessage && (
          <div className="p-3 rounded bg-sky-50 border border-sky-200 text-xs text-sky-900 flex items-center justify-between">
            <span>{importMessage}</span>
            <button
              type="button"
              onClick={() => setImportMessage(null)}
              className="text-sky-700 hover:text-sky-950 font-semibold cursor-pointer"
            >
              ✕
            </button>
          </div>
        )}

        {/* Level Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-md">
            {(['basic', 'intermediate', 'advanced'] as DifficultyLevel[]).map(
              (lvl) => {
                const count = questions.filter((q) => q.level === lvl).length;
                return (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setLevelFilter(lvl)}
                    className={`px-4 py-2 text-xs font-semibold rounded transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      levelFilter === lvl
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {lvl.toUpperCase()} ({count})
                  </button>
                );
              }
            )}
          </div>

          <div className="text-xs text-slate-500 font-mono tabular-nums">
            {lang === 'uz' ? 'Jami savollar bazada:' : 'Всего вопросов в базе:'}{' '}
            <span className="font-bold text-slate-900">{questions.length}</span>
          </div>
        </div>
      </div>

      {/* Questions List for Active Level */}
      <div className="space-y-3">
        {filteredQuestions.map((q, idx) => (
          <div
            key={q.id}
            className="bg-white border border-slate-200 rounded-lg p-5 space-y-3"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span className="font-mono font-bold text-[#1D4E78] tabular-nums">
                    #{idx + 1} ({q.level.toUpperCase()})
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>{q.categoryUz}</span>
                  <span aria-hidden="true">·</span>
                  <span>{q.normativeRefUz}</span>
                </div>
                <h3 className="text-sm font-bold text-slate-900">
                  O‘Z: {q.questionUz}
                </h3>
                <p className="text-xs text-slate-600">РУ: {q.questionRu}</p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setEditingQuestion({ ...q })}
                  className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded transition-colors cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>{t.editBtn}</span>
                </button>
                <button
                  type="button"
                  onClick={() => onDeleteQuestion(q.id)}
                  aria-label={`${t.deleteRecordBtn} #${idx + 1}`}
                  className="p-1.5 text-slate-400 hover:text-red-600 rounded transition-colors cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2.5 pt-2">
              {(['A', 'B', 'C', 'D'] as OptionLetter[]).map((letter) => {
                const isCorrect = q.correctOption === letter;
                return (
                  <div
                    key={letter}
                    className={`p-2.5 rounded border text-xs ${
                      isCorrect
                        ? 'bg-emerald-50/70 border-emerald-300 text-emerald-950 font-semibold'
                        : 'bg-slate-50 border-slate-200 text-slate-700'
                    }`}
                  >
                    <div className="font-mono font-bold">
                      [{letter}] {isCorrect ? '✓ (Kalit / Ключ)' : ''}
                    </div>
                    <div className="mt-1">{q.optionsUz[letter]}</div>
                    <div className="text-[11px] opacity-75 mt-0.5">
                      {q.optionsRu[letter]}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Question Modal */}
      {editingQuestion && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-slate-900/60 flex items-center justify-center p-4 overflow-y-auto"
        >
          <form
            onSubmit={handleModalSubmit}
            className="bg-white border border-slate-200 rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-5"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h2 className="text-base font-bold text-slate-900">
                {t.addQuestionBtn} / {t.editBtn}
              </h2>
              <button
                type="button"
                onClick={() => setEditingQuestion(null)}
                className="p-1 text-slate-500 hover:text-slate-900 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Level
                </label>
                <select
                  value={editingQuestion.level}
                  onChange={(e) =>
                    setEditingQuestion((prev) =>
                      prev
                        ? {
                            ...prev,
                            level: e.target.value as DifficultyLevel,
                          }
                        : null
                    )
                  }
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md"
                >
                  <option value="basic">Basic</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t.correctKeyLabel} (A/B/C/D)
                </label>
                <select
                  value={editingQuestion.correctOption}
                  onChange={(e) =>
                    setEditingQuestion((prev) =>
                      prev
                        ? {
                            ...prev,
                            correctOption: e.target.value as OptionLetter,
                          }
                        : null
                    )
                  }
                  className="w-full px-3 py-2 text-xs font-mono font-bold border border-slate-300 rounded-md"
                >
                  <option value="A">A</option>
                  <option value="B">B</option>
                  <option value="C">C</option>
                  <option value="D">D</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t.normativeBasisLabel}
                </label>
                <input
                  type="text"
                  value={editingQuestion.normativeRefUz}
                  onChange={(e) =>
                    setEditingQuestion((prev) =>
                      prev
                        ? {
                            ...prev,
                            normativeRefUz: e.target.value,
                            normativeRefRu: e.target.value,
                          }
                        : null
                    )
                  }
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Savol matni (O‘zbek tilida) *
                </label>
                <textarea
                  rows={2}
                  required
                  value={editingQuestion.questionUz}
                  onChange={(e) =>
                    setEditingQuestion((prev) =>
                      prev ? { ...prev, questionUz: e.target.value } : null
                    )
                  }
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Текст вопроса (На русском языке) *
                </label>
                <textarea
                  rows={2}
                  required
                  value={editingQuestion.questionRu}
                  onChange={(e) =>
                    setEditingQuestion((prev) =>
                      prev ? { ...prev, questionRu: e.target.value } : null
                    )
                  }
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md"
                />
              </div>
            </div>

            <div className="space-y-3">
              {(['A', 'B', 'C', 'D'] as OptionLetter[]).map((letter) => (
                <div
                  key={letter}
                  className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3 rounded bg-slate-50 border border-slate-200"
                >
                  <div>
                    <label className="block text-[11px] font-mono font-bold text-slate-700 mb-1">
                      [{letter}] Variant (O‘Z) *
                    </label>
                    <input
                      type="text"
                      required
                      value={editingQuestion.optionsUz[letter]}
                      onChange={(e) =>
                        setEditingQuestion((prev) =>
                          prev
                            ? {
                                ...prev,
                                optionsUz: {
                                  ...prev.optionsUz,
                                  [letter]: e.target.value,
                                },
                              }
                            : null
                        )
                      }
                      className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono font-bold text-slate-700 mb-1">
                      [{letter}] Вариант (РУ) *
                    </label>
                    <input
                      type="text"
                      required
                      value={editingQuestion.optionsRu[letter]}
                      onChange={(e) =>
                        setEditingQuestion((prev) =>
                          prev
                            ? {
                                ...prev,
                                optionsRu: {
                                  ...prev.optionsRu,
                                  [letter]: e.target.value,
                                },
                              }
                            : null
                        )
                      }
                      className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded"
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setEditingQuestion(null)}
                className="px-4 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md cursor-pointer"
              >
                {t.cancelBtn}
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-semibold text-white bg-[#1D4E78] hover:bg-[#163d5f] rounded-md cursor-pointer"
              >
                {t.saveBtn}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
