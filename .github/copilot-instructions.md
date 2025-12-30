# Copilot Instructions for Algorithms Mastery Tracker

## Project Overview

Local-first React PWA for mastering LeetCode-style problems through structured topic progression, spaced repetition (SM-2 algorithm), and a multi-language solution journal. All data stored in IndexedDB via Dexie.js—no backend required.

## Architecture

### Data Layer
- **Database**: Dexie.js wrapping IndexedDB with reactive queries via `useLiveQuery` (see [src/lib/db.ts](src/lib/db.ts))
- **Tables**: `problems`, `solutions`, `reviews`, `reviewHistory`, `timeLogs` (versioned migrations in db.ts)
- **IDs**: Use `crypto.randomUUID()` via `generateId()` from [src/lib/utils.ts](src/lib/utils.ts)

### State Management
- **No Redux/Zustand**: Data flows through custom hooks that wrap Dexie queries
- **Pattern**: Each entity has a `useX` hook (e.g., `useProblems`, `useSolutions`, `useReview`) returning `{ data, isLoading, error, ...crud }`
- **Reactive updates**: `useLiveQuery` auto-refreshes when IndexedDB changes

### Key Domain Logic
- **Topic unlock system**: 15 ordered topics; 70% mastery of previous topic required ([src/lib/mastery.ts](src/lib/mastery.ts))
- **SM-2 spaced repetition**: Calculates review intervals based on quality ratings 0/3/4/5 ([src/lib/sm2.ts](src/lib/sm2.ts))
- **Types**: All entities defined in [src/types/index.ts](src/types/index.ts) using `as const` patterns for type safety

## Code Conventions

### Component Patterns
```tsx
// Use @/ path alias for imports (configured in vite/tsconfig)
import { Button } from '@/components/ui/button';
import { useProblems } from '@/hooks/useProblems';
import type { Problem } from '@/types';
```

### UI Components
- **Base components**: shadcn/ui in [src/components/ui/](src/components/ui/) (Button, Card, Dialog, etc.)
- **Styling**: Tailwind CSS v4 with `cn()` utility for conditional classes
- **Icons**: Lucide React exclusively

### Form Validation
- Validation functions in [src/lib/validation.ts](src/lib/validation.ts)
- Pattern: `validateX(data)` returns error object, `isValid(errors)` checks emptiness
- Example: `validateProblem()`, `validateSolution()`

### Testing
- **Framework**: Vitest + React Testing Library + fake-indexeddb
- **Setup**: Tests auto-mock IndexedDB via [src/tests/setup.ts](src/tests/setup.ts)
- **Date mocking**: Use `vi.useFakeTimers()` / `vi.setSystemTime()` for time-sensitive tests
- **Co-location**: Tests alongside source files as `*.test.ts(x)`

## Commands

```bash
pnpm dev          # Start dev server (Vite)
pnpm test         # Run tests in watch mode
pnpm test --run   # Run tests once (CI mode)
pnpm typecheck    # TypeScript check without emit
pnpm lint         # ESLint
pnpm build        # Production build (runs tsc first)
```

## Key Files to Understand First

| Purpose | File |
|---------|------|
| Database schema & all CRUD | [src/lib/db.ts](src/lib/db.ts) |
| All TypeScript types | [src/types/index.ts](src/types/index.ts) |
| Topic definitions | [src/data/topics.ts](src/data/topics.ts) |
| SM-2 algorithm | [src/lib/sm2.ts](src/lib/sm2.ts) |
| Mastery/unlock logic | [src/lib/mastery.ts](src/lib/mastery.ts) |
| Main routing | [src/App.tsx](src/App.tsx) |
| Product roadmap | [PRODUCT_PLAN.md](PRODUCT_PLAN.md) |

## Patterns to Follow

1. **Adding new entities**: Create type in `types/index.ts` → add Dexie table in `db.ts` (with version bump) → create `useX` hook → build component

2. **Database migrations**: Always increment version number in `db.ts` and define new schema in `version(N).stores({...})`

3. **Form components**: Use controlled inputs with `useState`, validate on submit with `validateX()`, show errors inline

4. **Keyboard shortcuts**: Register via `useKeyboardShortcuts` hook, define in [src/lib/shortcuts.ts](src/lib/shortcuts.ts)

5. **Dates**: Use `date-fns` for formatting/manipulation, store as `Date` objects in IndexedDB

## Specs Directory

Feature specifications live in [specs/](specs/) with subdirectories per phase:
- `spec.md` - Requirements
- `data-model.md` - Entity definitions  
- `tasks.md` - Implementation checklist
- `contracts/` - API contracts

Reference these when implementing new features to understand expected behavior.
