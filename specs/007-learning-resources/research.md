# Research: Learning Resources

**Feature**: 007-learning-resources  
**Date**: 30 December 2025  
**Status**: Complete

## Research Questions

### 1. Storage Pattern: Embedded Array vs. Separate Table

**Decision**: Embedded array within Problem entity

**Rationale**:
- Resources are always accessed with their parent problem (no independent queries needed)
- Simplifies data model—no foreign key relationships or joins
- Cascade delete is automatic (delete problem → resources gone)
- Matches existing patterns (e.g., `sessions` array in `ProblemTimeLog`)
- Export/import automatically includes resources with problem data

**Alternatives Considered**:
| Alternative | Why Rejected |
|-------------|--------------|
| Separate `resources` table with `problemId` FK | Added complexity for no benefit; resources never queried independently |
| Normalized many-to-many (resource ↔ problem) | Overkill; resources are not shared across problems |

### 2. Dexie Migration Strategy for Embedded Array

**Decision**: Add version 5 migration that initializes `resources: []` for all existing problems

**Rationale**:
- Existing problems have no `resources` field
- TypeScript expects `resources` array to exist (non-optional field)
- Migration ensures backward compatibility

**Implementation Pattern** (from existing `db.ts`):
```typescript
this.version(5).stores({
  // Schema unchanged—resources is embedded, not indexed
  problems: 'id, topic, difficulty, status, createdAt',
  solutions: 'id, problemId, language, createdAt',
  reviews: 'problemId, nextReview',
  reviewHistory: 'id, problemId, reviewedAt',
  timeLogs: 'problemId',
}).upgrade(async (tx) => {
  await tx.table('problems').toCollection().modify((problem) => {
    if (!problem.resources) {
      problem.resources = [];
    }
  });
});
```

### 3. URL Source Auto-Detection Implementation

**Decision**: Pattern-matching on URL hostname using regex array

**Rationale**:
- Pure function, no network requests (works offline)
- Single pass through patterns is O(n) where n = pattern count
- Easy to extend with new sources
- Fallback to `null` for unknown sources (user can manually enter)

**Pattern List** (15+ sources per SC-003):
| Category | Patterns | Detected Source |
|----------|----------|-----------------|
| Video | `youtube.com`, `youtu.be` | YouTube |
| Video | `vimeo.com` | Vimeo |
| Video | `neetcode.io` | NeetCode |
| Video | `udemy.com` | Udemy |
| Video | `coursera.org` | Coursera |
| Article | `medium.com` | Medium |
| Article | `dev.to` | Dev.to |
| Article | `hashnode.dev`, `hashnode.com` | Hashnode |
| Article | `substack.com` | Substack |
| Article | `freecodecamp.org` | freeCodeCamp |
| Article | `geeksforgeeks.org` | GeeksforGeeks |
| Article | `towardsdatascience.com` | Towards Data Science |
| Documentation | `developer.mozilla.org` | MDN |
| Documentation | `docs.python.org` | Python Docs |
| Documentation | `typescriptlang.org` | TypeScript Docs |
| Documentation | `reactjs.org`, `react.dev` | React Docs |
| Coding | `leetcode.com` | LeetCode |
| Coding | `hackerrank.com` | HackerRank |
| Coding | `codewars.com` | Codewars |
| General | `github.com` | GitHub |
| General | `stackoverflow.com` | Stack Overflow |

**Edge Cases**:
- Invalid URL → catch exception, return `null`
- Subdomain variations → patterns use `.test()` on hostname, handles subdomains

### 4. Form UX: Collapsible vs. Always Visible

**Decision**: Collapsed by default with "Add Resource" button (per spec clarification)

**Rationale**:
- Reduces visual clutter when editing problems
- Users editing for other reasons don't see resource form
- One-click expand is fast enough
- Form collapses after successful add

**Implementation**:
- State: `const [isFormExpanded, setIsFormExpanded] = useState(false)`
- Button shows when collapsed, form shows when expanded
- On successful add: reset form, collapse

### 5. Resource Count Badge Design

**Decision**: Outline badge with book icon and count (e.g., 📚 3)

**Rationale**:
- Consistent with existing badge patterns (TopicBadge, DifficultyBadge)
- Book icon (BookOpen from Lucide) conveys learning/resources
- Only shown when `resources.length > 0`

**Implementation**:
```tsx
{problem.resources && problem.resources.length > 0 && (
  <Badge variant="outline" className="gap-1">
    <BookOpen className="h-3 w-3" />
    {problem.resources.length}
  </Badge>
)}
```

### 6. Type Icons for Resource Types

**Decision**: Lucide icons per type

| Type | Icon | Color Class |
|------|------|-------------|
| `video` | `Play` | `text-red-500` |
| `article` | `FileText` | `text-blue-500` |
| `documentation` | `BookOpen` | `text-green-500` |

**Rationale**:
- Play icon universally represents video content
- FileText is standard for articles/blog posts
- BookOpen represents documentation/reference material
- Colors match common associations (red=YouTube, blue=articles, green=docs)

### 7. Validation Rules

**Decision**: Align with existing validation patterns in `validation.ts`

| Field | Rule | Error Message |
|-------|------|---------------|
| `title` | Required, ≤200 chars | "Title is required" / "Title must be 200 characters or less" |
| `url` | Required, valid URL format | "URL is required" / "Please enter a valid URL" |
| `type` | Required, one of 3 valid values | "Please select a resource type" |
| `source` | Optional | N/A |

**Implementation Pattern** (from existing code):
```typescript
export interface ResourceValidationErrors {
  title?: string;
  url?: string;
  type?: string;
}

export function validateResource(resource: Partial<LearningResource>): ResourceValidationErrors {
  const errors: ResourceValidationErrors = {};
  // ... validation logic
  return errors;
}
```

## Dependencies Verified

| Dependency | Version | Usage |
|------------|---------|-------|
| Dexie.js | ^4.2.1 | IndexedDB wrapper, migration support |
| Lucide React | ^0.562.0 | Icons (Play, FileText, BookOpen, Trash2, Plus) |
| React | ^19.2.0 | Component framework |
| Tailwind CSS | ^4.1.18 | Styling |
| Vitest | ^4.0.16 | Testing |
| fake-indexeddb | ^6.2.5 | Test doubles for IndexedDB |

All dependencies already in project—no new packages required.

## Risks and Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Existing problems missing `resources` field | App crash on access | Migration v5 initializes empty array |
| Source detection misses new platforms | Minor UX friction | User can manually enter source; list is extensible |
| Large number of resources per problem | Performance degradation | No limit enforced; user self-manages (per spec assumptions) |

## Conclusion

All research questions resolved. No external dependencies required. Ready for Phase 1 (data-model.md, contracts/, quickstart.md).
