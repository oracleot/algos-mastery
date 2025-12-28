// components/ProblemCard.tsx - Card displaying problem details with badges

import { ExternalLink, Pencil, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TopicBadge } from '@/components/TopicBadge';
import { DifficultyBadge } from '@/components/DifficultyBadge';
import { cn } from '@/lib/utils';
import type { Problem, Status } from '@/types';

interface ProblemCardProps {
  /** Problem to display */
  problem: Problem;
  /** Called when edit button clicked */
  onEdit: () => void;
  /** Called when delete button clicked */
  onDelete: () => void;
  /** Called when status button clicked */
  onStatusChange: (status: Status) => void;
}

const statusConfig: Record<Status, { label: string; className: string; next: Status }> = {
  unsolved: {
    label: 'Unsolved',
    className: 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-200',
    next: 'attempted',
  },
  attempted: {
    label: 'Attempted',
    className: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200 border-yellow-200',
    next: 'solved',
  },
  solved: {
    label: 'Solved',
    className: 'bg-green-100 text-green-800 hover:bg-green-200 border-green-200',
    next: 'unsolved',
  },
};

function ProblemCard({ problem, onEdit, onDelete, onStatusChange }: ProblemCardProps) {
  const { label, className, next } = statusConfig[problem.status];

  const handleStatusClick = () => {
    onStatusChange(next);
  };

  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-base font-medium leading-tight">
              {problem.url ? (
                <a
                  href={problem.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary inline-flex items-center gap-1"
                >
                  {problem.title}
                  <ExternalLink className="h-3.5 w-3.5 shrink-0" />
                </a>
              ) : (
                problem.title
              )}
            </CardTitle>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={onEdit}
              aria-label="Edit problem"
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={onDelete}
              aria-label="Delete problem"
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-2 space-y-3">
        {/* Badges Row */}
        <div className="flex flex-wrap items-center gap-2">
          <TopicBadge topic={problem.topic} />
          <DifficultyBadge difficulty={problem.difficulty} />
          <button
            onClick={handleStatusClick}
            className={cn(
              'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold',
              'transition-colors cursor-pointer',
              className
            )}
            aria-label={`Status: ${label}. Click to change to ${statusConfig[next].label}`}
          >
            {label}
          </button>
        </div>

        {/* Notes */}
        {problem.notes && (
          <p className="text-sm text-muted-foreground line-clamp-2">{problem.notes}</p>
        )}
      </CardContent>
    </Card>
  );
}

export { ProblemCard };
export type { ProblemCardProps };
