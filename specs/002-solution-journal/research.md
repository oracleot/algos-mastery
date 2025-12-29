# Research: Solution Journal & Pattern Templates

**Feature**: 002-solution-journal  
**Date**: 2025-12-27  
**Status**: Complete

## Overview

Research findings for CodeMirror 6 integration, pattern templates design, and mastery calculation logic.

---

## 1. CodeMirror 6 Setup for React

### Decision: Use @uiw/react-codemirror wrapper

**Rationale**: Official CodeMirror 6 is vanilla JS. The @uiw/react-codemirror package provides React bindings with proper lifecycle management, reducing boilerplate significantly.

**Alternatives Considered**:
- **Raw CodeMirror 6**: More control but requires manual React integration, ref management
- **Monaco Editor**: Too heavy (~2MB), overkill for this use case
- **Prism.js**: Syntax highlighting only, not a full editor

### Implementation Pattern

```bash
npm install @uiw/react-codemirror @codemirror/lang-javascript @codemirror/lang-python @codemirror/lang-java @codemirror/lang-cpp @codemirror/lang-rust
```

```typescript
// lib/editor.ts
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import { java } from '@codemirror/lang-java';
import { cpp } from '@codemirror/lang-cpp';
import { rust } from '@codemirror/lang-rust';
import { go } from '@codemirror/lang-go';

export const LANGUAGE_EXTENSIONS = {
  javascript: javascript({ typescript: false }),
  typescript: javascript({ typescript: true }),
  python: python(),
  java: java(),
  cpp: cpp(),
  rust: rust(),
  go: go(),
} as const;

export type SupportedLanguage = keyof typeof LANGUAGE_EXTENSIONS;
```

```typescript
// components/SolutionEditor.tsx
import CodeMirror from '@uiw/react-codemirror';
import { LANGUAGE_EXTENSIONS, SupportedLanguage } from '../lib/editor';

interface SolutionEditorProps {
  value: string;
  language: SupportedLanguage;
  onChange: (value: string) => void;
  onLanguageChange: (lang: SupportedLanguage) => void;
}

export function SolutionEditor({ value, language, onChange, onLanguageChange }: SolutionEditorProps) {
  return (
    <CodeMirror
      value={value}
      height="400px"
      extensions={[LANGUAGE_EXTENSIONS[language]]}
      onChange={onChange}
      theme="dark" // or custom theme
    />
  );
}
```

### Lazy Loading Strategy

```typescript
// Lazy load editor to reduce initial bundle
const SolutionEditor = lazy(() => import('./components/SolutionEditor'));

// In component
<Suspense fallback={<EditorSkeleton />}>
  <SolutionEditor {...props} />
</Suspense>
```

---

## 2. Pattern Templates Design

### Decision: Store templates as static data with topic association

**Rationale**: Templates are read-only, predefined content. No need for database storage. TypeScript const assertions provide type safety.

### Template Structure

