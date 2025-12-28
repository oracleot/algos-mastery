// components/DifficultyBadge.tsx - Badge with color coding for difficulty

import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { Difficulty } from '@/types';

interface DifficultyBadgeProps {
  /** Difficulty level to display */
  difficulty: Difficulty;
  /** Additional CSS classes */
  className?: string;
}

const difficultyStyles: Record<Difficulty, { className: string; label: string }> = {
  easy: {
    className: 'bg-green-100 text-green-800 border-green-200 hover:bg-green-100',
    label: 'Easy',
  },
  medium: {
    className: 'bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-100',
    label: 'Medium',
  },
  hard: {
    className: 'bg-red-100 text-red-800 border-red-200 hover:bg-red-100',
    label: 'Hard',
  },
};

function DifficultyBadge({ difficulty, className }: DifficultyBadgeProps) {
  const styles = difficultyStyles[difficulty];

  return (
    <Badge variant="outline" className={cn(styles.className, className)}>
      {styles.label}
    </Badge>
  );
}

export { DifficultyBadge };
export type { DifficultyBadgeProps };
