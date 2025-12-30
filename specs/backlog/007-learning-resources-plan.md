# Learning Resources Feature — Implementation Spec

## Overview

Add a **Learning Resources** section to problems, allowing users to attach educational videos, articles, and documentation that explain how to solve each problem. Resources help users learn problem-solving patterns and techniques.

### Goals

- Help users learn how to solve problems with curated resources
- Support multiple resource types: videos, articles, documentation
- Auto-detect source from URL (YouTube, NeetCode, Medium, etc.)
- Provide a clear empty state prompting users to add resources

### Non-Goals

- Scraping or embedding external content
- Community-submitted resources (future consideration)
- Resource ratings or recommendations

---

## Data Structures

### New Type: `LearningResource`

Add to `src/types/index.ts`:

```typescript
export type ResourceType = 'video' | 'article' | 'documentation';

export interface LearningResource {
  /** Unique identifier (UUID) */
  id: string;
  /** Resource type */
  type: ResourceType;
  /** Descriptive title (required) */
  title: string;
  /** Direct URL to the resource */
  url: string;
  /** Source name (auto-detected or manual, e.g., "YouTube", "Medium") */
  source: string;
}

export const RESOURCE_TYPES = ['video', 'article', 'documentation'] as const;
```

### Extend `Problem` Interface

Update `src/types/index.ts`:

```typescript
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

### Extend `ProblemFormData` Interface

```typescript
export interface ProblemFormData {
  title: string;
  url: string;
  topic: TopicSlug | '';
  difficulty: Difficulty | '';
  notes: string;
  resources: LearningResource[];  // NEW FIELD
}
```

---

## Files to Create

### 1. Source Auto-Detection — `src/lib/resourceUtils.ts`

```typescript
/**
 * Auto-detect source name from URL using hostname pattern matching.
 * Returns null for unknown sources.
 */
export function detectResourceSource(url: string): string | null {
  try {
    const hostname = new URL(url).hostname.toLowerCase();
    
    const sourcePatterns: [RegExp, string][] = [
      // Video platforms
      [/youtube\.com|youtu\.be/, 'YouTube'],
      [/vimeo\.com/, 'Vimeo'],
      [/neetcode\.io/, 'NeetCode'],
      [/udemy\.com/, 'Udemy'],
      [/coursera\.org/, 'Coursera'],
      
      // Blog/Article platforms
      [/medium\.com/, 'Medium'],
      [/dev\.to/, 'Dev.to'],
      [/hashnode\.dev|hashnode\.com/, 'Hashnode'],
      [/substack\.com/, 'Substack'],
      [/freecodecamp\.org/, 'freeCodeCamp'],
      [/geeksforgeeks\.org/, 'GeeksforGeeks'],
      [/towardsdatascience\.com/, 'Towards Data Science'],
      
      // Documentation
      [/developer\.mozilla\.org/, 'MDN'],
      [/docs\.python\.org/, 'Python Docs'],
      [/typescriptlang\.org/, 'TypeScript Docs'],
      [/reactjs\.org|react\.dev/, 'React Docs'],
      
      // Coding platforms
      [/leetcode\.com/, 'LeetCode'],
      [/hackerrank\.com/, 'HackerRank'],
      [/codewars\.com/, 'Codewars'],
      
      // General tech
      [/github\.com/, 'GitHub'],
      [/stackoverflow\.com/, 'Stack Overflow'],
    ];
    
    for (const [pattern, source] of sourcePatterns) {
      if (pattern.test(hostname)) {
        return source;
      }
    }
    
    return null;
  } catch {
    return null;
  }
}

/**
 * Get icon suggestion based on resource type.
 * Used for UI rendering decisions.
 */
export function getResourceTypeIcon(type: ResourceType): string {
  const icons: Record<ResourceType, string> = {
    video: 'Play',
    article: 'FileText',
    documentation: 'BookOpen',
  };
  return icons[type];
}

/**
 * Get display label for resource type.
 */
export function getResourceTypeLabel(type: ResourceType): string {
  const labels: Record<ResourceType, string> = {
    video: 'Video',
    article: 'Article',
    documentation: 'Documentation',
  };
  return labels[type];
}
```

---

### 2. Resource Validation — Add to `src/lib/validation.ts`

```typescript
import type { LearningResource, ResourceType } from '@/types';

export interface ResourceValidationErrors {
  title?: string;
  url?: string;
  type?: string;
}

