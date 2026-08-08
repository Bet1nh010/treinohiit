import { Exercise, MuscleGroup, EquipmentType } from '../types/exercise';
import { Workout, WorkoutBlock, AppSettings } from '../types/workout';
import { CARDIO_EXERCISES, DUMBBELL_EXERCISES } from '../data/exercises';

// Map day of week to primary muscle group
export const DAY_MUSCLE_MAPPING: { [key: string]: MuscleGroup | 'descanso' } = {
  Segunda: 'bíceps',
  Terça: 'pernas',
  Quarta: 'ombros',
  Quinta: 'costas',
  Sexta: 'tríceps',
  Sábado: 'corpo inteiro',
  Domingo: 'descanso',
};

// Returns muscle group description for display
export function getMuscleGroupNamePt(group: MuscleGroup | 'descanso' | 'cardio'): string {
  switch (group) {
    case 'bíceps':
      return 'Bíceps';
    case 'pernas':
      return 'Pernas';
    case 'ombros':
      return 'Ombros';
    case 'costas':
      return 'Costas';
    case 'tríceps':
      return 'Tríceps';
    case 'corpo inteiro':
      return 'Corpo Inteiro';
    case 'descanso':
      return 'Descanso';
    case 'cardio':
      return 'Apenas Cardio';
    default:
      return '';
  }
}

// Shuffles an array helper
function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function generateWorkout(
  durationMinutes: number,
  exerciseSeconds: number,
  restSeconds: number,
  workoutType: 'Cardio' | 'Cardio + Halteres' | 'Halteres + Cardio',
  muscleGroup: MuscleGroup | 'descanso',
  recentWorkouts: Workout[],
  availableEquipment: AppSettings['availableEquipment']
): WorkoutBlock[] {
  const cycleTime = exerciseSeconds + restSeconds;
  const totalDurationSeconds = durationMinutes * 60;
  const numCycles = Math.round(totalDurationSeconds / cycleTime);

  // Collect recently used exercise IDs (last 3 workouts to ensure maximum variety)
  const recentExerciseIds = new Set<string>();
  recentWorkouts.slice(0, 3).forEach((w) => {
    w.blocks.forEach((b) => recentExerciseIds.add(b.exerciseId));
  });

  // Filter Cardio exercises (no equipment needed)
  let cardioPool = [...CARDIO_EXERCISES];

  // Filter Dumbbell exercises by muscle group and equipment availability
  let dumbbellPool = DUMBBELL_EXERCISES.filter((e) => e.grupoMuscular === muscleGroup);

  // If we don't have exercises for the specific muscle group (or it's Sunday/Descanso), fallback to corpo inteiro
  if (dumbbellPool.length === 0 && muscleGroup !== 'descanso') {
    dumbbellPool = DUMBBELL_EXERCISES.filter((e) => e.grupoMuscular === 'corpo inteiro');
  }

  // Filter dumbbell pool based on user equipment selection
  if (!availableEquipment.twoDumbbells) {
    // If user does NOT have 2 dumbbells, we prefer exercises that only require 1 halter
    const oneHalterExercises = dumbbellPool.filter((e) => e.equipamento === '1 halter');
    if (oneHalterExercises.length > 0) {
      dumbbellPool = oneHalterExercises;
    } else {
      // If none available, we still keep the original ones but they will adapt
      dumbbellPool = dumbbellPool.map(e => ({ ...e, equipamento: '1 halter' as EquipmentType }));
    }
  }

  // Helper to draw an exercise from a pool while avoiding duplicates and recent repetitions
  const selectExercise = (
    pool: Exercise[],
    usedInThisWorkout: Set<string>,
    lastSelectedId: string | null
  ): Exercise => {
    // 1. Try exercises that are NOT in recent workouts AND NOT used in this workout, and different from last selected
    let candidates = pool.filter(
      (e) => !recentExerciseIds.has(e.id) && !usedInThisWorkout.has(e.id) && e.id !== lastSelectedId
    );

    // 2. Fallback to exercises NOT used in this workout, and different from last selected
    if (candidates.length === 0) {
      candidates = pool.filter((e) => !usedInThisWorkout.has(e.id) && e.id !== lastSelectedId);
    }

    // 3. Fallback to any exercise in the pool different from last selected
    if (candidates.length === 0) {
      candidates = pool.filter((e) => e.id !== lastSelectedId);
    }

    // 4. Ultimate fallback (just return anything)
    if (candidates.length === 0) {
      candidates = pool;
    }

    // Pick a random candidate
    const chosen = candidates[Math.floor(Math.random() * candidates.length)];
    usedInThisWorkout.add(chosen.id);
    return chosen;
  };

  const blocks: WorkoutBlock[] = [];
  const usedExerciseIds = new Set<string>();
  let lastCardioId: string | null = null;
  let lastDumbbellId: string | null = null;

  // Determine starting type for mixed workouts
  // Cardio + Halteres -> starts with Halteres (or alternates)
  // Halteres + Cardio -> starts with Halteres (or alternates)
  // Let's alternate starting to keep it fun, or start with Dumbbell as requested.
  // "Quando estiver selecionado 'Cardio + Halteres', alternar os exercícios: HALTER -> CARDIO -> HALTER -> CARDIO"
  let nextIsDumbbell = workoutType !== 'Cardio';

  for (let i = 0; i < numCycles; i++) {
    let chosen: Exercise;

    if (workoutType === 'Cardio' || dumbbellPool.length === 0) {
      // Cardio only
      chosen = selectExercise(cardioPool, usedExerciseIds, lastCardioId);
      lastCardioId = chosen.id;
    } else {
      // Mixed workout
      if (nextIsDumbbell) {
        chosen = selectExercise(dumbbellPool, usedExerciseIds, lastDumbbellId);
        lastDumbbellId = chosen.id;
      } else {
        chosen = selectExercise(cardioPool, usedExerciseIds, lastCardioId);
        lastCardioId = chosen.id;
      }
      // Alternate for next cycle
      nextIsDumbbell = !nextIsDumbbell;
    }

    blocks.push({
      exerciseId: chosen.id,
      exerciseName: chosen.nome,
      category: chosen.categoria,
      muscleGroup: chosen.grupoMuscular,
      durationSeconds: exerciseSeconds,
      restSeconds: restSeconds,
      gifUrl: chosen.gifUrl,
      descricaoCurta: chosen.descricaoCurta,
      equipment: chosen.equipamento,
    });
  }

  return blocks;
}
