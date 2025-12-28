# Data Model: MVP Project Setup

**Feature**: 001-mvp-project-setup  
**Date**: 2025-12-27  
**Status**: Complete

---

## Entity Overview

```
┌─────────────────────────────────────────────────────────┐
│                      Problem                             │
├─────────────────────────────────────────────────────────┤
│ id: string (auto-generated UUID)                        │
│ title: string (required)                                │
│ url: string | null                                      │
│ topic: TopicSlug (required)                             │
│ difficulty: Difficulty (required)                       │
│ status: Status (default: 'unsolved')                    │
│ notes: string (default: '')                             │
│ createdAt: Date (auto-set)                              │
│ updatedAt: Date (auto-set)                              │
└─────────────────────────────────────────────────────────┘
          │
          │ references
          ▼
┌─────────────────────────────────────────────────────────┐
│                     Topic (static)                       │
├─────────────────────────────────────────────────────────┤
│ slug: string (primary key)                              │
│ name: string (display name)                             │
│ order: number (1-15, learning progression)              │
└─────────────────────────────────────────────────────────┘
```

---

## Entities

### Problem

The core entity representing an algorithm problem to practice.

| Field | Type | Required | Default | Constraints | Description |
|-------|------|----------|---------|-------------|-------------|
| `id` | `string` | Yes | auto-gen | UUID v4 | Unique identifier |
| `title` | `string` | Yes | - | non-empty, max 200 chars | Problem name (e.g., "Two Sum") |
| `url` | `string \| null` | No | `null` | valid URL format if present | Link to problem (LeetCode, etc.) |
| `topic` | `TopicSlug` | Yes | - | must be valid topic slug | Algorithm category |
| `difficulty` | `Difficulty` | Yes | - | 'easy' \| 'medium' \| 'hard' | Problem difficulty level |
| `status` | `Status` | Yes | `'unsolved'` | 'unsolved' \| 'attempted' \| 'solved' | Current progress state |
| `notes` | `string` | No | `''` | max 5000 chars | Personal notes, approach ideas |
| `createdAt` | `Date` | Yes | auto-set | - | Timestamp of creation |
| `updatedAt` | `Date` | Yes | auto-set | - | Timestamp of last modification |

**Indexes** (for efficient querying):
- Primary: `id`
- Secondary: `topic`, `difficulty`, `status`, `createdAt`

### Topic (Static/Enum)

Represents the 15 algorithm categories. This is static data, not stored in IndexedDB.

| Field | Type | Description |
|-------|------|-------------|
| `slug` | `string` | URL-safe identifier (e.g., 'arrays-hashing') |
| `name` | `string` | Display name (e.g., 'Arrays & Hashing') |
| `order` | `number` | Position in learning progression (1-15) |

**Values**:
1. `arrays-hashing` - "Arrays & Hashing"
2. `two-pointers` - "Two Pointers"
3. `sliding-window` - "Sliding Window"
4. `stack` - "Stack"
5. `binary-search` - "Binary Search"
6. `linked-list` - "Linked List"
7. `trees` - "Trees"
8. `tries` - "Tries"
9. `backtracking` - "Backtracking"
10. `heap` - "Heap / Priority Queue"
11. `graphs` - "Graphs"
12. `dynamic-programming` - "Dynamic Programming"
13. `greedy` - "Greedy"
14. `intervals` - "Intervals"
15. `bit-manipulation` - "Bit Manipulation"

---

## TypeScript Interfaces

```typescript
// types/index.ts

export const DIFFICULTIES = ['easy', 'medium', 'hard'] as const;
export type Difficulty = typeof DIFFICULTIES[number];

export const STATUSES = ['unsolved', 'attempted', 'solved'] as const;
export type Status = typeof STATUSES[number];

export const TOPIC_SLUGS = [
  'arrays-hashing',
  'two-pointers', 
  'sliding-window',
  'stack',
  'binary-search',
  'linked-list',
  'trees',
  'tries',
  'backtracking',
  'heap',
  'graphs',
  'dynamic-programming',
  'greedy',
  'intervals',
  'bit-manipulation',
] as const;
export type TopicSlug = typeof TOPIC_SLUGS[number];

export interface Topic {
  slug: TopicSlug;
  name: string;
  order: number;
}

export interface Problem {
  id: string;
  title: string;
  url: string | null;
  topic: TopicSlug;
  difficulty: Difficulty;
  status: Status;
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

// Form data type (for create/update operations)
export interface ProblemFormData {
  title: string;
  url: string;
  topic: TopicSlug | '';
  difficulty: Difficulty | '';
  notes: string;
}

// Filter state type
export interface ProblemFilters {
  topic: TopicSlug | null;
  difficulty: Difficulty | null;
  status: Status | null;
  search: string;
}
```

---

## Dexie Schema Definition

