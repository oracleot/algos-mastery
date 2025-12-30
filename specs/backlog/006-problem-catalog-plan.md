# Problem Catalog Feature — Implementation Spec

## Overview

Add a static catalog of **150 curated algorithm problems** (Blind 75 + 75 extras) to eliminate friction of finding problems to practice. Users can browse, filter, and one-click add problems to their practice list.

### Goals

- Remove cold-start friction — new users see problems immediately
- Provide "what to practice next" recommendations on Dashboard
- Keep full support for manually adding custom problems
- Work 100% offline (static data, no API calls)

### Non-Goals

- LeetCode API integration (future consideration)
- User-submitted problem suggestions
- Problem difficulty auto-adjustment

---

## Data Structures

### New Type: `CatalogProblem`

Add to `src/types/index.ts`:

```typescript
export interface CatalogProblem {
  /** Unique identifier (e.g., "two-sum", "valid-parentheses") */
  id: string;
  /** Problem title as shown on LeetCode */
  title: string;
  /** Direct LeetCode problem URL */
  url: string;
  /** Algorithm topic */
  topic: TopicSlug;
  /** Difficulty level */
  difficulty: Difficulty;
  /** Source attribution */
  source: 'blind-75' | 'neetcode-150' | 'grind-75' | 'curated';
  /** Suggested order within topic (1 = do first) */
  order: number;
  /** Optional: LeetCode problem number for reference */
  leetcodeNumber?: number;
}

export const CATALOG_SOURCES = ['blind-75', 'neetcode-150', 'grind-75', 'curated'] as const;
export type CatalogSource = (typeof CATALOG_SOURCES)[number];
```

---

## Files to Create

### 1. Catalog Data — `src/data/catalog.ts`

Static array of 150 problems. Structure:

```typescript
import type { CatalogProblem } from '@/types';

export const PROBLEM_CATALOG: CatalogProblem[] = [
  // Arrays & Hashing (first topic)
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
  {
    id: 'valid-anagram',
    title: 'Valid Anagram',
    url: 'https://leetcode.com/problems/valid-anagram/',
    topic: 'arrays-hashing',
    difficulty: 'easy',
    source: 'blind-75',
    order: 2,
    leetcodeNumber: 242,
  },
  // ... 148 more problems
];

// Helper to get problems by topic
export function getCatalogByTopic(topic: TopicSlug): CatalogProblem[] {
  return PROBLEM_CATALOG
    .filter(p => p.topic === topic)
    .sort((a, b) => a.order - b.order);
}

// Helper to get problems by source
export function getCatalogBySource(source: CatalogSource): CatalogProblem[] {
  return PROBLEM_CATALOG.filter(p => p.source === source);
}
```

#### Sourcing Guidelines for the 150 Problems

- Start with all **75 Blind 75** problems (source: `'blind-75'`)
- Add **75 extras** from NeetCode 150 / Grind 75 that aren't in Blind 75 (source: `'neetcode-150'` or `'grind-75'`)
- Distribute across all **15 topics** (aim for ~10 per topic)
- Order within each topic: **easy → medium → hard**, then by "foundational first"
- Include direct LeetCode URLs (e.g., `https://leetcode.com/problems/two-sum/`)

---

### 2. Catalog Recommendations Hook — `src/hooks/useCatalogRecommendations.ts`

