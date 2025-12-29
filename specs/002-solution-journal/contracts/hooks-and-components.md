# Hook & Component Contracts: Solution Journal

**Feature**: 002-solution-journal  
**Date**: 2025-12-27

---

## Hook Contracts

### `useSolutions` Hook

**File**: `hooks/useSolutions.ts`

```typescript
import type { Solution, SolutionFormData } from '../types';

interface UseSolutionsReturn {
  /** Solutions for the specified problem, undefined while loading */
  solutions: Solution[] | undefined;
  
  /** Whether loading */
  isLoading: boolean;
  
  /** Error if last operation failed */
  error: Error | null;
  
  /** Add a new solution */
  addSolution: (data: SolutionFormData) => Promise<string>;
  
  /** Update an existing solution */
  updateSolution: (id: string, data: Partial<SolutionFormData>) => Promise<void>;
  
  /** Delete a solution */
  deleteSolution: (id: string) => Promise<void>;
}

/**
 * Hook for managing solutions for a specific problem
 * 
 * @param problemId - The problem to get solutions for
 */
export function useSolutions(problemId: string): UseSolutionsReturn;
```

### `useProgress` Hook

**File**: `hooks/useProgress.ts`

```typescript
import type { TopicProgress, TopicSlug } from '../types';

interface UseProgressReturn {
  /** Progress for all topics, undefined while loading */
  progress: TopicProgress[] | undefined;
  
  /** Whether loading */
  isLoading: boolean;
  
  /** Get progress for a specific topic */
  getTopicProgress: (topic: TopicSlug) => TopicProgress | undefined;
  
  /** Check if a topic is unlocked */
  isTopicUnlocked: (topic: TopicSlug) => boolean;
  
  /** Get the next topic to unlock */
  nextToUnlock: TopicProgress | null;
}

/**
 * Hook for topic mastery and unlock status
 * Automatically recalculates when problems change
 */
export function useProgress(): UseProgressReturn;
```

### `useTemplates` Hook

**File**: `hooks/useTemplates.ts`

```typescript
import type { Template, TopicSlug } from '../types';

interface UseTemplatesReturn {
  /** All available templates */
  templates: readonly Template[];
  
  /** Get templates for a specific topic */
  getTemplatesForTopic: (topic: TopicSlug) => Template[];
  
  /** Get a specific template by ID */
  getTemplate: (id: string) => Template | undefined;
}

/**
 * Hook for accessing pattern templates
 */
export function useTemplates(): UseTemplatesReturn;
```

---

## Component Contracts

### `SolutionEditor` Component

```typescript
import type { SupportedLanguage } from '../types';

interface SolutionEditorProps {
  /** Current code value */
  value: string;
  
  /** Current language for syntax highlighting */
  language: SupportedLanguage;
  
  /** Called when code changes */
  onChange: (value: string) => void;
  
  /** Called when language selection changes */
  onLanguageChange: (language: SupportedLanguage) => void;
  
  /** Whether editor is read-only */
  readOnly?: boolean;
  
  /** Placeholder text when empty */
  placeholder?: string;
  
  /** Editor height */
  height?: string;
  
  /** Called when template should be inserted */
  onInsertTemplate?: (code: string) => void;
}
```

### `SolutionList` Component

```typescript
import type { Solution, Status } from '../types';

interface SolutionListProps {
  /** Solutions to display */
  solutions: Solution[];
  
  /** Called when user wants to edit a solution */
  onEdit: (solution: Solution) => void;
  
  /** Called when user wants to delete a solution */
  onDelete: (id: string) => void;
  
  /** Called when user copies code */
  onCopy: (code: string) => void;
}
```

### `SolutionCard` Component

```typescript
import type { Solution } from '../types';

interface SolutionCardProps {
  /** Solution to display */
  solution: Solution;
  
  /** Whether to show full code or collapsed */
  expanded?: boolean;
  
  /** Called when edit clicked */
  onEdit: () => void;
  
  /** Called when delete clicked */
  onDelete: () => void;
  
  /** Called when copy clicked */
  onCopy: () => void;
  
  /** Called when expand/collapse toggled */
  onToggleExpand?: () => void;
}
```

### `TemplateSelector` Component

```typescript
import type { Template, TopicSlug } from '../types';

interface TemplateSelectorProps {
  /** Current topic to prioritize relevant templates */
  currentTopic?: TopicSlug;
  
  /** Called when a template is selected */
  onSelect: (template: Template) => void;
  
  /** Button trigger element (optional custom trigger) */
  trigger?: React.ReactNode;
}
```

### `ProgressLadder` Component

```typescript
import type { TopicProgress } from '../types';

interface ProgressLadderProps {
  /** Progress data for all topics */
  progress: TopicProgress[];
  
  /** Called when a topic is clicked */
  onTopicClick?: (topic: TopicProgress) => void;
  
  /** Orientation */
  orientation?: 'vertical' | 'horizontal';
}
```

### `TopicProgressCard` Component

```typescript
import type { TopicProgress } from '../types';

interface TopicProgressCardProps {
  /** Topic progress data */
  progress: TopicProgress;
  
  /** Whether this is the current/active topic */
  isActive?: boolean;
  
  /** Called when clicked */
  onClick?: () => void;
}
```

### `MasteryBadge` Component

```typescript
interface MasteryBadgeProps {
  /** Mastery percentage (0-100) */
  percent: number;
  
  /** Whether the topic is unlocked */
  unlocked: boolean;
  
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
}
```

### `LanguageSelector` Component

```typescript
import type { SupportedLanguage } from '../types';

interface LanguageSelectorProps {
  /** Currently selected language */
  value: SupportedLanguage;
  
  /** Called when language changes */
  onChange: (language: SupportedLanguage) => void;
  
  /** Whether disabled */
  disabled?: boolean;
}
```
