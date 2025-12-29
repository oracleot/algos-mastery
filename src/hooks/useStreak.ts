// hooks/useStreak.ts - Hook for streak information from review history

import { useMemo } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { getStreak } from '@/lib/db';
import { startOfDay, isSameDay } from 'date-fns';
import type { StreakInfo } from '@/types';

interface UseStreakReturn {
  /** Current streak information */
  streak: StreakInfo | undefined;

  /** Whether loading */
  isLoading: boolean;

  /** Whether user has reviewed today */
  hasReviewedToday: boolean;
}

/**
 * Hook for streak calculation from review history
 * Provides current and longest streak, and whether reviewed today
 */
export function useStreak(): UseStreakReturn {
  const streakData = useLiveQuery(async () => {
    return await getStreak();
  });

  const isLoading = streakData === undefined;

  const streak: StreakInfo | undefined = useMemo(() => {
    if (!streakData) return undefined;
    return {
      currentStreak: streakData.currentStreak,
      longestStreak: streakData.longestStreak,
      lastReviewDate: streakData.lastReviewDate,
    };
  }, [streakData]);

  const hasReviewedToday = useMemo(() => {
    if (!streakData?.lastReviewDate) return false;
    const today = startOfDay(new Date());
    return isSameDay(streakData.lastReviewDate, today);
  }, [streakData]);

  return {
    streak,
    isLoading,
    hasReviewedToday,
  };
}
