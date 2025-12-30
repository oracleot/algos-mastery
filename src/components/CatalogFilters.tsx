// components/CatalogFilters.tsx - Filter bar for catalog page

import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { TOPICS } from '@/data/topics';
import { DIFFICULTIES, CATALOG_SOURCES, type TopicSlug, type Difficulty, type CatalogSource, type CatalogFilters as CatalogFiltersType } from '@/types';

interface CatalogFiltersProps {
  /** Current filter values */
  filters: CatalogFiltersType;
  /** Called when topic filter changes */
  onTopicChange: (topic: TopicSlug | null) => void;
  /** Called when difficulty filter changes */
  onDifficultyChange: (difficulty: Difficulty | null) => void;
  /** Called when source filter changes */
  onSourceChange: (source: CatalogSource | null) => void;
  /** Called when search text changes */
  onSearchChange: (search: string) => void;
  /** Called when clear all button clicked */
  onClearAll: () => void;
  /** Whether any filter is active */
  hasActiveFilters: boolean;
}

const sourceLabels: Record<CatalogSource, string> = {
  'blind-75': 'Blind 75',
  'neetcode-150': 'NeetCode 150',
  'grind-75': 'Grind 75',
  curated: 'Curated',
};

const difficultyLabels: Record<Difficulty, string> = {
  easy: 'Easy',
  medium: 'Medium',
  hard: 'Hard',
};

function CatalogFilters({
  filters,
  onTopicChange,
  onDifficultyChange,
  onSourceChange,
  onSearchChange,
  onClearAll,
  hasActiveFilters,
}: CatalogFiltersProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
      {/* Search input */}
      <div className="relative flex-1 min-w-[200px] sm:max-w-xs">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search problems..."
          value={filters.search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Topic filter */}
      <Select
        value={filters.topic ?? 'all'}
        onValueChange={(value) =>
          onTopicChange(value === 'all' ? null : (value as TopicSlug))
        }
      >
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder="All Topics" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Topics</SelectItem>
          {TOPICS.map((topic) => (
            <SelectItem key={topic.slug} value={topic.slug}>
              {topic.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Difficulty filter */}
      <Select
        value={filters.difficulty ?? 'all'}
        onValueChange={(value) =>
          onDifficultyChange(value === 'all' ? null : (value as Difficulty))
        }
      >
        <SelectTrigger className="w-full sm:w-[130px]">
          <SelectValue placeholder="All Difficulties" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Difficulties</SelectItem>
          {DIFFICULTIES.map((diff) => (
            <SelectItem key={diff} value={diff}>
              {difficultyLabels[diff]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Source filter */}
      <Select
        value={filters.source ?? 'all'}
        onValueChange={(value) =>
          onSourceChange(value === 'all' ? null : (value as CatalogSource))
        }
      >
        <SelectTrigger className="w-full sm:w-[150px]">
          <SelectValue placeholder="All Sources" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Sources</SelectItem>
          {CATALOG_SOURCES.map((source) => (
            <SelectItem key={source} value={source}>
              {sourceLabels[source]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Clear filters button */}
      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearAll}
          className="gap-1.5"
        >
          <X className="h-4 w-4" />
          Clear filters
        </Button>
      )}
    </div>
  );
}

export { CatalogFilters };
export type { CatalogFiltersProps };
