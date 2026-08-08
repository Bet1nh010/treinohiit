import React, { useState } from 'react';
import { Settings, Dumbbell, Calendar, Volume2, VolumeX, Save, Check, Scale } from 'lucide-react';
import { getSettings, saveSettings } from '../services/storage';
import { AppSettings } from '../types/workout';

export const SettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<AppSettings>(() => getSettings());
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  const durationOptions = [5, 10, 15, 20, 25, 30];
  const exerciseOptions = [20, 30, 40, 45, 60];
  const restOptions = [5, 10, 15, 20, 30];

  const updateSetting = <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
    const updated = { ...settings, [key]: value };
    setSettings(updated);
    saveSettings(updated);
    triggerSaveSuccess();
  };

  const toggleDay = (day: keyof AppSettings['trainingDays']) => {
    const updatedDays = { ...settings.trainingDays, [day]: !settings.trainingDays[day] };
    updateSetting('trainingDays', updatedDays);
  };

  const toggleEquipment = (equip: keyof AppSettings['availableEquipment']) => {
    const updatedEquip = { ...settings.availableEquipment, [equip]: !settings.availableEquipment[equip] };
    updateSetting('availableEquipment', updatedEquip);
  };

  const triggerSaveSuccess = () => {
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
    }, 1500);
  };

  return (
    <div id="settings-page" className="max-w-md mx-auto w-full px-4 pb-24 text-white animate-fade-in">
      
      {/* Page Header */}
      <div className="mt-6 mb-6">
        <h1 className="text-2xl font-black text-white flex items-center gap-2">
          <Settings className="h-6 w-6 text-lime-400" />
          Configurações
        </h1>
        <p className="text-zinc-400 text-xs">
          Personalize as preferências padrão do seu Meu Treino HIIT
        </p>
      </div>

      {/* Floating Save Success Indicator */}
      {saveSuccess && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 rounded-full bg-lime-400 text-black px-4 py-1.5 flex items-center gap-1.5 shadow-lg text-xs font-bold uppercase tracking-wider animate-[bounce_0.5s_infinite]">
          <Check className="h-4 w-4 stroke-[3px]" />
          Salvo automaticamente!
        </div>
      )}

      <div className="space-y-6">
        
        {/* SECTION 1: TIMER DEFAULT DEFAULTS */}
        <div className="rounded-2xl border border-zinc-850 bg-zinc-900/30 p-5 space-y-4">
          <h2 className="text-sm font-extrabold uppercase tracking-widest text-zinc-400 flex items-center gap-2">
            <Volume2 className="h-4 w-4 text-lime-400" />
            Valores Padrão
          </h2>

          {/* Workout Default Time */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-zinc-300 block">Duração do Treino</span>
            <div className="flex flex-wrap gap-1.5">
              {durationOptions.map((opt) => (
                <button
                  key={opt}
                  onClick={() => updateSetting('defaultDurationMinutes', opt)}
                  className={`flex-1 min-w-[50px] py-2 rounded-lg text-xs font-extrabold border transition ${
                    settings.defaultDurationMinutes === opt
                      ? 'bg-lime-400 text-black border-lime-400'
                      : 'bg-zinc-950/60 border-zinc-800 text-zinc-300 hover:border-zinc-700'
                  }`}
                >
                  {opt}m
                </button>
              ))}
            </div>
          </div>

          {/* Exercise Default Time */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-zinc-300 block">Tempo de Exercício</span>
            <div className="flex flex-wrap gap-1.5">
              {exerciseOptions.map((opt) => (
                <button
                  key={opt}
                  onClick={() => updateSetting('defaultExerciseSeconds', opt)}
                  className={`flex-1 min-w-[50px] py-2 rounded-lg text-xs font-extrabold border transition ${
                    settings.defaultExerciseSeconds === opt
                      ? 'bg-lime-400 text-black border-lime-400'
                      : 'bg-zinc-950/60 border-zinc-800 text-zinc-300 hover:border-zinc-700'
                  }`}
                >
                  {opt}s
                </button>
              ))}
            </div>
          </div>

          {/* Rest Default Time */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-zinc-300 block">Tempo de Descanso</span>
            <div className="flex flex-wrap gap-1.5">
              {restOptions.map((opt) => (
                <button
                  key={opt}
                  onClick={() => updateSetting('defaultRestSeconds', opt)}
                  className={`flex-1 min-w-[50px] py-2 rounded-lg text-xs font-extrabold border transition ${
                    settings.defaultRestSeconds === opt
                      ? 'bg-lime-400 text-black border-lime-400'
                      : 'bg-zinc-950/60 border-zinc-800 text-zinc-300 hover:border-zinc-700'
                  }`}
                >
                  {opt}s
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* SECTION 2: TRAINING DAYS SCHEDULE */}
        <div className="rounded-2xl border border-zinc-850 bg-zinc-900/30 p-5 space-y-4">
          <h2 className="text-sm font-extrabold uppercase tracking-widest text-zinc-400 flex items-center gap-2">
            <Calendar className="h-4 w-4 text-lime-400" />
            Dias de Treino
          </h2>
          <p className="text-xxs text-zinc-400 -mt-1 leading-relaxed">
            Selecione quais dias você deseja ativar em sua programação semanal regular:
          </p>

          <div className="grid grid-cols-2 gap-2">
            {(Object.keys(settings.trainingDays) as Array<keyof AppSettings['trainingDays']>).map((day) => {
              const active = settings.trainingDays[day];
              return (
                <button
                  key={day}
                  id={`settings-day-toggle-${day}`}
                  onClick={() => toggleDay(day)}
                  className={`flex items-center justify-between p-3 rounded-xl border text-left transition ${
                    active
                      ? 'bg-lime-500/10 border-lime-500/30 text-lime-400'
                      : 'bg-zinc-950/60 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                  }`}
                >
                  <span className="text-xs font-bold">{day}</span>
                  <div
                    className={`h-4 w-4 rounded-md border flex items-center justify-center transition ${
                      active
                        ? 'bg-lime-400 border-lime-400 text-black'
                        : 'border-zinc-600'
                    }`}
                  >
                    {active && <Check className="h-3 w-3 stroke-[3px]" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* SECTION 3: EQUIPMENTS & WEIGHT INFO */}
        <div className="rounded-2xl border border-zinc-850 bg-zinc-900/30 p-5 space-y-4">
          <h2 className="text-sm font-extrabold uppercase tracking-widest text-zinc-400 flex items-center gap-2">
            <Dumbbell className="h-4 w-4 text-lime-400" />
            Equipamento & Peso
          </h2>

          <div className="space-y-2.5">
            {/* None */}
            <button
              onClick={() => toggleEquipment('none')}
              className={`w-full flex items-center justify-between p-3.5 rounded-xl border text-left transition ${
                settings.availableEquipment.none
                  ? 'bg-zinc-800/80 border-lime-400/30'
                  : 'bg-zinc-950/60 border-zinc-850 opacity-60'
              }`}
            >
              <div>
                <span className="text-xs font-bold text-white block">Sem Equipamento (Peso Corporal)</span>
                <span className="text-xxs text-zinc-400">Ativa somente treinos de cardio.</span>
              </div>
              <div className={`h-4 w-4 rounded-full border flex items-center justify-center ${
                settings.availableEquipment.none ? 'bg-lime-400 border-lime-400 text-black' : 'border-zinc-600'
              }`}>
                {settings.availableEquipment.none && <Check className="h-3 w-3 stroke-[3px]" />}
              </div>
            </button>

            {/* One dumbbell */}
            <button
              onClick={() => toggleEquipment('oneDumbbell')}
              className={`w-full flex items-center justify-between p-3.5 rounded-xl border text-left transition ${
                settings.availableEquipment.oneDumbbell
                  ? 'bg-zinc-800/80 border-lime-400/30'
                  : 'bg-zinc-950/60 border-zinc-850 opacity-60'
              }`}
            >
              <div>
                <span className="text-xs font-bold text-white block">Tenho 1 Halter</span>
                <span className="text-xxs text-zinc-400">Libera variações unilaterais.</span>
              </div>
              <div className={`h-4 w-4 rounded-full border flex items-center justify-center ${
                settings.availableEquipment.oneDumbbell ? 'bg-lime-400 border-lime-400 text-black' : 'border-zinc-600'
              }`}>
                {settings.availableEquipment.oneDumbbell && <Check className="h-3 w-3 stroke-[3px]" />}
              </div>
            </button>

            {/* Two dumbbells */}
            <button
              onClick={() => toggleEquipment('twoDumbbells')}
              className={`w-full flex items-center justify-between p-3.5 rounded-xl border text-left transition ${
                settings.availableEquipment.twoDumbbells
                  ? 'bg-zinc-800/80 border-lime-400/30'
                  : 'bg-zinc-950/60 border-zinc-850 opacity-60'
              }`}
            >
              <div>
                <span className="text-xs font-bold text-white block">Tenho 2 Halteres</span>
                <span className="text-xxs text-zinc-400">Libera gama total de exercícios de força.</span>
              </div>
              <div className={`h-4 w-4 rounded-full border flex items-center justify-center ${
                settings.availableEquipment.twoDumbbells ? 'bg-lime-400 border-lime-400 text-black' : 'border-zinc-600'
              }`}>
                {settings.availableEquipment.twoDumbbells && <Check className="h-3 w-3 stroke-[3px]" />}
              </div>
            </button>
          </div>

          {/* Reference Weight Input */}
          <div className="space-y-2 pt-2">
            <label className="text-xs font-bold text-zinc-300 flex items-center gap-1.5">
              <Scale className="h-3.5 w-3.5 text-zinc-400" />
              Referência de Carga (kg)
            </label>
            <input
              id="settings-dumbbell-weight"
              type="text"
              value={settings.dumbbellWeight}
              onChange={(e) => updateSetting('dumbbellWeight', e.target.value)}
              placeholder="Ex: 5 ou 7.5"
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 text-sm font-bold text-white placeholder-zinc-600 focus:outline-none focus:border-lime-400"
            />
          </div>
        </div>

        {/* SECTION 4: SOUND SETTING */}
        <div className="rounded-2xl border border-zinc-850 bg-zinc-900/30 p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-zinc-850 text-lime-400">
              {settings.soundEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5 text-zinc-500" />}
            </div>
            <div>
              <span className="text-sm font-bold text-white block">Efeitos Sonoros</span>
              <span className="text-xxs text-zinc-500">Sinais (3, 2, 1) e transições.</span>
            </div>
          </div>

          <button
            onClick={() => updateSetting('soundEnabled', !settings.soundEnabled)}
            className={`w-12 h-6 flex items-center rounded-full p-1 transition duration-300 cursor-pointer ${
              settings.soundEnabled ? 'bg-lime-400' : 'bg-zinc-800'
            }`}
          >
            <div
              className={`bg-black w-4 h-4 rounded-full shadow-md transform transition duration-300 ${
                settings.soundEnabled ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

      </div>

    </div>
  );
};
