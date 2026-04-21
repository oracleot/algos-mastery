# Architecture Refactoring Plan - algos-mastery

**Created:** 2026-03-25  
**Author:** Sule (with software-architect input)  
**Status:** Proposed

---

## Executive Summary

This plan outlines a phased refactoring of algos-mastery to improve maintainability, testability, and scalability. All changes are designed to be **non-breaking** and can be implemented incrementally.

**Total Estimated Effort:** 3-4 days of focused work  
**Risk Level:** Low (phased approach with rollback capability)

---

## 1. Repository Layer Implementation

### Goal
Centralize all database operations behind a repository abstraction to improve testability and prepare for potential cloud sync.

### New Structure
```
src/
├── repositories/
│   ├── ProblemRepository.ts
│   ├── SolutionRepository.ts
│   ├── ReviewRepository.ts
│   ├── ReviewHistoryRepository.ts
│   ├── TimeLogRepository.ts
│   └── index.ts (barrel export)
├── lib/
│   └── db.ts (Dexie schema only, no CRUD functions)
```

### Example: ProblemRepository.ts
```typescript
import { db } from '@/lib/db';
import type { Problem, ProblemFormData } from '@/types';

export class ProblemRepository {
  /**
   * Create a new problem
   */
  async create(problem: Omit<Problem, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const id = crypto.randomUUID();
    await db.problems.add({
      ...problem,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return id;
  }

  /**
   * Get problem by ID
   */
  async getById(id: string): Promise<Problem | undefined> {
    return await db.problems.get(id);
  }

  /**
   * Get all problems ordered by creation date
   */
  async getAll(): Promise<Problem[]> {
    return await db.problems.orderBy('createdAt').reverse().toArray();
  }

  /**
   * Update problem
   */
  async update(id: string, updates: Partial<ProblemFormData>): Promise<void> {
    await db.problems.update(id, {
      ...updates,
      updatedAt: new Date(),
    });
  }

  /**
   * Delete problem with cascade
   */
  async deleteWithCascade(id: string): Promise<void> {
    await db.transaction('rw', [
      db.problems,
      db.solutions,
      db.reviews,
      db.reviewHistory,
      db.timeLogs,
    ], async () => {
      await db.timeLogs.delete(id);
      await db.reviewHistory.where('problemId').equals(id).delete();
      await db.reviews.delete(id);
      await db.solutions.where('problemId').equals(id).delete();
      await db.problems.delete(id);
    });
  }

  /**
   * Get problems by topic
   */
  async getByTopic(topic: string): Promise<Problem[]> {
    return await db.problems.where('topic').equals(topic).toArray();
  }

  /**
   * Get problems by status
   */
  async getByStatus(status: string): Promise<Problem[]> {
    return await db.problems.where('status').equals(status).toArray();
  }
}

// Singleton instance
export const problemRepository = new ProblemRepository();
```

### Migration Steps
1. Create `src/repositories/` folder
2. Create each repository class (one per table)
3. Create barrel export `index.ts`
4. Update hooks to use repositories instead of direct `db.` calls
5. Remove CRUD functions from `lib/db.ts` (keep schema only)

**Effort:** M (4-6 hours)  
**Risk:** Low (wrapper pattern, no logic changes)

---

## 2. Zustand Global State

### Goal
Replace ad-hoc Context + hooks with a centralized state management solution.

### New Structure
```
src/
├── stores/
│   ├── themeStore.ts
│   ├── preferencesStore.ts
│   ├── uiStore.ts
│   └── index.ts
```

### Example: themeStore.ts
```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Theme } from '@/types';

interface ThemeState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: 'light' | 'dark';
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: 'system',
      resolvedTheme: 'light',
      
      setTheme: (theme) => {
        set({ theme });
        // Apply to document
        const root = document.documentElement;
        root.classList.remove('light', 'dark');
        
        if (theme === 'system') {
          const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
            ? 'dark'
            : 'light';
          root.classList.add(systemTheme);
          set({ resolvedTheme: systemTheme });
        } else {
          root.classList.add(theme);
          set({ resolvedTheme: theme });
        }
      },
    }),
    {
      name: 'algos-mastery-theme',
      partialize: (state) => ({ theme: state.theme }),
    }
  )
);
```

