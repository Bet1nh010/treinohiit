import React, { useState, useEffect } from 'react';
import { History, Award, Clock, Activity, Calendar, Trash2, ShieldAlert } from 'lucide-react';
import { getHistory, saveHistory } from '../services/storage';
import { Workout } from '../types/workout';

export const HistoryPage: React.FC = () => {
  const [history, setHistory] = useState<Workout[]>([]);

  useEffect(() => {
    setHistory(getHistory());
  }, []);

  const handleClearHistory = () => {
    if (window.confirm('Tem certeza de que deseja apagar permanentemente todo o seu histórico de treinos? Esta ação não pode ser desfeita.')) {
      saveHistory([]);
      setHistory([]);
    }
  };

  const totalCompleted = history.length;
  const totalMinutes = history.reduce((sum, item) => sum + item.durationMinutes, 0);

  return (
    <div id="history-page" className="max-w-md mx-auto w-full px-4 pb-24 text-white animate-fade-in">
      
      {/* Page Header */}
      <div className="mt-6 mb-6">
        <h1 className="text-2xl font-black text-white flex items-center gap-2">
          <History className="h-6 w-6 text-lime-400" />
          Histórico
        </h1>
        <p className="text-zinc-400 text-xs">
          Acompanhe suas realizações e treinos salvos
        </p>
      </div>

      {/* History Metrics Board */}
      {totalCompleted > 0 && (
        <div id="history-metrics" className="grid grid-cols-2 gap-3 mb-6">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4">
            <span className="text-xxs font-extrabold text-zinc-500 uppercase tracking-widest block">
              Total Realizados
            </span>
            <span className="text-2xl font-black text-white font-mono block mt-1">
              {totalCompleted}
            </span>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4">
            <span className="text-xxs font-extrabold text-zinc-500 uppercase tracking-widest block">
              Tempo Acumulado
            </span>
            <span className="text-2xl font-black text-white font-mono block mt-1">
              {totalMinutes} <span className="text-xs text-zinc-400">min</span>
            </span>
          </div>
        </div>
      )}

      {/* No History Placeholder */}
      {history.length === 0 ? (
        <div id="no-history-placeholder" className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-800 bg-zinc-900/10 p-12 text-center my-8">
          <History className="h-12 w-12 text-zinc-600 mb-4 animate-pulse" />
          <h3 className="text-base font-bold text-zinc-350 mb-1">Nenhum treino ainda</h3>
          <p className="text-zinc-500 text-xs leading-relaxed max-w-xs">
            Complete sua primeira sessão HIIT na página inicial para ver suas estatísticas e conquistas aqui!
          </p>
        </div>
      ) : (
        /* History list feed */
        <div className="space-y-4 mb-8">
          {history.map((workout) => (
            <div
              key={workout.id}
              id={`history-workout-${workout.id}`}
              className="rounded-xl border border-zinc-850 bg-zinc-900/30 p-4 flex flex-col justify-between hover:border-zinc-800 transition"
            >
              {/* Top row metadata */}
              <div className="flex justify-between items-start mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xxs font-extrabold text-zinc-400 bg-zinc-800 px-2 py-0.5 rounded uppercase font-mono">
                      {workout.date}
                    </span>
                    <span className="text-xxs text-zinc-500 uppercase tracking-widest font-bold">
                      {workout.dayOfWeek}
                    </span>
                  </div>
                  <h3 className="text-base font-black text-white mt-1.5 leading-tight">
                    {workout.muscleGroup}
                  </h3>
                </div>
                
                {/* Completion Status Badge */}
                <span className="inline-flex items-center gap-1 rounded bg-lime-500/10 border border-lime-500/20 px-2 py-0.5 text-xxs font-extrabold uppercase text-lime-400">
                  {workout.status}
                </span>
              </div>

              {/* Workout Parameters Row */}
              <div className="grid grid-cols-3 gap-2 pt-3 border-t border-zinc-900 text-center">
                <div className="flex items-center gap-1.5 justify-center">
                  <Clock className="h-3.5 w-3.5 text-zinc-500" />
                  <span className="text-xs font-mono font-bold text-zinc-300">
                    {workout.durationMinutes} min
                  </span>
                </div>
                <div className="flex items-center gap-1.5 justify-center border-x border-zinc-900">
                  <Activity className="h-3.5 w-3.5 text-zinc-500" />
                  <span className="text-xs font-mono font-bold text-zinc-300">
                    {workout.exercisesCount} ciclos
                  </span>
                </div>
                <div className="flex items-center justify-center">
                  <span className="text-xxs uppercase tracking-widest font-extrabold text-zinc-400">
                    {workout.workoutType === 'Cardio' ? 'Cardio' : 'Misto'}
                  </span>
                </div>
              </div>
            </div>
          ))}

          {/* Delete History Button */}
          <button
            onClick={handleClearHistory}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-zinc-900/60 border border-zinc-850 py-3.5 px-4 text-xs font-bold uppercase tracking-wider text-zinc-500 hover:text-red-400 hover:border-red-500/20 transition active:scale-98 cursor-pointer"
          >
            <Trash2 className="h-4 w-4" />
            Limpar Todo o Histórico
          </button>
        </div>
      )}

    </div>
  );
};
