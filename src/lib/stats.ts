// lib/stats.ts - Weekly statistics calculation for dashboard

import { subDays, startOfDay, isSameDay, format } from 'date-fns';
import type { ReviewHistory } from '../types';

/**
 * Daily statistics for the weekly chart
 */
export interface DailyStat {
  /** Day label (Mon, Tue, etc.) */
  date: string;
  /** Total problems reviewed */
  reviewed: number;
  /** Count of Again ratings */
  again: number;
  /** Count of Hard ratings */
  hard: number;
  /** Count of Good ratings */
  good: number;
  /** Count of Easy ratings */
  easy: number;
}

/**
 * Calculate daily statistics for the past 7 days
 *
 * @param reviews - Array of review history entries
 * @returns Array of 7 DailyStat objects, from 6 days ago to today
 */
export function calculateWeeklyStats(reviews: ReviewHistory[]): DailyStat[] {
  const today = startOfDay(new Date());
  const stats: DailyStat[] = [];

  for (let i = 6; i >= 0; i--) {
    const date = subDays(today, i);
    const dayReviews = reviews.filter((r) =>
      isSameDay(startOfDay(r.reviewedAt), date)
    );

    stats.push({
      date: format(date, 'EEE'), // Mon, Tue, etc.
      reviewed: dayReviews.length,
      again: dayReviews.filter((r) => r.quality === 0).length,
      hard: dayReviews.filter((r) => r.quality === 3).length,
      good: dayReviews.filter((r) => r.quality === 4).length,
      easy: dayReviews.filter((r) => r.quality === 5).length,
    });
  }

  return stats;
}

/**
 * Calculate the total reviews for the week
 */
export function calculateWeeklyTotal(stats: DailyStat[]): number {
  return stats.reduce((sum, day) => sum + day.reviewed, 0);
}

/**
 * Calculate the daily average for the week
 */
export function calculateDailyAverage(stats: DailyStat[]): number {
  const total = calculateWeeklyTotal(stats);
  return Math.round((total / 7) * 10) / 10; // Round to 1 decimal
}
