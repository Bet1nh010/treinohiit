export type ExerciseCategory = 'cardio' | 'halteres';

export type MuscleGroup = 'bíceps' | 'ombros' | 'tríceps' | 'costas' | 'pernas' | 'corpo inteiro';

export type EquipmentType = 'nenhum' | '1 halter' | '2 halteres';

export interface Exercise {
  id: string;
  nome: string;
  categoria: ExerciseCategory;
  grupoMuscular?: MuscleGroup;
  equipamento: EquipmentType;
  gifUrl: string;
  descricaoCurta: string;
}
