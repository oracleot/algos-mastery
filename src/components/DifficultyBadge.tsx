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
    className: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 border-green-200 dark:border-green-800 hover:bg-green-100 dark:hover:bg-green-900/40',
    label: 'Easy',
  },
  medium: {
    className: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800 hover:bg-yellow-100 dark:hover:bg-yellow-900/40',
    label: 'Medium',
  },
  hard: {
    className: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400 border-red-200 dark:border-red-800 hover:bg-red-100 dark:hover:bg-red-900/40',
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
