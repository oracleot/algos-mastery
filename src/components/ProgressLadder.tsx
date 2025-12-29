// components/ProgressLadder.tsx - Visual progression ladder for all topics

import { TopicProgressCard } from '@/components/TopicProgressCard';
import { cn } from '@/lib/utils';
import type { TopicProgress, TopicSlug } from '@/types';

interface ProgressLadderProps {
  /** Progress data for all topics */
  progress: TopicProgress[];
  /** Called when a topic is clicked */
  onTopicClick?: (topic: TopicSlug) => void;
  /** Orientation */
  orientation?: 'vertical' | 'horizontal';
}

/**
 * Visual ladder showing progress through all algorithm topics
 */
export function ProgressLadder({
  progress,
  onTopicClick,
  orientation = 'vertical',
}: ProgressLadderProps) {
  // Find the current active topic (first unlocked topic not yet at 70%)
  const activeTopicIndex = progress.findIndex(
    (p) => p.unlocked && p.masteryPercent < 70
  );

  // Calculate overall stats
  const totalTopics = progress.length;
  const completedTopics = progress.filter((p) => p.masteryPercent >= 70).length;
  const overallPercent = Math.round((completedTopics / totalTopics) * 100);

  return (
    <div className="space-y-6">
      {/* Overall Progress Summary */}
      <div className="bg-card border rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Overall Progress</h2>
          <span className="text-2xl font-bold text-primary">{overallPercent}%</span>
        </div>
        
        {/* Progress bar */}
        <div className="h-3 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-500"
            style={{ width: `${overallPercent}%` }}
          />
        </div>
        
        <p className="text-sm text-muted-foreground mt-2">
          {completedTopics} of {totalTopics} topics mastered (70%+ solved)
        </p>
      </div>

      {/* Topic Ladder */}
      <div
        className={cn(
          orientation === 'vertical' 
            ? 'space-y-3' 
            : 'flex gap-3 overflow-x-auto pb-4'
        )}
      >
        {progress.map((topicProgress, index) => (
          <div
            key={topicProgress.topic}
            className={cn(
              orientation === 'horizontal' && 'flex-shrink-0 w-72'
            )}
          >
            <TopicProgressCard
              progress={topicProgress}
              position={index + 1}
              isActive={index === activeTopicIndex}
              onClick={() => onTopicClick?.(topicProgress.topic)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export type { ProgressLadderProps };
