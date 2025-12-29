// components/ReviewSessionSummary.tsx - Summary screen after review session

import { CheckCircle2, Clock, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { ReviewResult } from '@/components/ReviewSession';
import { REVIEW_RATINGS } from '@/types';

interface ReviewSessionSummaryProps {
  /** Results from the completed session */
  results: ReviewResult[];

  /** Session duration in seconds */
  duration: number;

  /** Called when user clicks Done */
  onDone: () => void;
}

/**
 * Shows summary statistics after completing a review session.
 * Displays ratings breakdown, time spent, and encouragement.
 */
export function ReviewSessionSummary({
  results,
  duration,
  onDone,
}: ReviewSessionSummaryProps) {
  // Calculate rating counts
  const ratingCounts = {
    again: results.filter((r) => r.quality === REVIEW_RATINGS.AGAIN).length,
    hard: results.filter((r) => r.quality === REVIEW_RATINGS.HARD).length,
    good: results.filter((r) => r.quality === REVIEW_RATINGS.GOOD).length,
    easy: results.filter((r) => r.quality === REVIEW_RATINGS.EASY).length,
  };

  const total = results.length;

  // Format duration as mm:ss
  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins === 0) return `${secs}s`;
    return `${mins}m ${secs}s`;
  };

  // Calculate success rate (Good + Easy vs Again + Hard)
  const successCount = ratingCounts.good + ratingCounts.easy;
  const successRate = total > 0 ? Math.round((successCount / total) * 100) : 0;

  // Get encouragement message based on performance
  const getMessage = (): string => {
    if (total === 0) return 'No problems reviewed';
    if (successRate >= 80) return 'Excellent session! 🌟';
    if (successRate >= 60) return 'Great work! Keep it up! 💪';
    if (successRate >= 40) return 'Good effort! Practice makes perfect 📚';
    return 'Keep practicing! You\'ll improve! 🚀';
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center pb-2">
        <div className="mx-auto mb-4 w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
          <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
        </div>
        <CardTitle className="text-2xl">Session Complete!</CardTitle>
        <p className="text-muted-foreground">{getMessage()}</p>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Stats Row */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-muted/50 rounded-lg p-4 text-center">
            <div className="flex items-center justify-center gap-2 text-muted-foreground mb-1">
              <TrendingUp className="h-4 w-4" />
              <span className="text-sm">Reviewed</span>
            </div>
            <p className="text-2xl font-bold">{total}</p>
          </div>

          <div className="bg-muted/50 rounded-lg p-4 text-center">
            <div className="flex items-center justify-center gap-2 text-muted-foreground mb-1">
              <Clock className="h-4 w-4" />
              <span className="text-sm">Duration</span>
            </div>
            <p className="text-2xl font-bold">{formatDuration(duration)}</p>
          </div>
        </div>

        {/* Ratings Breakdown */}
        {total > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              Ratings Breakdown
            </h3>
            <div className="space-y-2">
              <RatingBar
                label="Again"
                count={ratingCounts.again}
                total={total}
                color="bg-red-500"
              />
              <RatingBar
                label="Hard"
                count={ratingCounts.hard}
                total={total}
                color="bg-orange-500"
              />
              <RatingBar
                label="Good"
                count={ratingCounts.good}
                total={total}
                color="bg-green-500"
              />
              <RatingBar
                label="Easy"
                count={ratingCounts.easy}
                total={total}
                color="bg-blue-500"
              />
            </div>
          </div>
        )}

        {/* Success Rate */}
        {total > 0 && (
          <div className="bg-muted/30 rounded-lg p-4 text-center">
            <p className="text-sm text-muted-foreground mb-1">Success Rate (Good + Easy)</p>
            <p className="text-3xl font-bold text-green-600 dark:text-green-400">{successRate}%</p>
          </div>
        )}

        {/* Done Button */}
        <Button onClick={onDone} className="w-full" size="lg">
          Done
        </Button>
      </CardContent>
    </Card>
  );
}

/** Individual rating bar in the breakdown */
function RatingBar({
  label,
  count,
  total,
  color,
}: {
  label: string;
  count: number;
  total: number;
  color: string;
}) {
  const percentage = total > 0 ? (count / total) * 100 : 0;

  return (
    <div className="flex items-center gap-3">
      <span className="w-12 text-sm font-medium">{label}</span>
      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
        <div
          className={`h-full ${color} transition-all duration-500`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="w-8 text-sm text-muted-foreground text-right">{count}</span>
    </div>
  );
}

export type { ReviewSessionSummaryProps };
