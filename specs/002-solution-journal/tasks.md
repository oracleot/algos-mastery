````markdown
# Tasks: Solution Journal & Pattern Templates

**Input**: Design documents from `/specs/002-solution-journal/`
**Prerequisites**: MVP (001-mvp-project-setup) complete - Problem CRUD, IndexedDB with Dexie.js operational
**Depends On**: Existing React/Vite/Tailwind stack, Problem entity, useProblems hook

**Tests**: Constitution II mandates test-first for data layer - test tasks included for useSolutions hook and mastery calculation

**Organization**: Tasks grouped by user story to enable independent implementation and testing

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2)
- Exact file paths included in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Install CodeMirror dependencies and extend existing project structure

- [ ] T001 Install CodeMirror dependencies: `@uiw/react-codemirror @codemirror/lang-javascript @codemirror/lang-python @codemirror/lang-java @codemirror/lang-cpp @codemirror/lang-rust @codemirror/lang-go @uiw/codemirror-theme-github`
- [ ] T002 [P] Add Solution types and SupportedLanguage to src/types/index.ts
- [ ] T003 [P] Add Template and TopicProgress interfaces to src/types/index.ts
- [ ] T004 [P] Create editor configuration utilities and theme setup in src/lib/editor.ts

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before user story implementation

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T005 Extend Dexie schema to v2 with solutions table in src/lib/db.ts
- [ ] T006 [P] Add solution validation rules in src/lib/validation.ts
- [ ] T007 [P] Create pattern templates data in src/data/templates.ts
- [ ] T008a [P] Write tests for mastery calculation in src/lib/mastery.test.ts (test-first per constitution)
- [ ] T008b [P] Create mastery calculation logic in src/lib/mastery.ts
- [ ] T009 [P] Create clipboard utility function in src/lib/clipboard.ts
- [ ] T010 Add cascade delete for problem→solutions in src/lib/db.ts

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - Add Solution to Problem (Priority: P1) 🎯 MVP

**Goal**: Users can save code solutions with syntax highlighting for any problem

**Independent Test**: Add a solution to any problem, verify it persists with correct Python/JS syntax highlighting

### Tests for User Story 1 (Constitution II: Test-First for Data Layer)

- [ ] T010a [US1] Write tests for useSolutions hook in src/hooks/useSolutions.test.ts (MUST fail before T013)

### Implementation for User Story 1

- [ ] T011 [P] [US1] Create LanguageSelector component in src/components/LanguageSelector.tsx
- [ ] T012 [P] [US1] Create SolutionEditor component with CodeMirror in src/components/SolutionEditor.tsx
- [ ] T013 [US1] Create useSolutions hook (addSolution method) in src/hooks/useSolutions.ts
- [ ] T014 [US1] Create SolutionForm component for add/edit workflow in src/components/SolutionForm.tsx
- [ ] T015 [US1] Create Problem detail page with solution editor in src/pages/Problem.tsx
- [ ] T016 [US1] Add route for problem detail page in src/App.tsx
- [ ] T017 [US1] Add "Add Solution" button and integration in Problem.tsx

**Checkpoint**: User Story 1 complete - can add solutions to problems with syntax highlighting

---

## Phase 4: User Story 2 - View and Manage Solutions (Priority: P1)

**Goal**: Users can view solution history, copy code, edit, and delete solutions

**Independent Test**: View existing solutions, copy code to clipboard, edit a solution, delete with confirmation

### Implementation for User Story 2

- [ ] T018 [P] [US2] Create SolutionCard component with expand/collapse in src/components/SolutionCard.tsx
- [ ] T019 [P] [US2] Create SolutionList component in src/components/SolutionList.tsx
- [ ] T020 [US2] Extend useSolutions hook with updateSolution, deleteSolution methods in src/hooks/useSolutions.ts
- [ ] T021 [US2] Add copy-to-clipboard functionality with toast feedback in SolutionCard.tsx
- [ ] T022 [US2] Add edit mode with SolutionEditor in SolutionCard.tsx
- [ ] T023 [US2] Add delete confirmation dialog integration in SolutionCard.tsx
- [ ] T024 [US2] Integrate SolutionList into Problem detail page in src/pages/Problem.tsx

