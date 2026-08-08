import React from 'react';
import { Home, Calendar, History, Settings } from 'lucide-react';

interface BottomNavigationProps {
  activeTab: 'home' | 'week' | 'history' | 'settings';
  setActiveTab: (tab: 'home' | 'week' | 'history' | 'settings') => void;
  disabled?: boolean;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  activeTab,
  setActiveTab,
  disabled = false,
}) => {
  const navItems = [
    { id: 'home', label: 'Início', icon: Home },
    { id: 'week', label: 'Minha Semana', icon: Calendar },
    { id: 'history', label: 'Histórico', icon: History },
    { id: 'settings', label: 'Ajustes', icon: Settings },
  ] as const;

  return (
    <nav 
      id="bottom-nav"
      className="fixed bottom-0 left-0 right-0 z-40 border-t border-zinc-800 bg-zinc-950/95 py-2 pb-safe shadow-[0_-4px_24px_rgba(0,0,0,0.6)] backdrop-blur-md"
    >
      <div className="mx-auto flex max-w-md items-center justify-around px-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              id={`nav-${item.id}`}
              disabled={disabled}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center py-1 transition-all duration-300 ${
                isActive
                  ? 'text-lime-400 scale-105 font-medium'
                  : 'text-zinc-400 hover:text-zinc-200 active:scale-95'
              } ${disabled ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <Icon className="h-5 w-5 mb-1 transition-transform" />
              <span className="text-xs tracking-wide">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
