// components/FilterBar.tsx - Filter bar with topic, difficulty, status dropdowns and search

import { forwardRef } from 'react';
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
import { getTopicOptions } from '@/data/topics';
import { DIFFICULTIES, STATUSES } from '@/types';
import type { TopicSlug, Difficulty, Status, ProblemFilters } from '@/types';

interface FilterBarProps {
  /** Current filter values */
  filters: ProblemFilters;
  /** Called when topic filter changes */
  onTopicChange: (topic: TopicSlug | null) => void;
  /** Called when difficulty filter changes */
  onDifficultyChange: (difficulty: Difficulty | null) => void;
  /** Called when status filter changes */
  onStatusChange: (status: Status | null) => void;
  /** Called when search text changes */
  onSearchChange: (search: string) => void;
  /** Called when clear all button clicked */
  onClearAll: () => void;
  /** Whether any filter is active */
  hasActiveFilters: boolean;
}

const topicOptions = getTopicOptions();

const difficultyLabels: Record<Difficulty, string> = {
  easy: 'Easy',
  medium: 'Medium',
  hard: 'Hard',
};

const statusLabels: Record<Status, string> = {
  unsolved: 'Unsolved',
  attempted: 'Attempted',
  solved: 'Solved',
};

const FilterBar = forwardRef<HTMLInputElement, FilterBarProps>(function FilterBar({
  filters,
  onTopicChange,
  onDifficultyChange,
  onStatusChange,
  onSearchChange,
  onClearAll,
  hasActiveFilters,
}, ref) {
  return (
    <div className="space-y-4">
      {/* Search and Clear Row */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            ref={ref}
            type="text"
            placeholder="Search problems... (press / to focus)"
            value={filters.search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
        {hasActiveFilters && (
          <Button variant="outline" size="sm" onClick={onClearAll}>
            <X className="h-4 w-4 mr-1" />
            Clear All
          </Button>
        )}
      </div>

      {/* Filter Dropdowns Row */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Topic Filter */}
        <Select
          value={filters.topic ?? 'all'}
          onValueChange={(value) =>
            onTopicChange(value === 'all' ? null : (value as TopicSlug))
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Topics" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Topics</SelectItem>
            {topicOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Difficulty Filter */}
        <Select
          value={filters.difficulty ?? 'all'}
          onValueChange={(value) =>
            onDifficultyChange(value === 'all' ? null : (value as Difficulty))
          }
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="All Difficulties" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Difficulties</SelectItem>
            {DIFFICULTIES.map((difficulty) => (
              <SelectItem key={difficulty} value={difficulty}>
                {difficultyLabels[difficulty]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Status Filter */}
        <Select
          value={filters.status ?? 'all'}
          onValueChange={(value) =>
            onStatusChange(value === 'all' ? null : (value as Status))
          }
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {STATUSES.map((status) => (
              <SelectItem key={status} value={status}>
                {statusLabels[status]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
});

export { FilterBar };
