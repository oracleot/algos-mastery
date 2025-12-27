# Research: Spaced Repetition System

**Feature**: 003-spaced-repetition  
**Date**: 2025-12-27  
**Status**: Complete

## Overview

Research findings for SM-2 algorithm implementation, streak calculation, and dashboard statistics.

---

## 1. SM-2 Algorithm Implementation

### Decision: Implement standard SM-2 with modifications for coding practice

**Rationale**: SM-2 is the industry standard (used by Anki). It's well-documented and proven effective.

### SM-2 Algorithm

The algorithm calculates:
1. **Ease Factor (EF)**: How easy the item is (starts at 2.5, min 1.3)
2. **Interval**: Days until next review
3. **Repetition Count**: Number of successful reviews

### Rating Scale

| Rating | Name | Quality | Meaning |
|--------|------|---------|---------|
| 0 | Again | 0 | Complete blackout, reset to learning |
| 3 | Hard | 3 | Correct with significant difficulty |
| 4 | Good | 4 | Correct with some hesitation |
| 5 | Easy | 5 | Perfect recall |

### Implementation

```typescript
// lib/sm2.ts

export interface SM2Input {
  quality: 0 | 3 | 4 | 5;  // Rating quality
  repetitions: number;     // Current rep count
  easeFactor: number;      // Current EF (default 2.5)
  interval: number;        // Current interval in days
}

export interface SM2Output {
  repetitions: number;
  easeFactor: number;
  interval: number;
  nextReview: Date;
}

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
    
    // Calculate new interval
    if (newRepetitions === 1) {
      newInterval = 1;
    } else if (newRepetitions === 2) {
      newInterval = 6;
    } else {
      newInterval = Math.round(interval * easeFactor);
    }
    
    // Calculate new ease factor
    // EF' = EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
    newEaseFactor = easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
    
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

// Default values for new review cards
export const SM2_DEFAULTS = {
  easeFactor: 2.5,
  interval: 0,
  repetitions: 0,
} as const;
```

### Test Cases (Test-First Required)

```typescript
// lib/sm2.test.ts
import { describe, it, expect } from 'vitest';
import { calculateSM2, SM2_DEFAULTS } from './sm2';

describe('SM-2 Algorithm', () => {
  it('resets on Again rating', () => {
    const result = calculateSM2({
      quality: 0,
      repetitions: 5,
      easeFactor: 2.5,
      interval: 30,
    });
    expect(result.repetitions).toBe(0);
    expect(result.interval).toBe(1);
  });
  
  it('sets interval to 1 on first Good rating', () => {
    const result = calculateSM2({
      quality: 4,
      repetitions: 0,
      ...SM2_DEFAULTS,
    });
    expect(result.repetitions).toBe(1);
    expect(result.interval).toBe(1);
  });
  
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
  
  it('multiplies interval by EF after second review', () => {
    const result = calculateSM2({
      quality: 4,
      repetitions: 2,
      easeFactor: 2.5,
      interval: 6,
    });
    expect(result.interval).toBe(15); // 6 * 2.5 = 15
  });
  
  it('decreases ease factor on Hard rating', () => {
    const result = calculateSM2({
      quality: 3,
      repetitions: 2,
      easeFactor: 2.5,
      interval: 6,
    });
    expect(result.easeFactor).toBeLessThan(2.5);
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
});
```

---

## 2. Date Handling

### Decision: Use date-fns for date calculations

**Rationale**: Lightweight, tree-shakeable, immutable. Much smaller than moment.js.

```bash
npm install date-fns
```

### Key Functions

```typescript
import { 
  startOfDay, 
  isToday, 
  isBefore, 
  differenceInDays,
  subDays,
  eachDayOfInterval,
} from 'date-fns';

// Check if problem is due
function isDue(nextReview: Date): boolean {
  return isBefore(startOfDay(nextReview), startOfDay(new Date())) || 
         isToday(nextReview);
}

// Get days until next review
function daysUntilReview(nextReview: Date): number {
  return differenceInDays(startOfDay(nextReview), startOfDay(new Date()));
}
```

---

## 3. Streak Calculation

### Decision: Calculate streak from review history, not stored counter

**Rationale**: Prevents desync if app isn't opened daily. Recalculating from history ensures accuracy.

### Implementation

