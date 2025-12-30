# Research: Problem Catalog

**Feature**: 006-problem-catalog  
**Date**: 30 December 2025

## Research Tasks

### 1. Catalog Data Structure

**Question**: What is the optimal structure for static catalog data to support filtering and recommendations?

**Decision**: Use a flat TypeScript array with typed `CatalogProblem` objects, exported as a const.

**Rationale**:
- Static data requires no runtime fetching or caching logic
- TypeScript const assertion enables compile-time type checking
- Flat array with helper functions (filter by topic, filter by source) keeps code simple
- 150 items is small enough for in-memory operations without virtualization

**Alternatives Considered**:
- Nested structure by topic: Rejected because filtering by difficulty/source would require flattening
- JSON file with dynamic import: Rejected because adds complexity without benefit for static data

### 2. Duplicate Detection Strategy

**Question**: How to efficiently detect if a catalog problem is already in the user's problem list?

**Decision**: Build a Set of normalized URLs from existing problems, check membership with O(1) lookup.

**Rationale**:
- URL is the most reliable unique identifier for LeetCode problems
- Set provides O(1) lookup time for 150 problems
- Normalization (lowercase, trailing slash removal) handles minor URL variations

**Implementation**:
```typescript
function normalizeUrl(url: string): string {
  return url.toLowerCase().replace(/\/$/, '');
}

const existingUrls = useMemo(() => {
  return new Set(
    problems?.filter(p => p.url).map(p => normalizeUrl(p.url!)) ?? []
  );
}, [problems]);

const isAdded = (url: string) => existingUrls.has(normalizeUrl(url));
```

**Alternatives Considered**:
- Match by title: Rejected because titles can have minor variations
- Store catalog ID in Problem entity: Rejected because requires schema migration

### 3. Recommendation Algorithm

**Question**: What algorithm should prioritize catalog recommendations?

**Decision**: Multi-factor sorting with focus topic priority.

**Rationale**:
- Focus topic = lowest mastery unlocked topic (user's weakest area)
- Within focus topic, prefer easier problems first (learning progression)
- Order field provides curated sequencing within topic

**Algorithm**:
1. Filter to problems not yet added
2. Find focus topic (lowest masteryPercent among unlocked topics with <100% mastery)
3. Sort by:
   - Focus topic first (if matches focus topic)
   - Difficulty (easy=0, medium=1, hard=2)
   - Order within topic
4. Return top N recommendations

**Alternatives Considered**:
- Random selection: Rejected because not helpful for learning progression
- Most popular problems first: Rejected because requires external data

### 4. Source Badge Colors

**Question**: What colors should distinguish problem sources?

**Decision**: Distinct colors per source for visual recognition.

| Source | Light Mode | Dark Mode | Rationale |
|--------|------------|-----------|-----------|
| blind-75 | Purple | Purple | Distinctive, associated with premium/curated |
| neetcode-150 | Blue | Blue | NeetCode brand association |
| grind-75 | Green | Green | Growth/progress connotation |
| curated | Gray | Gray | Neutral for custom additions |

**Rationale**:
- Consistent with existing badge patterns (DifficultyBadge uses green/yellow/red)
- Colors pass WCAG contrast requirements
- Dark mode variants use reduced saturation for reduced eye strain

### 5. Catalog Data Sources

**Question**: Where should the 150 problems come from?

**Decision**: Compile from Blind 75, NeetCode 150, and Grind 75 problem lists.

**Data Collection Approach**:
1. Start with all 75 Blind 75 problems (source: `blind-75`)
2. Add non-overlapping problems from NeetCode 150 to reach 150 total
3. Map each problem to one of the 15 existing topics
4. Include LeetCode problem number for reference
5. Order within topic by difficulty, then foundational-first

**Topics Distribution Target** (~10 per topic):
- arrays-hashing: ~12 problems
- two-pointers: ~8 problems
- sliding-window: ~6 problems
- stack: ~8 problems
- binary-search: ~8 problems
- linked-list: ~10 problems
- trees: ~15 problems
- tries: ~4 problems
- backtracking: ~6 problems
- heap: ~6 problems
- graphs: ~12 problems
- dynamic-programming: ~20 problems
- greedy: ~6 problems
- intervals: ~6 problems
- bit-manipulation: ~6 problems

### 6. Component Patterns

**Question**: Which existing patterns should be followed?

**Decision**: Reuse existing component patterns from the codebase.

**Patterns to Follow**:
1. **Page Layout** (from Problems.tsx, Settings.tsx):
   - Header with back button, title
   - Main content with max-w-6xl container
   - Responsive padding

2. **Filter Bar** (from FilterBar.tsx):
   - Select components with "all" placeholder
   - Search input with icon
   - Flex wrap for mobile

3. **Card Grid** (from ProblemCard.tsx, SuggestedNext.tsx):
   - Responsive grid: 1 col mobile, 2 col tablet, 3 col desktop
   - Card with header/content structure
   - Hover states with transition

4. **Badge Components**:
   - Use existing DifficultyBadge
   - Create TopicBadge following same pattern
   - Create SourceBadge following same pattern

5. **Toast Notifications** (sonner):
   - `toast.success()` for successful add
   - `toast.error()` for failures

### 7. Testing Strategy

**Question**: What testing approach should be used?

**Decision**: Unit tests for hook logic, component tests for UI interactions.

**Test Coverage Plan**:

| File | Test Type | Coverage |
|------|-----------|----------|
| useCatalogRecommendations.ts | Unit | Filtering, sorting, duplicate detection |
| catalog.ts | Unit | Helper functions (getCatalogByTopic, getCatalogBySource) |
| CatalogCard.tsx | Component | Add button states, external link |
| Catalog.tsx | Integration | Filters, search, navigation |

**Edge Cases to Test**:
- All problems already added (empty recommendations)
- No problems added (all available)
- URL normalization edge cases
- Filter combinations

## Summary

All research questions resolved. No blockers identified. Ready for Phase 1 design.
