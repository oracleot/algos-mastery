// components/SuggestedNext.tsx - Suggested next problem to work on

import { RefreshCw, Lightbulb, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { Problem, TopicProgress } from '@/types';

interface SuggestedNextProps {
  /** Suggested problem */
  problem: Problem | null;

  /** Topic it's from */
  topic: TopicProgress | null;

  /** Reason for suggestion */
  reason: string;

  /** Called when problem is clicked */
  onSelect: (problem: Problem) => void;

  /** Called when refresh is clicked */
  onRefresh: () => void;
}

/**
 * Card showing a suggested problem to work on next
 * Based on weakest topic analysis
 */
export function SuggestedNext({
  problem,
  topic,
  reason,
  onSelect,
  onRefresh,
}: SuggestedNextProps) {
  if (!problem) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-yellow-500" />
            Suggested Next
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">{reason}</p>
        </CardContent>
      </Card>
    );
  }

  const difficultyColors = {
    easy: 'bg-green-100 text-green-700',
    medium: 'bg-yellow-100 text-yellow-700',
    hard: 'bg-red-100 text-red-700',
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-yellow-500" />
            Suggested Next
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onRefresh}
            className="h-8 w-8 p-0"
            aria-label="Get different suggestion"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground">{reason}</p>

        <button
          onClick={() => onSelect(problem)}
          className={cn(
            'w-full text-left p-3 rounded-lg border bg-background',
            'hover:bg-muted transition-colors group'
          )}
        >
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <h4 className="font-medium truncate group-hover:text-primary transition-colors">
                {problem.title}
              </h4>
              <div className="flex items-center gap-2 mt-1">
                <Badge
                  variant="secondary"
                  className={cn('text-xs', difficultyColors[problem.difficulty])}
                >
                  {problem.difficulty}
                </Badge>
                {topic && (
                  <span className="text-xs text-muted-foreground">
                    {topic.topicName}
                  </span>
                )}
              </div>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors mt-1" />
          </div>
        </button>
      </CardContent>
    </Card>
  );
}

export type { SuggestedNextProps };
