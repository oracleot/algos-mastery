// lib/sm2.ts - SM-2 Spaced Repetition Algorithm Implementation

import type { ReviewQuality } from '../types';

/**
 * Input for SM-2 algorithm calculation
 */
export interface SM2Input {
  /** Rating quality (0=Again, 3=Hard, 4=Good, 5=Easy) */
  quality: ReviewQuality;
  /** Current repetition count */
  repetitions: number;
  /** Current ease factor (default 2.5) */
  easeFactor: number;
  /** Current interval in days */
  interval: number;
}

/**
 * Output from SM-2 algorithm calculation
 */
export interface SM2Output {
  /** New repetition count */
  repetitions: number;
  /** New ease factor */
  easeFactor: number;
  /** New interval in days */
  interval: number;
  /** Next review date */
  nextReview: Date;
}

/**
 * Default values for new review cards
 */
export const SM2_DEFAULTS = {
  easeFactor: 2.5,
  interval: 0,
  repetitions: 0,
} as const;

/**
 * Calculate SM-2 spaced repetition values
 *
 * The SM-2 algorithm calculates:
 * 1. Ease Factor (EF): How easy the item is (starts at 2.5, min 1.3)
 * 2. Interval: Days until next review
 * 3. Repetition Count: Number of successful reviews
 *
 * @param input - Current review state and rating
 * @returns New review state with next review date
 */
export function calculateSM2(input: SM2Input): SM2Output {
  const { quality, repetitions, easeFactor, interval } = input;

  let newRepetitions: number;
  let newEaseFactor: number;
  let newInterval: number;

  // If quality < 3 (Again), reset learning
  if (quality < 3) {
    newRepetitions = 0;
    newInterval = 1; // Review tomorrow
    newEaseFactor = easeFactor; // Keep EF unchanged on failure
  } else {
    // Successful recall
    newRepetitions = repetitions + 1;

    // Calculate new interval based on repetition count
    if (newRepetitions === 1) {
      newInterval = 1;
    } else if (newRepetitions === 2) {
      newInterval = 6;
    } else {
      newInterval = Math.round(interval * easeFactor);
    }

    // Calculate new ease factor using SM-2 formula
    // EF' = EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
    newEaseFactor =
      easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));

    // EF cannot go below 1.3
    if (newEaseFactor < 1.3) {
      newEaseFactor = 1.3;
    }
  }

  // Calculate next review date
  const nextReview = new Date();
  nextReview.setDate(nextReview.getDate() + newInterval);
  nextReview.setHours(0, 0, 0, 0); // Start of day

  return {
    repetitions: newRepetitions,
    easeFactor: Math.round(newEaseFactor * 100) / 100, // Round to 2 decimals
    interval: newInterval,
    nextReview,
  };
}

/**
 * Preview what the next interval would be for each rating option
 * Used to show users the consequences of each rating choice
 */
export function previewIntervals(
  repetitions: number,
  easeFactor: number,
  interval: number
): { again: number; hard: number; good: number; easy: number } {
  return {
    again: calculateSM2({ quality: 0, repetitions, easeFactor, interval })
      .interval,
    hard: calculateSM2({ quality: 3, repetitions, easeFactor, interval })
      .interval,
    good: calculateSM2({ quality: 4, repetitions, easeFactor, interval })
      .interval,
    easy: calculateSM2({ quality: 5, repetitions, easeFactor, interval })
      .interval,
  };
}
