// components/ProblemCard.tsx - Card displaying problem details with badges

import { Link } from 'react-router-dom';
import { ExternalLink, Pencil, Trash2, Code, Check, ChevronDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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

const statusConfig: Record<Status, { label: string; badgeClassName: string }> = {
  unsolved: {
    label: 'Unsolved',
    badgeClassName: 'bg-gray-100 text-gray-700 border-gray-200',
  },
  attempted: {
    label: 'Attempted',
    badgeClassName: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  },
  solved: {
    label: 'Solved',
    badgeClassName: 'bg-green-100 text-green-800 border-green-200',
  },
};

const allStatuses: Status[] = ['unsolved', 'attempted', 'solved'];

function ProblemCard({ problem, onEdit, onDelete, onStatusChange }: ProblemCardProps) {
  const { label, badgeClassName } = statusConfig[problem.status];

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
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  asChild
                  aria-label="View solutions"
                >
                  <Link to={`/problems/${problem.id}`}>
                    <Code className="h-4 w-4" />
                  </Link>
                </Button>
              </TooltipTrigger>
              <TooltipContent>View solutions</TooltipContent>
            </Tooltip>
            <DropdownMenu>
              <Tooltip>
                <TooltipTrigger asChild>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 px-2 text-xs gap-1"
                      aria-label="Change status"
                    >
                      <Check className="h-3.5 w-3.5" />
                      <ChevronDown className="h-3 w-3" />
                    </Button>
                  </DropdownMenuTrigger>
                </TooltipTrigger>
                <TooltipContent>Change status</TooltipContent>
              </Tooltip>
              <DropdownMenuContent align="end">
                {allStatuses.map((status) => (
                  <DropdownMenuItem
                    key={status}
                    onClick={() => onStatusChange(status)}
                    className={cn(
                      'cursor-pointer',
                      problem.status === status && 'bg-accent'
                    )}
                  >
                    <span
                      className={cn(
                        'inline-block w-2 h-2 rounded-full mr-2',
                        status === 'unsolved' && 'bg-gray-400',
                        status === 'attempted' && 'bg-yellow-500',
                        status === 'solved' && 'bg-green-500'
                      )}
                    />
                    {statusConfig[status].label}
                    {problem.status === status && (
                      <Check className="h-4 w-4 ml-auto" />
                    )}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={onEdit}
                  aria-label="Edit problem"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Edit problem</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={onDelete}
                  aria-label="Delete problem"
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Delete problem</TooltipContent>
            </Tooltip>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-2 space-y-3">
        {/* Badges Row */}
        <div className="flex flex-wrap items-center gap-2">
          <TopicBadge topic={problem.topic} />
          <DifficultyBadge difficulty={problem.difficulty} />
          <span
            className={cn(
              'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold',
              badgeClassName
            )}
          >
            {label}
          </span>
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
