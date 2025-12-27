# Hook Contracts: MVP Project Setup

**Feature**: 001-mvp-project-setup  
**Date**: 2025-12-27

This document defines the public interfaces for React hooks and database operations. Since this is a local-first application with no backend, these contracts serve as the internal API surface.

---

## Database Operations Contract

### `lib/db.ts`

```typescript
import Dexie, { type Table } from 'dexie';
import type { Problem } from '../types';

/**
 * Database singleton for the Algorithms Mastery Tracker
 * Uses IndexedDB via Dexie.js
 */
export class AlgoMasteryDB extends Dexie {
  problems!: Table<Problem>;

  constructor(): void;
}

export const db: AlgoMasteryDB;
```

---

## Hook Contracts

### `useProblems` Hook

**File**: `hooks/useProblems.ts`

```typescript
import type { Problem, ProblemFormData, ProblemFilters, Status } from '../types';

interface UseProblemsReturn {
  /** List of problems matching current filters, undefined while loading */
  problems: Problem[] | undefined;
  
  /** Whether the initial load is in progress */
  isLoading: boolean;
  
  /** Error if the last operation failed */
  error: Error | null;
  
  /** Add a new problem */
  addProblem: (data: ProblemFormData) => Promise<string>;
  
  /** Update an existing problem */
  updateProblem: (id: string, data: Partial<ProblemFormData>) => Promise<void>;
  
  /** Delete a problem by ID */
  deleteProblem: (id: string) => Promise<void>;
  
  /** Update only the status of a problem */
  updateStatus: (id: string, status: Status) => Promise<void>;
  
  /** Get a single problem by ID */
  getProblem: (id: string) => Promise<Problem | undefined>;
}

/**
 * Hook for managing problems with CRUD operations
 * Automatically subscribes to database changes via useLiveQuery
 * 
 * @param filters - Optional filters to apply to the problem list
 * @returns Problem list and CRUD operations
 */
export function useProblems(filters?: ProblemFilters): UseProblemsReturn;
```

**Behaviors**:
- Returns reactive data that updates when IndexedDB changes
- `addProblem` generates UUID, sets `createdAt`/`updatedAt`, returns new ID
- `updateProblem` sets `updatedAt` timestamp
- All async operations throw on failure

---

### `useFilters` Hook

**File**: `hooks/useFilters.ts`

```typescript
import type { TopicSlug, Difficulty, Status, ProblemFilters } from '../types';

interface UseFiltersReturn {
  /** Current filter state */
  filters: ProblemFilters;
  
  /** Set topic filter (null to clear) */
  setTopic: (topic: TopicSlug | null) => void;
  
  /** Set difficulty filter (null to clear) */
  setDifficulty: (difficulty: Difficulty | null) => void;
  
  /** Set status filter (null to clear) */
  setStatus: (status: Status | null) => void;
  
  /** Set search text */
  setSearch: (search: string) => void;
  
  /** Clear all filters */
  clearFilters: () => void;
  
  /** Check if any filter is active */
  hasActiveFilters: boolean;
}

/**
 * Hook for managing problem list filters
 * Persists filter state in URL query params
 * 
 * @returns Filter state and setters
 */
export function useFilters(): UseFiltersReturn;
```

**Behaviors**:
- Filters sync to URL query parameters for shareable/bookmarkable states
- Initial state hydrates from URL on mount

---

### `useDB` Hook

**File**: `hooks/useDB.ts`

```typescript
interface UseDBReturn {
  /** Whether the database is ready */
  isReady: boolean;
  
  /** Error if database initialization failed */
  error: Error | null;
  
  /** Delete all data (for reset/testing) */
  clearAllData: () => Promise<void>;
  
  /** Export all problems as JSON */
  exportData: () => Promise<string>;
  
  /** Import problems from JSON */
  importData: (json: string) => Promise<number>;
}

/**
 * Hook for database lifecycle and utilities
 * 
 * @returns Database status and utility functions
 */
export function useDB(): UseDBReturn;
```

---

## Component Props Contracts

### `ProblemForm` Component

