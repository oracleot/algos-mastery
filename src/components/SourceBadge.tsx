// components/SourceBadge.tsx - Badge with color coding for problem source

import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { CatalogSource } from '@/types';

interface SourceBadgeProps {
  /** The source to display */
  source: CatalogSource;
  /** Additional CSS classes */
  className?: string;
}

const sourceStyles: Record<CatalogSource, { className: string; label: string }> = {
  'blind-75': {
    className:
      'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-400 border-purple-200 dark:border-purple-800 hover:bg-purple-100 dark:hover:bg-purple-900/40',
    label: 'Blind 75',
  },
  'neetcode-150': {
    className:
      'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/40',
    label: 'NeetCode 150',
  },
  'grind-75': {
    className:
      'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/40',
    label: 'Grind 75',
  },
  curated: {
    className:
      'bg-gray-100 dark:bg-gray-800/50 text-gray-700 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800/60',
    label: 'Curated',
  },
};

function SourceBadge({ source, className }: SourceBadgeProps) {
  const styles = sourceStyles[source];

  return (
    <Badge variant="outline" className={cn(styles.className, className)}>
      {styles.label}
    </Badge>
  );
}

export { SourceBadge };
export type { SourceBadgeProps };
