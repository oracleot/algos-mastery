// hooks/useSuggestedProblem.ts - Hook for suggested next problem

import { useState, useCallback } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { getSuggestedProblem } from '@/lib/db';
import type { Problem, TopicProgress } from '@/types';
import { useProgress } from './useProgress';

interface UseSuggestedProblemReturn {
  /** Suggested next problem */
  suggestion: Problem | null;

  /** Why this problem was suggested */
  reason: string;

  /** The topic it's from */
  topic: TopicProgress | null;

  /** Refresh the suggestion */
  refresh: () => void;
}

/**
 * Hook for getting a suggested next problem
 * Selects from the weakest unlocked topic to help strengthen skills
 */
export function useSuggestedProblem(): UseSuggestedProblemReturn {
  const { progress } = useProgress();
  const [refreshKey, setRefreshKey] = useState(0);

  const suggestionData = useLiveQuery(
    async () => {
      return await getSuggestedProblem();
    },
    [refreshKey]
  );

  // Find the TopicProgress for the suggested topic
  const topicProgress = suggestionData?.topic && progress
    ? progress.find((p) => p.topic === suggestionData.topic) ?? null
    : null;

  const refresh = useCallback(() => {
    setRefreshKey((k) => k + 1);
  }, []);

  return {
    suggestion: suggestionData?.problem ?? null,
    reason: suggestionData?.reason ?? 'Loading...',
    topic: topicProgress,
    refresh,
  };
}
