// components/CatalogCard.tsx - Card component for catalog problems

import { ExternalLink, Plus, Check } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DifficultyBadge } from '@/components/DifficultyBadge';
import { TopicBadge } from '@/components/TopicBadge';
import { SourceBadge } from '@/components/SourceBadge';
import type { CatalogProblem } from '@/types';

interface CatalogCardProps {
  /** The catalog problem to display */
  problem: CatalogProblem;
  /** Whether this problem is already in user's list */
  isAdded: boolean;
  /** Callback when user clicks "Add to My Problems" */
  onAdd: () => void;
}

function CatalogCard({ problem, isAdded, onAdd }: CatalogCardProps) {
  return (
    <Card className="flex flex-col gap-3 py-4">
      <CardContent className="flex flex-col gap-3 p-0 px-4">
        {/* Title and external link */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-sm leading-tight line-clamp-2">
              {problem.leetcodeNumber && (
                <span className="text-muted-foreground mr-1">
                  #{problem.leetcodeNumber}
                </span>
              )}
              {problem.title}
            </h3>
          </div>
          <a
            href={problem.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground transition-colors flex-shrink-0"
            aria-label={`Open ${problem.title} on LeetCode`}
          >
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-1.5">
          <DifficultyBadge difficulty={problem.difficulty} />
          <TopicBadge topic={problem.topic} />
          <SourceBadge source={problem.source} />
        </div>

        {/* Add button */}
        <div className="pt-1">
          {isAdded ? (
            <Button
              variant="secondary"
              size="sm"
              className="w-full gap-1.5"
              disabled
            >
              <Check className="h-4 w-4" />
              Already Added
            </Button>
          ) : (
            <Button
              variant="default"
              size="sm"
              className="w-full gap-1.5"
              onClick={onAdd}
            >
              <Plus className="h-4 w-4" />
              Add to My Problems
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export { CatalogCard };
export type { CatalogCardProps };