export function validateResource(resource: Partial<LearningResource>): ResourceValidationErrors {
  const errors: ResourceValidationErrors = {};

  // Title is required
  if (!resource.title?.trim()) {
    errors.title = 'Title is required';
  } else if (resource.title.length > 200) {
    errors.title = 'Title must be 200 characters or less';
  }

  // URL is required and must be valid
  if (!resource.url?.trim()) {
    errors.url = 'URL is required';
  } else {
    try {
      new URL(resource.url);
    } catch {
      errors.url = 'Please enter a valid URL';
    }
  }

  // Type must be valid
  const validTypes: ResourceType[] = ['video', 'article', 'documentation'];
  if (!resource.type || !validTypes.includes(resource.type)) {
    errors.type = 'Please select a resource type';
  }

  return errors;
}

export function isResourceValid(resource: Partial<LearningResource>): boolean {
  return Object.keys(validateResource(resource)).length === 0;
}
```

---

### 3. ResourceList Component — `src/components/ResourceList.tsx`

Display attached resources with type-specific icons and external links.

```typescript
import { ExternalLink, Play, FileText, BookOpen, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { LearningResource, ResourceType } from '@/types';

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

interface ResourceListProps {
  resources: LearningResource[];
  onRemove?: (id: string) => void;
  readOnly?: boolean;
}

export function ResourceList({ resources, onRemove, readOnly = false }: ResourceListProps) {
  if (resources.length === 0) {
    return null;
  }

  return (
    <ul className="space-y-2">
      {resources.map((resource) => {
        const Icon = TYPE_ICONS[resource.type];
        return (
          <li
            key={resource.id}
            className="flex items-center gap-3 p-3 rounded-lg border bg-background hover:bg-muted/50 transition-colors group"
          >
            {/* Type icon */}
            <div className={cn('shrink-0', TYPE_COLORS[resource.type])}>
              <Icon className="h-5 w-5" />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <a
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium hover:text-primary hover:underline inline-flex items-center gap-1"
              >
                <span className="truncate">{resource.title}</span>
                <ExternalLink className="h-3.5 w-3.5 shrink-0" />
              </a>
              {resource.source && (
                <p className="text-sm text-muted-foreground">{resource.source}</p>
              )}
            </div>

            {/* Remove button */}
            {!readOnly && onRemove && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => onRemove(resource.id)}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            )}
          </li>
        );
      })}
    </ul>
  );
}
```

---

### 4. ResourceForm Component — `src/components/ResourceForm.tsx`

Form for adding a new resource with auto-detection.

```typescript
import { useState, useCallback } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { detectResourceSource } from '@/lib/resourceUtils';
import { validateResource } from '@/lib/validation';
import type { LearningResource, ResourceType } from '@/types';
import { v4 as uuidv4 } from 'uuid';

interface ResourceFormProps {
  onAdd: (resource: LearningResource) => void;
}

const INITIAL_STATE = {
  type: 'video' as ResourceType,
  title: '',
  url: '',
  source: '',
};

