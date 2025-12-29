# Data Model: Timed Practice & Polish

**Feature**: 004-practice-polish  
**Date**: 2025-12-27  
**Status**: Complete

---

## Entity Overview

```
┌─────────────────────────────────────────────────────────┐
│                 PracticeSession (memory)                 │
├─────────────────────────────────────────────────────────┤
│ id: string                                              │
│ problemId: string | null                                │
│ startedAt: Date                                         │
│ duration: number (seconds)                              │
│ elapsed: number (seconds)                               │
│ isRunning: boolean                                      │
│ isPaused: boolean                                       │
│ problemsCompleted: string[]                             │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                 ProblemTimeLog (persisted)               │
├─────────────────────────────────────────────────────────┤
│ problemId: string (PK)                                  │
│ totalSeconds: number                                    │
│ sessions: TimeSession[]                                 │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│               UserPreferences (localStorage)             │
├─────────────────────────────────────────────────────────┤
│ theme: 'light' | 'dark' | 'system'                      │
│ defaultTimerMinutes: number                             │
│ keyboardShortcutsEnabled: boolean                       │
│ showInstallPrompt: boolean                              │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                    ExportData (file)                     │
├─────────────────────────────────────────────────────────┤
│ version: string                                         │
│ exportedAt: string (ISO)                                │
│ checksum: string (SHA-256)                              │
│ data: { problems, solutions, reviews, reviewHistory,    │
│         timeLogs }                                      │
└─────────────────────────────────────────────────────────┘
```

---

## Entities

### ProblemTimeLog (NEW - Persisted in IndexedDB)

Tracks time spent on each problem across practice sessions.

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `problemId` | `string` | Yes | - | PK, FK to Problem |
| `totalSeconds` | `number` | Yes | 0 | Cumulative time spent |
| `sessions` | `TimeSession[]` | Yes | [] | Individual practice sessions |

```typescript
interface TimeSession {
  startedAt: Date;
  endedAt: Date;
  durationSeconds: number;
}
```

**Indexes**:
- Primary: `problemId`

### UserPreferences (localStorage - Not IndexedDB)

User settings that should persist across sessions but don't need syncing.

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `theme` | `'light' \| 'dark' \| 'system'` | `'system'` | Color theme preference |
| `defaultTimerMinutes` | `number` | `45` | Default practice timer |
| `keyboardShortcutsEnabled` | `boolean` | `true` | Global shortcuts toggle |
| `showInstallPrompt` | `boolean` | `true` | Show PWA install banner |

### ExportData (File Format)

Structure of exported JSON files.

| Field | Type | Description |
|-------|------|-------------|
| `version` | `string` | Export format version (semver) |
| `exportedAt` | `string` | ISO timestamp of export |
| `appVersion` | `string` | App version that created export |
| `checksum` | `string` | SHA-256 hash of data payload |
| `data` | `object` | All app data |

---

## TypeScript Interfaces

```typescript
// types/index.ts (additions)

export interface TimeSession {
  startedAt: Date;
  endedAt: Date;
  durationSeconds: number;
}

export interface ProblemTimeLog {
  problemId: string;
  totalSeconds: number;
  sessions: TimeSession[];
}

export interface PracticeSessionState {
  id: string;
  problemId: string | null;
  startedAt: Date;
  duration: number;
  elapsed: number;
  remaining: number;
  isRunning: boolean;
  isPaused: boolean;
  problemsCompleted: string[];
}

export type Theme = 'light' | 'dark' | 'system';

export interface UserPreferences {
  theme: Theme;
  defaultTimerMinutes: number;
  keyboardShortcutsEnabled: boolean;
  showInstallPrompt: boolean;
}

export interface ExportData {
  version: string;
  exportedAt: string;
  appVersion: string;
  checksum: string;
  data: {
    problems: Problem[];
    solutions: Solution[];
    reviews: Review[];
    reviewHistory: ReviewHistory[];
    timeLogs: ProblemTimeLog[];
  };
}

export interface ImportResult {
  success: boolean;
  error?: string;
  stats?: {
    problems: number;
    solutions: number;
    reviews: number;
  };
}

// Keyboard shortcuts
export interface ShortcutDefinition {
  key: string;
  description: string;
  context: 'global' | 'review' | 'practice' | 'problems';
}

export const SHORTCUTS: ShortcutDefinition[] = [
  { key: '?', description: 'Show keyboard shortcuts', context: 'global' },
  { key: '/', description: 'Focus search', context: 'global' },
  { key: 'Escape', description: 'Close modal / Cancel', context: 'global' },
  { key: 'n', description: 'New problem', context: 'problems' },
  { key: 'r', description: 'Reveal solution', context: 'review' },
  { key: '1', description: 'Rate: Again', context: 'review' },
  { key: '2', description: 'Rate: Hard', context: 'review' },
  { key: '3', description: 'Rate: Good', context: 'review' },
  { key: '4', description: 'Rate: Easy', context: 'review' },
  { key: 'Space', description: 'Pause/Resume timer', context: 'practice' },
];
```