**Checkpoint**: User Stories 1 & 2 complete - full solution CRUD with copy functionality

---

## Phase 5: User Story 3 - Insert Pattern Template (Priority: P2)

**Goal**: Users can insert pre-built algorithm pattern templates at cursor position

**Independent Test**: Open editor, click "Insert Template", select any template, verify code appears at cursor

### Implementation for User Story 3

- [ ] T025 [P] [US3] Create useTemplates hook in src/hooks/useTemplates.ts
- [ ] T026 [US3] Create TemplateSelector dropdown component in src/components/TemplateSelector.tsx
- [ ] T027 [US3] Add template insertion handler to SolutionEditor in src/components/SolutionEditor.tsx
- [ ] T028 [US3] Integrate TemplateSelector into SolutionForm in src/components/SolutionForm.tsx

**Checkpoint**: User Story 3 complete - can insert pattern templates into editor

---

## Phase 6: User Story 4 - Topic Mastery Tracking (Priority: P2)

**Goal**: Track mastery percentage per topic and unlock next topics at 70%

**Independent Test**: Solve 70%+ of problems in a topic, verify next topic becomes unlocked

### Implementation for User Story 4

- [ ] T029 [P] [US4] Create useProgress hook in src/hooks/useProgress.ts
- [ ] T030 [P] [US4] Create MasteryBadge component in src/components/MasteryBadge.tsx
- [ ] T031 [US4] Update topic selector to show locked/unlocked state in src/components/ProblemForm.tsx
- [ ] T032 [US4] Add mastery percentage display to topic badges in src/components/TopicBadge.tsx

**Checkpoint**: User Story 4 complete - topic mastery tracking functional

---

## Phase 7: User Story 5 - Progress Ladder Visualization (Priority: P3)

**Goal**: Visual representation of learning journey with all 15 topics and unlock status

**Independent Test**: View progress ladder, verify correct lock/unlock states for all topics

### Implementation for User Story 5

- [ ] T033 [P] [US5] Create TopicProgressCard component in src/components/TopicProgressCard.tsx
- [ ] T034 [US5] Create ProgressLadder component in src/components/ProgressLadder.tsx
- [ ] T035 [US5] Create Progress page in src/pages/Progress.tsx
- [ ] T036 [US5] Add navigation link to Progress page in src/App.tsx
- [ ] T037 [US5] Add responsive layout for ladder (vertical/horizontal) in ProgressLadder.tsx

**Checkpoint**: User Story 5 complete - progress ladder visualization functional

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Performance optimization and refinements

- [ ] T038 [P] Implement lazy loading for SolutionEditor component in src/pages/Problem.tsx
- [ ] T039 [P] Add loading skeleton for editor in src/components/EditorSkeleton.tsx
- [ ] T040 [P] Add empty state for solutions list in SolutionList.tsx
- [ ] T041 Verify bundle size stays under 500KB gzipped
- [ ] T042 Run quickstart.md verification checklist
- [ ] T043 Code cleanup: ensure all files under 200 lines per constitution

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup - BLOCKS all user stories
- **User Stories (Phase 3-7)**: All depend on Foundational completion
  - US1 (P1) and US2 (P1) can run in parallel
  - US3 (P2) and US4 (P2) can start after US1/US2 or in parallel
  - US5 (P3) depends on US4 (needs useProgress hook)
- **Polish (Phase 8)**: Depends on all user stories complete

### User Story Dependencies

