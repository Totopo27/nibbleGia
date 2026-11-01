import React from "react";

interface ProgressBarProps {
  totalSteps: number;
  currentStepIndex: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ totalSteps, currentStepIndex }) => {
  return (
    <div className="flex items-center gap-1.5 w-full py-2">
      {Array.from({ length: totalSteps }).map((_, index) => {
        const isCompleted = index < currentStepIndex;
        const isCurrent = index === currentStepIndex;

        return (
          <div
            key={index}
            className="flex-1 h-1.5 rounded-full overflow-hidden bg-zinc-200 transition-all duration-300"
          >
            <div
              className={`h-full transition-all duration-300 ${
                isCompleted
                  ? "bg-amber-500 w-full"
                  : isCurrent
                  ? "bg-amber-400 w-full animate-pulse"
                  : "w-0"
              }`}
            />
          </div>
        );
      })}
    </div>
  );
};