---

## Dexie Schema (v4)

```typescript
// lib/db.ts (final version)

export class AlgoMasteryDB extends Dexie {
  problems!: Table<Problem>;
  solutions!: Table<Solution>;
  reviews!: Table<Review>;
  reviewHistory!: Table<ReviewHistory>;
  timeLogs!: Table<ProblemTimeLog>;

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
    
    this.version(4).stores({
      problems: 'id, topic, difficulty, status, createdAt',
      solutions: 'id, problemId, language, createdAt',
      reviews: 'problemId, nextReview',
      reviewHistory: 'id, problemId, reviewedAt',
      timeLogs: 'problemId'
    });
  }
}
```

---

## Preferences Storage

```typescript
// lib/preferences.ts

const PREFERENCES_KEY = 'algomasteryPreferences';

const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'system',
  defaultTimerMinutes: 45,
  keyboardShortcutsEnabled: true,
  showInstallPrompt: true,
};

export function getPreferences(): UserPreferences {
  try {
    const stored = localStorage.getItem(PREFERENCES_KEY);
    if (!stored) return DEFAULT_PREFERENCES;
    return { ...DEFAULT_PREFERENCES, ...JSON.parse(stored) };
  } catch {
    return DEFAULT_PREFERENCES;
  }
}

export function setPreferences(prefs: Partial<UserPreferences>): void {
  const current = getPreferences();
  const updated = { ...current, ...prefs };
  localStorage.setItem(PREFERENCES_KEY, JSON.stringify(updated));
}

export function resetPreferences(): void {
  localStorage.removeItem(PREFERENCES_KEY);
}
```

---

## Time Logging

```typescript
// lib/timeLog.ts

export async function logTime(problemId: string, session: TimeSession): Promise<void> {
  const existing = await db.timeLogs.get(problemId);
  
  if (existing) {
    await db.timeLogs.update(problemId, {
      totalSeconds: existing.totalSeconds + session.durationSeconds,
      sessions: [...existing.sessions, session],
    });
  } else {
    await db.timeLogs.add({
      problemId,
      totalSeconds: session.durationSeconds,
      sessions: [session],
    });
  }
}

export async function getTimeForProblem(problemId: string): Promise<number> {
  const log = await db.timeLogs.get(problemId);
  return log?.totalSeconds ?? 0;
}
```

---

## Cascade Behavior

When a **Problem is deleted**:
- **ProblemTimeLog** MUST be deleted (from Phase 4)
- Solutions, Reviews, ReviewHistory cascaded (from previous phases)

```typescript
export async function deleteProblemCascade(problemId: string): Promise<void> {
  await db.transaction('rw', 
    [db.problems, db.solutions, db.reviews, db.reviewHistory, db.timeLogs], 
    async () => {
      await db.timeLogs.delete(problemId);
      await db.reviewHistory.where('problemId').equals(problemId).delete();
      await db.reviews.delete(problemId);
      await db.solutions.where('problemId').equals(problemId).delete();
      await db.problems.delete(problemId);
    }
  );
}
```
