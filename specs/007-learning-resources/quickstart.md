# Quickstart: Learning Resources

**Feature**: 007-learning-resources  
**Date**: 30 December 2025

## Overview

This guide provides a quick reference for implementing the Learning Resources feature. Resources are embedded within Problem entities in IndexedDB.

## Files to Create

| File | Purpose |
|------|---------|
| `src/lib/resourceUtils.ts` | Source auto-detection and type helpers |
| `src/lib/resourceUtils.test.ts` | Unit tests for source detection |
| `src/components/ResourceList.tsx` | Display list of resources with icons |
| `src/components/ResourceList.test.tsx` | Component tests |
| `src/components/ResourceForm.tsx` | Collapsible add resource form |
| `src/components/ResourceForm.test.tsx` | Component tests |

## Files to Modify

| File | Changes |
|------|---------|
| `src/types/index.ts` | Add `LearningResource`, `ResourceType`, `RESOURCE_TYPES`, extend `Problem` |
| `src/lib/db.ts` | Add v5 migration to initialize `resources: []` |
| `src/lib/validation.ts` | Add `validateResource()`, `ResourceValidationErrors` |
| `src/components/ProblemForm.tsx` | Add Resources section with collapsible form |
| `src/components/ProblemCard.tsx` | Add resource count badge |
| `src/pages/Problem.tsx` | Add Learning Resources section after solutions |
| `src/hooks/useProblems.ts` | Handle `resources` in `addProblem` and `updateProblem` |

## Implementation Order

### Phase 1: Data Layer
1. Add types to `src/types/index.ts`
2. Add database migration v5 in `src/lib/db.ts`
3. Add validation in `src/lib/validation.ts`
4. Create `src/lib/resourceUtils.ts` with source detection
5. Write tests for resourceUtils and validation

### Phase 2: Display Components
1. Create `ResourceList.tsx` (read-only display)
2. Add Learning Resources section to `Problem.tsx`
3. Write tests for ResourceList

### Phase 3: Form Components
1. Create `ResourceForm.tsx` (collapsible add form)
2. Integrate into `ProblemForm.tsx`
3. Update `useProblems.ts` to handle resources
4. Write tests for ResourceForm

### Phase 4: Polish
1. Add resource count badge to `ProblemCard.tsx`
2. Verify export/import includes resources
3. End-to-end testing

## Key Patterns

### Source Detection (resourceUtils.ts)

```typescript
export function detectResourceSource(url: string): string | null {
  try {
    const hostname = new URL(url).hostname.toLowerCase();
    const patterns: [RegExp, string][] = [
      [/youtube\.com|youtu\.be/, 'YouTube'],
      [/medium\.com/, 'Medium'],
      // ... more patterns
    ];
    for (const [pattern, source] of patterns) {
      if (pattern.test(hostname)) return source;
    }
    return null;
  } catch {
    return null;
  }
}
```

### Resource Validation (validation.ts)

```typescript
export function validateResource(resource: Partial<LearningResource>): ResourceValidationErrors {
  const errors: ResourceValidationErrors = {};
  if (!resource.title?.trim()) errors.title = 'Title is required';
  else if (resource.title.length > 200) errors.title = 'Title must be 200 characters or less';
  if (!resource.url?.trim()) errors.url = 'URL is required';
  else { try { new URL(resource.url); } catch { errors.url = 'Please enter a valid URL'; } }
  if (!resource.type || !RESOURCE_TYPES.includes(resource.type)) errors.type = 'Please select a resource type';
  return errors;
}
```

### Database Migration (db.ts)

```typescript
this.version(5).stores({
  problems: 'id, topic, difficulty, status, createdAt',
  solutions: 'id, problemId, language, createdAt',
  reviews: 'problemId, nextReview',
  reviewHistory: 'id, problemId, reviewedAt',
  timeLogs: 'problemId',
}).upgrade(async (tx) => {
  await tx.table('problems').toCollection().modify((problem) => {
    if (!problem.resources) problem.resources = [];
  });
});
```

### Resource Type Icons

```typescript
import { Play, FileText, BookOpen } from 'lucide-react';

const TYPE_ICONS: Record<ResourceType, React.ElementType> = {
  video: Play,
  article: FileText,
  documentation: BookOpen,
};

const TYPE_COLORS: Record<ResourceType, string> = {
  video: 'text-red-500',
  article: 'text-blue-500',
  documentation: 'text-green-500',
};
```

## Testing Commands

```bash
# Run all tests
pnpm test

# Run tests once (CI mode)
pnpm test --run

# Run specific test file
pnpm test resourceUtils

# Type check
pnpm typecheck

# Lint
pnpm lint

# Build
pnpm build
```

## Acceptance Criteria Checklist

- [ ] Can add resources when creating a new problem
- [ ] Can add resources when editing an existing problem
- [ ] Resource form is collapsed by default, expands on "Add Resource" click
- [ ] Resource type dropdown works (video/article/documentation)
- [ ] Title is required, max 200 chars
- [ ] URL is required and validated
- [ ] Source auto-detects from known URLs (YouTube, Medium, etc.) on blur
- [ ] Source can be manually entered/edited
- [ ] Resources display correctly on problem detail page (after solutions)
- [ ] Empty state shows "Add resources" prompt with link to edit
- [ ] Resources can be removed instantly (no confirmation)
- [ ] Existing problems get `resources: []` after migration
- [ ] Resource count badge shows on ProblemCard
- [ ] External links open in new tab
- [ ] Export includes resources
- [ ] Import preserves resources
- [ ] All tests pass
- [ ] Type check passes
- [ ] Build succeeds
