# Data Model: Problem Catalog

**Feature**: 006-problem-catalog  
**Date**: 30 December 2025

## Entity Overview

This feature introduces **read-only static data** for the catalog. No new database tables are created; the catalog is bundled as TypeScript constants.

```
┌─────────────────────────────────────────────────────────────────┐
│                        CATALOG (Static)                         │
├─────────────────────────────────────────────────────────────────┤
│  PROBLEM_CATALOG: CatalogProblem[]                              │
│    - 150 curated problems                                       │
│    - Read-only, bundled with app                                │
│    - No persistence required                                    │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ "Add to My Problems"
                              │ (copies to IndexedDB)
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    PROBLEMS (IndexedDB)                         │
├─────────────────────────────────────────────────────────────────┤
│  Existing Problem table                                         │
│    - User's personal problem list                               │
│    - Created via useProblems.addProblem()                       │
└─────────────────────────────────────────────────────────────────┘
```

## New Types

### CatalogProblem

Represents a curated problem in the static catalog.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | string | ✓ | Unique slug identifier (e.g., "two-sum") |
| title | string | ✓ | Problem title as shown on LeetCode |
| url | string | ✓ | Direct LeetCode problem URL |
| topic | TopicSlug | ✓ | Algorithm topic category |
| difficulty | Difficulty | ✓ | Easy, Medium, or Hard |
| source | CatalogSource | ✓ | Origin list (blind-75, neetcode-150, etc.) |
| order | number | ✓ | Suggested order within topic (1 = do first) |
| leetcodeNumber | number | ✗ | Optional LeetCode problem number |

**Validation Rules**:
- `id` must be unique across all catalog problems
- `url` must be a valid LeetCode URL format
- `topic` must be one of the 15 defined TopicSlug values
- `order` must be a positive integer

### CatalogSource

Enum-like const for problem source attribution.

| Value | Description |
|-------|-------------|
| `'blind-75'` | From the Blind 75 list |
| `'neetcode-150'` | From NeetCode 150 list |
| `'grind-75'` | From Grind 75 list |
| `'curated'` | Custom curated addition |

### CatalogFilters

Filter state for the catalog page.

| Field | Type | Description |
|-------|------|-------------|
| topic | TopicSlug \| null | Filter by topic |
| difficulty | Difficulty \| null | Filter by difficulty |
| source | CatalogSource \| null | Filter by source |
| search | string | Text search on title |

## Data Flow

### Adding a Catalog Problem

```
User clicks "Add to My Problems"
           │
           ▼
┌──────────────────────────────────┐
│   CatalogCard.onAdd()            │
│   - Extract: title, url, topic,  │
│     difficulty from CatalogProblem│
└──────────────────────────────────┘
           │
           ▼
┌──────────────────────────────────┐
│   useProblems.addProblem()       │
│   - Creates new Problem in DB    │
│   - Sets status: 'unsolved'      │
│   - Sets notes: ''               │
└──────────────────────────────────┘
           │
           ▼
┌──────────────────────────────────┐
│   toast.success()                │
│   - User feedback                │
└──────────────────────────────────┘
           │
           ▼
┌──────────────────────────────────┐
│   useLiveQuery re-renders        │
│   - CatalogCard shows "Added"    │
│   - Recommendations update       │
└──────────────────────────────────┘
```

### Duplicate Detection

```
On catalog page load / filter change
           │
           ▼
┌──────────────────────────────────┐
│   useProblems() returns problems │
└──────────────────────────────────┘
           │
           ▼
┌──────────────────────────────────┐
│   useMemo: Build existingUrls Set│
│   - Normalize: lowercase, trim / │
└──────────────────────────────────┘
           │
           ▼
┌──────────────────────────────────┐
│   For each CatalogProblem:       │
│   isAdded = existingUrls.has(    │
│     normalizeUrl(problem.url)    │
│   )                              │
└──────────────────────────────────┘
```

### Recommendation Priority

```
useCatalogRecommendations()
           │
           ▼
┌──────────────────────────────────┐
│  1. Get all catalog problems     │
│  2. Filter out already-added     │
└──────────────────────────────────┘
           │
           ▼
┌──────────────────────────────────┐
│  3. Get focus topic:             │
│     - Unlocked topics            │
│     - Mastery < 100%             │
│     - Lowest masteryPercent      │
└──────────────────────────────────┘
           │
           ▼
┌──────────────────────────────────┐
│  4. Sort available problems:     │
│     - Focus topic first          │
│     - Easy before medium/hard    │
│     - Lower order first          │
└──────────────────────────────────┘
           │
           ▼
┌──────────────────────────────────┐
│  5. Return top N (default 3)     │
└──────────────────────────────────┘
```

## Relationships

```
┌─────────────────┐         ┌─────────────────┐
│ CatalogProblem  │         │    Problem      │
├─────────────────┤         ├─────────────────┤
│ id              │         │ id              │
│ title           │───────▶ │ title           │
│ url             │ (copy)  │ url             │
│ topic           │───────▶ │ topic           │
│ difficulty      │───────▶ │ difficulty      │
│ source          │         │ status          │
│ order           │         │ notes           │
│ leetcodeNumber? │         │ createdAt       │
└─────────────────┘         │ updatedAt       │
                            └─────────────────┘

Relationship: One-way copy when user adds a catalog problem.
No back-reference is stored.
```

## Indexes & Queries

No database indexes needed for catalog data (static array).

For duplicate detection, problems table is already queried by `useProblems()` which returns all problems. URL comparison is done in-memory.

## Migration

No database migration required. This feature only adds:
1. Static TypeScript data (`catalog.ts`)
2. New TypeScript types (no schema change)
3. New React components and hooks
