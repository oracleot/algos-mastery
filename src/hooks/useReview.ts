// hooks/useReview.ts - Hook for individual review operations

import { useCallback } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, recordReview as dbRecordReview } from '@/lib/db';
import { previewIntervals as calculatePreviewIntervals, SM2_DEFAULTS } from '@/lib/sm2';
import type { ReviewQuality } from '@/types';

interface UseReviewReturn {
  /** Record a review rating for a problem */
  recordReview: (problemId: string, quality: ReviewQuality) => Promise<void>;

  /** Get predicted next intervals for each rating */
  previewIntervals: (problemId: string) => {
    again: number;
    hard: number;
    good: number;
    easy: number;
  };
}

/**
 * Hook for individual review operations
 * Provides functions to record reviews and preview intervals
 *
 * @returns Review operations
 */
export function useReview(): UseReviewReturn {
  // Reactive query for all reviews (for interval preview)
  const allReviews = useLiveQuery(async () => {
    const reviews = await db.reviews.toArray();
    return new Map(reviews.map((r) => [r.problemId, r]));
  }, []);

  /**
   * Record a review rating for a problem
   */
  const recordReview = useCallback(
    async (problemId: string, quality: ReviewQuality): Promise<void> => {
      await dbRecordReview(problemId, quality);
    },
    []
  );

  /**
   * Get predicted next intervals for each rating option
   * Uses SM-2 algorithm to preview what interval each rating would produce
   */
  const previewIntervals = useCallback(
    (
      problemId: string
    ): { again: number; hard: number; good: number; easy: number } => {
      const review = allReviews?.get(problemId);

      // Default values for a new review card
      const repetitions = review?.repetitions ?? SM2_DEFAULTS.repetitions;
      const easeFactor = review?.easeFactor ?? SM2_DEFAULTS.easeFactor;
      const interval = review?.interval ?? SM2_DEFAULTS.interval;

      return calculatePreviewIntervals(repetitions, easeFactor, interval);
    },
    [allReviews]
  );

  return {
    recordReview,
    previewIntervals,
  };
}
