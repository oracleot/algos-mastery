# Data Model: Solution Journal & Pattern Templates

**Feature**: 002-solution-journal  
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
│ title, topic, difficulty, status, notes, etc.           │
└───────────────────────────┬─────────────────────────────┘
                            │ 1:N
                            ▼
┌─────────────────────────────────────────────────────────┐
│                      Solution                            │
├─────────────────────────────────────────────────────────┤
│ id: string (UUID)                                       │
│ problemId: string (FK → Problem.id)                     │
│ code: string (the solution code)                        │
│ language: SupportedLanguage                             │
│ createdAt: Date                                         │
│ updatedAt: Date                                         │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                  Template (static)                       │
├─────────────────────────────────────────────────────────┤
│ id: string                                              │
│ topic: TopicSlug                                        │
│ name: string                                            │
│ description: string                                     │
│ code: string                                            │
│ defaultLanguage: SupportedLanguage                      │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│              TopicProgress (computed)                    │
├─────────────────────────────────────────────────────────┤
│ topic: TopicSlug                                        │
│ topicName: string                                       │
│ totalProblems: number                                   │
│ solvedProblems: number                                  │
│ masteryPercent: number (0-100)                          │
│ unlocked: boolean                                       │
└─────────────────────────────────────────────────────────┘
```

---

## Entities

### Solution (NEW - Persisted)

A code solution associated with a problem. Multiple solutions per problem are allowed.

| Field | Type | Required | Default | Constraints | Description |
|-------|------|----------|---------|-------------|-------------|
| `id` | `string` | Yes | auto-gen | UUID v4 | Unique identifier |
| `problemId` | `string` | Yes | - | must exist in problems | Reference to parent problem |
| `code` | `string` | Yes | - | non-empty | The solution code |
| `language` | `SupportedLanguage` | Yes | - | valid language | Programming language |
| `createdAt` | `Date` | Yes | auto-set | - | When solution was created |
| `updatedAt` | `Date` | Yes | auto-set | - | When solution was last modified |

**Indexes**:
- Primary: `id`
- Secondary: `problemId` (for fetching solutions by problem), `createdAt`

### Template (Static - Not Persisted)

Pre-defined code pattern for algorithm categories. Stored in source code, not database.

| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Unique identifier (e.g., 'sliding-window') |
| `topic` | `TopicSlug` | Associated algorithm topic |
| `name` | `string` | Display name (e.g., 'Sliding Window') |
| `description` | `string` | Brief explanation of when to use |
| `code` | `string` | Template code with comments |
| `defaultLanguage` | `SupportedLanguage` | Default language (usually Python) |

### TopicProgress (Computed - Not Persisted)

Calculated mastery information per topic. Computed on-demand from Problem data.

| Field | Type | Description |
|-------|------|-------------|
| `topic` | `TopicSlug` | Topic identifier |
| `topicName` | `string` | Display name |
| `totalProblems` | `number` | Count of problems in topic |
| `solvedProblems` | `number` | Count of solved problems |
| `masteryPercent` | `number` | Percentage (0-100) |
| `unlocked` | `boolean` | Whether topic is accessible |

---

## TypeScript Interfaces

```typescript
// types/index.ts (additions)

export const SUPPORTED_LANGUAGES = [
  'javascript',
  'typescript', 
  'python',
  'java',
  'cpp',
  'rust',
  'go',
  'plaintext',
] as const;
export type SupportedLanguage = typeof SUPPORTED_LANGUAGES[number];

export interface Solution {
  id: string;
  problemId: string;
  code: string;
  language: SupportedLanguage;
  createdAt: Date;
  updatedAt: Date;
}

export interface SolutionFormData {
  code: string;
  language: SupportedLanguage;
}

export interface Template {
  id: string;
  topic: TopicSlug;
  name: string;
  description: string;
  code: string;
  defaultLanguage: SupportedLanguage;
}

