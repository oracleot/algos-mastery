```markdown
# Tasks: MVP Project Setup

**Input**: Design documents from `/specs/001-mvp-project-setup/`
**Prerequisites**: plan.md ✓, spec.md ✓, research.md ✓, data-model.md ✓, contracts/ ✓, quickstart.md ✓

**Tests**: Not explicitly requested in feature specification. Tests can be added later per Constitution requirements.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3, US4)
- Include exact file paths in descriptions

## Path Conventions

- **Single project**: `src/`, colocated tests at repository root
- Paths follow plan.md structure

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization with Vite + React + TypeScript + Tailwind

- [ ] T001 Initialize Vite project with React TypeScript template using `npm create vite@latest . -- --template react-ts`
- [ ] T002 Install and configure Tailwind CSS with postcss and autoprefixer in tailwind.config.js
- [ ] T003 [P] Configure TypeScript strict mode in tsconfig.json per Constitution requirements
- [ ] T004 [P] Install production dependencies: dexie, dexie-react-hooks, lucide-react, react-router-dom
- [ ] T005 [P] Install dev dependencies: vitest, @testing-library/react, @testing-library/jest-dom, jsdom, fake-indexeddb
- [ ] T006 [P] Configure Vitest with jsdom and fake-indexeddb in vitest.config.ts
- [ ] T007 [P] Create test setup file with fake-indexeddb auto-import in src/tests/setup.ts
- [ ] T008 Update package.json scripts for dev, build, test, typecheck, and lint
- [ ] T009 Create project directory structure: src/components/ui, src/hooks, src/lib, src/data, src/types, src/pages
- [ ] T010 [P] Replace src/index.css with Tailwind directives

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T011 Define TypeScript types and interfaces in src/types/index.ts (Problem, Topic, Difficulty, Status, ProblemFormData, ProblemFilters)
- [ ] T012 [P] Create static topic taxonomy data in src/data/topics.ts with 15 ordered algorithm topics
- [ ] T013a [P] Write db.test.ts with fake-indexeddb for Problem CRUD operations in src/lib/db.test.ts (test-first per Constitution II)
- [ ] T013b [P] Implement Dexie database schema with Problem table in src/lib/db.ts (tests from T013a must fail first)
- [ ] T014 [P] Create validation utility functions in src/lib/validation.ts (validateProblem, isValid)
- [ ] T015 [P] Create utility functions in src/lib/utils.ts (cn for className merging, generateId for UUID)
- [ ] T016 [P] Create Button component in src/components/ui/Button.tsx with variants (primary, secondary, ghost, danger)
- [ ] T017 [P] Create Input component in src/components/ui/Input.tsx with label, error, and hint support
- [ ] T018 [P] Create Select component in src/components/ui/Select.tsx with options and placeholder support
- [ ] T019 [P] Create Card component in src/components/ui/Card.tsx with padding variants
- [ ] T020 [P] Create Modal component in src/components/ui/Modal.tsx using native dialog element
- [ ] T021 [P] Create Toast component in src/components/Toast.tsx with success/error/info types
- [ ] T022 [P] Create EmptyState component in src/components/EmptyState.tsx with icon, title, description, action
- [ ] T023 [P] Create ConfirmDialog component in src/components/ConfirmDialog.tsx for destructive actions
- [ ] T024 [P] Create TopicBadge component in src/components/TopicBadge.tsx for displaying topic labels
- [ ] T025 [P] Create DifficultyBadge component in src/components/DifficultyBadge.tsx with color coding (green/yellow/red)
- [ ] T026 Setup React Router with routes in src/App.tsx (Home, Problems pages)
- [ ] T027 [P] Create basic Home page in src/pages/Home.tsx with navigation to Problems
- [ ] T028 Update src/main.tsx with BrowserRouter wrapper

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - Add a New Problem (Priority: P1) 🎯 MVP

**Goal**: Users can add algorithm problems with title, topic, difficulty, optional URL and notes

**Independent Test**: Add a problem via form and verify it appears in the list and persists after refresh

### Implementation for User Story 1

- [ ] T029 [US1] Implement useDB hook in src/hooks/useDB.ts with isReady, error, clearAllData, exportData, importData
- [ ] T030a [US1] Write useProblems.test.ts for addProblem, updateProblem, deleteProblem in src/hooks/useProblems.test.ts (test-first per Constitution II)
- [ ] T030b [US1] Implement useProblems hook in src/hooks/useProblems.ts with addProblem function using useLiveQuery (tests from T030a must fail first)
- [ ] T031 [US1] Create ProblemForm component in src/components/ProblemForm.tsx with all form fields and validation
- [ ] T032 [US1] Create ProblemCard component in src/components/ProblemCard.tsx displaying problem details with badges
- [ ] T033 [US1] Create ProblemList component in src/components/ProblemList.tsx rendering array of ProblemCards
- [ ] T034 [US1] Wire up Problems page in src/pages/Problems.tsx with Add Problem button and form modal
- [ ] T035 [US1] Add toast notifications for successful problem creation in Problems page
- [ ] T036 [US1] Handle loading state during async operations in Problems page
- [ ] T037 [US1] Add empty state when no problems exist with call-to-action to add first problem

**Checkpoint**: User Story 1 complete - users can add problems and see them persisted

---

## Phase 4: User Story 2 - View and Filter Problems (Priority: P1)

**Goal**: Users can see all problems and filter by topic, difficulty, or status

**Independent Test**: Add multiple problems with different attributes, verify filter dropdowns correctly filter the list

### Implementation for User Story 2

- [ ] T038 [US2] Implement useFilters hook in src/hooks/useFilters.ts with filter state and URL sync
- [ ] T039 [US2] Create FilterBar component in src/components/FilterBar.tsx with topic, difficulty, status dropdowns
- [ ] T040 [US2] Add search input to FilterBar for text search across title and notes
- [ ] T041 [US2] Extend useProblems hook to accept filters parameter and apply filtering logic
- [ ] T042 [US2] Integrate FilterBar into Problems page with filter state management
- [ ] T043 [US2] Add clear all filters button when any filter is active
- [ ] T044 [US2] Show empty state with clear filters action when filter returns no results
- [ ] T045 [US2] Ensure filter operations complete in under 100ms for responsive UX

**Checkpoint**: User Story 2 complete - users can filter and search their problem list

---

## Phase 5: User Story 3 - Edit and Delete Problems (Priority: P2)

**Goal**: Users can correct mistakes in problems or remove unwanted problems

**Independent Test**: Edit a problem's title, verify change persists. Delete a problem with confirmation, verify removal.

### Implementation for User Story 3

- [ ] T046 [US3] Add updateProblem function to useProblems hook in src/hooks/useProblems.ts
- [ ] T047 [US3] Add deleteProblem function to useProblems hook in src/hooks/useProblems.ts
- [ ] T048 [US3] Add getProblem function to useProblems hook for fetching single problem
- [ ] T049 [US3] Add edit button to ProblemCard that triggers onEdit callback
- [ ] T050 [US3] Add delete button to ProblemCard that triggers onDelete callback
- [ ] T051 [US3] Modify ProblemForm to support edit mode with initialData prop
- [ ] T052 [US3] Integrate edit functionality in Problems page with modal pre-populated with problem data
- [ ] T053 [US3] Integrate delete functionality in Problems page with ConfirmDialog
- [ ] T054 [US3] Add toast notifications for successful edit and delete operations

**Checkpoint**: User Story 3 complete - users can fully manage their problems (CRUD complete)

---

## Phase 6: User Story 4 - Update Problem Status (Priority: P2)

**Goal**: Users can quickly mark problems as attempted or solved without full edit form

**Independent Test**: Click status button on a problem, verify status changes visually and persists after refresh

### Implementation for User Story 4

- [ ] T055 [US4] Add updateStatus function to useProblems hook in src/hooks/useProblems.ts
- [ ] T056 [US4] Create StatusButton component in src/components/StatusButton.tsx with status cycle logic
- [ ] T057 [US4] Add StatusButton to ProblemCard with visual feedback on status change
- [ ] T058 [US4] Style status states differently in ProblemCard (unsolved: gray, attempted: yellow, solved: green)
- [ ] T059 [US4] Add toast notification for status updates
- [ ] T060 [US4] Ensure status persists across page refresh

**Checkpoint**: User Story 4 complete - users can track progress with quick status updates

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T061 [P] Add keyboard navigation support to all interactive elements (buttons, form fields)
- [ ] T062 [P] Ensure all form inputs have proper aria attributes for accessibility
- [ ] T063 [P] Add responsive styling for mobile (320px) to desktop (1920px) breakpoints
- [ ] T064 [P] Add IndexedDB error handling with user-friendly error messages
- [ ] T065 [P] Add loading skeleton states during initial data load
- [ ] T066 Verify bundle size is under 500KB gzipped using Vite build analysis
- [ ] T067 Test performance with 100+ problems to ensure filter <100ms and CRUD <200ms
- [ ] T068 Run quickstart.md verification checklist
- [ ] T069 Clean up any unused code, ensure lint passes with zero errors
- [ ] T070 Final typecheck verification with tsc --noEmit

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phases 3-6)**: All depend on Foundational phase completion
  - User stories can proceed in priority order (P1 → P1 → P2 → P2)
  - US1 and US2 are both P1, can potentially parallel with care
- **Polish (Phase 7)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P1)**: Can start after US1 (needs problem list to filter) - Uses useProblems from US1
- **User Story 3 (P2)**: Can start after US1 - Extends useProblems hook from US1
- **User Story 4 (P2)**: Can start after US1 - Extends useProblems hook and ProblemCard from US1

### Within Each Phase

- Tasks marked [P] can run in parallel
- UI components in Foundational phase can all be built in parallel
- Hooks should be built before components that use them
- Components should be built before pages that use them

### Parallel Opportunities Per Phase

**Phase 1 Setup**: T003, T004, T005, T006, T007, T010 can run in parallel after T001-T002
**Phase 2 Foundational**: T012-T025 can all run in parallel after T011 (types)
**Phase 7 Polish**: T061-T065 can run in parallel

---

## Parallel Example: Phase 2 Foundational

```bash
# After T011 (types) completes, launch all these in parallel:
Task: "Create static topic taxonomy data in src/data/topics.ts"
Task: "Implement Dexie database schema with Problem table in src/lib/db.ts"
Task: "Create validation utility functions in src/lib/validation.ts"
Task: "Create utility functions in src/lib/utils.ts"
Task: "Create Button component in src/components/ui/Button.tsx"
Task: "Create Input component in src/components/ui/Input.tsx"
Task: "Create Select component in src/components/ui/Select.tsx"
Task: "Create Card component in src/components/ui/Card.tsx"
Task: "Create Modal component in src/components/ui/Modal.tsx"
Task: "Create Toast component in src/components/Toast.tsx"
Task: "Create EmptyState component in src/components/EmptyState.tsx"
Task: "Create ConfirmDialog component in src/components/ConfirmDialog.tsx"
Task: "Create TopicBadge component in src/components/TopicBadge.tsx"
Task: "Create DifficultyBadge component in src/components/DifficultyBadge.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001-T010)
2. Complete Phase 2: Foundational (T011-T028)
3. Complete Phase 3: User Story 1 (T029-T037)
4. **STOP and VALIDATE**: Test adding problems, verify persistence
5. Deploy/demo if ready - this is a functional MVP!

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → **MVP: Add Problems** → Deploy/Demo
3. Add User Story 2 → **Filter and search** → Deploy/Demo
4. Add User Story 3 → **Edit and delete** → Deploy/Demo
5. Add User Story 4 → **Quick status updates** → Deploy/Demo
6. Polish phase → **Production ready** → Final release

### Suggested MVP Scope

For fastest initial delivery, complete only:
- Phase 1: Setup
- Phase 2: Foundational
- Phase 3: User Story 1 (Add Problems)

This delivers a working app where users can add and view problems - the core value proposition.

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] labels: US1=Add Problems, US2=View/Filter, US3=Edit/Delete, US4=Status Updates
- Each user story checkpoint validates that story works independently
- Constitution requires: TypeScript strict mode, Tailwind only, <200 lines per file, test-first for data layer
- **Test-first tasks**: T013a, T030a must be written and FAIL before T013b, T030b implementation
- Performance targets: Filter <100ms, CRUD <200ms, bundle <500KB gzipped
- Commit after each task or logical group
```
