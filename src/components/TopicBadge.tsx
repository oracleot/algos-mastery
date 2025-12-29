// components/TopicBadge.tsx - Badge for displaying topic labels

import { Badge } from '@/components/ui/badge';
import { getTopicName } from '@/data/topics';
import { cn } from '@/lib/utils';
import type { TopicSlug } from '@/types';

interface TopicBadgeProps {
  /** Topic slug to display */
  topic: TopicSlug;
  /** Optional mastery percentage to display */
  masteryPercent?: number;
  /** Whether the topic is unlocked (affects styling) */
  unlocked?: boolean;
  /** Additional CSS classes */
  className?: string;
}

function TopicBadge({ topic, masteryPercent, unlocked = true, className }: TopicBadgeProps) {
  const name = getTopicName(topic);

  // If mastery info is provided, show it
  const showMastery = masteryPercent !== undefined;
  const displayText = showMastery ? `${name} (${masteryPercent}%)` : name;

  return (
    <Badge 
      variant="secondary" 
      className={cn(
        !unlocked && 'opacity-50',
        className
      )}
    >
      {displayText}
    </Badge>
  );
}

export { TopicBadge };
export type { TopicBadgeProps };
