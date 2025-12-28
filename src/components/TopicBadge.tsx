// components/TopicBadge.tsx - Badge for displaying topic labels

import { Badge } from '@/components/ui/badge';
import { getTopicName } from '@/data/topics';
import type { TopicSlug } from '@/types';

interface TopicBadgeProps {
  /** Topic slug to display */
  topic: TopicSlug;
  /** Additional CSS classes */
  className?: string;
}

function TopicBadge({ topic, className }: TopicBadgeProps) {
  const name = getTopicName(topic);

  return (
    <Badge variant="secondary" className={className}>
      {name}
    </Badge>
  );
}

export { TopicBadge };
export type { TopicBadgeProps };
