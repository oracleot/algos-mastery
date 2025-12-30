// components/CatalogRecommendationRow.tsx - Compact row for catalog recommendations on Dashboard

import { ExternalLink, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DifficultyBadge } from '@/components/DifficultyBadge';
import { TopicBadge } from '@/components/TopicBadge';
import type { CatalogProblem } from '@/types';

interface CatalogRecommendationRowProps {
  /** The catalog problem to display */
  problem: CatalogProblem;
  /** Callback when user clicks "Add" */
  onAdd: () => void;
}

/**
 * Compact row component for displaying a catalog problem recommendation
 * Used in the Dashboard's "Recommended to Add" section
 */
function CatalogRecommendationRow({ problem, onAdd }: CatalogRecommendationRowProps) {
  return (
    <div className="flex items-center justify-between gap-3 py-2 px-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
      {/* Problem info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h4 className="text-sm font-medium truncate">
            {problem.leetcodeNumber && (
              <span className="text-muted-foreground mr-1">
                #{problem.leetcodeNumber}
              </span>
            )}
            {problem.title}
          </h4>
          <a
            href={problem.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground transition-colors flex-shrink-0"
            aria-label={`Open ${problem.title} on LeetCode`}
          >
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
        <div className="flex flex-wrap gap-1">
          <DifficultyBadge difficulty={problem.difficulty} />
          <TopicBadge topic={problem.topic} />
        </div>
      </div>

      {/* Add button */}
      <Button
        variant="outline"
        size="sm"
        className="flex-shrink-0 gap-1"
        onClick={onAdd}
      >
        <Plus className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">Add</span>
      </Button>
    </div>
  );
}

export { CatalogRecommendationRow };
export type { CatalogRecommendationRowProps };