```typescript
// data/templates.ts
export interface Template {
  id: string;
  topic: TopicSlug;
  name: string;
  description: string;
  code: string;
  defaultLanguage: SupportedLanguage;
}

export const TEMPLATES: readonly Template[] = [
  {
    id: 'sliding-window',
    topic: 'sliding-window',
    name: 'Sliding Window',
    description: 'Variable-size window with expand/shrink logic',
    defaultLanguage: 'python',
    code: `def sliding_window(arr):
    """
    Sliding Window Pattern
    - Use for: subarray/substring problems with contiguous elements
    - Time: O(n), Space: O(1) or O(k) for window contents
    """
    left = 0
    result = 0  # or float('-inf') for max, float('inf') for min
    window_state = 0  # track window sum, count, or use dict/set
    
    for right in range(len(arr)):
        # Expand: add arr[right] to window
        window_state += arr[right]
        
        # Shrink: while window is invalid
        while window_invalid_condition:
            window_state -= arr[left]
            left += 1
        
        # Update result
        result = max(result, right - left + 1)  # or window_state
    
    return result`,
  },
  {
    id: 'binary-search',
    topic: 'binary-search',
    name: 'Binary Search',
    description: 'Standard binary search with boundary handling',
    defaultLanguage: 'python',
    code: `def binary_search(arr, target):
    """
    Binary Search Pattern
    - Use for: sorted arrays, finding boundaries, search space reduction
    - Time: O(log n), Space: O(1)
    """
    left, right = 0, len(arr) - 1
    
    while left <= right:
        mid = left + (right - left) // 2  # Avoid overflow
        
        if arr[mid] == target:
            return mid  # Found
        elif arr[mid] < target:
            left = mid + 1  # Search right half
        else:
            right = mid - 1  # Search left half
    
    return -1  # Not found (or return left for insertion point)`,
  },
  // ... more templates for each topic
] as const;
```

### Full Template List

| Topic | Template Name | Key Pattern |
|-------|--------------|-------------|
| sliding-window | Sliding Window | left/right pointers, expand/shrink |
| binary-search | Binary Search | low/high/mid, boundary adjustment |
| two-pointers | Two Pointers | sorted array, converging pointers |
| stack | Monotonic Stack | maintain sorted stack property |
| trees | DFS Tree Traversal | recursive with base case |
| trees | BFS Level Order | queue-based traversal |
| graphs | Graph BFS | queue, visited set |
| graphs | Graph DFS | recursion or stack, visited set |
| backtracking | Backtracking | choose/explore/unchoose |
| dynamic-programming | DP Memoization | cache + recursion |
| dynamic-programming | DP Tabulation | table + iteration |
| heap | Top-K Pattern | heap with size limit |
| greedy | Greedy Interval | sort + local choice |

---

## 3. Mastery Calculation Logic

### Decision: Calculate mastery on-demand from problem data

**Rationale**: Storing mastery would require updates on every problem status change. Calculating from source data ensures consistency.

### Implementation

```typescript
// lib/mastery.ts
import { db } from './db';
import { TOPICS } from '../data/topics';
import type { TopicSlug, TopicProgress } from '../types';

const MASTERY_THRESHOLD = 0.70; // 70% to unlock next

export async function calculateTopicProgress(): Promise<TopicProgress[]> {
  const problems = await db.problems.toArray();
  
  return TOPICS.map((topic, index) => {
    const topicProblems = problems.filter(p => p.topic === topic.slug);
    const solvedProblems = topicProblems.filter(p => p.status === 'solved');
    
    const totalProblems = topicProblems.length;
    const solvedCount = solvedProblems.length;
    const masteryPercent = totalProblems > 0 
      ? Math.round((solvedCount / totalProblems) * 100) 
      : 0;
    
    // First topic always unlocked
    // Others unlock when previous reaches 70%
    let unlocked = index === 0;
    if (index > 0) {
      const prevTopic = TOPICS[index - 1];
      const prevProblems = problems.filter(p => p.topic === prevTopic.slug);
      const prevSolved = prevProblems.filter(p => p.status === 'solved');
      const prevMastery = prevProblems.length > 0 
        ? prevSolved.length / prevProblems.length 
        : 0;
      unlocked = prevMastery >= MASTERY_THRESHOLD;
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

### Hook Integration

```typescript
// hooks/useProgress.ts
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../lib/db';
import { calculateTopicProgress } from '../lib/mastery';

export function useProgress() {
  // Re-calculate when problems change
  const progress = useLiveQuery(
    () => calculateTopicProgress(),
    [] // dependencies
  );
  
  return {
    progress,
    isLoading: progress === undefined,
  };
}
```

---

## 4. Database Schema Extension

### Decision: Add solutions table to existing Dexie database

```typescript
// lib/db.ts (extended)
import Dexie, { type Table } from 'dexie';
import type { Problem, Solution } from '../types';

export class AlgoMasteryDB extends Dexie {
  problems!: Table<Problem>;
  solutions!: Table<Solution>;

  constructor() {
    super('AlgoMasteryDB');
    
    // Version 1: Problems only (MVP)
    this.version(1).stores({
      problems: 'id, topic, difficulty, status, createdAt'
    });
    
    // Version 2: Add solutions
    this.version(2).stores({
      problems: 'id, topic, difficulty, status, createdAt',
      solutions: 'id, problemId, language, createdAt'
    });
  }
}
```

---

## 5. Copy to Clipboard

### Decision: Use Clipboard API with fallback

```typescript
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Fallback for older browsers
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    const success = document.execCommand('copy');
    document.body.removeChild(textarea);
    return success;
  }
}
```

---

## Summary

All technical decisions documented. Ready for Phase 1 design.
