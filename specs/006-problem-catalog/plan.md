# Implementation Plan: Problem Catalog

**Branch**: `006-problem-catalog` | **Date**: 30 December 2025 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/006-problem-catalog/spec.md`

## Summary

Add a static catalog of 150 curated algorithm problems (Blind 75 + 75 extras from NeetCode 150/Grind 75) to eliminate cold-start friction for new users. The catalog supports browsing, filtering by topic/difficulty/source, and one-click add to practice list. Dashboard integration provides personalized recommendations based on user's current focus topic.

## Technical Context

**Language/Version**: TypeScript ~5.9.3  
**Framework**: React ^19.2.0 with React Router ^7.11.0  
**Primary Dependencies**: Vite ^7.2.4, Tailwind CSS ^4.1.18, Dexie.js ^4.2.1, Lucide React, Sonner (toasts)  
**Storage**: IndexedDB via Dexie.js (existing problems table)  
**Testing**: Vitest + React Testing Library + fake-indexeddb  
**Target Platform**: Web (PWA, offline-capable)  
**Project Type**: Single (frontend-only SPA)  
**Performance Goals**: Catalog page loads <500ms, filter updates <100ms  
**Constraints**: 100% offline-capable, bundle size <500KB gzipped  
**Scale/Scope**: 150 static problems, 15 topics, single-user local storage

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Requirement | Status | Notes |
|-----------|-------------|--------|-------|
| I.1 TypeScript Strict Mode | All code compiles with `strict: true` | ✅ Pass | Existing project configuration |
| I.2 Component Isolation | Single-purpose components | ✅ Pass | CatalogCard, SourceBadge, CatalogFilters are single-purpose |
| I.3 Custom Hooks First | Business logic in hooks | ✅ Pass | `useCatalogRecommendations` hook for recommendations logic |
| I.4 Explicit Types | Explicit annotations | ✅ Pass | CatalogProblem, CatalogSource types defined |
| I.5 Max File Length | <200 lines (300 max) | ✅ Pass | Components designed to be concise |
| I.6 No Dead Code | No unused exports | ✅ Pass | All exports have consumers |
| II.1 Test-First Data | Tests before implementation for data ops | ✅ Pass | Static data (no IndexedDB changes); URL normalization tested |
| II.2 Component Tests | Interactive components tested | ✅ Pass | CatalogCard.test.tsx added for primary component |
| II.3 Edge Cases | Boundary conditions tested | ✅ Pass | Empty states, all-added state, URL normalization |
| II.4 Test Collocation | Tests with source files | ✅ Pass | Following existing patterns |
| III.1 Design System | Tailwind CSS utility classes | ✅ Pass | Using existing UI components |
| III.2 Loading/Error States | Async feedback | ✅ Pass | Loading skeletons, toast notifications |
| III.3 Keyboard Navigation | Accessible | ✅ Pass | Using existing accessible components |
| III.4 Responsive | 320px-1920px | ✅ Pass | Mobile-first grid layout |
| III.5 Persistence Feedback | Toast for IndexedDB ops | ✅ Pass | sonner toast on add |
| III.6 Undo Support | Confirm destructive actions | N/A | Add is non-destructive |

**Gate Status**: ✅ PASS - All applicable principles satisfied

## Project Structure

### Documentation (this feature)

```text
specs/006-problem-catalog/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output (TypeScript interfaces)
└── tasks.md             # Phase 2 output (/speckit.tasks command)
```

### Source Code (repository root)

```text
src/
├── components/
│   ├── CatalogCard.tsx           # NEW: Catalog problem card
│   ├── CatalogFilters.tsx        # NEW: Filter bar for catalog
│   ├── CatalogRecommendationRow.tsx  # NEW: Compact row for Dashboard
│   ├── SourceBadge.tsx           # NEW: Badge for problem source
│   ├── TopicBadge.tsx            # EXISTING: Reuse for topic display
│   ├── DifficultyBadge.tsx       # EXISTING: Reuse for difficulty
│   └── Dashboard.tsx             # MODIFY: Add recommendations section
├── data/
│   ├── catalog.ts                # NEW: Static 150 problems array + helpers
│   └── topics.ts                 # EXISTING: Topic taxonomy
├── hooks/
│   ├── useCatalogRecommendations.ts  # NEW: Recommendation logic
│   └── useProblems.ts            # EXISTING: Used for addProblem
├── pages/
│   ├── Catalog.tsx               # NEW: Catalog browse page
│   └── Home.tsx                  # MODIFY: Add "Browse Catalog" button
├── types/
│   └── index.ts                  # MODIFY: Add CatalogProblem, CatalogSource
└── App.tsx                       # MODIFY: Add /catalog route
```

**Structure Decision**: Single project structure - all code in `src/` following existing React component organization.

## Complexity Tracking

> No constitution violations requiring justification.
