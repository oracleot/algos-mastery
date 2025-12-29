// components/ReviewSessionProgress.tsx - Progress indicator for review session

import type { ReviewResult } from '@/components/ReviewSession';
import { REVIEW_RATINGS } from '@/types';

interface ReviewSessionProgressProps {
  /** Current problem number (1-indexed) */
  current: number;

  /** Total problems in session */
  total: number;

  /** Completed review results */
  completedResults?: ReviewResult[];
}

/**
 * Shows progress through a review session as "2/5" with visual dots.
 * Dots are colored based on rating quality.
 */
export function ReviewSessionProgress({
  current,
  total,
  completedResults = [],
}: ReviewSessionProgressProps) {
  // Get rating color for completed problems
  const getRatingColor = (index: number): string => {
    const result = completedResults[index];
    if (!result) return 'bg-muted';

    switch (result.quality) {
      case REVIEW_RATINGS.AGAIN:
        return 'bg-red-500';
      case REVIEW_RATINGS.HARD:
        return 'bg-orange-500';
      case REVIEW_RATINGS.GOOD:
        return 'bg-green-500';
      case REVIEW_RATINGS.EASY:
        return 'bg-blue-500';
      default:
        return 'bg-green-500';
    }
  };

  return (
    <div className="flex items-center justify-between">
      {/* Text progress */}
      <div className="text-sm font-medium text-muted-foreground">
        <span className="text-foreground">{current}</span> / {total}
      </div>

      {/* Visual progress dots */}
      <div className="flex items-center gap-1.5" role="progressbar" aria-valuenow={current} aria-valuemin={1} aria-valuemax={total}>
        {Array.from({ length: total }, (_, idx) => {
          const isCompleted = idx < current - 1;
          const isCurrent = idx === current - 1;

          return (
            <div
              key={idx}
              className={`h-2 w-2 rounded-full transition-all duration-200 ${
                isCompleted
                  ? getRatingColor(idx)
                  : isCurrent
                    ? 'bg-primary ring-2 ring-primary/30'
                    : 'bg-muted'
              }`}
              aria-label={
                isCompleted
                  ? `Problem ${idx + 1} completed`
                  : isCurrent
                    ? `Problem ${idx + 1} current`
                    : `Problem ${idx + 1} pending`
              }
            />
          );
        })}
      </div>
    </div>
  );
}

export type { ReviewSessionProgressProps };
