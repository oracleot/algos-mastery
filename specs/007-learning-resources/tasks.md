````markdown
# Tasks: Learning Resources

**Input**: Design documents from `/specs/007-learning-resources/`
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, contracts/ ✅, quickstart.md ✅

**Tests**: Tests are included as they are required per the Constitution Check in plan.md (II.1, II.2, II.3, II.4).

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3, US4)
- Include exact file paths in descriptions

## Path Conventions

- **Single project**: `src/` at repository root (per plan.md)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Type definitions and database migration - shared by all user stories

- [X] T001 Add `RESOURCE_TYPES`, `ResourceType`, and `LearningResource` interface to src/types/index.ts
- [X] T002 Add `resources: LearningResource[]` field to `Problem` interface in src/types/index.ts
- [X] T003 Add `resources: LearningResource[]` field to `ProblemFormData` interface in src/types/index.ts
- [X] T004 Add `ResourceValidationErrors` interface to src/types/index.ts
- [X] T005 Add database v5 migration to initialize `resources: []` for existing problems in src/lib/db.ts

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Validation and utility functions that ALL user stories depend on

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T006 [P] Create `detectResourceSource()` function with 15+ URL patterns in src/lib/resourceUtils.ts
- [X] T007 Create `getResourceTypeIcon()` and `getResourceTypeLabel()` helper functions in src/lib/resourceUtils.ts (depends on T006)
- [X] T008 [P] Add `validateResource()` and `isResourceValid()` functions to src/lib/validation.ts
- [X] T009 [P] Write unit tests for `detectResourceSource()` covering all 15+ platforms in src/lib/resourceUtils.test.ts
- [X] T010 [P] Write unit tests for `validateResource()` in src/lib/validation.test.ts
- [X] T011 [P] Write unit tests for database migration v5 in src/lib/db.test.ts

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - Add Resource to a Problem (Priority: P1) 🎯 MVP

**Goal**: Enable users to attach learning resources (video, article, documentation) to problems with title, URL, type, and auto-detected source

**Independent Test**: Navigate to a problem, click "Add Resource", fill in title/URL/type, confirm it appears in the resource list with toast notification

### Tests for User Story 1

- [X] T012 [P] [US1] Write component tests for ResourceForm (form expansion, validation, submission, source auto-detect on blur) in src/components/ResourceForm.test.tsx

### Implementation for User Story 1

- [X] T013 [US1] Create `ResourceForm` component with collapsible form, title/URL/type inputs, source auto-detection on blur in src/components/ResourceForm.tsx
- [X] T014 [US1] Integrate `ResourceForm` into `ProblemForm` with local resources state management in src/components/ProblemForm.tsx
- [X] T015 [US1] Update `useProblems` hook to handle `resources` array in `addProblem` and `updateProblem` in src/hooks/useProblems.ts

**Checkpoint**: Users can add resources when creating/editing problems

---

## Phase 4: User Story 2 - View Resources on Problem Detail (Priority: P1)

**Goal**: Display all attached learning resources on the problem detail page with type-specific icons and clickable links

**Independent Test**: View a problem with attached resources, confirm Learning Resources section appears after solutions with icons and clickable external links

### Tests for User Story 2

- [X] T016 [P] [US2] Write component tests for ResourceList (empty state, icons per type, external links, remove button visibility) in src/components/ResourceList.test.tsx

### Implementation for User Story 2

- [X] T017 [US2] Create `ResourceList` component with type icons (Play/FileText/BookOpen), external links, optional remove buttons in src/components/ResourceList.tsx
- [X] T018 [US2] Add Learning Resources section to problem detail page (after solutions) with empty state in src/pages/Problem.tsx

**Checkpoint**: Users can view resources on problem detail page with appropriate icons and links

---

## Phase 5: User Story 3 - Remove Resource from Problem (Priority: P2)

**Goal**: Allow users to remove resources when editing a problem (instant, no confirmation dialog)

**Dependencies**: Requires T013 (ResourceForm) and T017 (ResourceList) to be complete

**Independent Test**: Edit a problem with resources, click remove on a resource, confirm it disappears instantly from the list

### Implementation for User Story 3

- [X] T019 [US3] Enable remove functionality in `ResourceList` by passing `onRemove` callback when in edit mode in src/components/ProblemForm.tsx
- [X] T020 [US3] Add remove button (Trash2 icon) to ResourceList items when `onRemove` is provided in src/components/ResourceList.tsx

**Checkpoint**: Users can remove resources from problems when editing

---

## Phase 6: User Story 4 - View Resource Count on Problem Card (Priority: P3)

**Goal**: Display resource count badge on problem cards to show which problems have learning materials

**Independent Test**: View problem list, confirm problems with resources show a badge with book icon and count

### Implementation for User Story 4

- [X] T021 [US4] Add resource count badge (BookOpen icon + count) to ProblemCard when resources exist in src/components/ProblemCard.tsx

