# Quickstart: MVP Project Setup

**Feature**: 001-mvp-project-setup  
**Date**: 2025-12-27

This guide walks through setting up the Algorithms Mastery Tracker development environment from scratch.

---

## Prerequisites

- **Node.js**: v18.x or higher (LTS recommended)
- **npm**: v9.x or higher (comes with Node.js)
- **Git**: For version control
- **VS Code**: Recommended editor with ESLint extension

```bash
# Verify installations
node --version  # Should be v18+
npm --version   # Should be v9+
git --version   # Any recent version
```

---

## Project Initialization

### 1. Create Vite + React + TypeScript Project

```bash
# Create project with Vite
npm create vite@latest algos-mastery -- --template react-ts

# Navigate to project
cd algos-mastery

# Install base dependencies
npm install
```

### 2. Add Tailwind CSS

```bash
# Install Tailwind and dependencies
npm install -D tailwindcss postcss autoprefixer

# Initialize Tailwind config
npx tailwindcss init -p
```

Update `tailwind.config.js`:

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

Replace `src/index.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### 3. Install Core Dependencies

```bash
# Production dependencies
npm install dexie dexie-react-hooks lucide-react react-router-dom

# Development dependencies
npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom fake-indexeddb @types/node
```

### 4. Configure TypeScript (Strict Mode)

Update `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",

    /* Constitution: Strict mode required */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

### 5. Configure Vitest

Create `vitest.config.ts`:

```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/tests/setup.ts'],
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
  },
});
```

Create `src/tests/setup.ts`:

```typescript
import '@testing-library/jest-dom';
import 'fake-indexeddb/auto';
```

Update `package.json` scripts:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "preview": "vite preview",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest run --coverage",
    "typecheck": "tsc --noEmit"
  }
}
```

---

## Project Structure

Create the directory structure:

```bash
mkdir -p src/{components/ui,hooks,lib,data,types,pages,tests}
```

```
src/
├── components/
│   ├── ui/             # Primitive components (Button, Input, etc.)
│   ├── ProblemList.tsx
│   ├── ProblemForm.tsx
│   ├── ProblemCard.tsx
│   ├── FilterBar.tsx
│   └── ...
├── hooks/
│   ├── useDB.ts
│   ├── useProblems.ts
│   └── useFilters.ts
├── lib/
│   ├── db.ts           # Dexie database
│   ├── validation.ts
│   └── utils.ts
├── data/
│   └── topics.ts       # Static topic data
├── types/
│   └── index.ts        # TypeScript interfaces
├── pages/
│   ├── Home.tsx
│   └── Problems.tsx
├── tests/
│   └── setup.ts
├── App.tsx
├── main.tsx
└── index.css
```

---

## Initial Files to Create

### `src/types/index.ts`

```typescript
export const DIFFICULTIES = ['easy', 'medium', 'hard'] as const;
export type Difficulty = typeof DIFFICULTIES[number];

export const STATUSES = ['unsolved', 'attempted', 'solved'] as const;
export type Status = typeof STATUSES[number];

export const TOPIC_SLUGS = [
  'arrays-hashing', 'two-pointers', 'sliding-window', 'stack',
  'binary-search', 'linked-list', 'trees', 'tries', 'backtracking',
  'heap', 'graphs', 'dynamic-programming', 'greedy', 'intervals',
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

export interface ProblemFormData {
  title: string;
  url: string;
  topic: TopicSlug | '';
  difficulty: Difficulty | '';
  notes: string;
}

export interface ProblemFilters {
  topic: TopicSlug | null;
  difficulty: Difficulty | null;
  status: Status | null;
  search: string;
}
```

### `src/data/topics.ts`

```typescript
import type { Topic, TopicSlug } from '../types';

export const TOPICS: readonly Topic[] = [
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

export function getTopicBySlug(slug: TopicSlug): Topic {
  const topic = TOPICS.find(t => t.slug === slug);
  if (!topic) throw new Error(`Unknown topic: ${slug}`);
  return topic;
}

export function getTopicName(slug: TopicSlug): string {
  return getTopicBySlug(slug).name;
}
```

### `src/lib/db.ts`

```typescript
import Dexie, { type Table } from 'dexie';
import type { Problem } from '../types';

export class AlgoMasteryDB extends Dexie {
  problems!: Table<Problem>;

  constructor() {
    super('AlgoMasteryDB');
    this.version(1).stores({
      problems: 'id, topic, difficulty, status, createdAt'
    });
  }
}

export const db = new AlgoMasteryDB();
```

---

## Development Commands

```bash
# Start development server
npm run dev

# Run tests in watch mode
npm test

# Type check without emitting
npm run typecheck

# Lint code
npm run lint

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## Verification Checklist

After setup, verify:

- [ ] `npm run dev` starts dev server at localhost:5173
- [ ] `npm run typecheck` passes with no errors
- [ ] `npm test` runs (may have no tests yet)
- [ ] `npm run build` creates production build in `dist/`
- [ ] Tailwind styles apply (test with a utility class)
- [ ] Browser DevTools → Application → IndexedDB shows "AlgoMasteryDB"

---

## Next Steps

1. Implement the `useProblems` hook (with tests first per constitution)
2. Build the `ProblemForm` component
3. Build the `ProblemList` and `ProblemCard` components
4. Build the `FilterBar` component
5. Wire together in `Problems.tsx` page
6. Add routing with React Router
