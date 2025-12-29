// lib/streak.test.ts - Tests for streak calculation
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { calculateStreak } from './streak';

describe('calculateStreak', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2025-01-15T10:00:00Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('empty history', () => {
    it('returns zero streak with no reviews', () => {
      const result = calculateStreak([]);
      expect(result.currentStreak).toBe(0);
      expect(result.longestStreak).toBe(0);
      expect(result.lastReviewDate).toBeNull();
    });
  });

  describe('current streak calculation', () => {
    it('counts consecutive days from today', () => {
      const dates = [
        new Date('2025-01-15T14:00:00Z'), // Today
        new Date('2025-01-14T10:00:00Z'), // Yesterday
        new Date('2025-01-13T09:00:00Z'), // 2 days ago
      ];
      const result = calculateStreak(dates);
      expect(result.currentStreak).toBe(3);
    });

    it('counts consecutive days from yesterday if not reviewed today', () => {
      const dates = [
        new Date('2025-01-14T10:00:00Z'), // Yesterday
        new Date('2025-01-13T09:00:00Z'), // 2 days ago
        new Date('2025-01-12T08:00:00Z'), // 3 days ago
      ];
      const result = calculateStreak(dates);
      expect(result.currentStreak).toBe(3);
    });

    it('returns 0 if last review was more than 1 day ago', () => {
      const dates = [
        new Date('2025-01-12T10:00:00Z'), // 3 days ago
        new Date('2025-01-11T09:00:00Z'), // 4 days ago
      ];
      const result = calculateStreak(dates);
      expect(result.currentStreak).toBe(0);
    });

    it('counts only unique days (multiple reviews same day = 1)', () => {
      const dates = [
        new Date('2025-01-15T14:00:00Z'), // Today morning
        new Date('2025-01-15T10:00:00Z'), // Today afternoon
        new Date('2025-01-15T08:00:00Z'), // Today evening
        new Date('2025-01-14T10:00:00Z'), // Yesterday
      ];
      const result = calculateStreak(dates);
      expect(result.currentStreak).toBe(2);
    });

    it('handles single day streak', () => {
      const dates = [new Date('2025-01-15T10:00:00Z')]; // Today only
      const result = calculateStreak(dates);
      expect(result.currentStreak).toBe(1);
    });
  });

  describe('longest streak calculation', () => {
    it('returns current streak when it is the longest', () => {
      const dates = [
        new Date('2025-01-15T10:00:00Z'),
        new Date('2025-01-14T10:00:00Z'),
        new Date('2025-01-13T10:00:00Z'),
      ];
      const result = calculateStreak(dates);
      expect(result.longestStreak).toBe(3);
    });

    it('returns historical longest streak when current is broken', () => {
      const dates = [
        // Current: broken (last review was 3 days ago)
        new Date('2025-01-12T10:00:00Z'),
        // Historical 5-day streak
        new Date('2025-01-05T10:00:00Z'),
        new Date('2025-01-04T10:00:00Z'),
        new Date('2025-01-03T10:00:00Z'),
        new Date('2025-01-02T10:00:00Z'),
        new Date('2025-01-01T10:00:00Z'),
      ];
      const result = calculateStreak(dates);
      expect(result.currentStreak).toBe(0);
      expect(result.longestStreak).toBe(5);
    });

    it('finds longest streak in middle of history', () => {
      const dates = [
        // Recent: 2 days
        new Date('2025-01-15T10:00:00Z'),
        new Date('2025-01-14T10:00:00Z'),
        // Gap
        // Historical: 4 days (longest)
        new Date('2025-01-10T10:00:00Z'),
        new Date('2025-01-09T10:00:00Z'),
        new Date('2025-01-08T10:00:00Z'),
        new Date('2025-01-07T10:00:00Z'),
        // Gap
        // Earlier: 2 days
        new Date('2025-01-03T10:00:00Z'),
        new Date('2025-01-02T10:00:00Z'),
      ];
      const result = calculateStreak(dates);
      expect(result.currentStreak).toBe(2);
      expect(result.longestStreak).toBe(4);
    });
  });

  describe('lastReviewDate', () => {
    it('returns the most recent review date', () => {
      const dates = [
        new Date('2025-01-15T14:00:00Z'),
        new Date('2025-01-14T10:00:00Z'),
        new Date('2025-01-10T10:00:00Z'),
      ];
      const result = calculateStreak(dates);
      expect(result.lastReviewDate?.toISOString()).toBe(
        '2025-01-15T00:00:00.000Z'
      );
    });

    it('handles unsorted input dates', () => {
      const dates = [
        new Date('2025-01-10T10:00:00Z'),
        new Date('2025-01-15T14:00:00Z'),
        new Date('2025-01-12T10:00:00Z'),
      ];
      const result = calculateStreak(dates);
      expect(result.lastReviewDate?.toISOString()).toBe(
        '2025-01-15T00:00:00.000Z'
      );
    });
  });
});
