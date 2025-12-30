````markdown
# Tasks: Problem Catalog

**Input**: Design documents from `/specs/006-problem-catalog/`
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, contracts/ ✅, quickstart.md ✅

**Tests**: No tests explicitly requested in the feature specification.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3, US4)
- Include exact file paths in descriptions

## Path Conventions

- **Single project**: `src/` at repository root (React/TypeScript SPA)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Add types and static catalog data

- [ ] T001 Add CatalogProblem, CatalogSource types and CATALOG_SOURCES constant to src/types/index.ts
- [ ] T002 Add CatalogFilters interface to src/types/index.ts
- [ ] T003 Create static catalog data with 150 problems and helper functions in src/data/catalog.ts
- [ ] T004 Create URL normalization utility function in src/lib/utils.ts

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core hook and badge components needed by all user stories

**⚠️ CRITICAL**: User story implementation requires these to be complete

- [ ] T005 Create SourceBadge component in src/components/SourceBadge.tsx
- [ ] T006 Create useCatalogRecommendations hook with priority algorithm (focus topic first, then difficulty easy→hard, then order) in src/hooks/useCatalogRecommendations.ts
- [ ] T007 Add /catalog route to src/App.tsx

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - Browse and Add Problems from Catalog (Priority: P1) 🎯 MVP

**Goal**: Users can browse the catalog and add problems to their practice list with one click

**Independent Test**: Navigate to /catalog, view 150 problems, click "Add to My Problems" on any problem, verify it's added and shows "Already Added" on page reload

### Implementation for User Story 1

- [ ] T008 [P] [US1] Create CatalogCard component with add button and external link in src/components/CatalogCard.tsx
- [ ] T009 [US1] Create Catalog page with grid layout in src/pages/Catalog.tsx
- [ ] T010 [US1] Add duplicate detection logic using URL normalization in src/pages/Catalog.tsx
- [ ] T011 [US1] Add toast notifications for add success/failure using sonner in src/pages/Catalog.tsx

**Checkpoint**: User Story 1 complete - users can browse catalog and add problems

---

## Phase 4: User Story 2 - Filter Catalog by Topic, Difficulty, and Source (Priority: P1)

**Goal**: Users can filter the catalog to find specific problems quickly

**Independent Test**: Apply filters on /catalog, verify only matching problems are displayed, verify stats bar shows filtered count

### Implementation for User Story 2

- [ ] T012 [P] [US2] Create CatalogFilters component with topic, difficulty, source selects and search input in src/components/CatalogFilters.tsx
- [ ] T013 [US2] Integrate CatalogFilters into Catalog page in src/pages/Catalog.tsx
- [ ] T014 [US2] Add filter state management and filtering logic in src/pages/Catalog.tsx
- [ ] T015 [US2] Add stats bar showing "Showing X of 150 problems • Y already added" in src/pages/Catalog.tsx

**Checkpoint**: User Stories 1 AND 2 complete - full catalog browsing with filtering

---

## Phase 5: User Story 3 - View Personalized Recommendations on Dashboard (Priority: P2)

**Goal**: Users see up to 3 recommended problems on their Dashboard based on focus topic

**Independent Test**: View Dashboard, verify 3 recommended problems appear, click "Add" on a recommendation, verify it updates

### Implementation for User Story 3

- [ ] T016 [P] [US3] Create CatalogRecommendationRow component in src/components/CatalogRecommendationRow.tsx
- [ ] T017 [US3] Add "Recommended to Add" section to Dashboard in src/components/Dashboard.tsx
- [ ] T018 [US3] Add "View full catalog" link in recommendations section in src/components/Dashboard.tsx
- [ ] T019 [US3] Handle edge case when all 150 problems are added (hide or show message) in src/components/Dashboard.tsx

**Checkpoint**: User Stories 1, 2, AND 3 complete - full catalog with Dashboard recommendations

---

## Phase 6: User Story 4 - Navigate to Catalog from Home (Priority: P2)

**Goal**: Users can easily navigate to the catalog from the home page

**Independent Test**: View home page, click "Browse Catalog" button, verify navigation to /catalog

### Implementation for User Story 4

- [ ] T020 [US4] Add "Browse Catalog" button/card to Home page in src/pages/Home.tsx

**Checkpoint**: All user stories complete - full feature functionality

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T021 [P] Verify responsive layout on mobile (320px), tablet, and desktop (1920px)
- [ ] T022 [P] Verify keyboard accessibility across catalog components
- [ ] T023 [P] Verify offline functionality (catalog data bundled statically)
- [ ] T024 Run quickstart.md validation checklist

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-6)**: All depend on Foundational phase completion
- **Polish (Phase 7)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational - Core MVP, no dependencies on other stories
- **User Story 2 (P1)**: Can start after Foundational - Enhances US1 but independently testable
- **User Story 3 (P2)**: Can start after Foundational - Uses useCatalogRecommendations hook
- **User Story 4 (P2)**: Can start after Foundational - Simple navigation, no dependencies

### Within Each Phase

- Setup tasks T001-T002 (types) before T003 (catalog data)
- T003 (catalog data) and T004 (utils) can run in parallel
- Foundational T005-T006 can run in parallel
- T007 (route) after T005-T006 complete

### Parallel Opportunities

```text
Phase 1: T001-T002 → T003 + T004 (parallel)
Phase 2: T005 + T006 (parallel) → T007
Phase 3: T008 → T009 → T010 → T011
Phase 4: T012 → T013 → T014 → T015
Phase 5: T016 → T017 → T018 → T019
Phase 6: T020
Phase 7: T021 + T022 + T023 (parallel) → T024
```

---

## Parallel Example: Foundational Phase

```bash
# Launch these tasks in parallel:
Task T005: "Create SourceBadge component in src/components/SourceBadge.tsx"
Task T006: "Create useCatalogRecommendations hook in src/hooks/useCatalogRecommendations.ts"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001-T004)
2. Complete Phase 2: Foundational (T005-T007)
3. Complete Phase 3: User Story 1 (T008-T011)
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo if ready - users can browse and add problems!

### Incremental Delivery

1. Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy (MVP!)
3. Add User Story 2 → Test independently → Deploy (filtering!)
4. Add User Story 3 → Test independently → Deploy (recommendations!)
5. Add User Story 4 → Test independently → Deploy (navigation!)
6. Polish phase → Final validation

### Task Counts by Phase

| Phase | Tasks | Cumulative |
|-------|-------|------------|
| Setup | 4 | 4 |
| Foundational | 3 | 7 |
| User Story 1 | 4 | 11 |
| User Story 2 | 4 | 15 |
| User Story 3 | 4 | 19 |
| User Story 4 | 1 | 20 |
| Polish | 4 | 24 |

---

## Notes

- All catalog data is static (150 problems bundled with app)
- No database migration required - uses existing Problem table
- Reuse existing components: DifficultyBadge, TopicBadge
- Use existing useProblems hook for addProblem functionality
- Use sonner for toast notifications (already in project)
- URL normalization handles duplicate detection edge cases
- Catalog works 100% offline

````