```typescript
// lib/db.ts

import Dexie, { type Table } from 'dexie';
import type { Problem } from '../types';

export class AlgoMasteryDB extends Dexie {
  problems!: Table<Problem>;

  constructor() {
    super('AlgoMasteryDB');
    
    this.version(1).stores({
      // Primary key: id (auto-generated)
      // Indexed fields: topic, difficulty, status, createdAt
      problems: 'id, topic, difficulty, status, createdAt'
    });
  }
}

export const db = new AlgoMasteryDB();
```

---

## State Transitions

### Problem Status

```
┌───────────┐      mark attempted      ┌────────────┐
│  unsolved │ ─────────────────────▶  │  attempted  │
└───────────┘                          └────────────┘
      │                                      │
      │          mark solved                 │ mark solved
      │                                      │
      └──────────────────┬───────────────────┘
                         │
                         ▼
                  ┌────────────┐
                  │   solved   │
                  └────────────┘

Note: Status can be changed to any other status at any time (bidirectional)
```

---

## Validation Rules

### Problem Creation/Update

| Field | Rule | Error Message |
|-------|------|---------------|
| `title` | Required, non-empty after trim | "Title is required" |
| `title` | Max 200 characters | "Title must be 200 characters or less" |
| `topic` | Required, must be valid TopicSlug | "Topic is required" |
| `difficulty` | Required, must be valid Difficulty | "Difficulty is required" |
| `url` | If provided, must be valid URL format | "Please enter a valid URL" |
| `notes` | Max 5000 characters | "Notes must be 5000 characters or less" |

### Validation Function

```typescript
// lib/validation.ts

import type { ProblemFormData } from '../types';
import { TOPIC_SLUGS, DIFFICULTIES } from '../types';

export interface ValidationErrors {
  title?: string;
  topic?: string;
  difficulty?: string;
  url?: string;
  notes?: string;
}

export function validateProblem(data: ProblemFormData): ValidationErrors {
  const errors: ValidationErrors = {};

  // Title validation
  if (!data.title.trim()) {
    errors.title = 'Title is required';
  } else if (data.title.length > 200) {
    errors.title = 'Title must be 200 characters or less';
  }

  // Topic validation
  if (!data.topic) {
    errors.topic = 'Topic is required';
  } else if (!TOPIC_SLUGS.includes(data.topic as any)) {
    errors.topic = 'Invalid topic selected';
  }

  // Difficulty validation
  if (!data.difficulty) {
    errors.difficulty = 'Difficulty is required';
  } else if (!DIFFICULTIES.includes(data.difficulty as any)) {
    errors.difficulty = 'Invalid difficulty selected';
  }

  // URL validation (optional)
  if (data.url && data.url.trim()) {
    try {
      new URL(data.url);
    } catch {
      errors.url = 'Please enter a valid URL';
    }
  }

  // Notes validation
  if (data.notes && data.notes.length > 5000) {
    errors.notes = 'Notes must be 5000 characters or less';
  }

  return errors;
}

export function isValid(errors: ValidationErrors): boolean {
  return Object.keys(errors).length === 0;
}
```

---

## Query Patterns

### Common Queries

| Query | Dexie Implementation |
|-------|---------------------|
| All problems | `db.problems.toArray()` |
| By topic | `db.problems.where('topic').equals(slug).toArray()` |
| By difficulty | `db.problems.where('difficulty').equals(level).toArray()` |
| By status | `db.problems.where('status').equals(status).toArray()` |
| Sorted by date | `db.problems.orderBy('createdAt').reverse().toArray()` |
| Combined filters | Use Collection chaining or filter in memory |

### Filter Implementation

```typescript
export async function getFilteredProblems(filters: ProblemFilters): Promise<Problem[]> {
  let collection = db.problems.toCollection();
  
  // Apply indexed filters first for efficiency
  let results = await collection.toArray();
  
  // Apply filters in memory (Dexie doesn't support compound queries well)
  if (filters.topic) {
    results = results.filter(p => p.topic === filters.topic);
  }
  if (filters.difficulty) {
    results = results.filter(p => p.difficulty === filters.difficulty);
  }
  if (filters.status) {
    results = results.filter(p => p.status === filters.status);
  }
  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    results = results.filter(p => 
      p.title.toLowerCase().includes(searchLower) ||
      p.notes.toLowerCase().includes(searchLower)
    );
  }
  
  // Sort by creation date, newest first
  return results.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}
```

---

## Migration Strategy

For future schema changes:

```typescript
// Adding a new field in version 2
this.version(2).stores({
  problems: 'id, topic, difficulty, status, createdAt'
}).upgrade(tx => {
  return tx.table('problems').toCollection().modify(problem => {
    // Initialize new fields with defaults
    problem.newField = defaultValue;
  });
});
```
