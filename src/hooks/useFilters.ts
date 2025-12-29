// hooks/useFilters.ts - Hook for managing problem list filters with URL sync

import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { TopicSlug, Difficulty, Status, ProblemFilters } from '@/types';
import { TOPIC_SLUGS, DIFFICULTIES, STATUSES } from '@/types';

interface UseFiltersReturn {
  /** Current filter state */
  filters: ProblemFilters;
  /** Set topic filter (null to clear) */
  setTopic: (topic: TopicSlug | null) => void;
  /** Set difficulty filter (null to clear) */
  setDifficulty: (difficulty: Difficulty | null) => void;
  /** Set status filter (null to clear) */
  setStatus: (status: Status | null) => void;
  /** Set search text */
  setSearch: (search: string) => void;
  /** Clear all filters */
  clearFilters: () => void;
  /** Check if any filter is active */
  hasActiveFilters: boolean;
}

// Type guards for validation
function isValidTopic(value: string | null): value is TopicSlug {
  return value !== null && (TOPIC_SLUGS as readonly string[]).includes(value);
}

function isValidDifficulty(value: string | null): value is Difficulty {
  return value !== null && (DIFFICULTIES as readonly string[]).includes(value);
}

function isValidStatus(value: string | null): value is Status {
  return value !== null && (STATUSES as readonly string[]).includes(value);
}

/**
 * Hook for managing problem list filters
 * Persists filter state in URL query params
 *
 * @returns Filter state and setters
 */
export function useFilters(): UseFiltersReturn {
  const [searchParams, setSearchParams] = useSearchParams();

  // Parse filters from URL
  const filters = useMemo<ProblemFilters>(() => {
    const topicParam = searchParams.get('topic');
    const difficultyParam = searchParams.get('difficulty');
    const statusParam = searchParams.get('status');
    const searchParam = searchParams.get('q') ?? '';

    return {
      topic: isValidTopic(topicParam) ? topicParam : null,
      difficulty: isValidDifficulty(difficultyParam) ? difficultyParam : null,
      status: isValidStatus(statusParam) ? statusParam : null,
      search: searchParam,
    };
  }, [searchParams]);

  // Check if any filter is active
  const hasActiveFilters = useMemo(() => {
    return (
      filters.topic !== null ||
      filters.difficulty !== null ||
      filters.status !== null ||
      filters.search.trim() !== ''
    );
  }, [filters]);

  // Update URL params helper
  const updateParam = useCallback(
    (key: string, value: string | null) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          if (value === null || value === '') {
            next.delete(key);
          } else {
            next.set(key, value);
          }
          return next;
        },
        { replace: true }
      );
    },
    [setSearchParams]
  );

  const setTopic = useCallback(
    (topic: TopicSlug | null) => {
      updateParam('topic', topic);
    },
    [updateParam]
  );

  const setDifficulty = useCallback(
    (difficulty: Difficulty | null) => {
      updateParam('difficulty', difficulty);
    },
    [updateParam]
  );

  const setStatus = useCallback(
    (status: Status | null) => {
      updateParam('status', status);
    },
    [updateParam]
  );

  const setSearch = useCallback(
    (search: string) => {
      updateParam('q', search.trim() || null);
    },
    [updateParam]
  );

  const clearFilters = useCallback(() => {
    setSearchParams({}, { replace: true });
  }, [setSearchParams]);

  return {
    filters,
    setTopic,
    setDifficulty,
    setStatus,
    setSearch,
    clearFilters,
    hasActiveFilters,
  };
}
