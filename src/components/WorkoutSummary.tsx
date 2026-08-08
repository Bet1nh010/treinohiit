import React from 'react';
import { Trophy, CheckCircle, Clock, Award, Activity, RotateCcw } from 'lucide-react';
import { Workout } from '../types/workout';

interface WorkoutSummaryProps {
  workout: Workout;
  onConfirm: () => void;
}

export const WorkoutSummary: React.FC<WorkoutSummaryProps> = ({
  workout,
  onConfirm,
}) => {
  return (
    <div
      id="workout-summary-screen"
      className="max-w-md mx-auto w-full bg-zinc-950 border border-zinc-800 rounded-2xl p-6 text-center shadow-2xl animate-fade-in mb-8"
    >
      {/* Trophy & Congrats */}
      <div className="mb-6 flex justify-center">
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-lime-500/20 blur-xl animate-pulse"></div>
          <div className="relative rounded-full bg-lime-500/10 border border-lime-500/20 p-5">
            <Trophy className="h-12 w-12 text-lime-400 animate-[bounce_2s_infinite]" />
          </div>
        </div>
      </div>

      <h1 className="text-3xl font-black tracking-tight text-white mb-2">
        TREINO CONCLUÍDO!
      </h1>
      <p className="text-zinc-400 text-sm mb-6">
        Parabéns! Você completou sua sessão HIIT com sucesso. Seu corpo agradece!
      </p>

      {/* Stats Grid */}
      <div id="stats-grid" className="grid grid-cols-3 gap-3 mb-8">
        <div className="flex flex-col items-center justify-center rounded-xl bg-zinc-900/60 border border-zinc-800 p-3">
          <Clock className="h-5 w-5 text-lime-400 mb-1" />
          <span className="text-xl font-bold text-white leading-none">
            {workout.durationMinutes}
          </span>
          <span className="text-xxs uppercase tracking-widest text-zinc-500 mt-1 font-semibold">
            Minutos
          </span>
        </div>

        <div className="flex flex-col items-center justify-center rounded-xl bg-zinc-900/60 border border-zinc-800 p-3">
          <Activity className="h-5 w-5 text-lime-400 mb-1" />
          <span className="text-xl font-bold text-white leading-none">
            {workout.exercisesCount}
          </span>
          <span className="text-xxs uppercase tracking-widest text-zinc-500 mt-1 font-semibold">
            Ciclos
          </span>
        </div>

        <div className="flex flex-col items-center justify-center rounded-xl bg-zinc-900/60 border border-zinc-800 p-3">
          <Award className="h-5 w-5 text-lime-400 mb-1" />
          <span className="text-xs font-bold text-white line-clamp-1 leading-tight text-center">
            {workout.muscleGroup}
          </span>
          <span className="text-xxs uppercase tracking-widest text-zinc-500 mt-1 font-semibold">
            Foco
          </span>
        </div>
      </div>

      {/* Exercises Done List */}
      <div className="text-left mb-8">
        <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-400 mb-3 px-1">
          Exercícios Realizados
        </h3>
        <div className="max-h-48 overflow-y-auto rounded-xl border border-zinc-850 bg-zinc-900/40 p-3 divide-y divide-zinc-800">
          {workout.blocks.map((block, idx) => {
            const isDumbbell = block.category === 'halteres';
            return (
              <div
                key={`${block.exerciseId}-${idx}`}
                className="flex items-center justify-between py-2.5 px-1 first:pt-0 last:pb-0"
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      isDumbbell ? 'bg-orange-500' : 'bg-lime-400'
                    }`}
                  />
                  <div>
                    <span className="text-sm font-bold text-white block leading-tight">
                      {block.exerciseName}
                    </span>
                    <span className="text-xxs text-zinc-400 uppercase tracking-wider font-semibold">
                      {isDumbbell ? `Halteres — ${block.muscleGroup}` : 'Cardio'}
                    </span>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold text-zinc-400">
                  {block.durationSeconds}s
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Action Button */}
      <button
        id="confirm-summary-button"
        onClick={onConfirm}
        className="w-full rounded-xl bg-lime-400 py-4 px-6 text-sm font-extrabold uppercase tracking-wider text-black transition-all hover:bg-lime-300 active:scale-98 shadow-lg shadow-lime-950/20 cursor-pointer"
      >
        Concluir e Salvar
      </button>
    </div>
  );
};