```typescript
import { useMemo } from 'react';
import { useProblems } from './useProblems';
import { useTopicProgress } from './useTopicProgress';
import { PROBLEM_CATALOG } from '@/data/catalog';
import type { CatalogProblem, TopicSlug } from '@/types';

interface UseCatalogRecommendationsReturn {
  /** Top recommended problems to add next */
  recommendations: CatalogProblem[];
  /** All catalog problems not yet added */
  availableProblems: CatalogProblem[];
  /** Check if a catalog problem is already added */
  isAdded: (url: string) => boolean;
  /** Loading state */
  isLoading: boolean;
}

export function useCatalogRecommendations(limit = 3): UseCatalogRecommendationsReturn {
  const { problems, isLoading } = useProblems();
  const { topicProgress } = useTopicProgress();

  // Build Set of existing URLs for O(1) duplicate detection
  const existingUrls = useMemo(() => {
    if (!problems) return new Set<string>();
    return new Set(
      problems.filter(p => p.url).map(p => normalizeUrl(p.url as string))
    );
  }, [problems]);

  const isAdded = (url: string) => existingUrls.has(normalizeUrl(url));

  // Filter to problems not yet added
  const availableProblems = useMemo(() => {
    return PROBLEM_CATALOG.filter(p => !isAdded(p.url));
  }, [existingUrls]);

  // Prioritize recommendations
  const recommendations = useMemo(() => {
    if (!topicProgress) return availableProblems.slice(0, limit);

    // Find current focus topic (lowest mastery that's unlocked)
    const focusTopic = topicProgress
      .filter(t => t.unlocked && t.masteryPercent < 100)
      .sort((a, b) => a.masteryPercent - b.masteryPercent)[0];

    // Sort available: focus topic first, then by order, easy→hard
    const sorted = [...availableProblems].sort((a, b) => {
      // Prioritize focus topic
      if (focusTopic) {
        if (a.topic === focusTopic.slug && b.topic !== focusTopic.slug) return -1;
        if (b.topic === focusTopic.slug && a.topic !== focusTopic.slug) return 1;
      }
      // Then by difficulty (easy first)
      const diffOrder = { easy: 0, medium: 1, hard: 2 };
      if (diffOrder[a.difficulty] !== diffOrder[b.difficulty]) {
        return diffOrder[a.difficulty] - diffOrder[b.difficulty];
      }
      // Then by order within topic
      return a.order - b.order;
    });

    return sorted.slice(0, limit);
  }, [availableProblems, topicProgress, limit]);

  return { recommendations, availableProblems, isAdded, isLoading };
}

// Helper for URL normalization
function normalizeUrl(url: string): string {
  return url.toLowerCase().replace(/\/$/, '');
}
```

---

### 3. Catalog Page — `src/pages/Catalog.tsx`

Full browsing experience with filters.

#### Layout Structure

```typescript
// Page structure pattern (match existing pages)
<div className="min-h-screen bg-background">
  <header className="bg-card border-b border-border">
    <div className="max-w-6xl mx-auto px-4 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/"><ArrowLeft className="h-5 w-5" /></Link>
          </Button>
          <h1 className="text-xl font-bold">Problem Catalog</h1>
        </div>
      </div>
    </div>
  </header>

  <main className="max-w-6xl mx-auto px-4 py-8 space-y-6">
    {/* Filters: Topic, Difficulty, Source, Search */}
    <CatalogFilters ... />

    {/* Stats bar: "Showing X of 150 problems • Y already added" */}
    <div className="text-sm text-muted-foreground">...</div>

    {/* Problem grid */}
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {filteredProblems.map(problem => (
        <CatalogCard
          key={problem.id}
          problem={problem}
          isAdded={isAdded(problem.url)}
          onAdd={() => handleAdd(problem)}
        />
      ))}
    </div>
  </main>
</div>
```

#### Filter State

```typescript
interface CatalogFilters {
  topic: TopicSlug | null;
  difficulty: Difficulty | null;
  source: CatalogSource | null;
  search: string;
}
```

---

### 4. Catalog Card Component — `src/components/CatalogCard.tsx`

```typescript
interface CatalogCardProps {
  problem: CatalogProblem;
  isAdded: boolean;
  onAdd: () => void;
}

export function CatalogCard({ problem, isAdded, onAdd }: CatalogCardProps) {
  return (
    <Card className={cn(isAdded && 'opacity-60')}>
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center justify-between">
          <span className="truncate">{problem.title}</span>
          {/* External link to LeetCode */}
          <a
            href={problem.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-primary"
          >
            <ExternalLink className="h-4 w-4" />
          </a>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Badges row */}
        <div className="flex flex-wrap gap-2">
          <DifficultyBadge difficulty={problem.difficulty} />
          <TopicBadge topic={problem.topic} />
          <SourceBadge source={problem.source} />
        </div>

        {/* Add button */}
        <Button
          onClick={onAdd}
          disabled={isAdded}
          className="w-full"
          variant={isAdded ? 'secondary' : 'default'}
        >
          {isAdded ? (
            <><Check className="h-4 w-4 mr-2" /> Already Added</>
          ) : (
            <><Plus className="h-4 w-4 mr-2" /> Add to My Problems</>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
```

---

### 5. Source Badge Component — `src/components/SourceBadge.tsx`

