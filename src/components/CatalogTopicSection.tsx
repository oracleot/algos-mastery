// components/CatalogTopicSection.tsx - Collapsible topic section with progress bar

import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CatalogProblemRow } from '@/components/CatalogProblemRow';
import type { TopicSection } from '@/hooks/useCatalogFilters';
import type { CatalogProblem } from '@/types';

// Topic icon mapping using emoji (fast, no extra imports)
const TOPIC_ICONS: Record<string, string> = {
  'arrays-hashing': '🗃️',
  'two-pointers': '👆',
  'sliding-window': '🪟',
  'stack': '📚',
  'binary-search': '🔍',
  'linked-list': '🔗',
  'trees': '🌲',
  'tries': '🌳',
  'backtracking': '↩️',
  'heap': '⛰️',
  'graphs': '🕸️',
  'dynamic-programming': '💡',
  'greedy': '🎯',
  'intervals': '📏',
  'bit-manipulation': '⚙️',
};

interface CatalogTopicSectionProps {
  section: TopicSection;
  isAdded: (url: string) => boolean;
  onAdd: (problem: CatalogProblem) => void;
  /** Force open when searching */
  forceOpen?: boolean;
  searchTerm?: string;
}

function CatalogTopicSection({
  section,
  isAdded,
  onAdd,
  forceOpen = false,
  searchTerm = '',
}: CatalogTopicSectionProps) {
  const [isOpen, setIsOpen] = useState(true);

  const open = forceOpen || isOpen;
  const icon = TOPIC_ICONS[section.slug] ?? '📌';
  const progressPct =
    section.totalInTopic > 0
      ? Math.round((section.addedCount / section.totalInTopic) * 100)
      : 0;
  const isComplete = progressPct === 100;

  return (
    <div
      className={cn(
        'rounded-xl border bg-card overflow-hidden transition-colors',
        isComplete && 'border-green-300 dark:border-green-800/50'
      )}
    >
      {/* Section header — click to toggle */}
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        className={cn(
          'w-full flex items-center gap-3 px-4 py-3 text-left',
          'hover:bg-accent/40 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1',
          open && 'border-b border-border'
        )}
        aria-expanded={open}
      >
        {/* Chevron */}
        <span className="flex-shrink-0 text-muted-foreground">
          {open ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </span>

        {/* Topic icon + name */}
        <span className="text-base leading-none flex-shrink-0" aria-hidden="true">
          {icon}
        </span>
        <span className="font-semibold text-sm text-foreground truncate">
          {section.name}
        </span>

        {/* Problem count badge */}
        <span className="ml-auto flex-shrink-0 text-xs text-muted-foreground tabular-nums bg-muted px-2 py-0.5 rounded-full">
          {section.problems.length === section.totalInTopic
            ? section.totalInTopic
            : `${section.problems.length}/${section.totalInTopic}`}
        </span>

        {/* Progress area */}
        <div className="flex-shrink-0 flex items-center gap-2 ml-3 hidden sm:flex">
          {/* Progress bar */}
          <div className="w-24 h-1.5 rounded-full bg-muted overflow-hidden">
            <div
              className={cn(
                'h-full rounded-full transition-all duration-500',
                isComplete ? 'bg-green-500' : 'bg-primary'
              )}
              style={{ width: `${progressPct}%` }}
            />
          </div>
          {/* x/y text */}
          <span
            className={cn(
              'text-xs tabular-nums',
              isComplete
                ? 'text-green-600 dark:text-green-400 font-medium'
                : 'text-muted-foreground'
            )}
          >
            {section.addedCount}/{section.totalInTopic}
          </span>
        </div>
      </button>

      {/* Problem list */}
      {open && (
        <div className="flex flex-col gap-1.5 p-3">
          {section.problems.map((problem) => (
            <CatalogProblemRow
              key={problem.id}
              problem={problem}
              isAdded={isAdded(problem.url)}
              onAdd={() => onAdd(problem)}
              isRecommended={
                section.recommended?.id === problem.id && !isAdded(problem.url)
              }
              searchTerm={searchTerm}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export { CatalogTopicSection };
export type { CatalogTopicSectionProps };
