import { ExerciseCategory, MuscleGroup, EquipmentType } from './exercise';

export interface WorkoutBlock {
  exerciseId: string;
  exerciseName: string;
  category: ExerciseCategory;
  muscleGroup?: MuscleGroup;
  durationSeconds: number;
  restSeconds: number;
  gifUrl: string;
  descricaoCurta: string;
  equipment: EquipmentType;
}

export interface Workout {
  id: string;
  date: string; // "DD/MM/YYYY" or "YYYY-MM-DD"
  dayOfWeek: string; // e.g. "Segunda-feira", "Sábado"
  durationMinutes: number;
  workoutType: 'Cardio' | 'Cardio + Halteres' | 'Halteres + Cardio';
  muscleGroup: string; // e.g., "Bíceps + Cardio", "Apenas Cardio"
  exercisesCount: number;
  blocks: WorkoutBlock[];
  status: 'Concluído' | 'Em andamento' | 'Cancelado';
}

export interface AppSettings {
  defaultDurationMinutes: number;
  defaultExerciseSeconds: number;
  defaultRestSeconds: number;
  trainingDays: {
    Segunda: boolean;
    Terça: boolean;
    Quarta: boolean;
    Quinta: boolean;
    Sexta: boolean;
    Sábado: boolean;
    Domingo: boolean;
  };
  availableEquipment: {
    none: boolean;
    oneDumbbell: boolean;
    twoDumbbells: boolean;
  };
  dumbbellWeight: string; // e.g., "5"
  soundEnabled: boolean;
}
