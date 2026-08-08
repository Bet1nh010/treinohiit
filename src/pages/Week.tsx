import React, { useState, useEffect } from 'react';
import { Calendar, CheckCircle2, Circle, Dumbbell, Award, Flame, Trash2 } from 'lucide-react';
import { getWeekCompleted, saveWeekCompleted, getCurrentDayPt } from '../services/storage';
import { DAY_MUSCLE_MAPPING, getMuscleGroupNamePt } from '../services/workoutGenerator';

export const Week: React.FC = () => {
  const [weekStatus, setWeekStatus] = useState<{ [key: string]: boolean }>(() => getWeekCompleted());
  const todayPt = getCurrentDayPt();

  const daysOrdered = [
    'Segunda',
    'Terça',
    'Quarta',
    'Quinta',
    'Sexta',
    'Sábado',
    'Domingo',
  ];

  // Map full PT day names to abbreviations for clean display
  const dayAbbr: { [key: string]: string } = {
    Segunda: 'SEG',
    Terça: 'TER',
    Quarta: 'QUA',
    Quinta: 'QUI',
    Sexta: 'SEX',
    Sábado: 'SÁB',
    Domingo: 'DOM',
  };

  const handleToggleDay = (day: string) => {
    const updated = { ...weekStatus, [day]: !weekStatus[day] };
    setWeekStatus(updated);
    saveWeekCompleted(updated);
  };

  const handleResetWeek = () => {
    if (window.confirm('Deseja limpar todos os treinos concluídos desta semana?')) {
      const reset = {
        Segunda: false,
        Terça: false,
        Quarta: false,
        Quinta: false,
        Sexta: false,
        Sábado: false,
        Domingo: false,
      };
      setWeekStatus(reset);
      saveWeekCompleted(reset);
    }
  };

  // Stats calculation
  const completedCount = Object.values(weekStatus).filter(Boolean).length;
  const targetDaysCount = 6; // Seg to Sab
  const completionPercent = Math.round((completedCount / targetDaysCount) * 100);

  return (
    <div id="week-page" className="max-w-md mx-auto w-full px-4 pb-24 text-white animate-fade-in">
      
      {/* Page Header */}
      <div className="mt-6 mb-6">
        <h1 className="text-2xl font-black text-white flex items-center gap-2">
          <Calendar className="h-6 w-6 text-lime-400" />
          Minha Semana
        </h1>
        <p className="text-zinc-400 text-xs">
          Acompanhe seu progresso e cumpra sua meta semanal
        </p>
      </div>

      {/* Week Progress Card */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5 mb-6 backdrop-blur-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 h-24 w-24 bg-lime-400/5 rounded-full blur-2xl -mr-6 -mt-6"></div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-xxs font-extrabold text-zinc-500 uppercase tracking-widest block">
              Consistência Semanal
            </span>
            <span className="text-xl font-black text-white">
              {completedCount} de {targetDaysCount} Treinos
            </span>
          </div>
          <div className="flex items-center gap-1 bg-lime-400/10 border border-lime-400/20 rounded-xl px-3 py-1 text-lime-400">
            <Flame className="h-4 w-4" />
            <span className="text-sm font-black font-mono">{completionPercent}%</span>
          </div>
        </div>

        {/* Mini progress line */}
        <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-800">
          <div
            className="h-full rounded-full bg-lime-400 transition-all duration-500"
            style={{ width: `${Math.min(100, completionPercent)}%` }}
          />
        </div>
      </div>

      {/* Weekly Schedule Days list */}
      <div className="space-y-3 mb-8">
        {daysOrdered.map((day) => {
          const isToday = day === todayPt;
          const muscleGroup = DAY_MUSCLE_MAPPING[day] || 'descanso';
          const isCompleted = weekStatus[day] || false;
          const isRestDay = muscleGroup === 'descanso';

          return (
            <div
              key={day}
              id={`week-day-card-${day}`}
              className={`rounded-xl border p-4 flex items-center justify-between transition-all duration-350 ${
                isCompleted
                  ? 'bg-lime-500/5 border-lime-500/20'
                  : isToday
                    ? 'bg-zinc-900/90 border-lime-400/30 shadow-md shadow-lime-950/5'
                    : 'bg-zinc-900/40 border-zinc-800/80'
              }`}
            >
              <div className="flex items-center gap-3.5">
                {/* Checkbox button */}
                <button
                  onClick={() => handleToggleDay(day)}
                  className={`focus:outline-none transition-transform active:scale-90 ${
                    isRestDay ? 'opacity-25 cursor-not-allowed' : 'cursor-pointer'
                  }`}
                  disabled={isRestDay}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="h-6 w-6 text-lime-400 fill-lime-950/20" />
                  ) : (
                    <Circle className={`h-6 w-6 ${isToday ? 'text-lime-500/50' : 'text-zinc-600'} hover:text-lime-400`} />
                  )}
                </button>

                {/* Day name & muscle focus */}
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xxs font-mono font-black tracking-wider bg-zinc-800 text-zinc-300 px-1.5 py-0.5 rounded leading-none">
                      {dayAbbr[day]}
                    </span>
                    <span className={`text-sm font-extrabold ${isToday ? 'text-lime-400' : 'text-white'}`}>
                      {day} {isToday && '• HOJE'}
                    </span>
                  </div>
                  <span className={`text-xs block mt-1 ${isCompleted ? 'text-zinc-400 line-through' : 'text-zinc-300'}`}>
                    {isRestDay ? 'Descanso' : `${getMuscleGroupNamePt(muscleGroup)} + Cardio`}
                  </span>
                </div>
              </div>

              {/* Decorative Icons */}
              <div className="text-zinc-600">
                {isRestDay ? (
                  <span className="text-xxs font-extrabold uppercase tracking-widest text-zinc-600 bg-zinc-900/80 px-2 py-1 rounded">
                    OFF
                  </span>
                ) : (
                  <Dumbbell className={`h-4 w-4 ${isToday ? 'text-lime-400' : 'text-zinc-600'}`} />
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Action panel */}
      {completedCount > 0 && (
        <button
          onClick={handleResetWeek}
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-zinc-900 border border-zinc-800 py-3.5 px-4 text-xs font-bold uppercase tracking-wider text-zinc-400 hover:text-red-400 hover:border-red-500/20 transition active:scale-98 cursor-pointer"
        >
          <Trash2 className="h-4 w-4" />
          Reiniciar Progresso da Semana
        </button>
      )}

    </div>
  );
};