```typescript
import { Badge } from '@/components/ui/badge';
import type { CatalogSource } from '@/types';

const SOURCE_LABELS: Record<CatalogSource, string> = {
  'blind-75': 'Blind 75',
  'neetcode-150': 'NeetCode 150',
  'grind-75': 'Grind 75',
  'curated': 'Curated',
};

const SOURCE_COLORS: Record<CatalogSource, string> = {
  'blind-75': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  'neetcode-150': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  'grind-75': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  'curated': 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
};

interface SourceBadgeProps {
  source: CatalogSource;
  className?: string;
}

export function SourceBadge({ source, className }: SourceBadgeProps) {
  return (
    <Badge variant="outline" className={cn(SOURCE_COLORS[source], className)}>
      {SOURCE_LABELS[source]}
    </Badge>
  );
}
```

---

## Files to Modify

### 1. Add Route — `src/App.tsx`

```typescript
import { Catalog } from './pages/Catalog';

// Inside <Routes>
<Route path="/catalog" element={<Catalog />} />
```

### 2. Add Navigation Link — `src/pages/Home.tsx`

Add a "Browse Problems" button in the main action area:

```typescript
<Button size="lg" variant="outline" asChild>
  <Link to="/catalog">
    <BookMarked className="h-5 w-5 mr-2" />
    Browse Catalog
  </Link>
</Button>
```

### 3. Add Types — `src/types/index.ts`

Add `CatalogProblem`, `CatalogSource`, and `CATALOG_SOURCES` as shown in the Data Structures section above.

### 4. Dashboard Recommendations — `src/components/Dashboard.tsx`

Add a "Recommended to Add" section showing 3 catalog recommendations:

```typescript
import { useCatalogRecommendations } from '@/hooks/useCatalogRecommendations';

// Inside Dashboard component
const { recommendations, isAdded } = useCatalogRecommendations(3);

// Add after the SuggestedNext/NextToUnlock grid:
{recommendations.length > 0 && (
  <Card>
    <CardHeader>
      <CardTitle className="text-base flex items-center gap-2">
        <Lightbulb className="h-4 w-4" />
        Recommended to Add
      </CardTitle>
      <CardDescription>
        Problems from the catalog based on your current focus
      </CardDescription>
    </CardHeader>
    <CardContent>
      <div className="space-y-2">
        {recommendations.map(problem => (
          <CatalogRecommendationRow
            key={problem.id}
            problem={problem}
            onAdd={() => handleAddFromCatalog(problem)}
          />
        ))}
      </div>
      <Button variant="link" asChild className="mt-2 px-0">
        <Link to="/catalog">View full catalog →</Link>
      </Button>
    </CardContent>
  </Card>
)}
```

---

## Duplicate Detection Logic

Match by **URL** (case-insensitive, trailing slash normalized):

```typescript
function normalizeUrl(url: string): string {
  return url.toLowerCase().replace(/\/$/, '');
}

const existingUrls = useMemo(() => {
  if (!problems) return new Set<string>();
  return new Set(
    problems
      .filter(p => p.url)
      .map(p => normalizeUrl(p.url as string))
  );
}, [problems]);

const isAdded = (url: string) => existingUrls.has(normalizeUrl(url));
```

---

## Implementation Reference

### Existing Patterns to Follow

#### Card Layout Pattern (from `SuggestedNext.tsx`)

```tsx
<button
  onClick={() => onSelect(problem)}
  className={cn(
    'w-full text-left p-3 rounded-lg border bg-background',
    'hover:bg-muted transition-colors group'
  )}
>
  <div className="flex items-start justify-between gap-2">
    <div className="flex-1 min-w-0">
      <h4 className="font-medium truncate group-hover:text-primary transition-colors">
        {problem.title}
      </h4>
      <div className="flex items-center gap-2 mt-1">
        <DifficultyBadge difficulty={problem.difficulty} />
        <TopicBadge topic={problem.topic} />
      </div>
    </div>
    <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors mt-1" />
  </div>
</button>
```

#### Adding a Problem (from `useProblems.ts`)

```typescript
const { addProblem } = useProblems();

const handleAddFromCatalog = async (catalogItem: CatalogProblem) => {
  try {
    const id = await addProblem({
      title: catalogItem.title,
      url: catalogItem.url,
      topic: catalogItem.topic,
      difficulty: catalogItem.difficulty,
      notes: '',
    });
    toast.success(`Added "${catalogItem.title}" to your problems`);
  } catch (err) {
    toast.error('Failed to add problem');
  }
};
```

