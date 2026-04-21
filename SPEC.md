# Problem Catalog Revamp — SPEC.md

## What

Complete visual and UX overhaul of the Problem Catalog page (`/catalog`) in algos-mastery.

**Goal:** Transform the plain 3-column card grid into a premium, curriculum-style learning experience that shows progress, organizes by topic sections, and guides users through their study plan.

---

## Tech Stack

- React 18 + TypeScript + Vite
- Tailwind CSS + shadcn/ui components
- CSS variables for dark mode
- Existing data structures: `PROBLEM_CATALOG`, `CatalogProblem`, `CatalogFilters`, `TOPICS`

---

## Design Direction

### Layout: Sidebar + Main Content

```
┌──────────────────────────────────────────────────────────────┐
│  PageHeader: "Problem Catalog"  [search bar]                │
├────────────┬─────────────────────────────────────────────────┤
│            │                                                  │
│  Filter    │  Topic Section 1: Arrays & Hashing               │
│  Sidebar   │  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐               │
│            │  │  1  │ │  2  │ │  3  │ │  4  │  ...          │
│  • Topics  │  └─────┘ └─────┘ └─────┘ └─────┘               │
│  • Diff    │  ████████████░░░░░ 8/12 completed               │
│  • Source  │                                                  │
│  • Stats   │  Topic Section 2: Two Pointers                  │
│            │  ...                                             │
│            │                                                  │
└────────────┴─────────────────────────────────────────────────┘
```

### Visual Changes

1. **Topic Section Cards** — Each topic is a collapsible section with:
   - Topic name + icon (emoji or Lucide icon per topic)
   - Progress bar: `███░░░░ 8/12 completed`
   - Problem count badge
   - Click to expand/collapse the problem list within

2. **Problem Cards** (inside topic sections):
   - Compact horizontal card instead of square card
   - Left: colored difficulty bar (3px wide vertical stripe — green/yellow/red)
   - Title with LeetCode number
   - Source badge (small)
   - "Add" or "Added" button on the right
   - External link icon

3. **Filter Sidebar** (replaces inline dropdowns):
   - Sticky sidebar on desktop (≥1024px)
   - Collapses to a filter drawer/modal on mobile
   - Sections: Topics (checkboxes), Difficulty (checkboxes), Source (checkboxes)
   - Active filter count badge
   - Clear all button

4. **Stats Bar** (above topic sections):
   - Total: 150 problems
   - Completed: X in your list
   - By difficulty: X easy, Y medium, Z hard
   - By source: Blind 75 (N), NeetCode 150 (N), etc.

5. **Search**:
   - Prominent search in PageHeader
   - Searches across titles
   - When searching, all topics expand and matching text is highlighted
   - Debounced input (300ms)

6. **"Recommended Next"**:
   - If a topic has partial completion, show the next un-added problem as "Recommended" with a highlight

---

## Data Structures (Must Preserve)

```typescript
// PROBLEM_CATALOG: readonly CatalogProblem[] (150 items)
// CatalogProblem: { id, title, url, topic, difficulty, source, order, leetcodeNumber? }
// CatalogFilters: { topic: TopicSlug|null, difficulty: Difficulty|null, source: CatalogSource|null, search: string }
// TOPICS: Topic[] with slug, name, order (15 topics)
```

**Constraints:**
- Filtering logic must work exactly as it does now (topic, difficulty, source, search)
- Dark mode must still work (CSS variables)
- Mobile responsive (filter sidebar becomes drawer)
- Performance: 150 problems must render fast

---

## Files to Create/Modify

### New Files
- `src/components/CatalogTopicSection.tsx` — Collapsible topic section with progress
- `src/components/CatalogProblemRow.tsx` — Horizontal problem card with difficulty bar
- `src/components/CatalogSidebar.tsx` — Filter sidebar with checkboxes
- `src/components/CatalogStats.tsx` — Stats bar showing overall progress

### Modify
- `src/pages/Catalog.tsx` — Replace 3-column grid with topic sections + sidebar layout
- `src/components/CatalogFilters.tsx` — Replace inline selects with sidebar (or keep for mobile)
- `src/components/CatalogCard.tsx` — Replace with new compact card (may deprecate)

### Optional/New
- `src/hooks/useCatalogFilters.ts` — Extract filter logic into a hook (if clean)

---

## Acceptance Criteria

- [ ] Problems grouped by topic, 15 collapsible sections
- [ ] Progress bar per topic showing "X/Y completed" when user has problems added
- [ ] Filter sidebar with topic/difficulty/source checkboxes (desktop)
- [ ] Filter drawer on mobile (≤1023px)
- [ ] Stats bar showing overall: total, by difficulty, by source
- [ ] Search with debounce + text highlighting
- [ ] Horizontal problem cards with colored difficulty bar (not just a badge)
- [ ] "Add to My Problems" / "Added" button per card
- [ ] Dark mode works via CSS variables
- [ ] All existing filter behavior preserved (topic, difficulty, source, search)
- [ ] Lint passes, TypeScript compiles, build succeeds
- [ ] Mobile responsive (sidebar → drawer)

---

## Implementation Notes

- Use existing shadcn/ui components: `Card`, `Button`, `Badge`, `Checkbox`, `Collapsible` (or custom accordion), `Sheet` (for mobile drawer), `Tooltip`
- Topic icons: pick from Lucide React (or use emoji if icon unavailable)
- Difficulty colors via Tailwind: easy=green, medium=yellow, hard=red (respect dark mode)
- Progress calculation: compare catalog problem URLs against user's added problems (use `normalizeUrl` as currently done)
- Collapsible sections: use native `<details>`/`<summary>` or shadcn Collapsible component
- Mobile drawer: shadcn `Sheet` component
- No external state management needed — React state in Catalog.tsx is sufficient
