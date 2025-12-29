// components/TopicProgressCard.tsx - Individual topic in the progress ladder

import { Lock, Check, ChevronRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { TopicProgress } from '@/types';

interface TopicProgressCardProps {
  /** Topic progress data */
  progress: TopicProgress;
  /** Whether this is the current/active topic */
  isActive?: boolean;
  /** Position in the ladder (1-indexed) */
  position: number;
  /** Called when clicked */
  onClick?: () => void;
}

/**
 * Card showing topic progress in the ladder visualization
 */
export function TopicProgressCard({
  progress,
  isActive = false,
  position,
  onClick,
}: TopicProgressCardProps) {
  const { topicName, totalProblems, solvedProblems, masteryPercent, unlocked } = progress;

  // Determine status for styling
  const isComplete = masteryPercent >= 70;
  const hasProgress = solvedProblems > 0;

  // Progress bar width
  const progressWidth = `${masteryPercent}%`;

  return (
    <Card
      className={cn(
        'relative overflow-hidden transition-all cursor-pointer',
        isActive && 'ring-2 ring-primary',
        !unlocked && 'opacity-60',
        unlocked && 'hover:shadow-md'
      )}
      onClick={onClick}
    >
      {/* Progress bar background */}
      <div
        className={cn(
          'absolute inset-0 transition-all',
          isComplete ? 'bg-green-100 dark:bg-green-900/30' : hasProgress ? 'bg-primary/10' : 'bg-transparent'
        )}
        style={{ width: progressWidth }}
      />

      <CardContent className="relative p-4">
        <div className="flex items-center gap-4">
          {/* Position number / status icon */}
          <div
            className={cn(
              'flex items-center justify-center w-10 h-10 rounded-full text-sm font-bold',
              !unlocked && 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400',
              unlocked && !isComplete && 'bg-primary/20 text-primary',
              isComplete && 'bg-green-500 text-white'
            )}
          >
            {!unlocked ? (
              <Lock className="h-4 w-4" />
            ) : isComplete ? (
              <Check className="h-5 w-5" />
            ) : (
              position
            )}
          </div>

          {/* Topic info */}
          <div className="flex-1 min-w-0">
            <h3 className={cn(
              'font-medium truncate',
              !unlocked && 'text-muted-foreground'
            )}>
              {topicName}
            </h3>
            <p className="text-sm text-muted-foreground">
              {unlocked ? (
                totalProblems > 0 ? (
                  `${solvedProblems} / ${totalProblems} solved (${masteryPercent}%)`
                ) : (
                  'No problems added yet'
                )
              ) : (
                'Complete previous topic to unlock'
              )}
            </p>
          </div>

          {/* Action indicator */}
          {unlocked && (
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export type { TopicProgressCardProps };