```typescript
interface ProblemFormProps {
  /** Initial values for editing, undefined for create mode */
  initialData?: Problem;
  
  /** Called when form is submitted with valid data */
  onSubmit: (data: ProblemFormData) => Promise<void>;
  
  /** Called when user cancels */
  onCancel: () => void;
  
  /** Whether the form is in a submitting state */
  isSubmitting?: boolean;
}
```

### `ProblemList` Component

```typescript
interface ProblemListProps {
  /** Problems to display */
  problems: Problem[];
  
  /** Called when user clicks edit on a problem */
  onEdit: (problem: Problem) => void;
  
  /** Called when user wants to delete a problem */
  onDelete: (id: string) => void;
  
  /** Called when user changes problem status */
  onStatusChange: (id: string, status: Status) => void;
  
  /** Whether any operation is in progress */
  isLoading?: boolean;
}
```

### `ProblemCard` Component

```typescript
interface ProblemCardProps {
  /** Problem to display */
  problem: Problem;
  
  /** Called when edit button clicked */
  onEdit: () => void;
  
  /** Called when delete button clicked */
  onDelete: () => void;
  
  /** Called when status button clicked */
  onStatusChange: (status: Status) => void;
}
```

### `FilterBar` Component

```typescript
interface FilterBarProps {
  /** Current filter values */
  filters: ProblemFilters;
  
  /** Called when topic filter changes */
  onTopicChange: (topic: TopicSlug | null) => void;
  
  /** Called when difficulty filter changes */
  onDifficultyChange: (difficulty: Difficulty | null) => void;
  
  /** Called when status filter changes */
  onStatusChange: (status: Status | null) => void;
  
  /** Called when search text changes */
  onSearchChange: (search: string) => void;
  
  /** Called when clear all button clicked */
  onClearAll: () => void;
}
```

### `ConfirmDialog` Component

```typescript
interface ConfirmDialogProps {
  /** Whether dialog is open */
  isOpen: boolean;
  
  /** Dialog title */
  title: string;
  
  /** Dialog message/body */
  message: string;
  
  /** Confirm button text */
  confirmLabel?: string;
  
  /** Cancel button text */
  cancelLabel?: string;
  
  /** Called when user confirms */
  onConfirm: () => void;
  
  /** Called when user cancels or dismisses */
  onCancel: () => void;
  
  /** Whether confirm action is destructive (red styling) */
  isDestructive?: boolean;
}
```

### `EmptyState` Component

```typescript
interface EmptyStateProps {
  /** Icon to display */
  icon?: React.ReactNode;
  
  /** Title text */
  title: string;
  
  /** Description text */
  description?: string;
  
  /** Call-to-action button */
  action?: {
    label: string;
    onClick: () => void;
  };
}
```

### `Toast` Component

```typescript
interface ToastProps {
  /** Toast message */
  message: string;
  
  /** Toast type for styling */
  type: 'success' | 'error' | 'info';
  
  /** Whether toast is visible */
  isVisible: boolean;
  
  /** Called when toast should be dismissed */
  onDismiss: () => void;
}
```

---

## UI Component Contracts (Primitives)

### `Button` Component

```typescript
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual variant */
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  
  /** Whether button is in loading state */
  isLoading?: boolean;
  
  /** Icon to display before text */
  leftIcon?: React.ReactNode;
  
  /** Icon to display after text */
  rightIcon?: React.ReactNode;
}
```

### `Input` Component

```typescript
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Label text */
  label?: string;
  
  /** Error message */
  error?: string;
  
  /** Helper text */
  hint?: string;
}
```

### `Select` Component

```typescript
interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'children'> {
  /** Label text */
  label?: string;
  
  /** Options to display */
  options: SelectOption[];
  
  /** Placeholder option text */
  placeholder?: string;
  
  /** Error message */
  error?: string;
}
```

### `Card` Component

```typescript
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Padding variant */
  padding?: 'none' | 'sm' | 'md' | 'lg';
}
```

### `Modal` Component

```typescript
interface ModalProps {
  /** Whether modal is open */
  isOpen: boolean;
  
  /** Called when modal should close */
  onClose: () => void;
  
  /** Modal title */
  title?: string;
  
  /** Modal content */
  children: React.ReactNode;
  
  /** Modal size */
  size?: 'sm' | 'md' | 'lg';
}
```
