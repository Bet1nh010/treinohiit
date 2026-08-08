import { AppSettings, Workout } from '../types/workout';

const SETTINGS_KEY = 'meu_treino_hiit_settings';
const HISTORY_KEY = 'meu_treino_hiit_history';
const WEEK_COMPLETED_KEY = 'meu_treino_hiit_week_completed';

export const DEFAULT_SETTINGS: AppSettings = {
  defaultDurationMinutes: 10,
  defaultExerciseSeconds: 20,
  defaultRestSeconds: 10,
  trainingDays: {
    Segunda: true,
    Terça: true,
    Quarta: true,
    Quinta: true,
    Sexta: true,
    Sábado: true,
    Domingo: false,
  },
  availableEquipment: {
    none: true,
    oneDumbbell: true,
    twoDumbbells: true,
  },
  dumbbellWeight: '5',
  soundEnabled: true,
};

export function getSettings(): AppSettings {
  try {
    const data = localStorage.getItem(SETTINGS_KEY);
    if (data) {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(data) };
    }
  } catch (e) {
    console.error('Error loading settings from localStorage', e);
  }
  return DEFAULT_SETTINGS;
}

export function saveSettings(settings: AppSettings): void {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error('Error saving settings to localStorage', e);
  }
}

export function getHistory(): Workout[] {
  try {
    const data = localStorage.getItem(HISTORY_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('Error loading history from localStorage', e);
  }
  return [];
}

export function saveHistory(history: Workout[]): void {
  try {
    // Keep only the last 30 workouts as requested
    const trimmedHistory = history.slice(0, 30);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(trimmedHistory));
  } catch (e) {
    console.error('Error saving history to localStorage', e);
  }
}

export function addWorkoutToHistory(workout: Workout): void {
  const history = getHistory();
  const updated = [workout, ...history];
  saveHistory(updated);
}

export function getWeekCompleted(): { [key: string]: boolean } {
  try {
    const data = localStorage.getItem(WEEK_COMPLETED_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('Error loading week completed status', e);
  }
  // Initialize with all false
  return {
    Segunda: false,
    Terça: false,
    Quarta: false,
    Quinta: false,
    Sexta: false,
    Sábado: false,
    Domingo: false,
  };
}

export function saveWeekCompleted(completed: { [key: string]: boolean }): void {
  try {
    localStorage.setItem(WEEK_COMPLETED_KEY, JSON.stringify(completed));
  } catch (e) {
    console.error('Error saving week completed status', e);
  }
}

export function markDayCompleted(dayName: string, status: boolean): void {
  const completed = getWeekCompleted();
  completed[dayName] = status;
  saveWeekCompleted(completed);
}

// Map JavaScript Date.getDay() (0-6, Sun-Sat) to Portuguese Day Name
export const WEEK_DAYS_PT = [
  'Domingo',
  'Segunda',
  'Terça',
  'Quarta',
  'Quinta',
  'Sexta',
  'Sábado'
];

export function getCurrentDayPt(): string {
  const dayIndex = new Date().getDay();
  return WEEK_DAYS_PT[dayIndex];
}