**Checkpoint**: Users can see resource count indicator on problem cards

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Ensure data integrity across all operations and final validation

- [X] T022 [P] Write unit test for export/import round-trip with resources in src/lib/exportImport.test.ts
- [X] T023 Verify export includes resources as part of problem data (manual check or extend T022 test)
- [X] T024 Verify import preserves resources when importing problems (manual check or extend T022 test)
- [X] T025 Run full test suite and ensure all tests pass: `pnpm test --run`
- [X] T026 Run type check and lint: `pnpm typecheck && pnpm lint`
- [X] T027 Run build to verify no production errors: `pnpm build`
- [X] T028 Manual validation against quickstart.md acceptance criteria checklist

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup (Phase 1) - BLOCKS all user stories
- **User Story 1 (Phase 3)**: Depends on Foundational (Phase 2)
- **User Story 2 (Phase 4)**: Depends on Foundational (Phase 2), can run in parallel with US1
- **User Story 3 (Phase 5)**: Depends on User Story 1 (needs ResourceForm and ResourceList)
- **User Story 4 (Phase 6)**: Depends on Setup (Phase 1), can run in parallel with US1/US2
- **Polish (Phase 7)**: Depends on all user stories being complete

### User Story Dependencies

```
Phase 1 (Setup)
     ↓
Phase 2 (Foundational)
     ↓
  ┌──┴──┬───────┐
  ↓     ↓       ↓
US1   US2     US4  (can run in parallel)
  ↓     ↓
  └──┬──┘
     ↓
   US3  (needs ResourceForm + ResourceList)
     ↓
Phase 7 (Polish)
```

### Parallel Opportunities

**Within Phase 2 (Foundational)**:
- T006, T007 (resourceUtils functions)
- T008 (validation functions)
- T009, T010, T011 (all tests)

**Across User Stories**:
- US1 (T012-T015) and US2 (T016-T018) can run in parallel
- US4 (T021) can run in parallel with US1/US2/US3

---

## Parallel Example: Phase 2 (Foundational)

```bash
# Launch all foundational implementation tasks together:
Task T006: "Create detectResourceSource() function in src/lib/resourceUtils.ts"
Task T007: "Create type helper functions in src/lib/resourceUtils.ts"
Task T008: "Add validateResource() to src/lib/validation.ts"

# Launch all foundational tests together:
Task T009: "Write tests for detectResourceSource() in src/lib/resourceUtils.test.ts"
Task T010: "Write tests for validateResource() in src/lib/validation.test.ts"
Task T011: "Write tests for db migration in src/lib/db.test.ts"
```

---

## Parallel Example: User Stories 1 & 2

```bash
# US1 and US2 can run in parallel after Foundational phase:

# Team Member A - User Story 1:
Task T012: "Write ResourceForm tests in src/components/ResourceForm.test.tsx"
Task T013: "Create ResourceForm component in src/components/ResourceForm.tsx"
Task T014: "Integrate ResourceForm into ProblemForm"
Task T015: "Update useProblems hook"

# Team Member B - User Story 2:
Task T016: "Write ResourceList tests in src/components/ResourceList.test.tsx"
Task T017: "Create ResourceList component in src/components/ResourceList.tsx"
Task T018: "Add Learning Resources section to Problem.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001-T005)
2. Complete Phase 2: Foundational (T006-T011)
3. Complete Phase 3: User Story 1 (T012-T015)
4. **STOP and VALIDATE**: Users can add resources to problems
5. Deploy/demo if ready

### Incremental Delivery

1. Setup + Foundational → Foundation ready (T001-T011)
2. Add User Story 1 → Can add resources → Deploy/Demo (MVP!)
3. Add User Story 2 → Can view resources → Deploy/Demo
4. Add User Story 3 → Can remove resources → Deploy/Demo
5. Add User Story 4 → Can see resource counts → Deploy/Demo
6. Polish → Production ready

### Recommended Order for Solo Developer

1. T001-T005 (Setup - all types and migration)
2. T006-T008 (Foundational implementation)
3. T009-T011 (Foundational tests - validate implementation)
4. T013-T015 (US1 implementation - core add flow)
5. T012 (US1 tests - validate add flow)
6. T017-T018 (US2 implementation - display resources)
7. T016 (US2 tests - validate display)
8. T019-T020 (US3 implementation - remove flow)
9. T021 (US4 implementation - badge)
10. T022-T027 (Polish - final validation)

---

## Notes

- [P] tasks = different files, no dependencies on other incomplete tasks
- [Story] label maps task to specific user story for traceability
- Each user story is independently completable and testable
- Resources are embedded in Problem (no separate table)
- Source auto-detection triggers on URL blur, not on keystroke
- Source defaults to empty string if not auto-detected
- Remove is instant (no confirmation dialog per spec clarification)
- Export/import automatically includes resources (embedded in Problem)
- Export/import has dedicated test coverage (T022)
- All 15+ source patterns defined in research.md
- **Total Tasks**: 28

````