- **US1 - Add Solution (P1)**: Foundation only - no dependencies on other stories
- **US2 - View/Manage (P1)**: Foundation + useSolutions from US1 (T013)
- **US3 - Templates (P2)**: Foundation + SolutionEditor from US1 (T012)
- **US4 - Mastery (P2)**: Foundation only - independent of US1-3
- **US5 - Ladder (P3)**: Foundation + useProgress from US4 (T029)

### Within Each User Story

- Models/Types before hooks
- Hooks before components
- Components before pages
- Core implementation before integration

### Parallel Opportunities

**Phase 1 (Setup)**: T002, T003, T004 can run in parallel

**Phase 2 (Foundational)**: T006, T007, T008, T009 can run in parallel

**User Story 1**: T011, T012 can run in parallel

**User Story 2**: T018, T019 can run in parallel

**User Story 3**: T025 independent

**User Story 4**: T029, T030 can run in parallel

**User Story 5**: T033 independent

**Polish**: T038, T039, T040 can run in parallel

---

## Parallel Example: User Story 1

```bash
# Launch UI components in parallel:
Task: "Create LanguageSelector component in src/components/LanguageSelector.tsx"
Task: "Create SolutionEditor component with CodeMirror in src/components/SolutionEditor.tsx"

# Then sequential: Hook → Form → Page → Integration
```

---

## Implementation Strategy

### MVP First (User Stories 1 & 2 Only)

1. Complete Phase 1: Setup (install dependencies, add types)
2. Complete Phase 2: Foundational (schema, validation, templates data)
3. Complete Phase 3: User Story 1 - Add Solution
4. Complete Phase 4: User Story 2 - View/Manage Solutions
5. **STOP and VALIDATE**: Test solution CRUD independently
6. Deploy/demo if ready - users can save and manage solutions

### Incremental Delivery

1. **MVP (US1 + US2)**: Full solution journal without templates/progression
2. **+US3**: Add template insertion for faster coding
3. **+US4**: Add mastery tracking with unlock mechanics
4. **+US5**: Add visual progress ladder
5. Each story adds value without breaking previous stories

### Key Files Created

| File | Phase | Purpose |
|------|-------|---------|
| src/types/index.ts | P1 | Extended with Solution, Template, TopicProgress types |
| src/lib/editor.ts | P1 | CodeMirror language extension mapping |
| src/lib/db.ts | P2 | Extended with solutions table (v2 schema) |
| src/lib/validation.ts | P2 | Extended with solution validation |
| src/lib/mastery.ts | P2 | Topic progress calculation logic |
| src/lib/clipboard.ts | P2 | Copy-to-clipboard utility |
| src/data/templates.ts | P2 | All 10+ pattern templates |
| src/hooks/useSolutions.ts | P3 | Solution CRUD hook |
| src/hooks/useTemplates.ts | P5 | Template access hook |
| src/hooks/useProgress.ts | P6 | Topic mastery hook |
| src/components/SolutionEditor.tsx | P3 | CodeMirror wrapper |
| src/components/LanguageSelector.tsx | P3 | Language dropdown |
| src/components/SolutionForm.tsx | P3 | Add/edit solution form |
| src/components/SolutionCard.tsx | P4 | Solution display card |
| src/components/SolutionList.tsx | P4 | Solutions list |
| src/components/TemplateSelector.tsx | P5 | Template dropdown |
| src/components/MasteryBadge.tsx | P6 | Progress indicator |
| src/components/TopicProgressCard.tsx | P7 | Single topic in ladder |
| src/components/ProgressLadder.tsx | P7 | Full ladder view |
| src/pages/Problem.tsx | P3 | Problem detail with solutions |
| src/pages/Progress.tsx | P7 | Progress ladder page |

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story (US1-US5)
- CodeMirror adds ~150KB - lazy load to stay under 500KB budget
- Constitution exception: CodeMirror requires its own CSS theming
- Constitution II compliance: T008a and T010a ensure test-first for data layer (mastery.ts, useSolutions.ts)
- Each user story is independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
````
