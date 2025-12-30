# Data Model: Learning Resources

**Feature**: 007-learning-resources  
**Date**: 30 December 2025  
**Status**: Complete

## Entity Definitions

### LearningResource (New)

Represents an educational resource attached to a problem. Embedded within Problem entity (not a separate table).

```typescript
// Add to src/types/index.ts

/**
 * Resource type categories
 */
export const RESOURCE_TYPES = ['video', 'article', 'documentation'] as const;
export type ResourceType = (typeof RESOURCE_TYPES)[number];

/**
 * Learning resource attached to a problem
 */
export interface LearningResource {
  /** Unique identifier (UUID) */
  id: string;
  
  /** Resource type category */
  type: ResourceType;
  
  /** Descriptive title (required, max 200 chars) */
  title: string;
  
  /** Direct URL to the resource */
  url: string;
  
  /** Source name (auto-detected or manual, e.g., "YouTube", "Medium"). Defaults to empty string if not detected. */
  source: string;
}
```

### Problem (Modified)

Add `resources` field to existing Problem interface.

```typescript
// Modify in src/types/index.ts

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
  /** Learning resources attached to this problem */
  resources: LearningResource[];  // NEW FIELD
}
```

### ProblemFormData (Modified)

Add `resources` field to form data interface.

```typescript
// Modify in src/types/index.ts

export interface ProblemFormData {
  title: string;
  url: string;
  topic: TopicSlug | '';
  difficulty: Difficulty | '';
  notes: string;
  /** Learning resources to save with this problem */
  resources: LearningResource[];  // NEW FIELD
}
```

### ResourceValidationErrors (New)

Validation error structure for resource form.

```typescript
// Add to src/types/index.ts OR keep in src/lib/validation.ts

export interface ResourceValidationErrors {
  title?: string;
  url?: string;
  type?: string;
}
```

## Database Schema Changes

### Migration v5

No schema index changes needed (resources are embedded, not queried directly).

```typescript
// Add to src/lib/db.ts

this.version(5).stores({
  problems: 'id, topic, difficulty, status, createdAt',
  solutions: 'id, problemId, language, createdAt',
  reviews: 'problemId, nextReview',
  reviewHistory: 'id, problemId, reviewedAt',
  timeLogs: 'problemId',
}).upgrade(async (tx) => {
  // Initialize resources array for existing problems
  await tx.table('problems').toCollection().modify((problem) => {
    if (!problem.resources) {
      problem.resources = [];
    }
  });
});
```

## Relationships

```
┌─────────────────────────────────────────────────────────────┐
│                         Problem                             │
├─────────────────────────────────────────────────────────────┤
│ id: string (PK)                                             │
│ title: string                                               │
│ url: string | null                                          │
│ topic: TopicSlug                                            │
│ difficulty: Difficulty                                      │
│ status: Status                                              │
│ notes: string                                               │
│ createdAt: Date                                             │
│ updatedAt: Date                                             │
│ resources: LearningResource[]  ◄── EMBEDDED (1:N)           │
└─────────────────────────────────────────────────────────────┘
         │
         │ (embedded array)
         ▼
┌─────────────────────────────────────────────────────────────┐
│                    LearningResource                         │
├─────────────────────────────────────────────────────────────┤
│ id: string (UUID, unique within parent)                     │
│ type: 'video' | 'article' | 'documentation'                 │
│ title: string (max 200 chars)                               │
│ url: string (valid URL)                                     │
│ source: string (auto-detected or manual)                    │
└─────────────────────────────────────────────────────────────┘
```

## Validation Rules

| Entity | Field | Rule | Error Message |
|--------|-------|------|---------------|
| LearningResource | title | Required | "Title is required" |
| LearningResource | title | Max 200 chars | "Title must be 200 characters or less" |
| LearningResource | url | Required | "URL is required" |
| LearningResource | url | Valid URL format | "Please enter a valid URL" |
| LearningResource | type | Required, valid enum | "Please select a resource type" |
| LearningResource | source | Optional | N/A |

## State Transitions

No explicit state machine. Resources are created, read, and deleted (no updates per spec).

```
[None] ──add──► [Exists] ──remove──► [None]
```

## Export/Import Impact

Resources are automatically included in export because they are embedded in Problem.

```typescript
// ExportData structure (existing) - no changes needed
export interface ExportData {
  data: {
    problems: Problem[];  // Problem now includes resources[]
    // ... other tables
  };
}
```

## Cascade Behavior

| Parent Action | Child Effect |
|---------------|--------------|
| Delete Problem | Resources deleted (embedded) |
| Update Problem | Resources can be modified (add/remove) |

## Backward Compatibility

- Existing problems have no `resources` field
- Migration v5 adds `resources: []` to all existing problems
- No data loss; existing functionality unchanged