export function ResourceForm({ onAdd }: ResourceFormProps) {
  const [formData, setFormData] = useState(INITIAL_STATE);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleUrlBlur = useCallback(() => {
    if (formData.url && !formData.source) {
      const detectedSource = detectResourceSource(formData.url);
      if (detectedSource) {
        setFormData((prev) => ({ ...prev, source: detectedSource }));
      }
    }
  }, [formData.url, formData.source]);

  const handleSubmit = () => {
    const validationErrors = validateResource(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const resource: LearningResource = {
      id: uuidv4(),
      type: formData.type,
      title: formData.title.trim(),
      url: formData.url.trim(),
      source: formData.source.trim(),
    };

    onAdd(resource);
    setFormData(INITIAL_STATE);
    setErrors({});
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg bg-muted/30">
      <div className="grid gap-4 sm:grid-cols-2">
        {/* Type */}
        <div className="space-y-2">
          <Label htmlFor="resource-type">Type</Label>
          <Select
            value={formData.type}
            onValueChange={(value: ResourceType) =>
              setFormData((prev) => ({ ...prev, type: value }))
            }
          >
            <SelectTrigger id="resource-type">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="video">Video</SelectItem>
              <SelectItem value="article">Article</SelectItem>
              <SelectItem value="documentation">Documentation</SelectItem>
            </SelectContent>
          </Select>
          {errors.type && (
            <p className="text-sm text-destructive">{errors.type}</p>
          )}
        </div>

        {/* Source (auto-detected or manual) */}
        <div className="space-y-2">
          <Label htmlFor="resource-source">Source (optional)</Label>
          <Input
            id="resource-source"
            placeholder="e.g., YouTube, Medium"
            value={formData.source}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, source: e.target.value }))
            }
          />
        </div>
      </div>

      {/* Title */}
      <div className="space-y-2">
        <Label htmlFor="resource-title">Title *</Label>
        <Input
          id="resource-title"
          placeholder="e.g., Two Sum - LeetCode Solution Explained"
          value={formData.title}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, title: e.target.value }))
          }
        />
        {errors.title && (
          <p className="text-sm text-destructive">{errors.title}</p>
        )}
      </div>

      {/* URL */}
      <div className="space-y-2">
        <Label htmlFor="resource-url">URL *</Label>
        <Input
          id="resource-url"
          type="url"
          placeholder="https://..."
          value={formData.url}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, url: e.target.value }))
          }
          onBlur={handleUrlBlur}
        />
        {errors.url && (
          <p className="text-sm text-destructive">{errors.url}</p>
        )}
      </div>

      {/* Add button */}
      <Button type="button" onClick={handleSubmit} className="w-full sm:w-auto">
        <Plus className="h-4 w-4 mr-2" />
        Add Resource
      </Button>
    </div>
  );
}
```

---

## Files to Modify

### 1. Database Migration — `src/lib/db.ts`

Add version 5 to initialize `resources` for existing problems:

```typescript
this.version(5).stores({
  problems: 'id, topic, difficulty, status, createdAt',
  solutions: 'id, problemId, createdAt',
  reviews: 'id, problemId, nextReviewDate, status',
  reviewHistory: 'id, reviewId, reviewedAt',
  timeLogs: 'id, problemId, startedAt',
}).upgrade(async (tx) => {
  // Initialize resources array for existing problems
  await tx.table('problems').toCollection().modify((problem) => {
    if (!problem.resources) {
      problem.resources = [];
    }
  });
});
```

---

### 2. Types — `src/types/index.ts`

Add the new types as shown in the Data Structures section above.

---

### 3. ProblemForm — `src/components/ProblemForm.tsx`

Add a Resources section to the form:

```typescript
import { ResourceForm } from './ResourceForm';
import { ResourceList } from './ResourceList';

// Inside the form component, after notes textarea:

{/* Learning Resources Section */}
<div className="space-y-4">
  <div className="flex items-center justify-between">
    <Label className="text-base font-medium">Learning Resources</Label>
    <span className="text-sm text-muted-foreground">
      {formData.resources.length} resource{formData.resources.length !== 1 ? 's' : ''}
    </span>
  </div>

  {/* Existing resources */}
  <ResourceList
    resources={formData.resources}
    onRemove={(id) =>
      setFormData((prev) => ({
        ...prev,
        resources: prev.resources.filter((r) => r.id !== id),
      }))
    }
  />

  {/* Add new resource form */}
  <ResourceForm
    onAdd={(resource) =>
      setFormData((prev) => ({
        ...prev,
        resources: [...prev.resources, resource],
      }))
    }
  />
</div>
```

---

### 4. Problem Detail Page — `src/pages/ProblemDetail.tsx`

Add a Learning Resources section:

```typescript
import { BookOpen, Plus } from 'lucide-react';
import { ResourceList } from '@/components/ResourceList';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

// Inside the page, after the solutions section:

{/* Learning Resources Section */}
<Card>
  <CardHeader>
    <CardTitle className="text-base flex items-center gap-2">
      <BookOpen className="h-4 w-4" />
      Learning Resources
    </CardTitle>
  </CardHeader>
  <CardContent>
    {problem.resources && problem.resources.length > 0 ? (
      <ResourceList resources={problem.resources} readOnly />
    ) : (
      <div className="text-center py-6 text-muted-foreground">
        <BookOpen className="h-8 w-8 mx-auto mb-2 opacity-50" />
        <p>Add resources to help you learn this problem</p>
        <Button variant="outline" size="sm" className="mt-3" asChild>
          <Link to={`/problems/${problem.id}/edit`}>
            <Plus className="h-4 w-4 mr-2" />
            Add Resources
          </Link>
        </Button>
      </div>
    )}
  </CardContent>
