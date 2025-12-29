// hooks/useStreak.test.ts - Tests for useStreak hook

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { db } from '@/lib/db';
import { useStreak } from './useStreak';
import { subDays, startOfDay } from 'date-fns';

describe('useStreak', () => {
  beforeEach(async () => {
    // Clear all data before each test
    await db.reviewHistory.clear();
    await db.reviews.clear();
  });

  afterEach(async () => {
    await db.reviewHistory.clear();
    await db.reviews.clear();
  });

  it('returns zero streak when no reviews exist', async () => {
    const { result } = renderHook(() => useStreak());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.streak?.currentStreak).toBe(0);
    expect(result.current.streak?.longestStreak).toBe(0);
    expect(result.current.hasReviewedToday).toBe(false);
  });

  it('returns hasReviewedToday true when reviewed today', async () => {
    const today = new Date();

    await db.reviewHistory.add({
      id: 'test-1',
      problemId: 'problem-1',
      quality: 4,
      reviewedAt: today,
      intervalBefore: 1,
      intervalAfter: 3,
    });

    const { result } = renderHook(() => useStreak());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.hasReviewedToday).toBe(true);
    expect(result.current.streak?.currentStreak).toBe(1);
  });

  it('calculates streak for consecutive days', async () => {
    const today = startOfDay(new Date());

    // Add reviews for today and yesterday
    await db.reviewHistory.bulkAdd([
      {
        id: 'test-1',
        problemId: 'problem-1',
        quality: 4,
        reviewedAt: today,
        intervalBefore: 1,
        intervalAfter: 3,
      },
      {
        id: 'test-2',
        problemId: 'problem-2',
        quality: 4,
        reviewedAt: subDays(today, 1),
        intervalBefore: 1,
        intervalAfter: 3,
      },
      {
        id: 'test-3',
        problemId: 'problem-3',
        quality: 4,
        reviewedAt: subDays(today, 2),
        intervalBefore: 1,
        intervalAfter: 3,
      },
    ]);

    const { result } = renderHook(() => useStreak());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.streak?.currentStreak).toBe(3);
  });

  it('returns hasReviewedToday false when last review was yesterday', async () => {
    const yesterday = subDays(new Date(), 1);

    await db.reviewHistory.add({
      id: 'test-1',
      problemId: 'problem-1',
      quality: 4,
      reviewedAt: yesterday,
      intervalBefore: 1,
      intervalAfter: 3,
    });

    const { result } = renderHook(() => useStreak());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.hasReviewedToday).toBe(false);
    // Streak is still 1 because yesterday maintains the streak
    expect(result.current.streak?.currentStreak).toBe(1);
  });

  it('tracks longest streak separately from current', async () => {
    const today = startOfDay(new Date());

    // Create a gap in the streak
    await db.reviewHistory.bulkAdd([
      // Current streak: today only
      {
        id: 'test-1',
        problemId: 'problem-1',
        quality: 4,
        reviewedAt: today,
        intervalBefore: 1,
        intervalAfter: 3,
      },
      // Gap: no review 1-2 days ago
      // Old streak: 3-5 days ago (3 consecutive days)
      {
        id: 'test-2',
        problemId: 'problem-2',
        quality: 4,
        reviewedAt: subDays(today, 3),
        intervalBefore: 1,
        intervalAfter: 3,
      },
      {
        id: 'test-3',
        problemId: 'problem-3',
        quality: 4,
        reviewedAt: subDays(today, 4),
        intervalBefore: 1,
        intervalAfter: 3,
      },
      {
        id: 'test-4',
        problemId: 'problem-4',
        quality: 4,
        reviewedAt: subDays(today, 5),
        intervalBefore: 1,
        intervalAfter: 3,
      },
    ]);

    const { result } = renderHook(() => useStreak());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.streak?.currentStreak).toBe(1);
    expect(result.current.streak?.longestStreak).toBe(3);
  });
});
