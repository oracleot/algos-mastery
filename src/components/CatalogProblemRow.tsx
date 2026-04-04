// components/CatalogProblemRow.tsx - Compact horizontal problem row with difficulty bar

import { ExternalLink, Plus, Check, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SourceBadge } from '@/components/SourceBadge';
import { cn } from '@/lib/utils';
import type { CatalogProblem } from '@/types';

interface CatalogProblemRowProps {
  /** The catalog problem to display */
  problem: CatalogProblem;
  /** Whether this problem is already in user's list */
  isAdded: boolean;
  /** Callback when user clicks add */
  onAdd: () => void;
  /** Whether this is the recommended next problem for this topic */
  isRecommended?: boolean;
  /** Search term for highlighting matching text */
  searchTerm?: string;
}

const difficultyBar: Record<string, string> = {
  easy: 'bg-green-500',
  medium: 'bg-yellow-500',
  hard: 'bg-red-500',
};

const difficultyLabel: Record<string, string> = {
  easy: 'E',
  medium: 'M',
  hard: 'H',
};

const difficultyTextColor: Record<string, string> = {
  easy: 'text-green-600 dark:text-green-400',
  medium: 'text-yellow-600 dark:text-yellow-400',
  hard: 'text-red-600 dark:text-red-400',
};

/** Highlight search term inside a string — returns spans */
function HighlightedText({
  text,
  term,
}: {
  text: string;
  term: string;
}) {
  if (!term.trim()) return <>{text}</>;
  const idx = text.toLowerCase().indexOf(term.toLowerCase());
  if (idx === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, idx)}
      <mark className="bg-yellow-200 dark:bg-yellow-800/60 text-inherit rounded-sm px-0.5">
        {text.slice(idx, idx + term.length)}
      </mark>
      {text.slice(idx + term.length)}
    </>
  );
}

function CatalogProblemRow({
  problem,
  isAdded,
  onAdd,
  isRecommended = false,
  searchTerm = '',
}: CatalogProblemRowProps) {
  return (
    <div
      className={cn(
        'group flex items-center gap-0 rounded-lg border bg-card transition-colors',
        'hover:bg-accent/40 hover:border-accent-foreground/10',
        isRecommended && 'border-primary/30 bg-primary/5 hover:bg-primary/10',
        isAdded && 'opacity-70'
      )}
    >
      {/* Difficulty color bar */}
      <div
        className={cn(
          'w-1 self-stretch rounded-l-lg flex-shrink-0',
          difficultyBar[problem.difficulty]
        )}
        aria-hidden="true"
      />

      {/* Main content */}
      <div className="flex flex-1 items-center gap-3 px-3 py-2.5 min-w-0">
        {/* Difficulty letter badge */}
        <span
          className={cn(
            'text-xs font-bold w-4 flex-shrink-0 text-center tabular-nums',
            difficultyTextColor[problem.difficulty]
          )}
          aria-label={problem.difficulty}
        >
          {difficultyLabel[problem.difficulty]}
        </span>

        {/* Problem title */}
        <div className="flex-1 min-w-0">
          <span className="text-sm font-medium leading-snug line-clamp-1">
            {problem.leetcodeNumber && (
              <span className="text-muted-foreground mr-1.5 text-xs tabular-nums">
                #{problem.leetcodeNumber}
              </span>
            )}
            <HighlightedText text={problem.title} term={searchTerm} />
          </span>
        </div>

        {/* Source badge */}
        <div className="hidden sm:flex flex-shrink-0">
          <SourceBadge source={problem.source} className="text-[10px] px-1.5 py-0 h-5" />
        </div>

        {/* Recommended star */}
        {isRecommended && (
          <span
            className="flex-shrink-0 text-primary"
            title="Recommended next"
            aria-label="Recommended next problem"
          >
            <Star className="h-3.5 w-3.5 fill-primary" />
          </span>
        )}

        {/* External link */}
        <a
          href={problem.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-shrink-0 text-muted-foreground hover:text-foreground transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
          aria-label={`Open ${problem.title} on LeetCode`}
          onClick={(e) => e.stopPropagation()}
        >
          <ExternalLink className="h-3.5 w-3.5" />
        </a>

        {/* Add button */}
        {isAdded ? (
          <Button
            variant="ghost"
            size="sm"
            className="flex-shrink-0 gap-1 h-7 px-2 text-xs text-green-600 dark:text-green-400 cursor-default"
            disabled
            aria-label="Already added"
          >
            <Check className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Added</span>
          </Button>
        ) : (
          <Button
            variant="outline"
            size="sm"
            className="flex-shrink-0 gap-1 h-7 px-2 text-xs"
            onClick={onAdd}
            aria-label={`Add ${problem.title} to my problems`}
          >
            <Plus className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Add</span>
          </Button>
        )}
      </div>
    </div>
  );
}

export { CatalogProblemRow };
export type { CatalogProblemRowProps };
