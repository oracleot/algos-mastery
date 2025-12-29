// components/StreakCounter.tsx - Display current review streak

import { Flame } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StreakCounterProps {
  /** Current streak count */
  count: number;

  /** Whether reviewed today */
  isActive: boolean;

  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Streak counter with flame icon
 * Shows current consecutive day streak for review activity
 */
export function StreakCounter({
  count,
  isActive,
  size = 'md',
}: StreakCounterProps) {
  const sizeClasses = {
    sm: {
      container: 'gap-1.5 px-2 py-1',
      icon: 'h-4 w-4',
      text: 'text-sm',
    },
    md: {
      container: 'gap-2 px-3 py-2',
      icon: 'h-5 w-5',
      text: 'text-base',
    },
    lg: {
      container: 'gap-3 px-4 py-3',
      icon: 'h-7 w-7',
      text: 'text-xl',
    },
  };

  const classes = sizeClasses[size];

  return (
    <div
      className={cn(
        'inline-flex items-center rounded-lg font-semibold transition-colors',
        classes.container,
        isActive
          ? 'bg-orange-100 text-orange-700'
          : 'bg-muted text-muted-foreground'
      )}
    >
      <Flame
        className={cn(
          classes.icon,
          isActive && 'text-orange-500',
          isActive && count > 0 && 'animate-pulse'
        )}
      />
      <span className={classes.text}>{count}</span>
      <span className={cn(classes.text, 'font-normal')}>
        day{count !== 1 ? 's' : ''}
      </span>
    </div>
  );
}

export type { StreakCounterProps };
