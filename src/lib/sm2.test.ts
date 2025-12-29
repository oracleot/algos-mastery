// lib/sm2.test.ts - Tests for SM-2 spaced repetition algorithm
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { calculateSM2, SM2_DEFAULTS } from './sm2';

describe('SM-2 Algorithm', () => {
  beforeEach(() => {
    // Mock the current date for consistent testing
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2025-01-15T10:00:00Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('Again rating (quality = 0)', () => {
    it('resets repetitions to 0 on Again rating', () => {
      const result = calculateSM2({
        quality: 0,
        repetitions: 5,
        easeFactor: 2.5,
        interval: 30,
      });
      expect(result.repetitions).toBe(0);
    });

    it('sets interval to 1 day on Again rating', () => {
      const result = calculateSM2({
        quality: 0,
        repetitions: 5,
        easeFactor: 2.5,
        interval: 30,
      });
      expect(result.interval).toBe(1);
    });

    it('keeps ease factor unchanged on Again rating', () => {
      const result = calculateSM2({
        quality: 0,
        repetitions: 5,
        easeFactor: 2.5,
        interval: 30,
      });
      expect(result.easeFactor).toBe(2.5);
    });

    it('sets next review to tomorrow on Again', () => {
      const result = calculateSM2({
        quality: 0,
        repetitions: 0,
        easeFactor: 2.5,
        interval: 0,
      });
      const tomorrow = new Date('2025-01-16T00:00:00.000Z');
      expect(result.nextReview.getTime()).toBe(tomorrow.getTime());
    });
  });

  describe('First successful review (repetitions: 0 → 1)', () => {
    it('sets interval to 1 on first Good rating', () => {
      const result = calculateSM2({
        quality: 4,
        repetitions: 0,
        easeFactor: SM2_DEFAULTS.easeFactor,
        interval: SM2_DEFAULTS.interval,
      });
      expect(result.repetitions).toBe(1);
      expect(result.interval).toBe(1);
    });

    it('sets interval to 1 on first Easy rating', () => {
      const result = calculateSM2({
        quality: 5,
        repetitions: 0,
        easeFactor: SM2_DEFAULTS.easeFactor,
        interval: SM2_DEFAULTS.interval,
      });
      expect(result.interval).toBe(1);
    });

    it('sets interval to 1 on first Hard rating', () => {
      const result = calculateSM2({
        quality: 3,
        repetitions: 0,
        easeFactor: SM2_DEFAULTS.easeFactor,
        interval: SM2_DEFAULTS.interval,
      });
      expect(result.interval).toBe(1);
    });
  });

  describe('Second successful review (repetitions: 1 → 2)', () => {
    it('sets interval to 6 on second Good rating', () => {
      const result = calculateSM2({
        quality: 4,
        repetitions: 1,
        easeFactor: 2.5,
        interval: 1,
      });
      expect(result.repetitions).toBe(2);
      expect(result.interval).toBe(6);
    });
  });

  describe('Subsequent reviews (repetitions >= 2)', () => {
    it('multiplies interval by ease factor after second review', () => {
      const result = calculateSM2({
        quality: 4,
        repetitions: 2,
        easeFactor: 2.5,
        interval: 6,
      });
      expect(result.interval).toBe(15); // 6 * 2.5 = 15
    });

    it('rounds interval to nearest integer', () => {
      const result = calculateSM2({
        quality: 4,
        repetitions: 2,
        easeFactor: 2.3,
        interval: 6,
      });
      expect(result.interval).toBe(14); // 6 * 2.3 = 13.8 → 14
    });
  });

  describe('Ease factor adjustments', () => {
    it('decreases ease factor on Hard rating', () => {
      const result = calculateSM2({
        quality: 3,
        repetitions: 2,
        easeFactor: 2.5,
        interval: 6,
      });
      expect(result.easeFactor).toBeLessThan(2.5);
    });

    it('keeps ease factor similar on Good rating', () => {
      const result = calculateSM2({
        quality: 4,
        repetitions: 2,
        easeFactor: 2.5,
        interval: 6,
      });
      // EF' = 2.5 + (0.1 - (5-4) * (0.08 + (5-4) * 0.02))
      // EF' = 2.5 + (0.1 - 1 * (0.08 + 0.02))
      // EF' = 2.5 + (0.1 - 0.1) = 2.5
      expect(result.easeFactor).toBe(2.5);
    });

    it('increases ease factor on Easy rating', () => {
      const result = calculateSM2({
        quality: 5,
        repetitions: 2,
        easeFactor: 2.5,
        interval: 6,
      });
      // EF' = 2.5 + (0.1 - (5-5) * (0.08 + (5-5) * 0.02))
      // EF' = 2.5 + 0.1 = 2.6
      expect(result.easeFactor).toBe(2.6);
    });

    it('never lets ease factor go below 1.3', () => {
      const result = calculateSM2({
        quality: 3,
        repetitions: 10,
        easeFactor: 1.3,
        interval: 30,
      });
      expect(result.easeFactor).toBeGreaterThanOrEqual(1.3);
    });

    it('rounds ease factor to 2 decimal places', () => {
      const result = calculateSM2({
        quality: 3,
        repetitions: 2,
        easeFactor: 2.5,
        interval: 6,
      });
      // Should be a clean 2 decimal number
      const decimalPlaces = (result.easeFactor.toString().split('.')[1] || '').length;
      expect(decimalPlaces).toBeLessThanOrEqual(2);
    });
  });

  describe('Next review date calculation', () => {
    it('calculates next review date correctly', () => {
      const result = calculateSM2({
        quality: 4,
        repetitions: 2,
        easeFactor: 2.5,
        interval: 6,
      });
      // Interval is 15 days from 2025-01-15
      const expectedDate = new Date('2025-01-30T00:00:00.000Z');
      expect(result.nextReview.getTime()).toBe(expectedDate.getTime());
    });

    it('sets next review to start of day', () => {
      const result = calculateSM2({
        quality: 4,
        repetitions: 0,
        easeFactor: 2.5,
        interval: 0,
      });
      expect(result.nextReview.getHours()).toBe(0);
      expect(result.nextReview.getMinutes()).toBe(0);
      expect(result.nextReview.getSeconds()).toBe(0);
      expect(result.nextReview.getMilliseconds()).toBe(0);
    });
  });

  describe('SM2_DEFAULTS', () => {
    it('has correct default values', () => {
      expect(SM2_DEFAULTS.easeFactor).toBe(2.5);
      expect(SM2_DEFAULTS.interval).toBe(0);
      expect(SM2_DEFAULTS.repetitions).toBe(0);
    });
  });
});
