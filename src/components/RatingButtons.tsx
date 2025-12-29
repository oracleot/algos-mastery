// components/RatingButtons.tsx - Rating buttons for review sessions

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { ReviewQuality } from '@/types';
import { REVIEW_RATINGS } from '@/types';

interface RatingButtonsProps {
  /** Called when a rating is selected */
  onRate: (quality: ReviewQuality) => void;

  /** Interval previews to show on buttons */
  intervals: {
    again: number;
    hard: number;
    good: number;
    easy: number;
  };

  /** Whether buttons are disabled */
  disabled?: boolean;
}

/**
 * Formats an interval in days to a human-readable string
 */
function formatInterval(days: number): string {
  if (days === 1) {
    return '1 day';
  }
  if (days < 7) {
    return `${days} days`;
  }
  if (days < 30) {
    const weeks = Math.round(days / 7);
    return weeks === 1 ? '1 week' : `${weeks} weeks`;
  }
  const months = Math.round(days / 30);
  return months === 1 ? '1 month' : `${months} months`;
}

/**
 * Rating buttons for review sessions with interval previews
 * Supports keyboard shortcuts: 1=Again, 2=Hard, 3=Good, 4=Easy
 */
export function RatingButtons({
  onRate,
  intervals,
  disabled = false,
}: RatingButtonsProps) {
  const buttons = [
    {
      quality: REVIEW_RATINGS.AGAIN as ReviewQuality,
      label: 'Again',
      interval: intervals.again,
      shortcut: '1',
      className: 'bg-red-500/10 hover:bg-red-500/20 text-red-700 dark:text-red-400 border-red-500/20',
    },
    {
      quality: REVIEW_RATINGS.HARD as ReviewQuality,
      label: 'Hard',
      interval: intervals.hard,
      shortcut: '2',
      className: 'bg-orange-500/10 hover:bg-orange-500/20 text-orange-700 dark:text-orange-400 border-orange-500/20',
    },
    {
      quality: REVIEW_RATINGS.GOOD as ReviewQuality,
      label: 'Good',
      interval: intervals.good,
      shortcut: '3',
      className: 'bg-green-500/10 hover:bg-green-500/20 text-green-700 dark:text-green-400 border-green-500/20',
    },
    {
      quality: REVIEW_RATINGS.EASY as ReviewQuality,
      label: 'Easy',
      interval: intervals.easy,
      shortcut: '4',
      className: 'bg-blue-500/10 hover:bg-blue-500/20 text-blue-700 dark:text-blue-400 border-blue-500/20',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
      {buttons.map((button) => (
        <Button
          key={button.quality}
          onClick={() => onRate(button.quality)}
          disabled={disabled}
          variant="outline"
          className={cn(
            'flex flex-col h-auto py-3 px-4 gap-1 transition-all',
            button.className
          )}
        >
          <span className="font-semibold text-sm sm:text-base">{button.label}</span>
          <span className="text-xs opacity-80">{formatInterval(button.interval)}</span>
          <span className="hidden sm:inline text-[10px] opacity-60 mt-1">
            Press {button.shortcut}
          </span>
        </Button>
      ))}
    </div>
  );
}

export type { RatingButtonsProps };