</Card>
```

---

### 5. ProblemCard — `src/components/ProblemCard.tsx`

Optionally show resource count badge:

```typescript
// Inside the card, near other badges:
{problem.resources && problem.resources.length > 0 && (
  <Badge variant="outline" className="gap-1">
    <BookOpen className="h-3 w-3" />
    {problem.resources.length}
  </Badge>
)}
```

---

### 6. useProblems Hook — `src/hooks/useProblems.ts`

Update `addProblem` and `updateProblem` to handle resources:

```typescript
// In addProblem:
const addProblem = async (data: ProblemFormData): Promise<string> => {
  const problem: Problem = {
    id: uuidv4(),
    title: data.title.trim(),
    url: data.url?.trim() || null,
    topic: data.topic as TopicSlug,
    difficulty: data.difficulty as Difficulty,
    status: 'unsolved',
    notes: data.notes?.trim() || '',
    resources: data.resources || [],  // NEW
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  await db.problems.add(problem);
  return problem.id;
};

// In updateProblem, resources will be included via partial update
```

---

### 7. Export/Import — `src/lib/exportImport.ts`

Ensure resources are included in export serialization (should work automatically if resources are part of Problem interface).

---

## Implementation Reference

### Existing Patterns to Follow

#### Card Layout Pattern (from existing components)

```tsx
<Card>
  <CardHeader>
    <CardTitle className="text-base flex items-center gap-2">
      <Icon className="h-4 w-4" />
      Section Title
    </CardTitle>
  </CardHeader>
  <CardContent>
    {/* Content */}
  </CardContent>
</Card>
```

#### External Link Pattern

```tsx
<a
  href={url}
  target="_blank"
  rel="noopener noreferrer"
  className="hover:text-primary inline-flex items-center gap-1"
>
  {title}
  <ExternalLink className="h-3.5 w-3.5 shrink-0" />
</a>
```

#### Form Validation Pattern

```typescript
const errors = validateResource(formData);
if (Object.keys(errors).length > 0) {
  setErrors(errors);
  return;
}
```

#### Toast Notifications

```typescript
import { toast } from 'sonner';
toast.success('Resource added');
toast.error('Failed to add resource');
```

---

## Testing Checklist

- [ ] Can add resources when creating a new problem
- [ ] Can add resources when editing an existing problem
- [ ] Resource type dropdown works (video/article/documentation)
- [ ] Title is required validation works
- [ ] URL is required and validated
- [ ] Source auto-detects from known URLs (YouTube, Medium, etc.)
- [ ] Source can be manually entered/edited
- [ ] Resources display correctly on problem detail page
- [ ] Empty state shows "Add resources to help you learn this problem"
- [ ] Resources can be removed from form
- [ ] Existing problems get `resources: []` after migration
- [ ] Export includes resources
- [ ] Import preserves resources
- [ ] Resource count badge shows on ProblemCard
- [ ] External links open in new tab
- [ ] Works offline

---

## Source Auto-Detection Reference

| URL Pattern | Detected Source |
|-------------|-----------------|
| `youtube.com`, `youtu.be` | YouTube |
| `vimeo.com` | Vimeo |
| `neetcode.io` | NeetCode |
| `udemy.com` | Udemy |
| `coursera.org` | Coursera |
| `medium.com` | Medium |
| `dev.to` | Dev.to |
| `hashnode.dev`, `hashnode.com` | Hashnode |
| `substack.com` | Substack |
| `freecodecamp.org` | freeCodeCamp |
| `geeksforgeeks.org` | GeeksforGeeks |
| `towardsdatascience.com` | Towards Data Science |
| `developer.mozilla.org` | MDN |
| `docs.python.org` | Python Docs |
| `typescriptlang.org` | TypeScript Docs |
| `reactjs.org`, `react.dev` | React Docs |
| `leetcode.com` | LeetCode |
| `hackerrank.com` | HackerRank |
| `codewars.com` | Codewars |
| `github.com` | GitHub |
| `stackoverflow.com` | Stack Overflow |

---

## File Summary

### New Files to Create

| File | Purpose |
|------|---------|
| `src/lib/resourceUtils.ts` | Source auto-detection and type helpers |
| `src/components/ResourceList.tsx` | Display list of resources with icons |
| `src/components/ResourceForm.tsx` | Add/edit resource form component |

### Files to Modify

| File | Changes |
|------|---------|
| `src/types/index.ts` | Add `LearningResource`, `ResourceType`, extend `Problem` |
| `src/lib/db.ts` | Add migration v5 to initialize `resources: []` |
| `src/lib/validation.ts` | Add `validateResource()` function |
| `src/components/ProblemForm.tsx` | Add Resources section with form |
| `src/components/ProblemCard.tsx` | Show resource count badge |
| `src/pages/ProblemDetail.tsx` | Add Learning Resources section |
| `src/hooks/useProblems.ts` | Handle resources in add/update |
