# Hook & Component Contracts: Spaced Repetition

**Feature**: 003-spaced-repetition  
**Date**: 2025-12-27

---

## Hook Contracts

### `useReviewQueue` Hook

```typescript
import type { Problem, Review } from '../types';

interface DueItem {
  problem: Problem;
  review: Review;
}

interface UseReviewQueueReturn {
  /** Problems due for review today */
  dueToday: DueItem[] | undefined;
  
  /** Total count of due items */
  dueCount: number;
  
  /** Whether loading */
  isLoading: boolean;
  
  /** Add a problem to the review system */
  addToReview: (problemId: string) => Promise<void>;
  
  /** Force add to today's queue (manual override) */
  addToTodayQueue: (problemId: string) => Promise<void>;
  
  /** Check if a problem is in review system */
  isInReview: (problemId: string) => boolean;
  
  /** Get review data for a problem */
  getReview: (problemId: string) => Review | undefined;
}

export function useReviewQueue(): UseReviewQueueReturn;
```

### `useReview` Hook

```typescript
import type { ReviewQuality, Review } from '../types';

interface UseReviewReturn {
  /** Record a review rating for a problem */
  recordReview: (problemId: string, quality: ReviewQuality) => Promise<void>;
  
  /** Get predicted next intervals for each rating */
  previewIntervals: (problemId: string) => {
    again: number;
    hard: number;
    good: number;
    easy: number;
  };
}

export function useReview(): UseReviewReturn;
```

### `useStreak` Hook

```typescript
import type { StreakInfo } from '../types';

interface UseStreakReturn {
  /** Current streak information */
  streak: StreakInfo | undefined;
  
  /** Whether loading */
  isLoading: boolean;
  
  /** Whether user has reviewed today */
  hasReviewedToday: boolean;
}

export function useStreak(): UseStreakReturn;
```

### `useStats` Hook

```typescript
import type { DailyStat } from '../types';

interface UseStatsReturn {
  /** Weekly statistics */
  weeklyStats: DailyStat[] | undefined;
  
  /** Total reviews this week */
  weeklyTotal: number;
  
  /** Average daily reviews */
  dailyAverage: number;
  
  /** Whether loading */
  isLoading: boolean;
}

export function useStats(): UseStatsReturn;
```

### `useSuggestedProblem` Hook

```typescript
import type { Problem, TopicProgress } from '../types';

interface UseSuggestedProblemReturn {
  /** Suggested next problem */
  suggestion: Problem | null;
  
  /** Why this problem was suggested */
  reason: string;
  
  /** The topic it's from */
  topic: TopicProgress | null;
  
  /** Refresh the suggestion */
  refresh: () => void;
}

export function useSuggestedProblem(): UseSuggestedProblemReturn;
```

---

## Component Contracts

### `DueToday` Component

```typescript
import type { Problem, Review } from '../types';

interface DueTodayProps {
  /** Due items to display */
  items: Array<{ problem: Problem; review: Review }>;
  
  /** Called when Start Review is clicked */
  onStartReview: () => void;
  
  /** Whether to show compact view */
  compact?: boolean;
}
```

### `ReviewSession` Component

```typescript
import type { Problem, ReviewQuality } from '../types';

interface ReviewSessionProps {
  /** Problems to review */
  problems: Problem[];
  
  /** Called when session completes */
  onComplete: (results: ReviewResult[]) => void;
  
  /** Called when session is cancelled */
  onCancel: () => void;
}

interface ReviewResult {
  problemId: string;
  quality: ReviewQuality;
}
```

### `ReviewCard` Component

```typescript
import type { Problem, Solution, ReviewQuality } from '../types';

interface ReviewCardProps {
  /** Problem being reviewed */
  problem: Problem;
  
  /** Solutions to show on reveal */
  solutions: Solution[];
  
  /** Whether solution is revealed */
  isRevealed: boolean;
  
  /** Called when reveal button clicked */
  onReveal: () => void;
  
  /** Called when rating is selected */
  onRate: (quality: ReviewQuality) => void;
  
  /** Preview of next intervals for each rating */
  intervalPreview: {
    again: number;
    hard: number;
    good: number;
    easy: number;
  };
}
```

### `RatingButtons` Component

```typescript
import type { ReviewQuality } from '../types';

interface RatingButtonsProps {
  /** Called when a rating is selected */
  onRate: (quality: ReviewQuality) => void;
  
  /** Interval previews to show on buttons */
  intervals: {
    again: number;
    hard: number;
    good: number;
    easy: number;
  };
  
  /** Whether buttons are disabled */
  disabled?: boolean;
}
```

### `StreakCounter` Component

```typescript
interface StreakCounterProps {
  /** Current streak count */
  count: number;
  
  /** Whether reviewed today */
  isActive: boolean;
  
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
}
```

### `WeeklyStatsChart` Component

```typescript
import type { DailyStat } from '../types';

interface WeeklyStatsChartProps {
  /** Daily stats for the week */
  data: DailyStat[];
  
  /** Chart height */
  height?: number;
  
  /** Whether to show rating breakdown */
  showBreakdown?: boolean;
}
```

### `SuggestedNext` Component

```typescript
import type { Problem, TopicProgress } from '../types';

interface SuggestedNextProps {
  /** Suggested problem */
  problem: Problem | null;
  
  /** Topic it's from */
  topic: TopicProgress | null;
  
  /** Reason for suggestion */
  reason: string;
  
  /** Called when problem is clicked */
  onSelect: (problem: Problem) => void;
  
  /** Called when refresh is clicked */
  onRefresh: () => void;
}
```

### `NextToUnlock` Component

```typescript
import type { TopicProgress } from '../types';

interface NextToUnlockProps {
  /** Current progress of the topic being worked on */
  currentTopic: TopicProgress;
  
  /** Next topic to unlock */
  nextTopic: TopicProgress;
  
  /** Problems needed to unlock */
  problemsNeeded: number;
}
```

### `ReviewSessionSummary` Component

```typescript
import type { ReviewResult } from '../types';

interface ReviewSessionSummaryProps {
  /** Results from the session */
  results: ReviewResult[];
  
  /** Session duration in seconds */
  duration: number;
  
  /** Called when done */
  onDone: () => void;
}
```