### Example: preferencesStore.ts
```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UserPreferences } from '@/types';

interface PreferencesState extends UserPreferences {
  setPreference: <K extends keyof UserPreferences>(
    key: K,
    value: UserPreferences[K]
  ) => void;
  resetPreferences: () => void;
}

const defaultPreferences: UserPreferences = {
  theme: 'system',
  defaultTimerMinutes: 25,
  keyboardShortcutsEnabled: true,
  showInstallPrompt: true,
  onboardingCompleted: false,
};

export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set) => ({
      ...defaultPreferences,
      
      setPreference: (key, value) => {
        set({ [key]: value });
      },
      
      resetPreferences: () => {
        set(defaultPreferences);
      },
    }),
    {
      name: 'algos-mastery-preferences',
    }
  )
);
```

### Example: uiStore.ts
```typescript
import { create } from 'zustand';

interface UIState {
  isShortcutHelpOpen: boolean;
  isProblemModalOpen: boolean;
  activeProblemId: string | null;
  openShortcutHelp: () => void;
  closeShortcutHelp: () => void;
  openProblemModal: (problemId?: string) => void;
  closeProblemModal: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  isShortcutHelpOpen: false,
  isProblemModalOpen: false,
  activeProblemId: null,
  
  openShortcutHelp: () => set({ isShortcutHelpOpen: true }),
  closeShortcutHelp: () => set({ isShortcutHelpOpen: false }),
  
  openProblemModal: (problemId) => set({ 
    isProblemModalOpen: true,
    activeProblemId: problemId || null,
  }),
  closeProblemModal: () => set({ 
    isProblemModalOpen: false,
    activeProblemId: null,
  }),
}));
```

### Migration Steps
1. Install Zustand: `pnpm add zustand`
2. Create store files
3. Replace Context providers with store usage in components
4. Remove old Context files (ThemeContext, ShortcutsContext)
5. Update hooks that depend on contexts

**Effort:** M (4-6 hours)  
**Risk:** Low (Zustand is simple, minimal boilerplate)

---

## 3. Error Boundaries & Error Handling

### Goal
Implement consistent error handling with graceful degradation.

### New Structure
```
src/
├── components/
│   ├── ErrorBoundary.tsx
│   ├── RouteErrorBoundary.tsx
│   └── ErrorFallback.tsx
```

### Example: ErrorBoundary.tsx
```typescript
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { toast } from 'sonner';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
    
    // Show toast notification
    toast.error('Something went wrong', {
      description: error.message,
      action: {
        label: 'Report',
        onClick: () => this.props.onError?.(error),
      },
    });
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      
      return (
        <div className="p-4 text-center text-red-600">
          <h2 className="text-lg font-semibold">Oops! Something went wrong</h2>
          <p className="text-sm text-gray-600">{this.state.error?.message}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded"
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
```

### Example: RouteErrorBoundary.tsx
```typescript
import { ErrorBoundary } from './ErrorBoundary';
import { useNavigate } from 'react-router-dom';

interface RouteErrorBoundaryProps {
  children: React.ReactNode;
  routeName: string;
}

export function RouteErrorBoundary({ children, routeName }: RouteErrorBoundaryProps) {
  const navigate = useNavigate();
  
  return (
    <ErrorBoundary
      fallback={
        <div className="p-8 text-center">
          <h2 className="text-xl font-semibold mb-2">
            {routeName} failed to load
          </h2>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Go Home
          </button>
        </div>
      }
    >
      {children}
    </ErrorBoundary>
  );
}
```

