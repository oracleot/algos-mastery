````markdown
# Tasks: Timed Practice Improvements

**Input**: Design documents from `/specs/008-timed-practice-improvements/`
**Prerequisites**: plan.md ✓, spec.md ✓, research.md ✓, data-model.md ✓, quickstart.md ✓

**Tests**: Included as specified in plan.md (test-first approach per Constitution II.1)

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3, US4)
- Include exact file paths in descriptions

## Path Conventions

- **Single project**: `src/` at repository root (React PWA with Vite)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: No new project setup required - extending existing codebase

- [ ] T001 Verify existing dependencies are sufficient (no new packages needed per plan.md)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Shared utilities that multiple user stories depend on

**⚠️ CRITICAL**: US2 (Code Validation) depends on code runner utilities; US3 (Fullscreen) depends on T012 (CodeRunnerPanel) only, not full US2 completion

- [ ] T002 Create code execution utilities with timeout, console capture, and output truncation (1000 lines/100KB limit) in src/lib/codeRunner.ts
- [ ] T003 Create useCodeRunner hook with run, result, and clear functions in src/hooks/useCodeRunner.ts
- [ ] T004 Create useCodeRunner hook tests in src/hooks/useCodeRunner.test.ts

**Checkpoint**: Foundation ready - code execution infrastructure complete

---

## Phase 3: User Story 1 - Timer-Enforced Coding Discipline (Priority: P1) 🎯 MVP

**Goal**: Disable solution editor when timer isn't running to enforce practice discipline

**Independent Test**: Start a practice session, attempt to type before starting timer, verify editor is locked with "Start timer to begin coding" message

### Tests for User Story 1

- [ ] T005 [P] [US1] Add tests for EditorDisabledBanner component in src/components/EditorDisabledBanner.test.tsx
- [ ] T006 [P] [US1] Add tests for SolutionEditor readOnly behavior with disabled message in src/components/SolutionEditor.test.tsx

### Implementation for User Story 1

- [ ] T007 [P] [US1] Create EditorDisabledBanner component showing contextual disable message in src/components/EditorDisabledBanner.tsx
- [ ] T008 [US1] Extend SolutionEditor with disabledMessage prop and integrate EditorDisabledBanner in src/components/SolutionEditor.tsx
- [ ] T009 [US1] Modify PracticeSession to compute isEditorDisabled from timer state and pass to SolutionEditor in src/components/PracticeSession.tsx
- [ ] T010 [US1] Add disabled message logic: "Start timer to begin coding" when not started, "Resume timer to continue" when paused in src/components/PracticeSession.tsx

**Checkpoint**: User Story 1 complete - editor locks when timer isn't running

---

## Phase 4: User Story 2 - In-Editor JavaScript Code Validation (Priority: P2)

**Goal**: Enable running JavaScript/TypeScript code directly in the editor with output display

**Independent Test**: Write a JavaScript function with console.log statements, click Run, verify output appears in panel below editor

### Tests for User Story 2

- [ ] T011 [P] [US2] Create CodeRunnerPanel component tests for run button, output display, and language restrictions in src/components/CodeRunnerPanel.test.tsx

### Implementation for User Story 2

- [ ] T012 [US2] Create CodeRunnerPanel component with run button, output panel, and language-aware tooltip in src/components/CodeRunnerPanel.tsx
- [ ] T013 [US2] Extend SolutionEditor with showRunButton prop and integrate CodeRunnerPanel in src/components/SolutionEditor.tsx
- [ ] T014 [US2] Enable run button in PracticeSession by passing showRunButton={true} to SolutionEditor in src/components/PracticeSession.tsx
- [ ] T015 [US2] Enable run button in SolutionForm for problem detail page by passing showRunButton={true} in src/components/SolutionForm.tsx
- [ ] T016 [US2] Ensure Run button is disabled when editor is in readOnly mode (timer not running) in src/components/CodeRunnerPanel.tsx

**Checkpoint**: User Story 2 complete - can run JS/TS code and see output in editor

---

## Phase 5: User Story 3 - Fullscreen Focus Mode (Priority: P3)

**Goal**: Provide distraction-free fullscreen overlay during timed practice

**Independent Test**: Click fullscreen button during practice session, verify editor fills viewport, press Escape to exit

### Tests for User Story 3

- [ ] T017 [P] [US3] Create FullscreenOverlay component tests for portal rendering, Escape key, timer display in src/components/FullscreenOverlay.test.tsx

### Implementation for User Story 3

- [ ] T018 [US3] Create FullscreenOverlay component with React Portal, timer, editor, collapsible problem description in src/components/FullscreenOverlay.tsx
- [ ] T019 [US3] Add fullscreen state and toggle button to PracticeSession in src/components/PracticeSession.tsx
- [ ] T020 [US3] Integrate FullscreenOverlay rendering when isFullscreen is true in src/components/PracticeSession.tsx
- [ ] T021 [US3] Ensure fullscreen mode automatically exits when leaving practice session via useEffect cleanup in src/components/PracticeSession.tsx
- [ ] T022 [US3] Include CodeRunnerPanel in fullscreen view for code execution capability in src/components/FullscreenOverlay.tsx

