import React, { useState } from "react";
import type { Capsule, CheckAttempt } from "../../types/domain.ts";
import { ProgressBar } from "./ProgressBar.tsx";
import { QuizCard } from "./QuizCard.tsx";
import { ChevronRight, ArrowLeft, Award, Sparkles, RefreshCw } from "lucide-react";
import { sfx } from "../../utils/sound.ts";

interface CapsuleRunnerProps {
  capsule: Capsule;
  onClose: () => void;
  onComplete: (accuracyRate: number) => void;
  evaluateCheckFn: (checkId: string, selectedOptionId: string) => Promise<CheckAttempt>;
}

export const calculateAccuracy = (
  steps: Capsule["steps"],
  attempts: Record<string, CheckAttempt>
): number => {
  const totalChecks = steps.filter((s) => !!s.check).length;
  if (totalChecks === 0) return 100;
  const correctChecks = Object.values(attempts).filter((a) => a.isCorrect).length;
  return Math.round((correctChecks / totalChecks) * 100);
};

export const CapsuleRunner: React.FC<CapsuleRunnerProps> = ({
  capsule,
  onClose,
  onComplete,
  evaluateCheckFn,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [attempts, setAttempts] = useState<Record<string, CheckAttempt>>({});
  const [isFinished, setIsFinished] = useState<boolean>(false);

  const currentStep = capsule.steps[currentStepIndex];
  const hasQuiz = !!currentStep?.check;
  const currentQuizAttempt = hasQuiz ? attempts[currentStep.check!.id] : undefined;
  const isAdvanceAllowed = !hasQuiz || !!currentQuizAttempt;

  const handleNext = () => {
    if (!isAdvanceAllowed) return;

    sfx.playTap();
    sfx.haptic("light");

    if (currentStepIndex + 1 < capsule.steps.length) {
      setCurrentStepIndex((prev) => prev + 1);
    } else {
      // Fin de la cápsula
      setIsFinished(true);
      sfx.playCelebration();
      sfx.haptic("success");
      const accuracy = calculateAccuracy(capsule.steps, attempts);
      onComplete(accuracy);
    }
  };

  const handleAttempt = (attempt: CheckAttempt) => {
    setAttempts((prev) => ({
      ...prev,
      [attempt.checkId]: attempt,
    }));
  };

  if (isFinished) {
    const accuracy = calculateAccuracy(capsule.steps, attempts);

    return (
      <div className="flex-1 flex flex-col justify-between py-6 animate-pop-in">
        <div className="flex flex-col items-center text-center mt-8">
          <div className="w-16 h-16 rounded-3xl bg-amber-100 flex items-center justify-center text-amber-600 mb-4 shadow-sm ring-8 ring-amber-50 animate-bounce">
            <Award className="w-8 h-8 fill-amber-500 text-amber-600" />
          </div>

          <span className="text-xs font-bold uppercase tracking-wider text-amber-600 mb-1 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" /> ¡Cápsula completada!
          </span>
          <h2 className="text-2xl font-black text-zinc-900 tracking-tight">
            {capsule.title}
          </h2>

          <div className="mt-8 p-6 w-full rounded-2xl bg-zinc-50 border border-zinc-200/80 flex justify-around items-center shadow-xs">
            <div className="flex flex-col items-center">
              <span className="text-2xl font-black text-amber-600">{accuracy}%</span>
              <span className="text-xs text-zinc-500 font-semibold mt-0.5">Precisión</span>
            </div>
            <div className="h-8 w-px bg-zinc-200" />
            <div className="flex flex-col items-center">
              <span className="text-2xl font-black text-zinc-800">{capsule.estimatedMinutes} min</span>
              <span className="text-xs text-zinc-500 font-semibold mt-0.5">Tiempo invertido</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2.5 mt-8">
          <button
            onClick={() => {
              sfx.playTap();
              onClose();
            }}
            className="w-full py-3.5 px-4 bg-zinc-950 text-white rounded-xl font-bold text-sm hover:bg-zinc-900 active:scale-[0.985] transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
          >
            Volver al catálogo
          </button>
          <button
            onClick={() => {
              sfx.playTap();
              setCurrentStepIndex(0);
              setAttempts({});
              setIsFinished(false);
            }}
            className="w-full py-3 px-4 bg-zinc-100 text-zinc-700 rounded-xl font-semibold text-xs hover:bg-zinc-200 active:scale-[0.985] transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Repasar cápsula
          </button>
        </div>
      </div>
    );
  }

  const getButtonText = () => {
    if (hasQuiz && !currentQuizAttempt) {
      return "Elige una opción para continuar";
    }
    if (currentStepIndex + 1 === capsule.steps.length) {
      return "Finalizar lección";
    }
    return "Continuar";
  };

  return (
    <div className="flex-1 flex flex-col justify-between">
      {/* Barra superior de progreso y control de salida */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <button
            onClick={() => {
              sfx.playTap();
              onClose();
            }}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 active:scale-95 transition-all cursor-pointer"
            title="Salir de la cápsula"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <span className="text-xs font-semibold text-zinc-400">
            Paso {currentStepIndex + 1} de {capsule.steps.length}
          </span>
        </div>

        <ProgressBar
          totalSteps={capsule.steps.length}
          currentStepIndex={currentStepIndex}
        />
      </div>

      {/* Contenido del paso actual */}
      <div key={currentStepIndex} className="my-auto py-4 flex flex-col animate-pop-in">
        {currentStep.imageUrl && (
          <div className="w-full h-44 rounded-2xl overflow-hidden mb-4 shadow-sm relative group">
            <img
              src={currentStep.imageUrl}
              alt={capsule.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
        )}

        <p className="text-zinc-800 text-base md:text-lg leading-relaxed font-semibold">
          {currentStep.narrative}
        </p>

        {currentStep.check && (
          <QuizCard
            key={currentStep.check.id}
            check={currentStep.check}
            onAttemptEvaluated={handleAttempt}
            evaluateFn={evaluateCheckFn}
          />
        )}
      </div>

      {/* Botón inferior de avance */}
      <div className="pt-4 border-t border-zinc-100">
        <button
          onClick={handleNext}
          disabled={!isAdvanceAllowed}
          className={`w-full py-3.5 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
            isAdvanceAllowed
              ? "bg-amber-400 text-zinc-950 hover:bg-amber-500 active:scale-[0.985] shadow-sm cursor-pointer"
              : "bg-zinc-100 text-zinc-400 cursor-not-allowed"
          }`}
        >
          <span>{getButtonText()}</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
