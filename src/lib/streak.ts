// lib/streak.ts - Streak calculation for review history

import { startOfDay, differenceInDays, isSameDay, subDays } from 'date-fns';

/**
 * Result of streak calculation
 */
export interface StreakResult {
  /** Current active streak in days */
  currentStreak: number;
  /** Longest streak in history */
  longestStreak: number;
  /** Date of most recent review (start of day) */
  lastReviewDate: Date | null;
}

/**
 * Calculate streak information from review dates
 *
 * @param reviewDates - Array of review timestamps
 * @returns Streak information including current and longest streaks
 */
export function calculateStreak(reviewDates: Date[]): StreakResult {
  if (reviewDates.length === 0) {
    return { currentStreak: 0, longestStreak: 0, lastReviewDate: null };
  }

  // Normalize to start of day and sort descending (most recent first)
  const sortedDates = [...reviewDates]
    .map((d) => startOfDay(d))
    .sort((a, b) => b.getTime() - a.getTime());

  // Get unique dates (deduplicate same-day reviews)
  const uniqueDates = sortedDates.filter(
    (date, index) => index === 0 || !isSameDay(date, sortedDates[index - 1]!)
  );

  const today = startOfDay(new Date());
  const lastReviewDate = uniqueDates[0]!;

  // Check if streak is still active (reviewed today or yesterday)
  const daysSinceLastReview = differenceInDays(today, lastReviewDate);

  let currentStreak = 0;

  if (daysSinceLastReview <= 1) {
    // Streak is active - count consecutive days
    const startDate = daysSinceLastReview === 0 ? today : subDays(today, 1);
    let expectedDate = startDate;

    for (const date of uniqueDates) {
      if (isSameDay(date, expectedDate)) {
        currentStreak++;
        expectedDate = subDays(expectedDate, 1);
      } else {
        break;
      }
    }
  }

  // Calculate longest streak in history
  const longestStreak = calculateLongestStreak(uniqueDates);

  return {
    currentStreak,
    longestStreak: Math.max(currentStreak, longestStreak),
    lastReviewDate,
  };
}

/**
 * Calculate the longest streak in a sorted list of unique dates
 * @param sortedDates - Unique dates sorted descending (most recent first)
 */
function calculateLongestStreak(sortedDates: Date[]): number {
  if (sortedDates.length === 0) return 0;
  if (sortedDates.length === 1) return 1;

  let longestStreak = 1;
  let currentStreakLength = 1;

  for (let i = 1; i < sortedDates.length; i++) {
    const current = sortedDates[i]!;
    const previous = sortedDates[i - 1]!;

    // Check if dates are consecutive (previous is 1 day after current since sorted desc)
    const daysDiff = differenceInDays(previous, current);

    if (daysDiff === 1) {
      currentStreakLength++;
      longestStreak = Math.max(longestStreak, currentStreakLength);
    } else {
      currentStreakLength = 1;
    }
  }

  return longestStreak;
}
