// components/ProblemList.tsx - List component rendering array of ProblemCards

import { ProblemCard } from '@/components/ProblemCard';
import type { Problem, Status } from '@/types';

interface ProblemListProps {
  /** Problems to display */
  problems: Problem[];
  /** Called when user clicks edit on a problem */
  onEdit: (problem: Problem) => void;
  /** Called when user wants to delete a problem */
  onDelete: (id: string) => void;
  /** Called when user changes problem status */
  onStatusChange: (id: string, status: Status) => void;
  /** Whether any operation is in progress */
  isLoading?: boolean;
}

function ProblemList({
  problems,
  onEdit,
  onDelete,
  onStatusChange,
  isLoading,
}: ProblemListProps) {
  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-40 rounded-xl border bg-card animate-pulse"
            aria-hidden="true"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {problems.map((problem) => (
        <ProblemCard
          key={problem.id}
          problem={problem}
          onEdit={() => onEdit(problem)}
          onDelete={() => onDelete(problem.id)}
          onStatusChange={(status) => onStatusChange(problem.id, status)}
        />
      ))}
    </div>
  );
}

export { ProblemList };
export type { ProblemListProps };
