import React from 'react';
import { Dumbbell, Activity, CalendarDays } from 'lucide-react';
import { WorkoutBlock } from '../types/workout';

interface RestScreenProps {
  nextBlock: WorkoutBlock | null;
  restTimeRemaining: number;
}

export const RestScreen: React.FC<RestScreenProps> = ({
  nextBlock,
  restTimeRemaining,
}) => {
  const isNextDumbbell = nextBlock?.category === 'halteres';

  return (
    <div
      id="rest-screen"
      className="flex flex-col items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-950/60 p-8 text-center shadow-2xl backdrop-blur-sm animate-fade-in"
    >
      {/* Title */}
      <span className="text-sm font-extrabold uppercase tracking-widest text-lime-400 mb-2">
        FASE DE DESCANSO
      </span>
      <h2 className="text-4xl font-black text-white mb-6">DESCANSO</h2>

      {/* Countdown Timer */}
      <div className="relative flex items-center justify-center w-36 h-36 rounded-full border-4 border-zinc-800 bg-zinc-900/40 mb-8 shadow-inner">
        <span className="text-5xl font-mono font-black text-lime-400">
          00:{restTimeRemaining.toString().padStart(2, '0')}
        </span>
        {/* Animated circle border */}
        <div className="absolute inset-0 rounded-full border-4 border-t-lime-400 border-r-transparent border-b-transparent border-l-transparent animate-spin duration-1000"></div>
      </div>

      {/* Next exercise info */}
      {nextBlock ? (
        <div id="next-exercise-preview" className="w-full max-w-sm rounded-xl bg-zinc-900/80 p-5 border border-zinc-800/80">
          <p className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2">
            Próximo Exercício
          </p>
          <div className="flex items-center justify-center gap-2 mb-1.5">
            {isNextDumbbell ? (
              <Dumbbell className="h-4 w-4 text-orange-400" />
            ) : (
              <Activity className="h-4 w-4 text-lime-400" />
            )}
            <h3 className="text-xl font-extrabold text-white">
              {nextBlock.exerciseName}
            </h3>
          </div>
          <span
            className={`inline-block text-xxs font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider mb-3 ${
              isNextDumbbell
                ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20'
                : 'bg-lime-500/10 text-lime-400 border border-lime-500/20'
            }`}
          >
            {isNextDumbbell ? `Halteres — ${nextBlock.muscleGroup}` : 'Cardio'}
          </span>

          {/* Dumbbell Preparation Prompt */}
          {isNextDumbbell && (
            <div className="flex items-center justify-center gap-2 mt-2 rounded-lg bg-orange-500/10 border border-orange-500/20 py-2 px-3 animate-[pulse_2s_infinite]">
              <Dumbbell className="h-4 w-4 text-orange-400 animate-[bounce_1s_infinite]" />
              <span className="text-xs font-bold text-orange-300 uppercase tracking-wide">
                Prepare os halteres ({nextBlock.equipment})
              </span>
            </div>
          )}
        </div>
      ) : (
        <div id="no-next-exercise" className="text-zinc-500 text-sm">Próxima fase indisponível</div>
      )}
    </div>
  );
};