#### Filter Bar Pattern (from `FilterBar.tsx`)

```tsx
<Select
  value={filters.topic ?? 'all'}
  onValueChange={(value) =>
    onTopicChange(value === 'all' ? null : (value as TopicSlug))
  }
>
  <SelectTrigger className="w-[180px]">
    <SelectValue placeholder="All Topics" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="all">All Topics</SelectItem>
    {topicOptions.map((option) => (
      <SelectItem key={option.value} value={option.value}>
        {option.label}
      </SelectItem>
    ))}
  </SelectContent>
</Select>
```

#### Badge Components

```tsx
// TopicBadge
<TopicBadge topic="arrays-hashing" />
<TopicBadge topic="two-pointers" masteryPercent={75} unlocked={true} />

// DifficultyBadge
<DifficultyBadge difficulty="easy" />
<DifficultyBadge difficulty="medium" className="ml-2" />
```

#### Toast Notifications

```typescript
import { toast } from 'sonner';
toast.success('Problem added successfully');
toast.error('Failed to add problem');
```

---

## Testing Checklist

- [ ] Catalog page loads with all 150 problems
- [ ] Filters work: topic, difficulty, source, search
- [ ] "Add to My Problems" creates problem and disables button
- [ ] Already-added problems show as disabled/dimmed
- [ ] Dashboard shows 3 recommendations from catalog
- [ ] Recommendations update when problems are added
- [ ] External LeetCode links open in new tab
- [ ] Works offline (no network requests)
- [ ] Mobile responsive layout
- [ ] Navigation link appears on Home page

---

## Sample Catalog Data (First 20 Problems)

Reference for building the full 150:

| # | Title | Topic | Difficulty | Source | LeetCode # |
|---|-------|-------|------------|--------|------------|
| 1 | Two Sum | arrays-hashing | easy | blind-75 | 1 |
| 2 | Valid Anagram | arrays-hashing | easy | blind-75 | 242 |
| 3 | Contains Duplicate | arrays-hashing | easy | blind-75 | 217 |
| 4 | Group Anagrams | arrays-hashing | medium | blind-75 | 49 |
| 5 | Top K Frequent Elements | arrays-hashing | medium | blind-75 | 347 |
| 6 | Product of Array Except Self | arrays-hashing | medium | blind-75 | 238 |
| 7 | Valid Sudoku | arrays-hashing | medium | neetcode-150 | 36 |
| 8 | Longest Consecutive Sequence | arrays-hashing | medium | blind-75 | 128 |
| 9 | Valid Palindrome | two-pointers | easy | blind-75 | 125 |
| 10 | Two Sum II | two-pointers | medium | blind-75 | 167 |
| 11 | 3Sum | two-pointers | medium | blind-75 | 15 |
| 12 | Container With Most Water | two-pointers | medium | blind-75 | 11 |
| 13 | Trapping Rain Water | two-pointers | hard | blind-75 | 42 |
| 14 | Best Time to Buy and Sell Stock | sliding-window | easy | blind-75 | 121 |
| 15 | Longest Substring Without Repeating | sliding-window | medium | blind-75 | 3 |
| 16 | Longest Repeating Character Replacement | sliding-window | medium | blind-75 | 424 |
| 17 | Permutation in String | sliding-window | medium | neetcode-150 | 567 |
| 18 | Minimum Window Substring | sliding-window | hard | blind-75 | 76 |
| 19 | Valid Parentheses | stack | easy | blind-75 | 20 |
| 20 | Min Stack | stack | medium | blind-75 | 155 |

---

## File Summary

### New Files to Create

| File | Purpose |
|------|---------|
| `src/data/catalog.ts` | Static array of 150 curated problems |
| `src/pages/Catalog.tsx` | Browse/filter catalog page |
| `src/components/CatalogCard.tsx` | Individual catalog problem card |
| `src/components/SourceBadge.tsx` | Badge showing problem source |
| `src/hooks/useCatalogRecommendations.ts` | Hook for prioritized recommendations |

### Files to Modify

| File | Changes |
|------|---------|
| `src/types/index.ts` | Add `CatalogProblem`, `CatalogSource` types |
| `src/App.tsx` | Add `/catalog` route |
| `src/pages/Home.tsx` | Add "Browse Catalog" navigation button |
| `src/components/Dashboard.tsx` | Add "Recommended to Add" section |
