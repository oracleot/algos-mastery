# Quickstart: Solution Journal & Pattern Templates

**Feature**: 002-solution-journal  
**Date**: 2025-12-27  
**Depends On**: 001-mvp-project-setup must be complete

---

## Prerequisites

- MVP (001-mvp-project-setup) is implemented and working
- Problem CRUD functionality is operational
- IndexedDB with Dexie.js is set up

---

## Install Additional Dependencies

```bash
# CodeMirror 6 with React wrapper
npm install @uiw/react-codemirror

# Language support packages
npm install @codemirror/lang-javascript @codemirror/lang-python \
  @codemirror/lang-java @codemirror/lang-cpp @codemirror/lang-rust \
  @codemirror/lang-go

# Theme (optional - for dark mode)
npm install @uiw/codemirror-theme-github
```

---

## Database Migration

Update the database schema to version 2:

```typescript
// lib/db.ts - add solutions table
this.version(2).stores({
  problems: 'id, topic, difficulty, status, createdAt',
  solutions: 'id, problemId, language, createdAt'
});
```

The migration happens automatically when the app loads.

---

## New Files to Create

### Types

Add to `src/types/index.ts`:

```typescript
export const SUPPORTED_LANGUAGES = [
  'javascript', 'typescript', 'python', 'java', 
  'cpp', 'rust', 'go', 'plaintext',
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

### Editor Setup

Create `src/lib/editor.ts`:

```typescript
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import { java } from '@codemirror/lang-java';
import { cpp } from '@codemirror/lang-cpp';
import { rust } from '@codemirror/lang-rust';
import { go } from '@codemirror/lang-go';
import type { Extension } from '@codemirror/state';
import type { SupportedLanguage } from '../types';

export function getLanguageExtension(lang: SupportedLanguage): Extension {
  switch (lang) {
    case 'javascript': return javascript();
    case 'typescript': return javascript({ typescript: true });
    case 'python': return python();
    case 'java': return java();
    case 'cpp': return cpp();
    case 'rust': return rust();
    case 'go': return go();
    default: return [];
  }
}
```

### Templates Data

Create `src/data/templates.ts` with all pattern templates (see research.md for full list).

### Mastery Logic

Create `src/lib/mastery.ts`:

```typescript
import { db } from './db';
import { TOPICS } from '../data/topics';
import type { TopicProgress } from '../types';

const MASTERY_THRESHOLD = 0.70;

export async function calculateTopicProgress(): Promise<TopicProgress[]> {
  const problems = await db.problems.toArray();
  
  return TOPICS.map((topic, index) => {
    const topicProblems = problems.filter(p => p.topic === topic.slug);
    const solvedCount = topicProblems.filter(p => p.status === 'solved').length;
    const totalProblems = topicProblems.length;
    
    const masteryPercent = totalProblems > 0 
      ? Math.round((solvedCount / totalProblems) * 100) 
      : 0;
    
    let unlocked = index === 0;
    if (index > 0) {
      const prevTopic = TOPICS[index - 1]!;
      const prevProblems = problems.filter(p => p.topic === prevTopic.slug);
      const prevSolved = prevProblems.filter(p => p.status === 'solved').length;
      unlocked = prevProblems.length > 0 && (prevSolved / prevProblems.length) >= MASTERY_THRESHOLD;
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

## Component Structure

```
src/components/
├── SolutionEditor.tsx      # CodeMirror wrapper (lazy loaded)
├── SolutionList.tsx        # List of solutions for a problem
├── SolutionCard.tsx        # Individual solution with actions
├── TemplateSelector.tsx    # Dropdown to pick templates
├── LanguageSelector.tsx    # Language picker dropdown
├── ProgressLadder.tsx      # Visual topic progression
├── TopicProgressCard.tsx   # Single topic in ladder
└── MasteryBadge.tsx        # Percentage indicator
```

---

## Lazy Loading CodeMirror

To keep initial bundle small:

```typescript
// In Problem.tsx or wherever editor is used
import { lazy, Suspense } from 'react';

const SolutionEditor = lazy(() => import('../components/SolutionEditor'));

function ProblemDetail() {
  return (
    <Suspense fallback={<div className="h-96 bg-gray-100 animate-pulse" />}>
      <SolutionEditor {...props} />
    </Suspense>
  );
}
```

---

## Testing Setup

Add CodeMirror tests:

```typescript
// components/SolutionEditor.test.tsx
import { render, screen } from '@testing-library/react';
import { SolutionEditor } from './SolutionEditor';

describe('SolutionEditor', () => {
  it('renders with initial code', () => {
    render(
      <SolutionEditor 
        value="print('hello')" 
        language="python"
        onChange={() => {}}
        onLanguageChange={() => {}}
      />
    );
    expect(screen.getByText(/print/)).toBeInTheDocument();
  });
});
```

---

## Verification Checklist

- [ ] Solutions table created in IndexedDB (check DevTools → Application)
- [ ] Can add a solution to a problem
- [ ] Syntax highlighting works for Python, JavaScript, TypeScript
- [ ] Can insert a template into editor
- [ ] Progress ladder shows all 15 topics
- [ ] First topic (Arrays & Hashing) is always unlocked
- [ ] Solving 70%+ problems unlocks next topic
- [ ] Copy to clipboard works with feedback

---

## Next Steps

1. Implement `useSolutions` hook with tests
2. Build `SolutionEditor` component with CodeMirror
3. Create all pattern templates in `data/templates.ts`
4. Build `ProgressLadder` visualization
5. Integrate solutions into Problem detail page
6. Add Progress page with ladder view
