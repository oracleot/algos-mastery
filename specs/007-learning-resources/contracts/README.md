# Contracts: Learning Resources

**Feature**: 007-learning-resources  
**Date**: 30 December 2025

## Overview

This feature has **no external API contracts**.

All operations are local-only using IndexedDB via Dexie.js. No REST endpoints, GraphQL schemas, or external service integrations are required.

## Internal Interfaces

The following TypeScript interfaces serve as internal contracts between components:

### Component Props

```typescript
// ResourceList component props
interface ResourceListProps {
  resources: LearningResource[];
  onRemove?: (id: string) => void;
  readOnly?: boolean;
}

// ResourceForm component props
interface ResourceFormProps {
  onAdd: (resource: LearningResource) => void;
}
```

### Hook Return Types

```typescript
// useProblems hook (existing, extended)
interface UseProblemsReturn {
  // ... existing properties
  addProblem: (data: ProblemFormData) => Promise<string>;  // data.resources now included
  updateProblem: (id: string, data: Partial<ProblemFormData>) => Promise<void>;  // data.resources now included
}
```

### Validation Functions

```typescript
// validation.ts exports
function validateResource(resource: Partial<LearningResource>): ResourceValidationErrors;
function isResourceValid(resource: Partial<LearningResource>): boolean;
```

### Utility Functions

```typescript
// resourceUtils.ts exports
function detectResourceSource(url: string): string | null;
function getResourceTypeIcon(type: ResourceType): string;
function getResourceTypeLabel(type: ResourceType): string;
```

## Data Flow

```
User Input → ResourceForm → validateResource() → LearningResource
                                                        ↓
                                              ProblemForm state
                                                        ↓
                                              useProblems.updateProblem()
                                                        ↓
                                              Dexie.js → IndexedDB
```

No network requests. All data persisted locally.
