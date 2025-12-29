// components/NextToUnlock.tsx - Progress indicator for next topic to unlock

import { Lock, ArrowUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { TopicProgress } from '@/types';

interface NextToUnlockProps {
  /** Current progress of the topic being worked on */
  currentTopic: TopicProgress;

  /** Next topic to unlock */
  nextTopic: TopicProgress;

  /** Problems needed to unlock */
  problemsNeeded: number;
}

/**
 * Shows progress toward unlocking the next topic
 * Motivates users to complete current topic
 */
export function NextToUnlock({
  currentTopic,
  nextTopic,
  problemsNeeded,
}: NextToUnlockProps) {
  // Calculate how many more problems to solve for 70% mastery
  const targetSolved = Math.ceil(currentTopic.totalProblems * 0.7);
  const currentSolved = currentTopic.solvedProblems;
  const progressPercent = currentTopic.totalProblems > 0
    ? Math.min((currentSolved / targetSolved) * 100, 100)
    : 0;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Lock className="h-5 w-5 text-muted-foreground" />
          Next to Unlock
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Next topic info */}
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-muted">
            <Lock className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="flex-1">
            <h4 className="font-medium">{nextTopic.topicName}</h4>
            <p className="text-sm text-muted-foreground">
              {problemsNeeded} more problem{problemsNeeded !== 1 ? 's' : ''} to unlock
            </p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">
              Working on: {currentTopic.topicName}
            </span>
            <span className="font-medium">
              {currentSolved}/{targetSolved}
            </span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className={cn(
                'h-full rounded-full transition-all duration-500',
                progressPercent >= 100 ? 'bg-green-500' : 'bg-primary'
              )}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Solve {targetSolved - currentSolved > 0 ? targetSolved - currentSolved : 0} more to reach 70% mastery
          </p>
        </div>

        {/* Encouragement */}
        {progressPercent >= 50 && progressPercent < 100 && (
          <div className="flex items-center gap-2 text-sm text-primary">
            <ArrowUp className="h-4 w-4" />
            <span>You're more than halfway there!</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export type { NextToUnlockProps };
