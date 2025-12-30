# Quickstart: Problem Catalog

**Feature**: 006-problem-catalog  
**Date**: 30 December 2025

## Prerequisites

- Node.js 18+
- pnpm package manager
- Existing algos-mastery development environment

## Quick Verification

After implementation, verify the feature works:

```bash
# Run all checks
pnpm typecheck && pnpm lint && pnpm test --run

# Start development server
pnpm dev
```

Then navigate to:
1. **Home page** → Click "Browse Catalog" button
2. **Catalog page** (`/catalog`) → Browse 150 problems
3. **Dashboard** → See "Recommended to Add" section

## New Files Created

| File | Purpose |
|------|---------|
| `src/types/index.ts` | Add `CatalogProblem`, `CatalogSource`, `CATALOG_SOURCES` |
| `src/data/catalog.ts` | Static array of 150 problems + helper functions |
| `src/hooks/useCatalogRecommendations.ts` | Hook for recommendations logic |
| `src/components/SourceBadge.tsx` | Badge component for problem source |
| `src/components/CatalogCard.tsx` | Card component for catalog problem |
| `src/components/CatalogFilters.tsx` | Filter bar for catalog page |
| `src/components/CatalogRecommendationRow.tsx` | Compact row for Dashboard |
| `src/pages/Catalog.tsx` | Main catalog browse page |

## Files Modified

| File | Changes |
|------|---------|
| `src/App.tsx` | Add `/catalog` route |
| `src/pages/Home.tsx` | Add "Browse Catalog" navigation button |
| `src/components/Dashboard.tsx` | Add "Recommended to Add" section |

## Key Implementation Details

### Adding Types

Add to `src/types/index.ts`:

```typescript
// Catalog source attribution
export const CATALOG_SOURCES = ['blind-75', 'neetcode-150', 'grind-75', 'curated'] as const;
export type CatalogSource = (typeof CATALOG_SOURCES)[number];

// Catalog problem entity
export interface CatalogProblem {
  id: string;
  title: string;
  url: string;
  topic: TopicSlug;
  difficulty: Difficulty;
  source: CatalogSource;
  order: number;
  leetcodeNumber?: number;
}
```

### Catalog Data Structure

In `src/data/catalog.ts`:

```typescript
import type { CatalogProblem, TopicSlug, CatalogSource } from '@/types';

export const PROBLEM_CATALOG: CatalogProblem[] = [
  {
    id: 'two-sum',
    title: 'Two Sum',
    url: 'https://leetcode.com/problems/two-sum/',
    topic: 'arrays-hashing',
    difficulty: 'easy',
    source: 'blind-75',
    order: 1,
    leetcodeNumber: 1,
  },
  // ... 149 more problems
];

export function getCatalogByTopic(topic: TopicSlug): CatalogProblem[] {
  return PROBLEM_CATALOG
    .filter(p => p.topic === topic)
    .sort((a, b) => a.order - b.order);
}

export function getCatalogBySource(source: CatalogSource): CatalogProblem[] {
  return PROBLEM_CATALOG.filter(p => p.source === source);
}
```

### Using the Recommendations Hook

```typescript
import { useCatalogRecommendations } from '@/hooks/useCatalogRecommendations';
import { useProblems } from '@/hooks/useProblems';
import { toast } from 'sonner';

function MyComponent() {
  const { recommendations, isAdded, isLoading } = useCatalogRecommendations(3);
  const { addProblem } = useProblems();

  const handleAdd = async (problem: CatalogProblem) => {
    try {
      await addProblem({
        title: problem.title,
        url: problem.url,
        topic: problem.topic,
        difficulty: problem.difficulty,
        notes: '',
      });
      toast.success(`Added "${problem.title}" to your problems`);
    } catch {
      toast.error('Failed to add problem');
    }
  };

  // ...
}
```

### Adding the Route

In `src/App.tsx`:

```typescript
import { Catalog } from './pages/Catalog';

// Inside <Routes>
<Route path="/catalog" element={<Catalog />} />
```

## Testing Checklist

After implementation, verify:

- [ ] Navigate to `/catalog` - see 150 problems in grid
- [ ] Filter by topic - only matching problems shown
- [ ] Filter by difficulty - only matching problems shown
- [ ] Filter by source - only matching problems shown
- [ ] Search by title - results filter as you type
- [ ] Click "Add to My Problems" - problem added, toast appears
- [ ] Reload page - added problems show "Already Added"
- [ ] External link icon - opens LeetCode in new tab
- [ ] Dashboard shows recommendations section
- [ ] Adding from Dashboard updates recommendations
- [ ] "View full catalog" link works
- [ ] Works offline (no network requests)
- [ ] Mobile responsive layout works

## Troubleshooting

### "Cannot find module @/types"
Ensure path aliases are configured in `tsconfig.json`:
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### Catalog data not loading
Check that `catalog.ts` exports `PROBLEM_CATALOG` and it's imported correctly.

### Recommendations not updating
Ensure `useProblems()` is being called without filters to get all problems for duplicate detection.

### TypeScript errors on CatalogProblem
Make sure to add the types to `src/types/index.ts` before creating components that use them.
