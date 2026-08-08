import React from 'react';
import { Dumbbell, Activity, ShieldAlert } from 'lucide-react';
import { WorkoutBlock } from '../types/workout';

interface ExerciseCardProps {
  block: WorkoutBlock;
  isActive: boolean;
}

export const ExerciseCard: React.FC<ExerciseCardProps> = ({ block, isActive }) => {
  const isDumbbell = block.category === 'halteres';

  // Get muscle group or category string in uppercase
  const categoryLabel = isDumbbell
    ? `HALTERES — ${block.muscleGroup?.toUpperCase() || 'GERAL'}`
    : 'CARDIO';

  return (
    <div
      id={`exercise-card-${block.exerciseId}`}
      className={`relative w-full rounded-2xl border bg-zinc-900/60 p-6 shadow-xl backdrop-blur-sm transition-all duration-300 ${
        isActive
          ? isDumbbell
            ? 'border-orange-500/50 shadow-orange-950/20'
            : 'border-lime-500/50 shadow-lime-950/20'
          : 'border-zinc-800'
      }`}
    >
      {/* Category Tag */}
      <div className="mb-4 flex justify-between items-center">
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${
            isDumbbell
              ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20'
              : 'bg-lime-500/10 text-lime-400 border border-lime-500/20'
          }`}
        >
          {isDumbbell ? (
            <Dumbbell className="h-3.5 w-3.5" />
          ) : (
            <Activity className="h-3.5 w-3.5" />
          )}
          {categoryLabel}
        </span>

        {/* Equipment Label */}
        {isDumbbell && (
          <span className="text-xxs uppercase tracking-widest text-zinc-400 bg-zinc-800/80 px-2 py-0.5 rounded border border-zinc-700">
            {block.equipment}
          </span>
        )}
      </div>

      {/* Exercise Name */}
      <h2 className="text-2xl font-extrabold tracking-tight text-white mb-2 line-clamp-2 md:text-3xl">
        {block.exerciseName}
      </h2>

      {/* Description */}
      <p className="text-zinc-300 text-sm leading-relaxed mb-6 font-medium">
        {block.descricaoCurta}
      </p>

      {/* Visualization Area */}
      <div className="flex items-center justify-center rounded-xl bg-zinc-950/80 aspect-video w-full overflow-hidden border border-zinc-800 relative group">
        {block.gifUrl ? (
          <img
            src={block.gifUrl}
            alt={block.exerciseName}
            referrerPolicy="no-referrer"
            className="h-full w-full object-contain"
          />
        ) : (
          /* High-quality Procedural SVG/CSS Animations */
          <div className="flex flex-col items-center justify-center p-4 text-center">
            {isDumbbell ? (
              // Lifting weight animation
              <div className="relative flex flex-col items-center">
                <svg
                  className="w-16 h-16 text-orange-400 animate-[bounce_1.5s_infinite]"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M6.5 10h11" />
                  <path d="M12 4v12" />
                  <rect x="3" y="8" width="3.5" height="4" rx="1" />
                  <rect x="17.5" y="8" width="3.5" height="4" rx="1" />
                  <path d="M9 16c0 1.66 1.34 3 3 3s3-1.34 3-3" />
                </svg>
                {/* Dynamic Pulsing bar */}
                <div className="mt-4 flex gap-1 items-end h-8">
                  <div className="w-1.5 bg-orange-500 rounded-full animate-[pulse_1s_infinite] h-4"></div>
                  <div className="w-1.5 bg-orange-500 rounded-full animate-[pulse_1s_infinite_0.2s] h-7"></div>
                  <div className="w-1.5 bg-orange-500 rounded-full animate-[pulse_1s_infinite_0.4s] h-5"></div>
                  <div className="w-1.5 bg-orange-500 rounded-full animate-[pulse_1s_infinite_0.6s] h-8"></div>
                </div>
              </div>
            ) : (
              // Fast pacing heart or running rings
              <div className="relative flex flex-col items-center">
                <div className="relative w-16 h-16 flex items-center justify-center">
                  {/* Pulsing ring outer */}
                  <div className="absolute inset-0 rounded-full border-2 border-lime-500/20 animate-ping"></div>
                  {/* Middle ring */}
                  <div className="absolute inset-2 rounded-full border border-lime-400/40 animate-pulse"></div>
                  {/* Central Icon */}
                  <svg
                    className="w-10 h-10 text-lime-400 animate-[pulse_0.8s_infinite]"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                  </svg>
                </div>
                {/* Step frequency animation bar */}
                <div className="mt-4 flex gap-1 h-8 items-center">
                  <span className="text-xs font-bold text-lime-400 animate-pulse uppercase tracking-widest">
                    EM MOVIMENTO
                  </span>
                </div>
              </div>
            )}
            <span className="text-xxs text-zinc-500 mt-2 block max-w-xs uppercase tracking-wider">
              {isDumbbell ? 'Treino com Peso Corporal + Halteres' : 'Exercício Cardiovascular em Pé'}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
