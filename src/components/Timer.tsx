// components/Timer.tsx - Circular countdown timer display

import { cn } from '@/lib/utils';
import { formatTime, calculateProgress, type TimerState } from '@/lib/timer';

interface TimerProps {
  /** Current timer state */
  state: TimerState;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Additional CSS classes */
  className?: string;
}

const SIZE_CONFIG = {
  sm: {
    container: 'w-24 h-24 sm:w-32 sm:h-32',
    fontSize: 'text-xl sm:text-2xl',
    strokeWidth: 4,
    radius: 56,
  },
  md: {
    container: 'w-36 h-36 sm:w-48 sm:h-48',
    fontSize: 'text-3xl sm:text-4xl',
    strokeWidth: 6,
    radius: 84,
  },
  lg: {
    container: 'w-48 h-48 sm:w-64 sm:h-64',
    fontSize: 'text-4xl sm:text-5xl',
    strokeWidth: 8,
    radius: 112,
  },
};

/**
 * Circular countdown timer with progress ring
 */
export function Timer({ state, size = 'md', className }: TimerProps) {
  const config = SIZE_CONFIG[size];
  const progress = calculateProgress(state);
  const circumference = 2 * Math.PI * config.radius;
  const strokeDashoffset = circumference * (1 - progress);

  // Determine color based on state
  const getProgressColor = () => {
    if (state.isComplete) return 'text-red-500';
    if (state.remaining <= 60) return 'text-orange-500'; // Last minute
    if (state.remaining <= 300) return 'text-yellow-500'; // Last 5 minutes
    return 'text-primary';
  };

  const getStatusText = () => {
    if (state.isComplete) return 'Complete';
    if (state.isPaused) return 'Paused';
    if (!state.isRunning) return 'Ready';
    return null;
  };

  const statusText = getStatusText();

  return (
    <div
      className={cn(
        'relative flex items-center justify-center',
        config.container,
        className
      )}
    >
      {/* Background circle */}
      <svg
        className="absolute inset-0 -rotate-90 transform"
        viewBox={`0 0 ${(config.radius + config.strokeWidth) * 2} ${(config.radius + config.strokeWidth) * 2}`}
      >
        {/* Track */}
        <circle
          cx={config.radius + config.strokeWidth}
          cy={config.radius + config.strokeWidth}
          r={config.radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={config.strokeWidth}
          className="text-muted/20"
        />
        {/* Progress */}
        <circle
          cx={config.radius + config.strokeWidth}
          cy={config.radius + config.strokeWidth}
          r={config.radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={config.strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className={cn('transition-all duration-200', getProgressColor())}
        />
      </svg>

      {/* Time display */}
      <div className="relative text-center">
        <span
          className={cn(
            'font-mono font-bold tabular-nums',
            config.fontSize,
            state.isComplete && 'text-red-500',
            state.isPaused && 'opacity-80'
          )}
        >
          {formatTime(state.remaining)}
        </span>
        {statusText && (
          <div className="text-sm text-muted-foreground mt-1">{statusText}</div>
        )}
      </div>
    </div>
  );
}

export type { TimerProps };
