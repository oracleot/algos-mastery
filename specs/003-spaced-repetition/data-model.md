# Data Model: Spaced Repetition System

**Feature**: 003-spaced-repetition  
**Date**: 2025-12-27  
**Status**: Complete

---

## Entity Overview

```
┌─────────────────────────────────────────────────────────┐
│                      Problem                             │
│                   (from MVP)                             │
├─────────────────────────────────────────────────────────┤
│ id: string                                              │
└───────────────────────────┬─────────────────────────────┘
                            │ 1:1 (optional)
                            ▼
┌─────────────────────────────────────────────────────────┐
│                       Review                             │
├─────────────────────────────────────────────────────────┤
│ problemId: string (PK, FK → Problem.id)                 │
│ easeFactor: number (default 2.5)                        │
│ interval: number (days)                                 │
│ repetitions: number                                     │
│ nextReview: Date                                        │
│ lastReviewed: Date | null                               │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                   ReviewHistory                          │
├─────────────────────────────────────────────────────────┤
│ id: string (UUID)                                       │
│ problemId: string (FK → Problem.id)                     │
│ quality: 0 | 3 | 4 | 5                                  │
│ reviewedAt: Date                                        │
│ intervalBefore: number                                  │
│ intervalAfter: number                                   │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│               DailyStat (computed)                       │
├─────────────────────────────────────────────────────────┤
│ date: string                                            │
│ reviewed: number                                        │
│ again/hard/good/easy: number                            │
└─────────────────────────────────────────────────────────┘
```

---

## Entities

### Review (NEW - Persisted)

Spaced repetition state for a problem. One Review per Problem (optional).

| Field | Type | Required | Default | Constraints | Description |
|-------|------|----------|---------|-------------|-------------|
| `problemId` | `string` | Yes | - | PK, FK to Problem | Links to problem |
| `easeFactor` | `number` | Yes | 2.5 | >= 1.3 | SM-2 ease factor |
| `interval` | `number` | Yes | 0 | >= 0 | Days until next review |
| `repetitions` | `number` | Yes | 0 | >= 0 | Successful review count |
| `nextReview` | `Date` | Yes | today | - | When to review next |
| `lastReviewed` | `Date` | No | `null` | - | Last review timestamp |

**Indexes**:
- Primary: `problemId`
- Secondary: `nextReview` (for due today queries)

### ReviewHistory (NEW - Persisted)

Individual review events for statistics and streak calculation.

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `id` | `string` | Yes | auto-gen | UUID |
| `problemId` | `string` | Yes | - | FK to Problem |
| `quality` | `0 \| 3 \| 4 \| 5` | Yes | - | Rating given |
| `reviewedAt` | `Date` | Yes | auto-set | When reviewed |
| `intervalBefore` | `number` | Yes | - | Interval before this review |
| `intervalAfter` | `number` | Yes | - | Interval after this review |

**Indexes**:
- Primary: `id`
- Secondary: `problemId`, `reviewedAt`

---

## TypeScript Interfaces

```typescript
// types/index.ts (additions)

export type ReviewQuality = 0 | 3 | 4 | 5;

export const REVIEW_RATINGS = {
  AGAIN: 0,
  HARD: 3,
  GOOD: 4,
  EASY: 5,
} as const;

export interface Review {
  problemId: string;
  easeFactor: number;
  interval: number;
  repetitions: number;
  nextReview: Date;
  lastReviewed: Date | null;
}

export interface ReviewHistory {
  id: string;
  problemId: string;
  quality: ReviewQuality;
  reviewedAt: Date;
  intervalBefore: number;
  intervalAfter: number;
}

export interface DailyStat {
  date: string;
  reviewed: number;
  again: number;
  hard: number;
  good: number;
  easy: number;
}

export interface StreakInfo {
  currentStreak: number;
  longestStreak: number;
  lastReviewDate: Date | null;
}

// For manual queue override
export interface QueueOverride {
  problemId: string;
  addedAt: Date;
}
```

---

## Dexie Schema (v3)

