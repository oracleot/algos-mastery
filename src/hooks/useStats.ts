// hooks/useStats.ts - Hook for weekly review statistics

import { useMemo } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { getWeeklyStats } from '@/lib/db';
import { calculateWeeklyTotal, calculateDailyAverage, type DailyStat } from '@/lib/stats';

interface UseStatsReturn {
  /** Weekly statistics */
  weeklyStats: DailyStat[] | undefined;

  /** Total reviews this week */
  weeklyTotal: number;

  /** Average daily reviews */
  dailyAverage: number;

  /** Whether loading */
  isLoading: boolean;
}

/**
 * Hook for weekly review statistics
 * Provides daily breakdown and aggregated totals for dashboard
 */
export function useStats(): UseStatsReturn {
  const weeklyStats = useLiveQuery(async () => {
    return await getWeeklyStats();
  });

  const isLoading = weeklyStats === undefined;

  const weeklyTotal = useMemo(() => {
    if (!weeklyStats) return 0;
    return calculateWeeklyTotal(weeklyStats);
  }, [weeklyStats]);

  const dailyAverage = useMemo(() => {
    if (!weeklyStats) return 0;
    return calculateDailyAverage(weeklyStats);
  }, [weeklyStats]);

  return {
    weeklyStats,
    weeklyTotal,
    dailyAverage,
    isLoading,
  };
}
