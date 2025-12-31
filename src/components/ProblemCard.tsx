// components/ProblemCard.tsx - Card displaying problem details with badges

import { Link, useNavigate } from 'react-router-dom';
import { ExternalLink, Pencil, Trash2, Code, Check, ChevronDown, BookOpen } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
    badgeClassName: 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700',
  },
  attempted: {
    label: 'Attempted',
    badgeClassName: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800',
  },
  solved: {
    label: 'Solved',
    badgeClassName: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 border-green-200 dark:border-green-800',
  },
};

const allStatuses: Status[] = ['unsolved', 'attempted', 'solved'];

function ProblemCard({ problem, onEdit, onDelete, onStatusChange }: ProblemCardProps) {
  const { label, badgeClassName } = statusConfig[problem.status];
  const navigate = useNavigate();

  // Navigate to problem details when card is clicked
  const handleCardClick = (e: React.MouseEvent) => {
    // Don't navigate if clicking on interactive elements
    const target = e.target as HTMLElement;
    if (
      target.closest('a') ||
      target.closest('button') ||
      target.closest('[role="menuitem"]')
    ) {
      return;
    }
    navigate(`/problems/${problem.id}`);
  };

  return (
    <Card 
      className="transition-shadow hover:shadow-md cursor-pointer"
      onClick={handleCardClick}
    >
      <CardHeader className="pb-2">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
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
          <div className="flex items-center gap-1 shrink-0 -ml-1 sm:ml-0">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  asChild
                  aria-label="View solutions"
                  className="h-9 w-9 sm:h-8 sm:w-8 touch-manipulation"
                >
                  <Link to={`/problems/${problem.id}`}>
                    <Code className="h-4 w-4" />
                  </Link>
                </Button>
              </TooltipTrigger>
              <TooltipContent>View solutions</TooltipContent>
            </Tooltip>
            <DropdownMenu modal={false}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-9 sm:h-7 px-2 text-xs gap-1 touch-manipulation"
                      aria-label="Change status"
                    >
                      <Check className="h-3.5 w-3.5" />
                      <ChevronDown className="h-3 w-3" />
                    </Button>
                  </DropdownMenuTrigger>
                </TooltipTrigger>
                <TooltipContent>Change status</TooltipContent>
              </Tooltip>
              <DropdownMenuContent align="start">
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
                  className="h-9 w-9 sm:h-8 sm:w-8 touch-manipulation"
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
                  className="h-9 w-9 sm:h-8 sm:w-8 touch-manipulation"
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
          {problem.resources && problem.resources.length > 0 && (
            <Badge variant="outline" className="gap-1">
              <BookOpen className="h-3 w-3" />
              {problem.resources.length}
            </Badge>
          )}
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