```typescript
// lib/streak.ts
import { startOfDay, differenceInDays, isSameDay } from 'date-fns';

export interface StreakResult {
  currentStreak: number;
  longestStreak: number;
  lastReviewDate: Date | null;
}

export function calculateStreak(reviewDates: Date[]): StreakResult {
  if (reviewDates.length === 0) {
    return { currentStreak: 0, longestStreak: 0, lastReviewDate: null };
  }
  
  // Sort dates descending (most recent first)
  const sortedDates = [...reviewDates]
    .map(d => startOfDay(d))
    .sort((a, b) => b.getTime() - a.getTime());
  
  // Get unique dates
  const uniqueDates = sortedDates.filter((date, index) => 
    index === 0 || !isSameDay(date, sortedDates[index - 1]!)
  );
  
  const today = startOfDay(new Date());
  const lastReviewDate = uniqueDates[0]!;
  
  // Check if streak is still active (reviewed today or yesterday)
  const daysSinceLastReview = differenceInDays(today, lastReviewDate);
  if (daysSinceLastReview > 1) {
    // Streak broken
    return { currentStreak: 0, longestStreak: calculateLongest(uniqueDates), lastReviewDate };
  }
  
  // Count current streak
  let currentStreak = 0;
  let expectedDate = daysSinceLastReview === 0 ? today : subDays(today, 1);
  
  for (const date of uniqueDates) {
    if (isSameDay(date, expectedDate)) {
      currentStreak++;
      expectedDate = subDays(expectedDate, 1);
    } else {
      break;
    }
  }
  
  return {
    currentStreak,
    longestStreak: Math.max(currentStreak, calculateLongest(uniqueDates)),
    lastReviewDate,
  };
}

function calculateLongest(sortedDates: Date[]): number {
  // Implementation for longest streak in history
  // ...
}
```

---

## 4. Weekly Statistics

### Decision: Aggregate reviews by day for the past 7 days

```typescript
// lib/stats.ts
import { subDays, startOfDay, isSameDay, format } from 'date-fns';

export interface DailyStat {
  date: string;        // 'Mon', 'Tue', etc.
  reviewed: number;    // Problems reviewed
  again: number;       // Count of Again ratings
  hard: number;        // Count of Hard ratings
  good: number;        // Count of Good ratings
  easy: number;        // Count of Easy ratings
}

export function calculateWeeklyStats(reviews: ReviewHistory[]): DailyStat[] {
  const today = startOfDay(new Date());
  const stats: DailyStat[] = [];
  
  for (let i = 6; i >= 0; i--) {
    const date = subDays(today, i);
    const dayReviews = reviews.filter(r => 
      isSameDay(startOfDay(r.reviewedAt), date)
    );
    
    stats.push({
      date: format(date, 'EEE'), // Mon, Tue, etc.
      reviewed: dayReviews.length,
      again: dayReviews.filter(r => r.quality === 0).length,
      hard: dayReviews.filter(r => r.quality === 3).length,
      good: dayReviews.filter(r => r.quality === 4).length,
      easy: dayReviews.filter(r => r.quality === 5).length,
    });
  }
  
  return stats;
}
```

### Recharts Integration

```typescript
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

function WeeklyStatsChart({ data }: { data: DailyStat[] }) {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data}>
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="reviewed" fill="#3b82f6" />
      </BarChart>
    </ResponsiveContainer>
  );
}
```

---

## 5. Suggested Next Problem

### Decision: Recommend from unlocked topic with lowest mastery

```typescript
export async function getSuggestedProblem(): Promise<Problem | null> {
  const progress = await calculateTopicProgress();
  const problems = await db.problems.toArray();
  
  // Find unlocked topics sorted by mastery (ascending)
  const unlockedTopics = progress
    .filter(p => p.unlocked && p.masteryPercent < 100)
    .sort((a, b) => a.masteryPercent - b.masteryPercent);
  
  if (unlockedTopics.length === 0) return null;
  
  // Get unsolved problems from weakest topic
  const weakestTopic = unlockedTopics[0]!;
  const candidates = problems.filter(
    p => p.topic === weakestTopic.topic && p.status !== 'solved'
  );
  
  if (candidates.length === 0) return null;
  
  // Return random unsolved problem from weakest topic
  return candidates[Math.floor(Math.random() * candidates.length)]!;
}
```

---

## Summary

All algorithms and data patterns documented. SM-2 requires test-first implementation per constitution.
