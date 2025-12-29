// hooks/useStats.test.ts - Tests for useStats hook

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { db } from '@/lib/db';
import { useStats } from './useStats';
import { subDays } from 'date-fns';

describe('useStats', () => {
  beforeEach(async () => {
    // Clear all data before each test
    await db.reviewHistory.clear();
  });

  afterEach(async () => {
    await db.reviewHistory.clear();
  });

  it('returns empty stats when no reviews exist', async () => {
    const { result } = renderHook(() => useStats());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.weeklyStats).toHaveLength(7);
    expect(result.current.weeklyTotal).toBe(0);
    expect(result.current.dailyAverage).toBe(0);
  });

  it('returns 7 days of stats', async () => {
    const { result } = renderHook(() => useStats());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.weeklyStats).toHaveLength(7);
    // Each stat should have the expected structure
    result.current.weeklyStats?.forEach((stat) => {
      expect(stat).toHaveProperty('date');
      expect(stat).toHaveProperty('reviewed');
      expect(stat).toHaveProperty('again');
      expect(stat).toHaveProperty('hard');
      expect(stat).toHaveProperty('good');
      expect(stat).toHaveProperty('easy');
    });
  });

  it('calculates weeklyTotal correctly', async () => {
    const today = new Date();
    const yesterday = subDays(today, 1);

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
        quality: 5,
        reviewedAt: today,
        intervalBefore: 1,
        intervalAfter: 6,
      },
      {
        id: 'test-3',
        problemId: 'problem-3',
        quality: 3,
        reviewedAt: yesterday,
        intervalBefore: 1,
        intervalAfter: 1,
      },
    ]);

    const { result } = renderHook(() => useStats());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.weeklyTotal).toBe(3);
  });

  it('calculates dailyAverage correctly', async () => {
    const today = new Date();

    // Add 7 reviews today
    await db.reviewHistory.bulkAdd(
      Array.from({ length: 7 }, (_, i) => ({
        id: `test-${i}`,
        problemId: `problem-${i}`,
        quality: 4 as const,
        reviewedAt: today,
        intervalBefore: 1,
        intervalAfter: 3,
      }))
    );

    const { result } = renderHook(() => useStats());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // 7 reviews / 7 days = 1.0 average
    expect(result.current.dailyAverage).toBe(1);
  });

  it('tracks rating breakdown in stats', async () => {
    const today = new Date();

    await db.reviewHistory.bulkAdd([
      {
        id: 'test-1',
        problemId: 'problem-1',
        quality: 0, // Again
        reviewedAt: today,
        intervalBefore: 1,
        intervalAfter: 1,
      },
      {
        id: 'test-2',
        problemId: 'problem-2',
        quality: 3, // Hard
        reviewedAt: today,
        intervalBefore: 1,
        intervalAfter: 1,
      },
      {
        id: 'test-3',
        problemId: 'problem-3',
        quality: 4, // Good
        reviewedAt: today,
        intervalBefore: 1,
        intervalAfter: 3,
      },
      {
        id: 'test-4',
        problemId: 'problem-4',
        quality: 5, // Easy
        reviewedAt: today,
        intervalBefore: 1,
        intervalAfter: 6,
      },
    ]);

    const { result } = renderHook(() => useStats());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Find today's stat
    const todayStat = result.current.weeklyStats?.find(
      (s) => s.reviewed > 0
    );

    expect(todayStat).toBeDefined();
    expect(todayStat?.again).toBe(1);
    expect(todayStat?.hard).toBe(1);
    expect(todayStat?.good).toBe(1);
    expect(todayStat?.easy).toBe(1);
    expect(todayStat?.reviewed).toBe(4);
  });

  it('ignores reviews older than 7 days', async () => {
    const today = new Date();
    const eightDaysAgo = subDays(today, 8);

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
        reviewedAt: eightDaysAgo,
        intervalBefore: 1,
        intervalAfter: 3,
      },
    ]);

    const { result } = renderHook(() => useStats());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Only 1 review should be counted (the one from today)
    expect(result.current.weeklyTotal).toBe(1);
  });
});
