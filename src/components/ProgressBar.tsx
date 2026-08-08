import React from 'react';

interface ProgressBarProps {
  progress: number; // 0 to 100
  colorClassName?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  colorClassName = 'bg-lime-400',
}) => {
  return (
    <div id="progress-bar-container" className="h-2 w-full overflow-hidden rounded-full bg-zinc-800">
      <div
        id="progress-bar-fill"
        className={`h-full rounded-full transition-all duration-300 ${colorClassName}`}
        style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
      />
    </div>
  );
};
