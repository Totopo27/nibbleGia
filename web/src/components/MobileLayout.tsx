import React from "react";
import { Flame, Sparkles } from "lucide-react";

interface MobileLayoutProps {
  children: React.ReactNode;
  streakCount?: number;
}

export const MobileLayout: React.FC<MobileLayoutProps> = ({ children, streakCount = 1 }) => {
  return (
    <div className="min-h-screen bg-zinc-100 flex justify-center">
      {/* Contenedor emulador de viewport móvil, centrado en desktop */}
      <div className="w-full max-w-[480px] bg-white min-h-screen flex flex-col shadow-xl border-x border-zinc-200/80">
        {/* Header superior */}
        <header className="px-5 py-4 border-b border-zinc-100 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur z-20">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-400 flex items-center justify-center font-bold text-zinc-900 shadow-sm">
              <Sparkles className="w-4 h-4 fill-zinc-900" />
            </div>
            <span className="font-extrabold tracking-tight text-lg text-zinc-900">
              Nibble<span className="text-amber-500">.</span>
            </span>
          </div>

          {/* Badge de Racha Diaria */}
          <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 border border-amber-200/60 rounded-full text-amber-700 font-semibold text-xs shadow-xs">
            <Flame className="w-4 h-4 fill-amber-500 text-amber-500 animate-pulse" />
            <span>{streakCount} {streakCount === 1 ? "día" : "días"}</span>
          </div>
        </header>

        {/* Contenido principal */}
        <main className="flex-1 flex flex-col p-5 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
