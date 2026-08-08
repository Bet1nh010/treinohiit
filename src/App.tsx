/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Home } from './pages/Home';
import { WorkoutPage } from './pages/Workout';
import { Week } from './pages/Week';
import { HistoryPage } from './pages/History';
import { SettingsPage } from './pages/Settings';
import { BottomNavigation } from './components/BottomNavigation';
import { WorkoutSummary } from './components/WorkoutSummary';
import { WorkoutBlock, Workout } from './types/workout';
import { getSettings } from './services/storage';

export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'week' | 'history' | 'settings'>('home');
  
  // Active Workout session state
  const [activeWorkoutBlocks, setActiveWorkoutBlocks] = useState<WorkoutBlock[] | null>(null);
  const [workoutDurationMin, setWorkoutDurationMin] = useState<number>(10);
  const [workoutTypeLabel, setWorkoutTypeLabel] = useState<'Cardio' | 'Cardio + Halteres' | 'Halteres + Cardio'>('Cardio + Halteres');
  const [muscleGroupLabel, setMuscleGroupLabel] = useState<string>('');

  // Finished Workout Summary state
  const [completedWorkout, setCompletedWorkout] = useState<Workout | null>(null);

  const settings = getSettings();

  const handleStartWorkout = (
    blocks: WorkoutBlock[],
    durationMin: number,
    workoutType: 'Cardio' | 'Cardio + Halteres' | 'Halteres + Cardio',
    label: string
  ) => {
    setActiveWorkoutBlocks(blocks);
    setWorkoutDurationMin(durationMin);
    setWorkoutTypeLabel(workoutType);
    setMuscleGroupLabel(label);
    setCompletedWorkout(null);
  };

  const handleFinishWorkout = (workout: Workout) => {
    setCompletedWorkout(workout);
    setActiveWorkoutBlocks(null);
  };

  const handleQuitWorkout = () => {
    if (window.confirm('Tem certeza de que deseja interromper e encerrar seu treino atual? Seu progresso não será salvo no histórico.')) {
      setActiveWorkoutBlocks(null);
      setCompletedWorkout(null);
      setActiveTab('home');
    }
  };

  const handleDismissSummary = () => {
    setCompletedWorkout(null);
    setActiveTab('history'); // Go to history to see the newly logged workout
  };

  return (
    <div id="app-root" className="min-h-screen bg-zinc-950 text-white flex flex-col font-sans select-none antialiased selection:bg-lime-400 selection:text-black">
      
      {/* Scrollable container */}
      <main className="flex-grow w-full pb-16">
        {completedWorkout ? (
          /* Celebratory Summary Screen */
          <div className="flex items-center justify-center min-h-[90vh] px-4 py-8">
            <WorkoutSummary
              workout={completedWorkout}
              onConfirm={handleDismissSummary}
            />
          </div>
        ) : activeWorkoutBlocks ? (
          /* Active Workout Screen - Hides Bottom Navigation and Header for distraction-free focus */
          <WorkoutPage
            blocks={activeWorkoutBlocks}
            totalDurationMin={workoutDurationMin}
            workoutType={workoutTypeLabel}
            muscleGroupLabel={muscleGroupLabel}
            onFinishWorkout={handleFinishWorkout}
            onQuit={handleQuitWorkout}
            soundInitiallyEnabled={settings.soundEnabled}
          />
        ) : (
          /* Regular Tab Views */
          <div className="w-full">
            {activeTab === 'home' && <Home onStartWorkout={handleStartWorkout} />}
            {activeTab === 'week' && <Week />}
            {activeTab === 'history' && <HistoryPage />}
            {activeTab === 'settings' && <SettingsPage />}
          </div>
        )}
      </main>

      {/* Persistent Bottom Tab Menu (Hidden during active workouts or summary celebration) */}
      {!activeWorkoutBlocks && !completedWorkout && (
        <BottomNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
      )}
    </div>
  );
}