**Checkpoint**: User Story 3 complete - fullscreen focus mode operational

---

## Phase 6: User Story 4 - Accurate Navigation Button Visibility (Priority: P4)

**Goal**: Hide navigation buttons when they have no valid destinations

**Independent Test**: Reach last problem in queue, verify "Next Problem" disappears; have only one unsolved problem, verify "Random Unsolved Problem" disappears

### Tests for User Story 4

- [ ] T023 [P] [US4] Add tests verifying navigation buttons exclude unsolved problems from availability calculation in src/components/PracticeSession.test.tsx

### Implementation for User Story 4

- [ ] T024 [US4] Add availableProblemsCount, practiceQueue, and currentQueueIndex props to PracticeSession component in src/components/PracticeSession.tsx (Note: Practice.tsx must calculate availableProblemsCount from attempted+solved problems and pass as prop)
- [ ] T025 [US4] Implement hasMoreProblems calculation based on queue position and available problems count in src/components/PracticeSession.tsx
- [ ] T026 [US4] Conditionally render "Next Problem" button only when hasMoreProblems is true in src/components/PracticeSession.tsx
- [ ] T027 [US4] Fix Practice page to conditionally show "Random Unsolved Problem" button based on unsolvedProblems.length > 0 in src/pages/Practice.tsx
- [ ] T028 [US4] Show informative message "No unsolved problems available for practice" when no unsolved problems exist in src/pages/Practice.tsx

**Checkpoint**: User Story 4 complete - navigation buttons accurately reflect available options

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Final validation and cleanup

- [ ] T029 [P] Run all tests and fix any failures with pnpm test --run
- [ ] T030 [P] Run type checker and fix any type errors with pnpm typecheck
- [ ] T031 [P] Run linter and fix any lint errors with pnpm lint
- [ ] T032 Run quickstart.md manual validation scenarios
- [ ] T033 Verify build succeeds with pnpm build

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - verification only
- **Foundational (Phase 2)**: Must complete before US2 (Code Validation)
- **US1 (Phase 3)**: Can start immediately - no dependencies on Foundational
- **US2 (Phase 4)**: Depends on Foundational (T002-T004) for code runner utilities
- **US3 (Phase 5)**: Depends on US2 (T012) for CodeRunnerPanel in fullscreen
- **US4 (Phase 6)**: Can start immediately - no dependencies on other stories
- **Polish (Phase 7)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Independent - can start immediately
- **User Story 2 (P2)**: Depends on Foundational phase (code runner utilities)
- **User Story 3 (P3)**: Depends on US2 (CodeRunnerPanel must exist)
- **User Story 4 (P4)**: Independent - can start immediately

### Within Each User Story

- Tests SHOULD be written first and fail before implementation
- Components before integrations
- Core functionality before enhancements

### Parallel Opportunities

- T005 and T006 can run in parallel (different test files)
- T007 can run in parallel with T005/T006 (new component file)
- T011 and T017 can run in parallel (different test files)
- T029, T030, T031 can run in parallel (different validation commands)
- US1 and US4 can be worked on in parallel (no dependencies between them)

---

## Parallel Example: User Story 1

```bash
# Launch all tests for US1 together:
Task T005: "Add tests for EditorDisabledBanner component"
Task T006: "Add tests for SolutionEditor readOnly behavior"

# Create component in parallel with tests:
Task T007: "Create EditorDisabledBanner component"
```

## Parallel Example: Independent Stories

```bash
# US1 and US4 can be worked in parallel:
# Developer A: T005 → T006 → T007 → T008 → T009 → T010
# Developer B: T023 → T024 → T025 → T026 → T027
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001)
2. Complete Phase 3: User Story 1 (T005-T010)
3. **STOP and VALIDATE**: Test editor locking behavior
4. Deploy/demo if timer discipline feature is sufficient

### Incremental Delivery

1. Add User Story 1 → Test independently → **MVP ready!**
2. Add Foundational + User Story 2 → Test code execution → Deploy/Demo
3. Add User Story 3 → Test fullscreen mode → Deploy/Demo
4. Add User Story 4 → Test navigation visibility → Deploy/Demo
5. Each story adds value without breaking previous stories

### Recommended Execution Order

Since US2 depends on Foundational and US3 depends on US2:

1. **Parallel Track A**: US1 (T005-T010) - Can start immediately
2. **Sequential Track B**: Foundational (T002-T004) → US2 (T011-T016) → US3 (T017-T022)
3. **Parallel Track C**: US4 (T023-T027) - Can start immediately
4. **Final**: Polish (T028-T032)

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Verify tests fail before implementing (test-first per Constitution II.1)
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- No new dependencies required - uses existing React, CodeMirror, shadcn/ui, Lucide React

````
