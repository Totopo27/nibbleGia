import React, { useEffect, useState } from "react";
import { MobileLayout } from "./components/MobileLayout.tsx";
import { CapsuleRunner } from "./features/capsule/CapsuleRunner.tsx";
import { StreakCelebrationModal } from "./features/streak/StreakCelebrationModal.tsx";
import { apiService } from "./services/api.ts";
import type { Topic, Capsule, StreakState } from "./types/domain.ts";
import { Brain, Hourglass, Compass, ChevronRight, BookOpen, Clock, AlertCircle } from "lucide-react";

export const App: React.FC = () => {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCapsule, setActiveCapsule] = useState<Capsule | null>(null);
  const [loadingCapsule, setLoadingCapsule] = useState<boolean>(false);
  const [streak, setStreak] = useState<StreakState>({ totalDays: 1, currentStreak: 1, maxStreak: 1 });
  const [showCelebration, setShowCelebration] = useState<boolean>(false);

  useEffect(() => {
    Promise.all([apiService.getTopics(), apiService.getStreak()])
      .then(([topicsData, streakData]) => {
        setTopics(topicsData);
        setStreak(streakData);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error cargando datos iniciales:", err);
        setError("No pudimos conectar con el servidor local en :8080. Puedes revisar el backend.");
        setLoading(false);
      });
  }, []);

  const handleStartCapsule = async (capsuleId: string) => {
    setLoadingCapsule(true);
    try {
      const capsule = await apiService.getCapsule(capsuleId);
      setActiveCapsule(capsule);
    } catch (err) {
      console.error("Error al cargar la cápsula:", err);
      setError("No se pudo iniciar la cápsula. Revisa la conexión con el servidor.");
    } finally {
      setLoadingCapsule(false);
    }
  };

  const handleCompleteCapsule = async (_accuracyRate: number) => {
    if (!activeCapsule) return;

    try {
      // Registrar la lección completada en el servidor y sincronizar la racha
      const updatedStreak = await apiService.completeCapsule(activeCapsule.id);
      setStreak(updatedStreak);
      setShowCelebration(true);
    } catch (err) {
      console.error("Error actualizando racha:", err);
      // Fallback local optimista si la red falla
      setStreak((prev) => ({
        ...prev,
        currentStreak: prev.currentStreak + 1,
        totalDays: prev.totalDays + 1,
      }));
      setShowCelebration(true);
    }
  };

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "Brain":
        return <Brain className="w-5 h-5 text-indigo-600" />;
      case "Hourglass":
        return <Hourglass className="w-5 h-5 text-amber-600" />;
      default:
        return <Compass className="w-5 h-5 text-emerald-600" />;
    }
  };

  return (
    <MobileLayout streakCount={streak.currentStreak}>
      {showCelebration && (
        <StreakCelebrationModal
          currentStreak={streak.currentStreak}
          totalDays={streak.totalDays}
          onClose={() => setShowCelebration(false)}
        />
      )}

      {activeCapsule ? (
        <CapsuleRunner
          capsule={activeCapsule}
          onClose={() => setActiveCapsule(null)}
          onComplete={handleCompleteCapsule}
          evaluateCheckFn={(checkId, selectedOptionId) =>
            apiService.submitCheckAttempt(activeCapsule.id, checkId, selectedOptionId)
          }
        />
      ) : (
        <>
          {/* Banner de saludo */}
          <section className="mb-6">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600">
              Tu dosis diaria de conocimiento
            </span>
            <h1 className="text-2xl font-black text-zinc-900 tracking-tight mt-1">
              ¿Qué quieres explorar hoy?
            </h1>
            <p className="text-sm text-zinc-500 mt-1">
              Cápsulas interactivas de 4 minutos diseñadas para aprender sin esfuerzo.
            </p>
          </section>

          {/* Cápsula destacada del día */}
          <div className="mb-6 p-4 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 text-zinc-950 shadow-md">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-0.5 rounded-md bg-zinc-950/20 text-xs font-bold uppercase tracking-wider">
                Recomendada hoy
              </span>
              <span className="flex items-center gap-1 text-xs font-medium">
                <Clock className="w-3.5 h-3.5" /> 4 min
              </span>
            </div>
            <h2 className="text-lg font-extrabold leading-tight">
              La Falacia del Hombre de Paja
            </h2>
            <p className="text-xs text-zinc-900/80 mt-1 font-medium">
              Aprende a identificar y desmontar argumentos distorsionados en debates reales.
            </p>
            <button
              onClick={() => handleStartCapsule("capsule-logic-01")}
              disabled={loadingCapsule}
              className="mt-3 w-full py-2.5 px-4 bg-zinc-950 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-zinc-900 transition-colors shadow-sm disabled:opacity-75"
            >
              <BookOpen className="w-4 h-4" />
              {loadingCapsule ? "Cargando lección..." : "Iniciar cápsula interactiva"}
            </button>
          </div>

          {/* Lista de temas */}
          <section className="flex-1">
            <h2 className="text-sm font-bold text-zinc-800 uppercase tracking-wider mb-3">
              Temas Disponibles
            </h2>

            {loading && (
              <div className="flex flex-col gap-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-20 bg-zinc-100 rounded-2xl animate-pulse" />
                ))}
              </div>
            )}

            {error && (
              <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-500 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {!loading && !error && (
              <div className="flex flex-col gap-3">
                {topics.map((topic) => (
                  <article
                    key={topic.id}
                    onClick={() => handleStartCapsule("capsule-logic-01")}
                    className="p-4 rounded-2xl border border-zinc-200/90 bg-white hover:border-amber-400 hover:shadow-md transition-all cursor-pointer group flex items-center justify-between"
                  >
                    <div className="flex items-start gap-3.5">
                      <div className="w-10 h-10 rounded-xl bg-zinc-100 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                        {getIcon(topic.icon)}
                      </div>
                      <div>
                        <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                          {topic.category}
                        </span>
                        <h3 className="font-bold text-zinc-900 text-sm leading-snug">
                          {topic.title}
                        </h3>
                        <p className="text-xs text-zinc-500 mt-0.5 line-clamp-1">
                          {topic.description}
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-zinc-400 group-hover:text-amber-500 group-hover:translate-x-0.5 transition-all" />
                  </article>
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </MobileLayout>
  );
};
