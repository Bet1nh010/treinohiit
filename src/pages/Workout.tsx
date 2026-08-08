import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipBack, SkipForward, XCircle, RefreshCw, Volume2, VolumeX } from 'lucide-react';
import { WorkoutBlock, Workout } from '../types/workout';
import { WorkoutTimer } from '../components/WorkoutTimer';
import { ExerciseCard } from '../components/ExerciseCard';
import { RestScreen } from '../components/RestScreen';
import { ProgressBar } from '../components/ProgressBar';
import { CARDIO_EXERCISES, DUMBBELL_EXERCISES } from '../data/exercises';
import { addWorkoutToHistory, getCurrentDayPt, markDayCompleted } from '../services/storage';

interface WorkoutProps {
  blocks: WorkoutBlock[];
  totalDurationMin: number;
  workoutType: 'Cardio' | 'Cardio + Halteres' | 'Halteres + Cardio';
  muscleGroupLabel: string;
  onFinishWorkout: (workout: Workout) => void;
  onQuit: () => void;
  soundInitiallyEnabled: boolean;
}

export const WorkoutPage: React.FC<WorkoutProps> = ({
  blocks: initialBlocks,
  totalDurationMin,
  workoutType,
  muscleGroupLabel,
  onFinishWorkout,
  onQuit,
  soundInitiallyEnabled,
}) => {
  // We make the blocks list stateful so the user can swap exercises (Trocar Exercício)
  const [blocks, setBlocks] = useState<WorkoutBlock[]>(initialBlocks);
  const [currentBlockIdx, setCurrentBlockIdx] = useState<number>(0);
  const [currentPhase, setCurrentPhase] = useState<'exercise' | 'rest'>('exercise');
  const [timeRemaining, setTimeRemaining] = useState<number>(initialBlocks[0].durationSeconds);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(soundInitiallyEnabled);

  // Keep a ref of soundEnabled so the interval callback always reads the up-to-date value
  const soundEnabledRef = useRef<boolean>(soundEnabled);
  useEffect(() => {
    soundEnabledRef.current = soundEnabled;
  }, [soundEnabled]);

  const activeBlock = blocks[currentBlockIdx];

  // Browser Audio Synthesizer (Web Audio API)
  const playBeep = (frequency: number, durationMs: number) => {
    if (!soundEnabledRef.current) return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      oscillator.frequency.value = frequency;
      oscillator.type = 'sine';

      gainNode.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + durationMs / 1000);

      oscillator.start();
      oscillator.stop(audioCtx.currentTime + durationMs / 1000);
    } catch (e) {
      console.error('Failed to play local synth beep:', e);
    }
  };

  // Sound chime when completing the entire workout
  const playChime = () => {
    if (!soundEnabledRef.current) return;
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((freq, index) => {
      setTimeout(() => {
        playBeep(freq, 250);
      }, index * 200);
    });
  };

  // Timer loop
  useEffect(() => {
    if (!isPlaying) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        const nextTime = prev - 1;

        // Sound countdown beep during the last 3 seconds
        if (nextTime <= 3 && nextTime > 0) {
          playBeep(400, 150); // Low pitch warning beep
        }

        if (nextTime <= 0) {
          // Transition phase
          handlePhaseTransition();
          return 0;
        }

        return nextTime;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isPlaying, currentBlockIdx, currentPhase, blocks]);

  const handlePhaseTransition = () => {
    const currentBlock = blocks[currentBlockIdx];

    if (currentPhase === 'exercise') {
      // Transition from exercise to rest
      if (currentBlock.restSeconds > 0) {
        setCurrentPhase('rest');
        setTimeRemaining(currentBlock.restSeconds);
        playBeep(550, 300); // Medium transition beep
      } else {
        // If rest is 0 (unusual but handled), move to next exercise directly
        moveToNextExercise();
      }
    } else {
      // Transition from rest to exercise (next block)
      moveToNextExercise();
    }
  };

  const moveToNextExercise = () => {
    if (currentBlockIdx < blocks.length - 1) {
      const nextIdx = currentBlockIdx + 1;
      setCurrentBlockIdx(nextIdx);
      setCurrentPhase('exercise');
      setTimeRemaining(blocks[nextIdx].durationSeconds);
      playBeep(800, 400); // High pitch exercise start beep
    } else {
      // Workout Finished!
      handleWorkoutComplete();
    }
  };

  const handleWorkoutComplete = () => {
    setIsPlaying(false);
    playChime();

    // Create a workout history item
    const todayPt = getCurrentDayPt();
    const completedWorkout: Workout = {
      id: Math.random().toString(36).substring(2, 9),
      date: new Date().toLocaleDateString('pt-BR'),
      dayOfWeek: todayPt,
      durationMinutes: totalDurationMin,
      workoutType: workoutType,
      muscleGroup: muscleGroupLabel,
      exercisesCount: blocks.length,
      blocks: blocks,
      status: 'Concluído',
    };

    // Save to history and mark calendar day as completed
    addWorkoutToHistory(completedWorkout);
    markDayCompleted(todayPt, true);

    // Call callback to render summary
    onFinishWorkout(completedWorkout);
  };

  // Control Actions
  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    if (currentPhase === 'exercise' && activeBlock.restSeconds > 0) {
      // Skip exercise to rest
      setCurrentPhase('rest');
      setTimeRemaining(activeBlock.restSeconds);
      playBeep(600, 150);
    } else {
      // Skip rest to next block
      if (currentBlockIdx < blocks.length - 1) {
        const nextIdx = currentBlockIdx + 1;
        setCurrentBlockIdx(nextIdx);
        setCurrentPhase('exercise');
        setTimeRemaining(blocks[nextIdx].durationSeconds);
        playBeep(800, 200);
      } else {
        handleWorkoutComplete();
      }
    }
  };

  const handlePrevious = () => {
    if (currentPhase === 'rest') {
      // Rewind rest to exercise
      setCurrentPhase('exercise');
      setTimeRemaining(activeBlock.durationSeconds);
    } else {
      // Rewind exercise to previous block
      if (currentBlockIdx > 0) {
        const prevIdx = currentBlockIdx - 1;
        setCurrentBlockIdx(prevIdx);
        setCurrentPhase('exercise');
        setTimeRemaining(blocks[prevIdx].durationSeconds);
      } else {
        // Reset current exercise
        setTimeRemaining(activeBlock.durationSeconds);
      }
    }
    playBeep(500, 150);
  };

  // Swap exercise (Trocar Exercício)
  const handleSwapExercise = () => {
    const isCardio = activeBlock.category === 'cardio';
    const pool = isCardio
      ? CARDIO_EXERCISES
      : DUMBBELL_EXERCISES.filter((e) => e.grupoMuscular === activeBlock.muscleGroup);

    // Filter out exercises already used in this workout to maintain variety
    const usedIds = new Set(blocks.map((b) => b.exerciseId));
    let candidates = pool.filter((e) => !usedIds.has(e.id));

    // Fallback if all are already used
    if (candidates.length === 0) {
      candidates = pool.filter((e) => e.id !== activeBlock.exerciseId);
    }
    if (candidates.length === 0) {
      candidates = pool;
    }

    // Pick random substitute
    const chosen = candidates[Math.floor(Math.random() * candidates.length)];

    // Apply substitution to stateful blocks array
    const updatedBlocks = [...blocks];
    updatedBlocks[currentBlockIdx] = {
      ...activeBlock,
      exerciseId: chosen.id,
      exerciseName: chosen.nome,
      descricaoCurta: chosen.descricaoCurta,
      gifUrl: chosen.gifUrl,
      equipment: chosen.equipamento,
    };

    setBlocks(updatedBlocks);
    
    // Reset timer for the newly swapped exercise if in exercise phase
    if (currentPhase === 'exercise') {
      setTimeRemaining(activeBlock.durationSeconds);
    }
    
    playBeep(700, 250);
  };

  // Calculations for total remaining time and progress bar
  const calculateProgressStats = () => {
    // Total time of all cycles
    const totalWorkoutSeconds = blocks.reduce((acc, b) => acc + b.durationSeconds + b.restSeconds, 0);

    // Calculate elapsed seconds
    let elapsedSeconds = 0;
    for (let i = 0; i < blocks.length; i++) {
      if (i < currentBlockIdx) {
        elapsedSeconds += blocks[i].durationSeconds + blocks[i].restSeconds;
      } else if (i === currentBlockIdx) {
        if (currentPhase === 'exercise') {
          elapsedSeconds += (blocks[i].durationSeconds - timeRemaining);
        } else {
          elapsedSeconds += blocks[i].durationSeconds + (blocks[i].restSeconds - timeRemaining);
        }
      }
    }

    const remainingWorkoutSeconds = Math.max(0, totalWorkoutSeconds - elapsedSeconds);
    const progressPercent = (elapsedSeconds / totalWorkoutSeconds) * 100;

    const remainingMin = Math.floor(remainingWorkoutSeconds / 60);
    const remainingSec = remainingWorkoutSeconds % 60;
    const remainingFormatted = `${remainingMin.toString().padStart(2, '0')}:${remainingSec.toString().padStart(2, '0')}`;

    const totalMinFormatted = `${totalDurationMin.toString().padStart(2, '0')}:00`;

    return {
      totalMinFormatted,
      remainingFormatted,
      progressPercent,
    };
  };

  const { totalMinFormatted, remainingFormatted, progressPercent } = calculateProgressStats();

  return (
    <div id="active-workout-page" className="max-w-md mx-auto w-full px-4 pb-12 text-white animate-fade-in relative min-h-[90vh] flex flex-col justify-between">
      
      {/* 1. TOP HEADER PANEL */}
      <div id="workout-header" className="space-y-3 mt-4">
        
        {/* Row 1: Session title and Sound toggle */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-500 leading-tight">
              Sessão HIIT Ativa
            </h2>
            <span className="text-xs font-bold text-lime-400">
              {workoutType} • {muscleGroupLabel}
            </span>
          </div>
          
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 transition"
            title={soundEnabled ? 'Desativar som' : 'Ativar som'}
          >
            {soundEnabled ? (
              <Volume2 className="h-4 w-4" />
            ) : (
              <VolumeX className="h-4 w-4 text-zinc-500" />
            )}
          </button>
        </div>

        {/* Row 2: Metrics block */}
        <div className="grid grid-cols-3 gap-2 py-3 rounded-xl bg-zinc-900/60 border border-zinc-800/80 px-4">
          <div className="text-center">
            <span className="text-xxs uppercase tracking-wider text-zinc-500 font-semibold block">
              Duração Total
            </span>
            <span className="text-sm font-mono font-bold text-white">
              {totalMinFormatted}
            </span>
          </div>
          <div className="text-center border-x border-zinc-800">
            <span className="text-xxs uppercase tracking-wider text-zinc-500 font-semibold block">
              Faltando
            </span>
            <span className="text-sm font-mono font-bold text-lime-400 animate-[pulse_2s_infinite]">
              {remainingFormatted}
            </span>
          </div>
          <div className="text-center">
            <span className="text-xxs uppercase tracking-wider text-zinc-500 font-semibold block">
              Ciclo
            </span>
            <span className="text-sm font-bold text-white">
              {currentBlockIdx + 1} <span className="text-zinc-500">of</span> {blocks.length}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="pt-1">
          <ProgressBar progress={progressPercent} colorClassName={activeBlock.category === 'halteres' && currentPhase === 'exercise' ? 'bg-orange-500' : 'bg-lime-400'} />
        </div>
      </div>

      {/* 2. CENTER STAGE: EXERCISE OR REST */}
      <div id="workout-center-stage" className="my-6 flex-grow flex flex-col justify-center gap-6">
        {currentPhase === 'exercise' ? (
          <>
            {/* Active Exercise Visualization Card */}
            <ExerciseCard block={activeBlock} isActive={isPlaying} />
            
            {/* Countdown timer */}
            <WorkoutTimer
              timeRemaining={timeRemaining}
              totalTime={activeBlock.durationSeconds}
              phase="exercise"
              category={activeBlock.category}
            />
          </>
        ) : (
          /* Rest Phase Screen */
          <RestScreen
            nextBlock={currentBlockIdx < blocks.length - 1 ? blocks[currentBlockIdx + 1] : null}
            restTimeRemaining={timeRemaining}
          />
        )}
      </div>

      {/* 3. BOTTOM PANEL CONTROLS */}
      <div id="workout-controls" className="space-y-4 pt-4 border-t border-zinc-800/60 bg-zinc-950 pb-6">
        
        {/* Swap Exercise Button (Only active during exercise phase) */}
        {currentPhase === 'exercise' && (
          <button
            id="swap-exercise-button"
            onClick={handleSwapExercise}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-zinc-900 hover:bg-zinc-850 text-zinc-300 py-3 text-xs font-bold uppercase tracking-wider border border-zinc-800 hover:border-zinc-700 active:scale-98 transition cursor-pointer"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Trocar este exercício
          </button>
        )}

        {/* Main interactive media controller buttons */}
        <div className="flex items-center justify-between gap-2">
          {/* Skip Back */}
          <button
            id="prev-exercise-button"
            onClick={handlePrevious}
            className="flex-1 py-3.5 flex justify-center items-center rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white active:scale-95 transition cursor-pointer"
            title="Exercício anterior"
          >
            <SkipBack className="h-5 w-5" />
          </button>

          {/* Play/Pause */}
          <button
            id="play-pause-button"
            onClick={togglePlay}
            className={`flex-2 py-3.5 flex justify-center items-center rounded-xl border font-black uppercase tracking-wider text-sm transition-all active:scale-95 cursor-pointer ${
              isPlaying
                ? 'bg-zinc-100 text-black border-white hover:bg-white'
                : 'bg-lime-400 text-black border-lime-400 hover:bg-lime-300'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="h-5 w-5 mr-1.5 fill-black" /> Pausar
              </>
            ) : (
              <>
                <Play className="h-5 w-5 mr-1.5 fill-black" /> Retomar
              </>
            )}
          </button>

          {/* Skip Forward */}
          <button
            id="next-exercise-button"
            onClick={handleNext}
            className="flex-1 py-3.5 flex justify-center items-center rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white active:scale-95 transition cursor-pointer"
            title="Próximo exercício"
          >
            <SkipForward className="h-5 w-5" />
          </button>
        </div>

        {/* Quit Workout button */}
        <button
          id="quit-workout-button"
          onClick={onQuit}
          className="w-full flex items-center justify-center gap-1.5 text-zinc-500 hover:text-red-400 text-xs font-bold uppercase tracking-widest py-2 transition"
        >
          <XCircle className="h-4 w-4" />
          Encerrar Treino
        </button>
      </div>

    </div>
  );
};
