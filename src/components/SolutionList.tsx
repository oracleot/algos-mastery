// components/SolutionList.tsx - List of solutions for a problem

import { Code } from 'lucide-react';
import { SolutionCard } from '@/components/SolutionCard';
import { EmptyState } from '@/components/EmptyState';
import type { Solution, SupportedLanguage } from '@/types';

interface SolutionListProps {
  /** Solutions to display */
  solutions: Solution[];
  /** Whether solutions are loading */
  isLoading?: boolean;
  /** Called when user updates a solution */
  onUpdate: (id: string, data: { code: string; language: SupportedLanguage }) => Promise<void>;
  /** Called when user deletes a solution */
  onDelete: (id: string) => Promise<void>;
  /** Called when user wants to add a solution */
  onAdd: () => void;
}

/**
 * Displays a list of solutions with loading and empty states
 */
export function SolutionList({
  solutions,
  isLoading = false,
  onUpdate,
  onDelete,
  onAdd,
}: SolutionListProps) {
  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="h-24 bg-muted animate-pulse rounded-lg"
            aria-label="Loading solution"
          />
        ))}
      </div>
    );
  }

  // Empty state
  if (solutions.length === 0) {
    return (
      <EmptyState
        icon={<Code className="h-12 w-12" />}
        title="No solutions yet"
        description="Add your first solution to track your progress on this problem."
        action={{
          label: 'Add Solution',
          onClick: onAdd,
        }}
      />
    );
  }

  // Solutions list
  return (
    <div className="space-y-4">
      {solutions.map((solution, index) => (
        <SolutionCard
          key={solution.id}
          solution={solution}
          expanded={index === 0} // First solution is expanded by default
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}

export type { SolutionListProps };
