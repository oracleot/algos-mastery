# Quickstart: Spaced Repetition System

**Feature**: 003-spaced-repetition  
**Date**: 2025-12-27  
**Depends On**: 001-mvp-project-setup, 002-solution-journal

---

## Prerequisites

- MVP (001) and Solution Journal (002) are implemented
- Problems, Solutions, and Topics are working
- IndexedDB schema is at version 2

---

## Install Additional Dependencies

```bash
# Date handling
npm install date-fns

# Charts
npm install recharts
```

---

## Database Migration

Update to schema version 3:

```typescript
// lib/db.ts
this.version(3).stores({
  problems: 'id, topic, difficulty, status, createdAt',
  solutions: 'id, problemId, language, createdAt',
  reviews: 'problemId, nextReview',
  reviewHistory: 'id, problemId, reviewedAt'
});
```

---

## New Files to Create

### SM-2 Algorithm (Test-First!)

Create tests first: `src/lib/sm2.test.ts`

```typescript
import { describe, it, expect } from 'vitest';
import { calculateSM2 } from './sm2';

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
  
  // Add more tests from research.md
});
```

Then implement: `src/lib/sm2.ts`

### Types

Add to `src/types/index.ts`:

```typescript
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
```

### Streak Calculator

Create `src/lib/streak.ts` (see research.md for implementation)

### Stats Aggregator

Create `src/lib/stats.ts` (see research.md for implementation)

---

## Component Structure

```
src/components/
├── DueToday.tsx            # Due today queue display
├── ReviewSession.tsx       # Full review session flow
├── ReviewCard.tsx          # Single problem in review
├── RatingButtons.tsx       # Again/Hard/Good/Easy
├── StreakCounter.tsx       # Flame icon with count
├── WeeklyStatsChart.tsx    # Recharts bar chart
├── SuggestedNext.tsx       # Next problem recommendation
├── NextToUnlock.tsx        # Progress to next topic
└── ReviewSessionSummary.tsx # End of session summary
```

---

## Dashboard Layout

```typescript
// pages/Dashboard.tsx
export function Dashboard() {
  const { dueToday, dueCount } = useReviewQueue();
  const { streak } = useStreak();
  const { weeklyStats } = useStats();
  const { progress } = useProgress();
  const { suggestion } = useSuggestedProblem();
  
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {/* Due Today */}
      <Card className="md:col-span-2">
        <DueToday items={dueToday} onStartReview={...} />
      </Card>
      
      {/* Streak */}
      <Card>
        <StreakCounter count={streak.currentStreak} isActive={...} />
      </Card>
      
      {/* Weekly Stats */}
      <Card className="md:col-span-2">
        <WeeklyStatsChart data={weeklyStats} />
      </Card>
      
      {/* Suggested Next */}
      <Card>
        <SuggestedNext problem={suggestion} ... />
      </Card>
      
      {/* Progress Ladder */}
      <Card className="lg:col-span-3">
        <ProgressLadder progress={progress} />
      </Card>
    </div>
  );
}
```

---

## Review Session Flow

```
┌─────────────────────────────────────────┐
│ Review Session: 3/5                      │
├─────────────────────────────────────────┤
│                                         │
│  Problem: Two Sum                       │
│  Topic: Arrays & Hashing                │
│  Difficulty: Easy                       │
│                                         │
│  [Reveal Solution]                      │
│                                         │
├─────────────────────────────────────────┤
│                                         │
│  (After reveal, show rating buttons)    │
│                                         │
│  Again    Hard     Good     Easy        │
│  <1d      <1d      4d       7d          │
│                                         │
└─────────────────────────────────────────┘
```

---

## Verification Checklist

- [ ] SM-2 algorithm tests pass
- [ ] Reviews table created in IndexedDB
- [ ] Can add problem to review system
- [ ] Due today queue shows problems correctly
- [ ] Rating updates interval and next review date
- [ ] Streak calculates correctly
- [ ] Weekly stats chart renders
- [ ] Suggested next problem works

---

## Next Steps

1. Write SM-2 tests (TDD required by constitution)
2. Implement SM-2 algorithm
3. Build `useReviewQueue` hook
4. Create review session components
5. Build dashboard with stats charts
6. Add routing for `/review` session page
