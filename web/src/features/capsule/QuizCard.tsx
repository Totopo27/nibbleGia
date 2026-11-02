import React, { useState } from "react";
import type { Check, CheckAttempt } from "../../types/domain.ts";
import { CheckCircle2, XCircle, HelpCircle } from "lucide-react";
import { sfx } from "../../utils/sound.ts";

interface QuizCardProps {
  check: Check;
  onAttemptEvaluated: (attempt: CheckAttempt) => void;
  evaluateFn: (checkId: string, selectedOptionId: string) => Promise<CheckAttempt>;
}

export const QuizCard: React.FC<QuizCardProps> = ({ check, onAttemptEvaluated, evaluateFn }) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [attempt, setAttempt] = useState<CheckAttempt | null>(null);
  const [evaluating, setEvaluating] = useState<boolean>(false);

  const handleSelect = async (optionId: string) => {
    if (attempt || evaluating) return; // Ya evaluado o en proceso
    setSelectedId(optionId);
    setEvaluating(true);
    sfx.playTap();
    sfx.haptic("light");

    try {
      const result = await evaluateFn(check.id, optionId);
      setAttempt(result);
      onAttemptEvaluated(result);

      if (result.isCorrect) {
        sfx.playSuccess();
        sfx.haptic("success");
      } else {
        sfx.playIncorrect();
        sfx.haptic("error");
      }
    } catch (err) {
      console.error("Error evaluando quiz:", err);
    } finally {
      setEvaluating(false);
    }
  };

  return (
    <div className="mt-4 p-5 rounded-2xl bg-zinc-50/90 border border-zinc-200/90 flex flex-col transition-all duration-300">
      <div className="flex items-center gap-2 text-xs font-bold text-amber-700 uppercase tracking-wider mb-2">
        <HelpCircle className="w-4 h-4 text-amber-500 animate-float-gentle" />
        <span>Desafío de Comprobación</span>
      </div>

      <h3 className="font-extrabold text-zinc-900 text-base leading-snug mb-4">
        {check.question}
      </h3>

      {/* Opciones */}
      <div className="flex flex-col gap-2.5">
        {check.options.map((option) => {
          const isSelected = selectedId === option.id;
          let btnStyle = "border-zinc-200 bg-white text-zinc-800 hover:border-amber-400 hover:bg-amber-50/40 active:scale-[0.985]";

          if (attempt) {
            if (option.id === check.correctOptionId) {
              btnStyle = "border-emerald-500 bg-emerald-50 text-emerald-950 font-bold ring-2 ring-emerald-400/40 shadow-sm animate-pop-in";
            } else if (isSelected && !attempt.isCorrect) {
              btnStyle = "border-rose-400 bg-rose-50 text-rose-950 ring-2 ring-rose-400/40 animate-pop-in";
            } else {
              btnStyle = "border-zinc-200 bg-zinc-100/70 text-zinc-400 opacity-60";
            }
          } else if (isSelected) {
            btnStyle = "border-amber-500 bg-amber-50 text-amber-950 font-semibold ring-2 ring-amber-400/30 scale-[0.99]";
          }

          return (
            <button
              key={option.id}
              onClick={() => handleSelect(option.id)}
              disabled={!!attempt || evaluating}
              className={`p-3.5 rounded-xl border text-left text-sm transition-all duration-200 flex items-center justify-between gap-3 cursor-pointer disabled:cursor-default ${btnStyle}`}
            >
              <span className="leading-snug">{option.text}</span>
              {attempt && option.id === check.correctOptionId && (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 animate-pop-in" />
              )}
              {attempt && isSelected && !attempt.isCorrect && (
                <XCircle className="w-5 h-5 text-rose-500 shrink-0 animate-pop-in" />
              )}
            </button>
          );
        })}
      </div>

      {/* Retroalimentación explicativa */}
      {attempt && (
        <div
          className={`mt-4 p-4 rounded-xl text-xs leading-relaxed transition-all duration-300 animate-pop-in ${
            attempt.isCorrect
              ? "bg-emerald-100/80 border border-emerald-300 text-emerald-950"
              : "bg-rose-100/80 border border-rose-300 text-rose-950"
          }`}
        >
          <p className="font-bold mb-1 flex items-center gap-1.5">
            {attempt.isCorrect ? "¡Excelente razonamiento!" : "No del todo acertado:"}
          </p>
          <p className="opacity-90">{attempt.explanationShown}</p>
        </div>
      )}
    </div>
  );
};
