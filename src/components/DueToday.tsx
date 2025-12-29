// components/DueToday.tsx - Due today queue list with Start Review button

import { Link } from 'react-router-dom';
import { Calendar, PlayCircle, BookOpen } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TopicBadge } from '@/components/TopicBadge';
import { DifficultyBadge } from '@/components/DifficultyBadge';
import { format } from 'date-fns';
import type { Problem, Review } from '@/types';

interface DueItem {
  problem: Problem;
  review: Review;
}

interface DueTodayProps {
  /** Due items to display */
  items: DueItem[];

  /** Called when Start Review is clicked */
  onStartReview: () => void;

  /** Whether to show compact view */
  compact?: boolean;
}

/**
 * Component to display problems due for review today
 */
export function DueToday({
  items,
  onStartReview,
  compact = false,
}: DueTodayProps) {
  // Empty state
  if (items.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-8 text-center">
          <div className="p-3 bg-green-500/10 rounded-full mb-4">
            <Calendar className="h-8 w-8 text-green-600" />
          </div>
          <h3 className="font-semibold text-lg mb-2">All caught up!</h3>
          <p className="text-muted-foreground text-sm max-w-xs">
            No problems due for review today. Great job staying on top of your practice!
          </p>
        </CardContent>
      </Card>
    );
  }

  if (compact) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Calendar className="h-5 w-5 text-primary" />
              Due Today
            </CardTitle>
            <span className="text-2xl font-bold text-primary">{items.length}</span>
          </div>
        </CardHeader>
        <CardContent>
          <Button onClick={onStartReview} className="w-full gap-2">
            <PlayCircle className="h-4 w-4" />
            Start Review
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Due for Review ({items.length})
          </CardTitle>
          <Button onClick={onStartReview} className="gap-2">
            <PlayCircle className="h-4 w-4" />
            Start Review
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {items.map(({ problem, review }) => (
            <div
              key={problem.id}
              className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
            >
              <div className="flex-1 min-w-0 mr-4">
                <Link
                  to={`/problems/${problem.id}`}
                  className="font-medium text-foreground hover:text-primary transition-colors truncate block"
                >
                  {problem.title}
                </Link>
                <div className="flex items-center gap-2 mt-1">
                  <TopicBadge topic={problem.topic} className="text-xs" />
                  <DifficultyBadge difficulty={problem.difficulty} className="text-xs" />
                </div>
              </div>
              <div className="text-xs text-muted-foreground text-right shrink-0">
                {review.repetitions === 0 ? (
                  <span className="flex items-center gap-1">
                    <BookOpen className="h-3 w-3" />
                    New
                  </span>
                ) : (
                  <span>
                    {review.lastReviewed
                      ? `Last: ${format(review.lastReviewed, 'MMM d')}`
                      : 'New'}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export type { DueTodayProps, DueItem };
