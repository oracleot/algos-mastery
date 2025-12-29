# Research: MVP Project Setup

**Feature**: 001-mvp-project-setup  
**Date**: 2025-12-27  
**Status**: Complete

## Overview

This document consolidates research findings for the MVP implementation. No NEEDS CLARIFICATION items were present in the Technical Context—all technology choices are defined in PRODUCT_PLAN.md.

---

## 1. Dexie.js Best Practices for React

### Decision: Use Dexie.js with useLiveQuery hook

**Rationale**: Dexie.js provides the best DX for IndexedDB with native React integration via `dexie-react-hooks`. The `useLiveQuery` hook automatically subscribes to database changes and re-renders components when data changes.

**Alternatives Considered**:
- **Raw IndexedDB API**: Too verbose, requires manual transaction handling
- **idb (by Jake Archibald)**: Lighter but lacks React hooks integration
- **localForage**: Simple key-value only, not suitable for complex queries

### Implementation Pattern

```typescript
// lib/db.ts
import Dexie, { type Table } from 'dexie';
import type { Problem } from '../types';

export class AlgoMasteryDB extends Dexie {
  problems!: Table<Problem>;

  constructor() {
    super('AlgoMasteryDB');
    this.version(1).stores({
      problems: '++id, topic, difficulty, status, createdAt'
    });
  }
}

export const db = new AlgoMasteryDB();
```

```typescript
// hooks/useProblems.ts
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../lib/db';

export function useProblems(filters?: Filters) {
  return useLiveQuery(
    () => db.problems.where(filters).toArray(),
    [filters]
  );
}
```

---

## 2. Testing with fake-indexeddb

### Decision: Use fake-indexeddb for all Dexie.js tests

**Rationale**: Constitution requires "No Mocking IndexedDB in Integration Tests." fake-indexeddb provides a complete in-memory implementation that allows testing real database behavior.

**Alternatives Considered**:
- **jest.mock()**: Violates constitution, doesn't test real DB behavior
- **happy-dom with indexeddb**: Less mature, potential compatibility issues

### Implementation Pattern

```typescript
// tests/setup.ts
import 'fake-indexeddb/auto';

// tests/lib/db.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { db } from '../../src/lib/db';

beforeEach(async () => {
  await db.problems.clear();
});

describe('Problem CRUD', () => {
  it('creates a problem', async () => {
    const id = await db.problems.add({
      title: 'Two Sum',
      topic: 'arrays-hashing',
      difficulty: 'easy',
      status: 'unsolved',
      createdAt: new Date()
    });
    expect(id).toBeDefined();
  });
});
```

---

## 3. Topic Taxonomy Structure

### Decision: Use slug-based keys with display names and order index

**Rationale**: Slugs enable URL-safe filtering, order index enables progression ladder, display names ensure proper UI rendering.

**Alternatives Considered**:
- **Numeric IDs only**: Loses semantic meaning
- **Display names as keys**: Case-sensitivity issues, URL-encoding needed

### Implementation Pattern

```typescript
// data/topics.ts
export const TOPICS = [
  { slug: 'arrays-hashing', name: 'Arrays & Hashing', order: 1 },
  { slug: 'two-pointers', name: 'Two Pointers', order: 2 },
  { slug: 'sliding-window', name: 'Sliding Window', order: 3 },
  { slug: 'stack', name: 'Stack', order: 4 },
  { slug: 'binary-search', name: 'Binary Search', order: 5 },
  { slug: 'linked-list', name: 'Linked List', order: 6 },
  { slug: 'trees', name: 'Trees', order: 7 },
  { slug: 'tries', name: 'Tries', order: 8 },
  { slug: 'backtracking', name: 'Backtracking', order: 9 },
  { slug: 'heap', name: 'Heap / Priority Queue', order: 10 },
  { slug: 'graphs', name: 'Graphs', order: 11 },
  { slug: 'dynamic-programming', name: 'Dynamic Programming', order: 12 },
  { slug: 'greedy', name: 'Greedy', order: 13 },
  { slug: 'intervals', name: 'Intervals', order: 14 },
  { slug: 'bit-manipulation', name: 'Bit Manipulation', order: 15 },
] as const;

export type TopicSlug = typeof TOPICS[number]['slug'];
```

---

## 4. Form Validation Approach

### Decision: Use React Hook Form with Zod schema validation

**Rationale**: Constitution requires explicit type annotations and form validation. Zod provides compile-time type safety with runtime validation. React Hook Form offers excellent performance with uncontrolled inputs.

**Alternatives Considered**:
- **Manual validation**: Error-prone, more code
- **Formik**: Heavier, less TypeScript-native
- **Native HTML validation**: Limited error messaging

**Note**: React Hook Form and Zod are not in the initial dependency list. For MVP, can use simple controlled form state with manual validation to minimize bundle size. Consider adding for V1.

### MVP Implementation Pattern (no extra deps)

```typescript
const [errors, setErrors] = useState<Record<string, string>>({});

function validate(data: ProblemFormData): boolean {
  const newErrors: Record<string, string> = {};
  
  if (!data.title.trim()) {
    newErrors.title = 'Title is required';
  }
  if (!data.topic) {
    newErrors.topic = 'Topic is required';
  }
  if (!data.difficulty) {
    newErrors.difficulty = 'Difficulty is required';
  }
  
  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
}
```

---

## 5. UI Component Patterns

### Decision: Use Tailwind CSS utility classes exclusively with Lucide icons

**Rationale**: Constitution prohibits custom CSS except for CodeMirror theming. Tailwind provides all needed utilities for responsive, accessible UI.

**Component Library Decision**: Build minimal UI components from scratch rather than adding shadcn/ui or Radix to minimize bundle size for MVP.

### Key Patterns

- **Buttons**: Use `<button>` with Tailwind classes, include `focus:ring-2` for keyboard accessibility
- **Inputs**: Use `<input>` with `aria-invalid` and `aria-describedby` for error states
- **Modals**: Use `<dialog>` element for native focus trapping (Safari 15.4+)
- **Badges**: `<span>` with topic/difficulty color coding via Tailwind

---

## 6. Persistence Feedback Pattern

### Decision: Use toast notifications for save/delete confirmations

**Rationale**: Constitution requires "Data persistence feedback" for any action modifying IndexedDB.

**Implementation Approach**: Create simple Toast component that auto-dismisses after 3 seconds.

```typescript
// Simple toast state management
const [toast, setToast] = useState<{message: string; type: 'success'|'error'} | null>(null);

// Show toast after successful save
setToast({ message: 'Problem saved', type: 'success' });
setTimeout(() => setToast(null), 3000);
```

---

## 7. Project Setup Commands

### Decision: Use Vite with React + TypeScript + Tailwind template

**Rationale**: Fastest setup path with all required tooling pre-configured.

```bash
# Project initialization
npm create vite@latest algos-mastery -- --template react-ts
cd algos-mastery
npm install

# Add Tailwind CSS
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# Add core dependencies
npm install dexie dexie-react-hooks lucide-react react-router-dom

# Add dev dependencies
npm install -D vitest @testing-library/react @testing-library/jest-dom \
  jsdom fake-indexeddb @types/node
```

---

## Summary

All technology decisions are now documented with rationale. No NEEDS CLARIFICATION items remain. Ready to proceed to Phase 1: Design & Contracts.
