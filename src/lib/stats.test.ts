// lib/stats.test.ts - Tests for weekly statistics calculation
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { calculateWeeklyStats } from './stats';
import type { ReviewHistory, ReviewQuality } from '../types';

function createReviewHistory(
  date: Date,
  quality: ReviewQuality
): ReviewHistory {
  return {
    id: crypto.randomUUID(),
    problemId: 'test-problem',
    quality,
    reviewedAt: date,
    intervalBefore: 1,
    intervalAfter: 6,
  };
}

describe('calculateWeeklyStats', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    // Set to Wednesday, Jan 15, 2025
    vi.setSystemTime(new Date('2025-01-15T10:00:00Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('empty history', () => {
    it('returns 7 days with zero counts', () => {
      const result = calculateWeeklyStats([]);
      expect(result).toHaveLength(7);
      result.forEach((day) => {
        expect(day.reviewed).toBe(0);
        expect(day.again).toBe(0);
        expect(day.hard).toBe(0);
        expect(day.good).toBe(0);
        expect(day.easy).toBe(0);
      });
    });

    it('includes correct day labels', () => {
      const result = calculateWeeklyStats([]);
      // From 6 days ago to today: Thu, Fri, Sat, Sun, Mon, Tue, Wed
      expect(result.map((d) => d.date)).toEqual([
        'Thu',
        'Fri',
        'Sat',
        'Sun',
        'Mon',
        'Tue',
        'Wed',
      ]);
    });
  });

  describe('counting reviews', () => {
    it('counts reviews on correct days', () => {
      const reviews = [
        createReviewHistory(new Date('2025-01-15T10:00:00Z'), 4), // Wed (today)
        createReviewHistory(new Date('2025-01-15T14:00:00Z'), 5), // Wed (today, another)
        createReviewHistory(new Date('2025-01-14T10:00:00Z'), 3), // Tue
        createReviewHistory(new Date('2025-01-13T10:00:00Z'), 0), // Mon
      ];

      const result = calculateWeeklyStats(reviews);

      // Wed (today, index 6)
      expect(result[6]!.reviewed).toBe(2);
      // Tue (index 5)
      expect(result[5]!.reviewed).toBe(1);
      // Mon (index 4)
      expect(result[4]!.reviewed).toBe(1);
    });

    it('categorizes ratings correctly', () => {
      const reviews = [
        createReviewHistory(new Date('2025-01-15T08:00:00Z'), 0), // Again
        createReviewHistory(new Date('2025-01-15T09:00:00Z'), 3), // Hard
        createReviewHistory(new Date('2025-01-15T10:00:00Z'), 4), // Good
        createReviewHistory(new Date('2025-01-15T11:00:00Z'), 5), // Easy
      ];

      const result = calculateWeeklyStats(reviews);
      const today = result[6]!;

      expect(today.again).toBe(1);
      expect(today.hard).toBe(1);
      expect(today.good).toBe(1);
      expect(today.easy).toBe(1);
      expect(today.reviewed).toBe(4);
    });
  });

  describe('date filtering', () => {
    it('excludes reviews from before the week', () => {
      const reviews = [
        createReviewHistory(new Date('2025-01-15T10:00:00Z'), 4), // Today (in range)
        createReviewHistory(new Date('2025-01-08T10:00:00Z'), 4), // 7 days ago (out of range)
        createReviewHistory(new Date('2025-01-01T10:00:00Z'), 4), // 14 days ago (out of range)
      ];

      const result = calculateWeeklyStats(reviews);
      const totalReviewed = result.reduce((sum, d) => sum + d.reviewed, 0);

      expect(totalReviewed).toBe(1);
    });

    it('includes reviews from exactly 6 days ago', () => {
      const reviews = [
        createReviewHistory(new Date('2025-01-09T10:00:00Z'), 4), // Thu (6 days ago)
      ];

      const result = calculateWeeklyStats(reviews);

      expect(result[0]!.reviewed).toBe(1);
      expect(result[0]!.date).toBe('Thu');
    });
  });

  describe('edge cases', () => {
    it('handles reviews at midnight', () => {
      const reviews = [
        createReviewHistory(new Date('2025-01-15T00:00:00Z'), 4), // Midnight today
        createReviewHistory(new Date('2025-01-14T23:59:59Z'), 4), // Just before midnight yesterday
      ];

      const result = calculateWeeklyStats(reviews);

      expect(result[6]!.reviewed).toBe(1); // Wed
      expect(result[5]!.reviewed).toBe(1); // Tue
    });

    it('handles multiple reviews of same problem on same day', () => {
      const reviews = [
        createReviewHistory(new Date('2025-01-15T08:00:00Z'), 0),
        createReviewHistory(new Date('2025-01-15T12:00:00Z'), 4),
        createReviewHistory(new Date('2025-01-15T18:00:00Z'), 5),
      ];

      const result = calculateWeeklyStats(reviews);

      expect(result[6]!.reviewed).toBe(3);
      expect(result[6]!.again).toBe(1);
      expect(result[6]!.good).toBe(1);
      expect(result[6]!.easy).toBe(1);
    });
  });
});
