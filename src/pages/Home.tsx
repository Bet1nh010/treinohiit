import React, { useState, useEffect } from 'react';
import { Dumbbell, Activity, Flame, AlertCircle, RefreshCw, Play, Sparkles } from 'lucide-react';
import { getSettings, saveSettings, getHistory, getCurrentDayPt, getWeekCompleted } from '../services/storage';
import { generateWorkout, DAY_MUSCLE_MAPPING, getMuscleGroupNamePt } from '../services/workoutGenerator';
import { AppSettings, WorkoutBlock } from '../types/workout';
import { MuscleGroup } from '../types/exercise';

interface HomeProps {
  onStartWorkout: (blocks: WorkoutBlock[], durationMin: number, workoutType: 'Cardio' | 'Cardio + Halteres' | 'Halteres + Cardio', muscleGroupLabel: string) => void;
}

export const Home: React.FC<HomeProps> = ({ onStartWorkout }) => {
  // Load settings from localStorage
  const [settings, setLocalSettings] = useState<AppSettings>(() => getSettings());
  
  // Local state for temporary customizations
  const [durationMin, setDurationMin] = useState<number>(settings.defaultDurationMinutes);
  const [customDuration, setCustomDuration] = useState<string>('');
  const [isCustom, setIsCustom] = useState<boolean>(false);

  const [exerciseSeconds, setExerciseSeconds] = useState<number>(settings.defaultExerciseSeconds);
  const [restSeconds, setRestSeconds] = useState<number>(settings.defaultRestSeconds);
  const [workoutType, setWorkoutType] = useState<'Cardio' | 'Cardio + Halteres' | 'Halteres + Cardio'>('Cardio + Halteres');

  // Workout generation states
  const [generatedBlocks, setGeneratedBlocks] = useState<WorkoutBlock[] | null>(null);

  const durationOptions = [5, 10, 15, 20, 25, 30];
  const exerciseOptions = [20, 30, 40, 45, 60];
  const restOptions = [5, 10, 15, 20, 30];

  const todayPt = getCurrentDayPt();
  const todayMuscle = DAY_MUSCLE_MAPPING[todayPt] || 'descanso';
  const todayMuscleLabel = todayMuscle === 'descanso' 
    ? 'Descanso' 
    : `${getMuscleGroupNamePt(todayMuscle)} + Cardio`;

  // Auto-save changes back to settings in localStorage
  useEffect(() => {
    const updated = {
      ...settings,
      defaultDurationMinutes: durationMin,
      defaultExerciseSeconds: exerciseSeconds,
      defaultRestSeconds: restSeconds,
    };
    saveSettings(updated);
    setLocalSettings(updated);
  }, [durationMin, exerciseSeconds, restSeconds]);

  // Handle duration choice
  const selectDuration = (val: number) => {
    setIsCustom(false);
    setDurationMin(val);
  };

  const handleCustomDurationChange = (val: string) => {
    setCustomDuration(val);
    const parsed = parseInt(val, 10);
    if (!isNaN(parsed) && parsed > 0) {
      setDurationMin(parsed);
    }
  };

  // Generate Workout Flow
  const handleGenerateWorkout = () => {
    const recentWorkouts = getHistory();
    const muscleGroupToGenerate: MuscleGroup | 'descanso' = workoutType === 'Cardio' 
      ? 'descanso' 
      : (todayMuscle === 'descanso' ? 'corpo inteiro' : todayMuscle);

    const blocks = generateWorkout(
      durationMin,
      exerciseSeconds,
      restSeconds,
      workoutType,
      muscleGroupToGenerate,
      recentWorkouts,
      settings.availableEquipment
    );

    setGeneratedBlocks(blocks);
  };

  // Quick Action: Start Immediately
  const handleStart = () => {
    if (!generatedBlocks) return;
    
    const muscleGroupLabel = workoutType === 'Cardio'
      ? 'Apenas Cardio'
      : (todayMuscle === 'descanso' ? 'Corpo Inteiro + Cardio' : todayMuscleLabel);

    onStartWorkout(generatedBlocks, durationMin, workoutType, muscleGroupLabel);
  };

  // Dynamic cycle estimates
  const cycleTime = exerciseSeconds + restSeconds;
  const totalCyclesEst = Math.round((durationMin * 60) / cycleTime);

  return (
    <div id="home-page" className="max-w-md mx-auto w-full px-4 pb-24 text-white animate-fade-in">
      
      {/* App Header Banner */}
      <div className="flex flex-col items-center justify-center text-center mt-6 mb-8">
        <div className="flex items-center gap-2 mb-1.5">
          <div className="rounded-xl bg-lime-400 p-2 text-black shadow-lg shadow-lime-950/20">
            <Flame className="h-6 w-6 animate-pulse" />
          </div>
          <span className="text-2xl font-black tracking-tight uppercase">
            Meu Treino <span className="text-lime-400">HIIT</span>
          </span>
        </div>
        <p className="text-zinc-400 text-xs tracking-wide">
          Treinos intensos, práticos e 100% em pé
        </p>
      </div>

      {/* Today Schedule Alert Card */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4 mb-6 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-zinc-800 p-2.5 text-zinc-300">
            <Dumbbell className="h-5 w-5" />
          </div>
          <div>
            <span className="text-xxs font-extrabold text-zinc-500 uppercase tracking-widest block">
              Programação de Hoje ({todayPt.toUpperCase()})
            </span>
            <span className="text-base font-black text-white">
              {todayMuscle === 'descanso' ? 'Dia de Descanso' : todayMuscleLabel}
            </span>
          </div>
        </div>
        {todayMuscle === 'descanso' && (
          <p className="text-xxs text-zinc-400 mt-2 leading-relaxed">
            Hoje é seu dia de descanso programado. Se quiser treinar mesmo assim, geramos um treino focado em <strong>Corpo Inteiro</strong> para você!
          </p>
        )}
      </div>

      {/* CONTROLS SECTION */}
      <div id="controls-section" className="space-y-6 mb-8">
        
        {/* 1. Tempo total do treino */}
        <div className="space-y-3">
          <label className="text-sm font-extrabold uppercase tracking-widest text-zinc-400 flex items-center justify-between">
            <span>Duração Total</span>
            <span className="text-lime-400 font-mono text-base font-bold">{durationMin} min</span>
          </label>
          
          <div className="grid grid-cols-3 gap-2">
            {durationOptions.map((opt) => (
              <button
                key={opt}
                id={`duration-opt-${opt}`}
                onClick={() => selectDuration(opt)}
                className={`py-3 rounded-xl text-sm font-extrabold border transition-all duration-300 ${
                  durationMin === opt && !isCustom
                    ? 'bg-lime-400 text-black border-lime-400 font-black shadow-md shadow-lime-950/20'
                    : 'bg-zinc-900/80 text-zinc-300 border-zinc-800 hover:border-zinc-700 active:scale-95'
                }`}
              >
                {opt}m
              </button>
            ))}
          </div>

          {/* Custom Duration Input Toggle */}
          <div className="flex gap-2">
            <button
              onClick={() => setIsCustom(!isCustom)}
              className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-xl border transition-all ${
                isCustom 
                  ? 'bg-zinc-800 text-white border-zinc-700' 
                  : 'bg-zinc-950/40 text-zinc-500 border-transparent hover:text-zinc-400'
              }`}
            >
              Personalizado
            </button>
            
            {isCustom && (
              <input
                id="custom-duration-input"
                type="number"
                min="1"
                max="120"
                value={customDuration}
                onChange={(e) => handleCustomDurationChange(e.target.value)}
                placeholder="Ex: 12"
                className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-1.5 text-sm font-extrabold text-white placeholder-zinc-600 focus:outline-none focus:border-lime-400 font-mono"
              />
            )}
          </div>
        </div>

        {/* 2. Tempo de exercício */}
        <div className="space-y-3">
          <label className="text-sm font-extrabold uppercase tracking-widest text-zinc-400 flex items-center justify-between">
            <span>Tempo de Exercício</span>
            <span className="text-lime-400 font-mono text-base font-bold">{exerciseSeconds}s</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {exerciseOptions.map((opt) => (
              <button
                key={opt}
                id={`exercise-opt-${opt}`}
                onClick={() => setExerciseSeconds(opt)}
                className={`flex-1 min-w-[50px] py-2.5 rounded-xl text-xs font-extrabold border transition-all duration-300 ${
                  exerciseSeconds === opt
                    ? 'bg-lime-400 text-black border-lime-400 font-black'
                    : 'bg-zinc-900/80 text-zinc-300 border-zinc-800 hover:border-zinc-700'
                }`}
              >
                {opt}s
              </button>
            ))}
          </div>
        </div>

        {/* 3. Tempo de descanso */}
        <div className="space-y-3">
          <label className="text-sm font-extrabold uppercase tracking-widest text-zinc-400 flex items-center justify-between">
            <span>Tempo de Descanso</span>
            <span className="text-lime-400 font-mono text-base font-bold">{restSeconds}s</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {restOptions.map((opt) => (
              <button
                key={opt}
                id={`rest-opt-${opt}`}
                onClick={() => setRestSeconds(opt)}
                className={`flex-1 min-w-[50px] py-2.5 rounded-xl text-xs font-extrabold border transition-all duration-300 ${
                  restSeconds === opt
                    ? 'bg-lime-400 text-black border-lime-400 font-black'
                    : 'bg-zinc-900/80 text-zinc-300 border-zinc-800 hover:border-zinc-700'
                }`}
              >
                {opt}s
              </button>
            ))}
          </div>
        </div>

        {/* 4. Tipo de treino */}
        <div className="space-y-3">
          <label className="text-sm font-extrabold uppercase tracking-widest text-zinc-400">
            Tipo de Treino
          </label>
          <div className="grid grid-cols-1 gap-2">
            {(['Cardio', 'Cardio + Halteres', 'Halteres + Cardio'] as const).map((type) => {
              const isActive = workoutType === type;
              return (
                <button
                  key={type}
                  id={`workout-type-${type.replace(/\s+/g, '-')}`}
                  onClick={() => {
                    setWorkoutType(type);
                    setGeneratedBlocks(null); // Clear preview when changing type
                  }}
                  className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-300 text-left ${
                    isActive
                      ? 'bg-lime-400/10 border-lime-400/60 shadow-lg shadow-lime-950/5'
                      : 'bg-zinc-900/60 border-zinc-800/80 hover:border-zinc-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${isActive ? 'bg-lime-400 text-black' : 'bg-zinc-800 text-zinc-300'}`}>
                      {type === 'Cardio' ? (
                        <Activity className="h-4 w-4" />
                      ) : (
                        <Dumbbell className="h-4 w-4" />
                      )}
                    </div>
                    <div>
                      <span className="text-sm font-extrabold block text-white leading-tight">
                        {type}
                      </span>
                      <span className="text-xxs text-zinc-400">
                        {type === 'Cardio' 
                          ? 'Somente exercícios de cardio sem peso.' 
                          : 'Alternância perfeita: Halteres + Cardio.'}
                      </span>
                    </div>
                  </div>
                  {isActive && (
                    <span className="h-2 w-2 rounded-full bg-lime-400 animate-pulse" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* GENERATE ACTION BUTTON */}
      <div className="mb-8">
        <button
          id="generate-workout-button"
          onClick={handleGenerateWorkout}
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-zinc-100 hover:bg-white text-black py-4 px-6 text-sm font-extrabold uppercase tracking-wider transition-all active:scale-98 shadow-md"
        >
          <Sparkles className="h-4 w-4 text-amber-500 fill-amber-500" />
          Gerar Treino de Hoje
        </button>
      </div>

      {/* GENERATED PREVIEW SECTION */}
      {generatedBlocks && (
        <div id="generated-preview" className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5 backdrop-blur-sm animate-fade-in space-y-4 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-black text-white">Treino Gerado!</h3>
              <p className="text-xxs text-zinc-400 uppercase tracking-wider font-semibold">
                Estimativa: {totalCyclesEst} ciclos • {durationMin}m total
              </p>
            </div>
            <button
              onClick={handleGenerateWorkout}
              title="Varia exercícios"
              className="p-2 rounded-lg border border-zinc-800 bg-zinc-950 text-zinc-400 hover:text-white transition-all active:scale-95 cursor-pointer"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
          </div>

          {/* List of generated sequence */}
          <div className="max-h-60 overflow-y-auto rounded-xl border border-zinc-800/80 bg-zinc-950/50 divide-y divide-zinc-900 px-3 py-1">
            {generatedBlocks.map((block, idx) => {
              const isDumbbell = block.category === 'halteres';
              return (
                <div key={`${block.exerciseId}-${idx}`} className="flex items-center justify-between py-2.5">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xxs font-mono text-zinc-500 w-5">
                      {(idx + 1).toString().padStart(2, '0')}
                    </span>
                    <div>
                      <span className="text-xs font-bold text-white block">
                        {block.exerciseName}
                      </span>
                      <span className="text-xxs text-zinc-500 uppercase tracking-wide font-semibold">
                        {isDumbbell ? `Halteres — ${block.muscleGroup}` : 'Cardio'}
                      </span>
                    </div>
                  </div>
                  <span className={`text-xxs font-extrabold px-1.5 py-0.5 rounded uppercase tracking-wider ${
                    isDumbbell 
                      ? 'bg-orange-500/10 text-orange-400' 
                      : 'bg-lime-500/10 text-lime-400'
                  }`}>
                    {block.durationSeconds}s
                  </span>
                </div>
              );
            })}
          </div>

          {/* START WORKOUT NOW ACTION */}
          <button
            id="start-workout-button"
            onClick={handleStart}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-lime-400 py-4 px-6 text-sm font-extrabold uppercase tracking-wider text-black transition-all hover:bg-lime-300 active:scale-98 shadow-lg shadow-lime-950/20 cursor-pointer"
          >
            <Play className="h-4 w-4 fill-black" />
            Iniciar Treino
          </button>
        </div>
      )}
      
    </div>
  );
};