### Usage in App.tsx
```typescript
import { RouteErrorBoundary } from '@/components/RouteErrorBoundary';

<Routes>
  <Route path="/" element={
    <RouteErrorBoundary routeName="Home">
      <Home />
    </RouteErrorBoundary>
  } />
  <Route path="/problems" element={
    <RouteErrorBoundary routeName="Problems">
      <Problems />
    </RouteErrorBoundary>
  } />
  {/* ... other routes */}
</Routes>
```

### Database Error Handling Pattern
```typescript
// In hooks
try {
  await problemRepository.create(problemData);
  toast.success('Problem created');
} catch (error) {
  console.error('Failed to create problem:', error);
  toast.error('Failed to create problem', {
    description: error instanceof Error ? error.message : 'Unknown error',
  });
}
```

**Effort:** S (2-3 hours)  
**Risk:** Very Low (additive changes)

---

## 4. Feature-Based Component Organization

### Goal
Reorganize components by feature/domain instead of type for better discoverability.

### New Structure
```
src/
├── features/
│   ├── problems/
│   │   ├── components/
│   │   │   ├── ProblemList.tsx
│   │   │   ├── ProblemForm.tsx
│   │   │   ├── ProblemCard.tsx
│   │   │   ├── ProblemFilters.tsx
│   │   │   └── index.ts
│   │   ├── hooks/
│   │   │   ├── useProblemForm.ts
│   │   │   └── useProblemFilters.ts
│   │   └── types.ts
│   ├── review/
│   │   ├── components/
│   │   │   ├── ReviewCard.tsx
│   │   │   ├── ReviewQueue.tsx
│   │   │   ├── ReviewSession.tsx
│   │   │   └── index.ts
│   │   ├── hooks/
│   │   │   └── useReviewSession.ts
│   │   └── types.ts
│   ├── practice/
│   │   ├── components/
│   │   │   ├── Timer.tsx
│   │   │   ├── PracticeSession.tsx
│   │   │   └── index.ts
│   │   └── hooks/
│   │       └── usePracticeTimer.ts
│   ├── dashboard/
│   │   ├── components/
│   │   │   ├── ProgressLadder.tsx
│   │   │   ├── StatsChart.tsx
│   │   │   ├── StreakCounter.tsx
│   │   │   └── index.ts
│   │   └── hooks/
│   │       └── useDashboardStats.ts
│   └── catalog/
│       ├── components/
│       │   ├── CatalogList.tsx
│       │   ├── CatalogFilters.tsx
│       │   └── index.ts
│       └── hooks/
│           └── useCatalogFilters.ts
├── components/
│   └── ui/          # shadcn base components (unchanged)
└── pages/           # Route wrappers, import from features/
```

### Migration Steps
1. Create `src/features/` folder structure
2. Move components to feature folders (one feature at a time)
3. Update imports in pages and other components
4. Create barrel exports (`index.ts`) for each feature
5. Update absolute path aliases if needed

**Effort:** L (6-8 hours)  
**Risk:** Medium (many import paths to update, but mechanical)

---

## 5. Architecture Documentation (ADRs)

### Goal
Document key architectural decisions for future maintainers.

### New Structure
```
docs/
├── architecture/
│   ├── README.md
│   ├── adr-001-local-first-indexeddb.md
│   ├── adr-002-sm2-spaced-repetition.md
│   ├── adr-003-hook-based-architecture.md
│   ├── adr-004-repository-pattern.md
│   └── adr-005-future-cloud-sync.md
```

### Example: adr-001-local-first-indexeddb.md
```markdown
# ADR-001: Local-First Architecture with IndexedDB

## Status
Accepted

## Context
The application needs to:
- Work offline without network dependency
- Store user data privately (no account required)
- Provide fast, responsive UI without API latency
- Support PWA installation

## Decision
Use IndexedDB via Dexie.js as the primary data store.

### Why IndexedDB?
- Native browser storage (no external dependencies)
- Large storage capacity (typically 50% of disk)
- Transaction support for data integrity
- Works offline by default

### Why Dexie.js?
- Clean, Promise-based API
- Schema versioning and migrations
- TypeScript support
- Active maintenance

## Consequences
### Positive
- Zero server infrastructure cost
- Instant data access (no network roundtrip)
- User data stays on their device
- PWA works fully offline

### Negative
- Data lost if browser cache cleared
- No cross-device sync (by design)
- Limited to browser storage quotas
- Backup requires manual export

## Future Considerations
If cloud sync becomes a requirement:
1. Implement repository pattern (see ADR-004)
2. Add sync layer that merges local + remote
3. Handle conflicts with "last write wins" or manual resolution
```