```typescript
// lib/db.ts (updated)

export class AlgoMasteryDB extends Dexie {
  problems!: Table<Problem>;
  solutions!: Table<Solution>;
  reviews!: Table<Review>;
  reviewHistory!: Table<ReviewHistory>;

  constructor() {
    super('AlgoMasteryDB');
    
    this.version(1).stores({
      problems: 'id, topic, difficulty, status, createdAt'
    });
    
    this.version(2).stores({
      problems: 'id, topic, difficulty, status, createdAt',
      solutions: 'id, problemId, language, createdAt'
    });
    
    this.version(3).stores({
      problems: 'id, topic, difficulty, status, createdAt',
      solutions: 'id, problemId, language, createdAt',
      reviews: 'problemId, nextReview',
      reviewHistory: 'id, problemId, reviewedAt'
    });
  }
}
```

---

## Query Patterns

### Due Today Queue

```typescript
export async function getDueToday(): Promise<Problem[]> {
  const today = startOfDay(new Date());
  
  // Get reviews due today or earlier
  const dueReviews = await db.reviews
    .where('nextReview')
    .belowOrEqual(today)
    .toArray();
  
  const problemIds = dueReviews.map(r => r.problemId);
  
  // Fetch the actual problems
  const problems = await db.problems
    .where('id')
    .anyOf(problemIds)
    .toArray();
  
  return problems;
}
```

### Add to Review System

```typescript
export async function addToReview(problemId: string): Promise<void> {
  const existing = await db.reviews.get(problemId);
  if (existing) return; // Already in review system
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  await db.reviews.add({
    problemId,
    easeFactor: 2.5,
    interval: 0,
    repetitions: 0,
    nextReview: today, // Due immediately
    lastReviewed: null,
  });
}
```

### Record Review

```typescript
export async function recordReview(
  problemId: string, 
  quality: ReviewQuality
): Promise<void> {
  const review = await db.reviews.get(problemId);
  if (!review) throw new Error('Problem not in review system');
  
  const sm2Result = calculateSM2({
    quality,
    repetitions: review.repetitions,
    easeFactor: review.easeFactor,
    interval: review.interval,
  });
  
  const now = new Date();
  
  await db.transaction('rw', [db.reviews, db.reviewHistory], async () => {
    // Update review record
    await db.reviews.update(problemId, {
      easeFactor: sm2Result.easeFactor,
      interval: sm2Result.interval,
      repetitions: sm2Result.repetitions,
      nextReview: sm2Result.nextReview,
      lastReviewed: now,
    });
    
    // Add to history
    await db.reviewHistory.add({
      id: crypto.randomUUID(),
      problemId,
      quality,
      reviewedAt: now,
      intervalBefore: review.interval,
      intervalAfter: sm2Result.interval,
    });
  });
}
```

### Streak Calculation

```typescript
export async function getStreak(): Promise<StreakInfo> {
  const history = await db.reviewHistory
    .orderBy('reviewedAt')
    .reverse()
    .toArray();
  
  const reviewDates = history.map(h => h.reviewedAt);
  return calculateStreak(reviewDates);
}
```

### Weekly Stats

```typescript
export async function getWeeklyStats(): Promise<DailyStat[]> {
  const weekAgo = subDays(new Date(), 7);
  
  const history = await db.reviewHistory
    .where('reviewedAt')
    .above(weekAgo)
    .toArray();
  
  return calculateWeeklyStats(history);
}
```

---

## Cascade Behavior

When a **Problem is deleted**:
- Associated **Review** record MUST be deleted
- Associated **ReviewHistory** records MUST be deleted
- Solutions cascade (from phase 2)

```typescript
export async function deleteProblemCascade(problemId: string): Promise<void> {
  await db.transaction('rw', [db.problems, db.solutions, db.reviews, db.reviewHistory], async () => {
    await db.reviewHistory.where('problemId').equals(problemId).delete();
    await db.reviews.delete(problemId);
    await db.solutions.where('problemId').equals(problemId).delete();
    await db.problems.delete(problemId);
  });
}
```
