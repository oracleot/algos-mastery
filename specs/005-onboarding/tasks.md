````markdown
# Tasks: App Onboarding

**Input**: Design documents from `/specs/005-onboarding/`
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, contracts/ ✅, quickstart.md ✅

**Tests**: Included per Constitution Principle II (Component Tests Required).

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3, US4)
- Include exact file paths in descriptions

## Path Conventions

- **Single project**: `src/` at repository root
- TypeScript React project with Vite

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Install dependencies and prepare type definitions

- [X] T001 Install react-joyride dependency via `pnpm add react-joyride`
- [X] T002 [P] Add OnboardingStep type extending Joyride Step in src/types/index.ts
- [X] T003 [P] Add onboardingCompleted field to UserPreferences interface in src/types/index.ts
- [X] T004 Add onboardingCompleted default value (false) to DEFAULT_PREFERENCES in src/lib/preferences.ts

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core onboarding infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T005 Create ONBOARDING_STEPS array with 6 tour step definitions in src/lib/onboarding-steps.ts
- [X] T006 Create useOnboarding hook with state management and Joyride callback handling in src/hooks/useOnboarding.ts
- [X] T007 Create OnboardingTour component wrapping Joyride with configured styles in src/components/OnboardingTour.tsx
- [X] T007a [P] Create useOnboarding hook tests verifying state management and callbacks in src/hooks/useOnboarding.test.ts
- [X] T007b [P] Create OnboardingTour component tests verifying rendering and Joyride integration in src/components/OnboardingTour.test.tsx

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - First-Time User Guided Tour (Priority: P1) 🎯 MVP

**Goal**: New users see an interactive guided tour on first visit that walks them through main features

**Independent Test**: Clear localStorage, refresh app, verify tour appears with welcome step and navigation buttons (Next/Skip)

### Implementation for User Story 1

- [X] T008 [P] [US1] Add data-tour="view-problems" attribute to View Problems button in src/pages/Home.tsx
- [X] T009 [P] [US1] Add data-tour="timed-practice" attribute to Timed Practice button in src/pages/Home.tsx
- [X] T010 [P] [US1] Add data-tour="progress-ladder" attribute to Progress Ladder button in src/pages/Home.tsx
- [X] T011 [P] [US1] Add data-tour="dashboard-stats" attribute to stats section wrapper in src/components/Dashboard.tsx
- [X] T012 [P] [US1] Add data-tour="due-today" attribute to DueToday wrapper in src/components/Dashboard.tsx
- [X] T013 [US1] Integrate OnboardingTour component into Home page in src/pages/Home.tsx
- [X] T014 [US1] Verify tour auto-starts for first-time users and persists completion state in localStorage

**Checkpoint**: At this point, User Story 1 should be fully functional - first-time users see the guided tour

---

## Phase 4: User Story 2 - Step-by-Step Feature Highlights (Priority: P1)

**Goal**: Each tour step has visual spotlight effect, scrolls to element, and shows clear tooltip with navigation

**Independent Test**: Navigate through all 6 steps verifying each element is highlighted with spotlight, page scrolls if needed, and tooltip shows title/description/buttons

### Implementation for User Story 2

- [X] T015 [US2] Configure Joyride spotlight padding and overlay styling in OnboardingTour component in src/components/OnboardingTour.tsx
- [X] T016 [US2] Configure scrollToFirstStep and scrollOffset for auto-scroll behavior in src/components/OnboardingTour.tsx
- [X] T017 [US2] Verify all 6 steps (welcome, view-problems, timed-practice, progress-ladder, dashboard-stats, due-today) highlight correctly
- [X] T018 [US2] Test Finish button on final step saves completion state and closes tour

**Checkpoint**: At this point, User Stories 1 AND 2 should both work - tour navigation and highlighting complete

---

## Phase 5: User Story 3 - Restart Onboarding Tour from Settings (Priority: P2)

**Goal**: Returning users can restart the tour from Settings page

**Independent Test**: Complete tour, navigate to Settings, click "Restart Tour", verify redirect to home and tour starts from step 1

### Implementation for User Story 3

