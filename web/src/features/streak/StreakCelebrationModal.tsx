import React, { useEffect } from "react";
import { Flame, Sparkles, CheckCircle2 } from "lucide-react";
import { sfx } from "../../utils/sound.ts";

interface StreakCelebrationModalProps {
  currentStreak: number;
  totalDays: number;
  onClose: () => void;
}

export const StreakCelebrationModal: React.FC<StreakCelebrationModalProps> = ({
  currentStreak,
  totalDays,
  onClose,
}) => {
  useEffect(() => {
    sfx.playCelebration();
    sfx.haptic("success");
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-[360px] bg-white rounded-3xl p-6 shadow-2xl flex flex-col items-center text-center border border-zinc-100 animate-pop-in">
        <div className="relative mb-4">
          <div className="w-20 h-20 rounded-full bg-amber-100 flex items-center justify-center shadow-inner ring-8 ring-amber-50">
            <Flame className="w-10 h-10 fill-amber-500 text-amber-500 animate-bounce" />
          </div>
          <div className="absolute -top-1 -right-1 w-7 h-7 rounded-full bg-emerald-500 flex items-center justify-center text-white shadow-xs animate-pop-in">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>

        <span className="text-xs font-bold uppercase tracking-wider text-amber-600 mb-1 flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 fill-amber-500" /> ¡Meta del día cumplida!
        </span>

        <h3 className="text-2xl font-black text-zinc-900 tracking-tight">
          ¡Racha de {currentStreak} {currentStreak === 1 ? "día" : "días"}!
        </h3>

        <p className="text-xs text-zinc-500 mt-2 leading-relaxed">
          Has completado tu dosis diaria de aprendizaje. Mantén el fuego encendido volviendo mañana para tu siguiente cápsula.
        </p>

        <div className="w-full my-5 py-3 px-4 rounded-xl bg-amber-50/80 border border-amber-200/50 flex justify-around text-xs font-semibold text-zinc-700 shadow-xs">
          <div>
            <span className="block text-base font-black text-amber-600">{currentStreak}</span>
            <span>Racha activa</span>
          </div>
          <div className="w-px h-8 bg-amber-200/60" />
          <div>
            <span className="block text-base font-black text-zinc-800">{totalDays}</span>
            <span>Días totales</span>
          </div>
        </div>

        <button
          onClick={() => {
            sfx.playTap();
            onClose();
          }}
          className="w-full py-3.5 px-4 bg-zinc-950 text-white rounded-xl font-bold text-sm hover:bg-zinc-900 active:scale-[0.985] transition-all shadow-sm cursor-pointer"
        >
          ¡A por ello!
        </button>
      </div>
    </div>
  );
};