### Example: adr-004-repository-pattern.md
```markdown
# ADR-004: Repository Pattern for Data Access

## Status
Proposed (2026-03-25)

## Context
Direct database access throughout the codebase makes:
- Testing difficult (hard to mock)
- Future cloud sync migration complex
- Error handling inconsistent

## Decision
Implement repository pattern with one repository per entity type.

### Structure
```
src/repositories/
├── ProblemRepository.ts
├── SolutionRepository.ts
├── ReviewRepository.ts
└── ...
```

### Benefits
- Single source of truth for data operations
- Easy to mock for testing
- Abstraction layer for future cloud sync
- Consistent error handling

## Consequences
### Positive
- Improved testability
- Clear separation of concerns
- Easier future migration to hybrid local/cloud

### Negative
- Slight increase in file count
- Additional layer of abstraction

## Migration Plan
1. Create repository classes alongside existing code
2. Update hooks to use repositories
3. Remove direct db.* calls from business logic
4. Keep db.ts for schema definition only
```

**Effort:** S (2-3 hours)  
**Risk:** None (documentation only)

---

## Prioritized Implementation Order

| Phase | Task | Effort | Risk | Dependencies |
|-------|------|--------|------|--------------|
| 1 | Error Boundaries | S (2-3h) | Very Low | None |
| 2 | Repository Layer | M (4-6h) | Low | None |
| 3 | Zustand State | M (4-6h) | Low | None |
| 4 | Feature Reorganization | L (6-8h) | Medium | Repositories complete |
| 5 | ADR Documentation | S (2-3h) | None | All above |

**Total:** 3-4 days

---

## Risk Mitigation Strategies

### General
- **Branch per phase** - Each phase on separate Git branch
- **Full test suite pass** - Run `pnpm test` after each phase
- **Manual regression testing** - Test core flows after each phase
- **Rollback plan** - Keep previous branch available for 1 week

### Specific Risks

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Zustand breaks theme switching | Low | High | Test theme toggle thoroughly; keep old code for 1 week |
| Repository migration introduces bugs | Low | Medium | Write integration tests for each repository method |
| Import path updates break builds | Medium | Low | Use TypeScript's path mapping; run `pnpm typecheck` frequently |
| Feature reorganization loses components | Low | Medium | Use `git mv` to preserve history; verify all imports |

---

## Testing Strategy

### Before Refactoring
```bash
# Run full test suite, save results
pnpm test:run > test-results-before.txt
pnpm test:coverage > coverage-before.txt
```

### After Each Phase
```bash
# Verify no regressions
pnpm test:run
pnpm typecheck
pnpm lint

# Manual testing checklist:
# - Create/edit/delete problem
# - Add solution with code editor
# - Complete review session
# - Timer start/pause/complete
# - Theme toggle
# - Export/import data
```

### After Full Refactoring
```bash
# Compare coverage
pnpm test:coverage > coverage-after.txt
# Should be >= before coverage
```

---

## Success Criteria

- [ ] All existing tests pass
- [ ] No TypeScript errors
- [ ] Manual regression testing complete
- [ ] Code coverage maintained or improved
- [ ] No console errors in development
- [ ] PWA still works offline
- [ ] Export/import still functional
- [ ] Theme switching works correctly

---

## Next Steps

1. **Review this plan** with stakeholders
2. **Create GitHub issues** for each phase
3. **Set up feature branches**
4. **Start with Phase 1** (Error Boundaries - lowest risk)
5. **Schedule 2-3 hour blocks** for each phase

---

**Questions?** Reach out to discuss any part of this plan.