- [X] T019 [US3] Add Onboarding section card with RotateCcw icon to Settings page in src/pages/Settings.tsx
- [X] T020 [US3] Implement handleRestartTour function that resets onboardingCompleted and navigates to home in src/pages/Settings.tsx
- [X] T021 [US3] Add "Restart Tour" button that calls handleRestartTour in src/pages/Settings.tsx
- [X] T022 [US3] Verify tour restarts from step 1 after clicking Restart Tour

**Checkpoint**: At this point, User Stories 1, 2, AND 3 work - full tour lifecycle with restart capability

---

## Phase 6: User Story 4 - Responsive Onboarding Experience (Priority: P3)

**Goal**: Tour tooltips display correctly on mobile devices with touch support

**Independent Test**: Use browser dev tools to simulate 320px mobile viewport, run through tour verifying tooltips are fully visible without horizontal scroll

### Implementation for User Story 4

- [X] T023 [US4] Configure tooltip maxWidth styling for mobile viewport in src/components/OnboardingTour.tsx
- [X] T024 [US4] Test tour on mobile viewport (320px width) ensuring tooltips remain visible
- [X] T025 [US4] Test touch interactions (tap Next/Previous/Skip) work correctly on mobile

**Checkpoint**: All user stories should now be independently functional

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Edge cases, validation, and final quality checks

- [X] T026 Handle TARGET_NOT_FOUND event gracefully (skip to next step) in src/hooks/useOnboarding.ts
- [X] T027 Verify tour closes gracefully if user navigates away from Home page
- [X] T028 [P] Test keyboard navigation (Tab, Enter, Escape) through tour steps
- [X] T029 Run quickstart.md manual testing checklist to validate all scenarios
- [X] T030 Run pnpm typecheck && pnpm lint && pnpm build to ensure no errors

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-6)**: All depend on Foundational phase completion
  - User stories can proceed in priority order (P1 → P1 → P2 → P3)
  - US1 and US2 are both P1 but US2 depends on US1's data-tour attributes
- **Polish (Phase 7)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P1)**: Can start after US1 (needs data-tour attributes in place)
- **User Story 3 (P2)**: Can start after Foundational (Phase 2) - Independent of US1/US2 but validates completion state
- **User Story 4 (P3)**: Can start after Foundational (Phase 2) - Independent styling concerns

### Within Each User Story

- Data-tour attributes before component integration
- Component configuration before verification
- Core implementation before edge cases

### Parallel Opportunities

- T002, T003 can run in parallel (different types in same file but independent)
- T008, T009, T010, T011, T012 can ALL run in parallel (different files)
- US3 and US4 can start in parallel after Foundational phase

---

## Parallel Example: User Story 1

```bash
# Launch all data-tour attribute tasks together:
Task: "Add data-tour='view-problems' attribute to View Problems button in src/pages/Home.tsx"
Task: "Add data-tour='timed-practice' attribute to Timed Practice button in src/pages/Home.tsx"
Task: "Add data-tour='progress-ladder' attribute to Progress Ladder button in src/pages/Home.tsx"
Task: "Add data-tour='dashboard-stats' attribute to stats section wrapper in src/components/Dashboard.tsx"
Task: "Add data-tour='due-today' attribute to DueToday wrapper in src/components/Dashboard.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001-T004)
2. Complete Phase 2: Foundational (T005-T007)
3. Complete Phase 3: User Story 1 (T008-T014)
4. **STOP and VALIDATE**: Test tour appears for first-time users
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test tour appears → Deploy/Demo (MVP!)
3. Add User Story 2 → Test highlighting → Deploy/Demo
4. Add User Story 3 → Test restart from Settings → Deploy/Demo
5. Add User Story 4 → Test mobile responsiveness → Deploy/Demo
6. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 (data-tour attributes + integration)
   - Developer B: User Story 3 (Settings restart - independent)
3. After US1 complete:
   - Developer A: User Story 2 (spotlight/scroll refinement)
   - Developer B: User Story 4 (mobile responsiveness)

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Bundle size impact: react-joyride adds ~15KB gzipped (acceptable given 500KB budget)
- Total tasks: 32 (including 2 test tasks per Constitution Principle II)

````
