import React from 'react';

interface WorkoutTimerProps {
  timeRemaining: number;
  totalTime: number;
  phase: 'exercise' | 'rest';
  category: 'cardio' | 'halteres';
}

export const WorkoutTimer: React.FC<WorkoutTimerProps> = ({
  timeRemaining,
  totalTime,
  phase,
  category,
}) => {
  const isDumbbell = category === 'halteres';
  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;
  const timeFormatted = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  // Calculate circular SVG progress percentage
  const percentage = (timeRemaining / totalTime) * 100;
  const strokeDashoffset = 282.7 - (282.7 * percentage) / 100;

  // Set colors based on phase and exercise type
  const themeColorClass = phase === 'rest'
    ? 'text-lime-400'
    : isDumbbell
      ? 'text-orange-500'
      : 'text-lime-400';

  const strokeColorClass = phase === 'rest'
    ? 'stroke-lime-400'
    : isDumbbell
      ? 'stroke-orange-500'
      : 'stroke-lime-400';

  return (
    <div id="workout-timer-container" className="flex flex-col items-center justify-center">
      <div className="relative w-56 h-56 md:w-64 md:h-64 flex items-center justify-center">
        {/* SVG Circular Countdown */}
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          {/* Base Background Track */}
          <circle
            cx="50"
            cy="50"
            r="45"
            className="stroke-zinc-800 fill-transparent"
            strokeWidth="6"
          />
          {/* Active Colored Progress Ring */}
          <circle
            cx="50"
            cy="50"
            r="45"
            className={`fill-transparent transition-all duration-1000 ease-linear ${strokeColorClass}`}
            strokeWidth="6"
            strokeDasharray="282.7"
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </svg>

        {/* Inner Content */}
        <div className="absolute flex flex-col items-center justify-center text-center">
          <span className="text-xs uppercase tracking-widest text-zinc-400 font-bold mb-1">
            {phase === 'exercise' ? 'EXERCÍCIO' : 'DESCANSO'}
          </span>
          <span className={`text-6xl md:text-7xl font-mono font-black tracking-tighter ${themeColorClass}`}>
            {timeFormatted}
          </span>
          {phase === 'exercise' && (
            <span className="text-xxs uppercase tracking-widest text-zinc-500 mt-1 font-bold">
              {category === 'halteres' ? 'Usar Halteres' : 'Peso Corporal'}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