export interface TopicProgress {
  topic: TopicSlug;
  topicName: string;
  totalProblems: number;
  solvedProblems: number;
  masteryPercent: number;
  unlocked: boolean;
}
```

---

## Dexie Schema (v2)

```typescript
// lib/db.ts (updated)

import Dexie, { type Table } from 'dexie';
import type { Problem, Solution } from '../types';

export class AlgoMasteryDB extends Dexie {
  problems!: Table<Problem>;
  solutions!: Table<Solution>;

  constructor() {
    super('AlgoMasteryDB');
    
    this.version(1).stores({
      problems: 'id, topic, difficulty, status, createdAt'
    });
    
    this.version(2).stores({
      problems: 'id, topic, difficulty, status, createdAt',
      solutions: 'id, problemId, language, createdAt'
    });
  }
}

export const db = new AlgoMasteryDB();
```

---

## Validation Rules

### Solution

| Field | Rule | Error Message |
|-------|------|---------------|
| `code` | Required, non-empty after trim | "Solution code is required" |
| `code` | Max 50,000 characters | "Solution too long (max 50,000 chars)" |
| `language` | Required, must be valid SupportedLanguage | "Please select a language" |
| `problemId` | Must reference existing problem | "Problem not found" |

```typescript
// lib/validation.ts (additions)

import { SUPPORTED_LANGUAGES, type SolutionFormData } from '../types';

export interface SolutionValidationErrors {
  code?: string;
  language?: string;
}

export function validateSolution(data: SolutionFormData): SolutionValidationErrors {
  const errors: SolutionValidationErrors = {};

  if (!data.code.trim()) {
    errors.code = 'Solution code is required';
  } else if (data.code.length > 50000) {
    errors.code = 'Solution too long (max 50,000 chars)';
  }

  if (!SUPPORTED_LANGUAGES.includes(data.language)) {
    errors.language = 'Please select a language';
  }

  return errors;
}
```

---

## Query Patterns

### Solutions

| Query | Dexie Implementation |
|-------|---------------------|
| Solutions for problem | `db.solutions.where('problemId').equals(id).toArray()` |
| Solutions sorted by date | `db.solutions.where('problemId').equals(id).reverse().sortBy('createdAt')` |
| Delete solution | `db.solutions.delete(id)` |
| Delete all for problem | `db.solutions.where('problemId').equals(problemId).delete()` |

### Mastery Calculation

```typescript
export async function calculateTopicProgress(): Promise<TopicProgress[]> {
  const problems = await db.problems.toArray();
  
  return TOPICS.map((topic, index) => {
    const topicProblems = problems.filter(p => p.topic === topic.slug);
    const solvedCount = topicProblems.filter(p => p.status === 'solved').length;
    const totalProblems = topicProblems.length;
    
    const masteryPercent = totalProblems > 0 
      ? Math.round((solvedCount / totalProblems) * 100) 
      : 0;
    
    // Unlock logic: first topic always unlocked, others need 70% on previous
    let unlocked = index === 0;
    if (index > 0) {
      const prevTopic = TOPICS[index - 1]!;
      const prevProblems = problems.filter(p => p.topic === prevTopic.slug);
      const prevSolved = prevProblems.filter(p => p.status === 'solved').length;
      unlocked = prevProblems.length > 0 && (prevSolved / prevProblems.length) >= 0.70;
    }
    
    return {
      topic: topic.slug,
      topicName: topic.name,
      totalProblems,
      solvedProblems: solvedCount,
      masteryPercent,
      unlocked,
    };
  });
}
```

---

## Cascade Behavior

When a **Problem is deleted**:
- All associated **Solutions** MUST be deleted
- Mastery percentages recalculate automatically (computed from remaining data)

```typescript
export async function deleteProblemWithSolutions(problemId: string): Promise<void> {
  await db.transaction('rw', [db.problems, db.solutions], async () => {
    await db.solutions.where('problemId').equals(problemId).delete();
    await db.problems.delete(problemId);
  });
}
```
