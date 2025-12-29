// components/ReviewCard.tsx - Problem card in review mode

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RatingButtons } from '@/components/RatingButtons';
import { TopicBadge } from '@/components/TopicBadge';
import { DifficultyBadge } from '@/components/DifficultyBadge';
import { LANGUAGE_DISPLAY_NAMES } from '@/lib/editor';
import type { Problem, Solution, ReviewQuality } from '@/types';

interface ReviewCardProps {
  /** Problem being reviewed */
  problem: Problem;

  /** Solutions to show on reveal */
  solutions: Solution[];

  /** Whether solution is revealed */
  isRevealed: boolean;

  /** Called when reveal button clicked */
  onReveal: () => void;

  /** Called when rating is selected */
  onRate: (quality: ReviewQuality) => void;

  /** Preview of next intervals for each rating */
  intervalPreview: {
    again: number;
    hard: number;
    good: number;
    easy: number;
  };
}

/**
 * Problem card for review sessions with reveal and rating functionality
 */
export function ReviewCard({
  problem,
  solutions,
  isRevealed,
  onReveal,
  onRate,
  intervalPreview,
}: ReviewCardProps) {
  const [expandedSolutions, setExpandedSolutions] = useState<Set<string>>(new Set());

  const toggleSolution = (solutionId: string) => {
    setExpandedSolutions((prev) => {
      const next = new Set(prev);
      if (next.has(solutionId)) {
        next.delete(solutionId);
      } else {
        next.add(solutionId);
      }
      return next;
    });
  };

  return (
    <Card className="w-full">
      <CardHeader className="space-y-4">
        {/* Problem Title and Badges */}
        <div className="space-y-3">
          <CardTitle className="text-xl sm:text-2xl leading-tight">
            {problem.title}
          </CardTitle>
          <div className="flex flex-wrap items-center gap-2">
            <TopicBadge topic={problem.topic} />
            <DifficultyBadge difficulty={problem.difficulty} />
          </div>
        </div>

        {/* Problem URL */}
        {problem.url && (
          <a
            href={problem.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
          >
            View Problem <ExternalLink className="h-3 w-3" />
          </a>
        )}

        {/* Problem Notes */}
        {problem.notes && (
          <div className="bg-muted/50 p-3 rounded-md">
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
              {problem.notes}
            </p>
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Reveal Button or Solutions */}
        {!isRevealed ? (
          <div className="flex flex-col items-center py-8">
            <p className="text-muted-foreground mb-4 text-center">
              Try to recall your solution before revealing
            </p>
            <Button
              onClick={onReveal}
              size="lg"
              variant="outline"
              className="gap-2"
            >
              <Eye className="h-5 w-5" />
              Show Solution
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
              Your Solutions ({solutions.length})
            </h3>

            {solutions.length === 0 ? (
              <div className="text-center py-6 bg-muted/50 rounded-lg">
                <p className="text-muted-foreground mb-2">
                  No solutions recorded for this problem
                </p>
                <Button variant="link" asChild>
                  <Link to={`/problems/${problem.id}`}>Add a solution</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {solutions.map((solution) => {
                  const isExpanded = expandedSolutions.has(solution.id);
                  return (
                    <div
                      key={solution.id}
                      className="border rounded-lg overflow-hidden"
                    >
                      <button
                        onClick={() => toggleSolution(solution.id)}
                        className="w-full flex items-center justify-between p-3 bg-muted/30 hover:bg-muted/50 transition-colors"
                      >
                        <span className="font-medium text-sm">
                          {LANGUAGE_DISPLAY_NAMES[solution.language]}
                        </span>
                        {isExpanded ? (
                          <ChevronUp className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <ChevronDown className="h-4 w-4 text-muted-foreground" />
                        )}
                      </button>
                      {isExpanded && (
                        <pre className="text-sm p-4 overflow-x-auto bg-background">
                          <code>{solution.code}</code>
                        </pre>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Rating Section */}
            <div className="pt-4 border-t">
              <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-3">
                How well did you recall?
              </h3>
              <RatingButtons
                onRate={onRate}
                intervals={intervalPreview}
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export type { ReviewCardProps };
