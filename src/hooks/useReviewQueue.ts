// hooks/useReviewQueue.ts - Hook for managing the review queue

import { useCallback, useMemo } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, getDueToday, addToReview as dbAddToReview, addToTodayQueue as dbAddToTodayQueue } from '@/lib/db';
import type { Problem, Review } from '@/types';

interface DueItem {
  problem: Problem;
  review: Review;
}

interface UseReviewQueueReturn {
  /** Problems due for review today */
  dueToday: DueItem[] | undefined;

  /** Total count of due items */
  dueCount: number;

  /** Whether loading */
  isLoading: boolean;

  /** Add a problem to the review system */
  addToReview: (problemId: string) => Promise<void>;

  /** Force add to today's queue (manual override) */
  addToTodayQueue: (problemId: string) => Promise<void>;

  /** Check if a problem is in review system */
  isInReview: (problemId: string) => boolean;

  /** Get review data for a problem */
  getReview: (problemId: string) => Review | undefined;
}

/**
 * Hook for managing the due today review queue
 * Automatically subscribes to database changes via useLiveQuery
 *
 * @returns Review queue state and operations
 */
export function useReviewQueue(): UseReviewQueueReturn {
  // Reactive query for due items
  const dueToday = useLiveQuery(async () => {
    return await getDueToday();
  }, []);

  // Reactive query for all reviews (for isInReview and getReview)
  const allReviews = useLiveQuery(async () => {
    return await db.reviews.toArray();
  }, []);

  const isLoading = dueToday === undefined || allReviews === undefined;

  // Create a map for fast lookup
  const reviewsMap = useMemo(() => {
    if (!allReviews) return new Map<string, Review>();
    return new Map(allReviews.map((r) => [r.problemId, r]));
  }, [allReviews]);

  /**
   * Add a problem to the review system
   */
  const addToReview = useCallback(async (problemId: string): Promise<void> => {
    await dbAddToReview(problemId);
  }, []);

  /**
   * Force add a problem to today's queue (override next review date)
   */
  const addToTodayQueue = useCallback(async (problemId: string): Promise<void> => {
    await dbAddToTodayQueue(problemId);
  }, []);

  /**
   * Check if a problem is in the review system
   */
  const isInReview = useCallback(
    (problemId: string): boolean => {
      return reviewsMap.has(problemId);
    },
    [reviewsMap]
  );

  /**
   * Get review data for a problem
   */
  const getReview = useCallback(
    (problemId: string): Review | undefined => {
      return reviewsMap.get(problemId);
    },
    [reviewsMap]
  );

  return {
    dueToday,
    dueCount: dueToday?.length ?? 0,
    isLoading,
    addToReview,
    addToTodayQueue,
    isInReview,
    getReview,
  };
}
