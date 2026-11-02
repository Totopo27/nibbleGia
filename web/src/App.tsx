import React, { useEffect, useState } from "react";
import { MobileLayout } from "./components/MobileLayout.tsx";
import { CapsuleRunner } from "./features/capsule/CapsuleRunner.tsx";
import { StreakCelebrationModal } from "./features/streak/StreakCelebrationModal.tsx";
import { apiService } from "./services/api.ts";
import type { Topic, Capsule, StreakState } from "./types/domain.ts";
import { Brain, Hourglass, Compass, Palette, ChevronRight, BookOpen, Clock, AlertCircle, ArrowLeft, Play } from "lucide-react";
import { sfx } from "./utils/sound.ts";

export const App: React.FC = () => {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [topicCapsules, setTopicCapsules] = useState<Capsule[]>([]);
  const [loadingTopicCapsules, setLoadingTopicCapsules] = useState<boolean>(false);
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

  const handleSelectTopic = async (topic: Topic) => {
    sfx.playTap();
    sfx.haptic("light");
    setSelectedTopic(topic);
    setLoadingTopicCapsules(true);
    try {
      const capsules = await apiService.getCapsulesByTopic(topic.id);
      setTopicCapsules(capsules.sort((a, b) => a.order - b.order));
    } catch (err) {
      console.error("Error al cargar cápsulas del tema:", err);
    } finally {
      setLoadingTopicCapsules(false);
    }
  };

  const handleStartCapsule = async (capsuleId: string) => {
    sfx.playTap();
    sfx.haptic("light");
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
      case "Palette":
        return <Palette className="w-5 h-5 text-rose-600" />;
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
      ) : selectedTopic ? (
        /* Vista de Detalle de Tema con sus Cápsulas */
        <div className="flex flex-col flex-1 animate-pop-in">
          <div className="flex items-center gap-2 mb-4">
            <button
              onClick={() => {
                sfx.playTap();
                setSelectedTopic(null);
              }}
              className="p-1.5 rounded-lg hover:bg-zinc-100 text-zinc-600 active:scale-95 transition-all cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              {selectedTopic.category}
            </span>
          </div>

          <div className="flex items-start gap-3.5 mb-4 p-4 rounded-2xl bg-zinc-50 border border-zinc-200/80 shadow-xs">
            <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center shrink-0">
              {getIcon(selectedTopic.icon)}
            </div>
            <div>
              <h1 className="text-xl font-black text-zinc-900 tracking-tight">
                {selectedTopic.title}
              </h1>
              <p className="text-xs text-zinc-600 mt-1">
                {selectedTopic.description}
              </p>
            </div>
          </div>

          <h2 className="text-sm font-bold text-zinc-800 uppercase tracking-wider mb-3">
            Cápsulas de aprendizaje
          </h2>

          {loadingTopicCapsules ? (
            <div className="flex flex-col gap-3">
              {[1, 2].map((i) => (
                <div key={i} className="h-16 bg-zinc-100 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : topicCapsules.length === 0 ? (
            <p className="text-sm text-zinc-500 py-6 text-center">
              Pronto habrá más cápsulas para este tema.
            </p>
          ) : (
            <div className="flex flex-col gap-3">
              {topicCapsules.map((capsule, index) => (
                <article
                  key={capsule.id}
                  onClick={() => handleStartCapsule(capsule.id)}
                  className="p-4 rounded-2xl border border-zinc-200/90 bg-white hover:border-amber-400 active:scale-[0.985] hover:shadow-md transition-all cursor-pointer group flex items-center justify-between"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-700 font-bold text-xs flex items-center justify-center shrink-0 group-hover:bg-amber-500 group-hover:text-zinc-950 transition-colors">
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="font-bold text-zinc-900 text-sm leading-snug">
                        {capsule.title}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="flex items-center gap-1 text-[11px] font-medium text-zinc-500">
                          <Clock className="w-3 h-3" /> {capsule.estimatedMinutes} min
                        </span>
                        <span className="text-[11px] text-zinc-400">•</span>
                        <span className="text-[11px] font-medium text-zinc-500">
                          {capsule.steps.length} pasos
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="p-2 rounded-full bg-zinc-100 text-zinc-600 group-hover:bg-amber-500 group-hover:text-zinc-950 transition-colors">
                    <Play className="w-4 h-4 fill-current" />
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* Vista de Inicio con Tópicos */
        <div className="flex flex-col flex-1 animate-pop-in">
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
          <div className="mb-6 p-4 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 text-zinc-950 shadow-md transition-transform duration-300 hover:scale-[1.01]">
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
              className="mt-3 w-full py-2.5 px-4 bg-zinc-950 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-zinc-900 active:scale-[0.985] transition-all shadow-sm disabled:opacity-75 cursor-pointer"
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
                {[1, 2, 3, 4].map((i) => (
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
                    onClick={() => handleSelectTopic(topic)}
                    className="p-4 rounded-2xl border border-zinc-200/90 bg-white hover:border-amber-400 active:scale-[0.985] hover:shadow-md transition-all cursor-pointer group flex items-center justify-between"
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
        </div>
      )}
    </MobileLayout>
  );
};
