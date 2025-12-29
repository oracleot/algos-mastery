// components/MasteryBadge.tsx - Progress indicator showing mastery percentage

import { Lock, Unlock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MasteryBadgeProps {
  /** Mastery percentage (0-100) */
  percent: number;
  /** Whether the topic is unlocked */
  unlocked: boolean;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Whether to show the lock icon */
  showLockIcon?: boolean;
}

const sizeClasses = {
  sm: 'h-5 w-5 text-[10px]',
  md: 'h-8 w-8 text-xs',
  lg: 'h-12 w-12 text-sm',
};

const iconSizes = {
  sm: 'h-2.5 w-2.5',
  md: 'h-3.5 w-3.5',
  lg: 'h-5 w-5',
};

/**
 * Circular badge showing mastery percentage with color coding
 */
export function MasteryBadge({
  percent,
  unlocked,
  size = 'md',
  showLockIcon = true,
}: MasteryBadgeProps) {
  // Color based on progress
  const getColorClass = () => {
    if (!unlocked) {
      return 'bg-gray-100 text-gray-400 border-gray-200';
    }
    if (percent >= 70) {
      return 'bg-green-100 text-green-700 border-green-300';
    }
    if (percent >= 40) {
      return 'bg-yellow-100 text-yellow-700 border-yellow-300';
    }
    if (percent > 0) {
      return 'bg-orange-100 text-orange-700 border-orange-300';
    }
    return 'bg-gray-50 text-gray-500 border-gray-200';
  };

  if (!unlocked && showLockIcon) {
    return (
      <div
        className={cn(
          'flex items-center justify-center rounded-full border',
          'bg-gray-100 text-gray-400 border-gray-200',
          sizeClasses[size]
        )}
        title="Locked - Complete 70% of previous topic to unlock"
      >
        <Lock className={iconSizes[size]} />
      </div>
    );
  }

  return (
    <div
      className={cn(
        'flex items-center justify-center rounded-full border font-semibold',
        getColorClass(),
        sizeClasses[size]
      )}
      title={unlocked ? `${percent}% mastery` : 'Unlocked'}
    >
      {unlocked ? (
        `${percent}%`
      ) : (
        <Unlock className={iconSizes[size]} />
      )}
    </div>
  );
}

export type { MasteryBadgeProps };
