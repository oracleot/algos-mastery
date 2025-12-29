```markdown
# Tasks: Spaced Repetition System

**Input**: Design documents from `/specs/003-spaced-repetition/`
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, contracts/ ✅
**Depends On**: `001-mvp-project-setup`, `002-solution-journal`

**Tests**: Included per constitution (SM-2 algorithm requires test-first implementation)

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3, US4)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Install dependencies and extend database schema for spaced repetition

- [X] T001 Install date-fns dependency via `pnpm add date-fns`
- [X] T002 Install recharts dependency via `pnpm add recharts`
- [X] T003 Add Review types and interfaces to src/types/index.ts (ReviewQuality, REVIEW_RATINGS, Review, ReviewHistory, DailyStat, StreakInfo, QueueOverride)
- [X] T004 Extend database schema to version 3 with reviews and reviewHistory tables in src/lib/db.ts
- [X] T005 Update deleteProblemCascade to delete associated reviews and reviewHistory in src/lib/db.ts

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core SM-2 algorithm and utility functions that ALL user stories depend on

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

### SM-2 Algorithm (Test-First Required by Constitution)

- [X] T006 [P] Write SM-2 algorithm tests (MUST FAIL before implementation) in src/lib/sm2.test.ts
- [X] T007 Implement SM-2 algorithm calculateSM2 function and SM2_DEFAULTS in src/lib/sm2.ts

### Streak & Stats Utilities

- [X] T008 [P] Write streak calculation tests in src/lib/streak.test.ts
- [X] T009 Implement calculateStreak function in src/lib/streak.ts
- [X] T010 [P] Write weekly stats calculation tests in src/lib/stats.test.ts
- [X] T011 Implement calculateWeeklyStats function in src/lib/stats.ts

### Database Query Helpers

- [X] T012 Implement getDueToday query function in src/lib/db.ts
- [X] T013 Implement addToReview database function in src/lib/db.ts
- [X] T014 Implement recordReview database function with SM-2 integration in src/lib/db.ts
- [X] T015 Implement getStreak query function in src/lib/db.ts
- [X] T016 Implement getWeeklyStats query function in src/lib/db.ts
- [X] T016b Implement getSuggestedProblem query function (weakest unlocked topic) in src/lib/db.ts

**Checkpoint**: Foundation ready - SM-2 algorithm tested, database extended, utilities complete

---

## Phase 3: User Story 1 - Review Due Problems (Priority: P1) 🎯 MVP

**Goal**: Users can see due problems, start review sessions, rate their recall, and have next review dates calculated via SM-2

**Independent Test**: Mark problems for review, wait for due date, complete review session, verify next review dates are calculated correctly

### Hooks for User Story 1

- [X] T017 [P] [US1] Create useReviewQueue hook with dueToday, dueCount, isLoading, addToReview, addToTodayQueue, isInReview, getReview in src/hooks/useReviewQueue.ts
- [X] T018 [P] [US1] Create useReview hook with recordReview and previewIntervals in src/hooks/useReview.ts

### Components for User Story 1

- [X] T019 [P] [US1] Create RatingButtons component (Again/Hard/Good/Easy with interval previews) in src/components/RatingButtons.tsx
- [X] T020 [P] [US1] Create ReviewCard component (problem display, reveal solution, rating) in src/components/ReviewCard.tsx
- [X] T021 [US1] Create DueToday component (queue list with Start Review button) in src/components/DueToday.tsx

### Integration for User Story 1

- [X] T022 [US1] Create Review page for active review session in src/pages/Review.tsx
- [X] T023 [US1] Add /review route to App routing in src/App.tsx
- [X] T024 [US1] Add DueToday section to Home page in src/pages/Home.tsx

**Checkpoint**: User Story 1 complete - users can see due problems, start reviews, rate recall, and see calculated next review dates

---

## Phase 4: User Story 2 - Add Problem to Review Queue (Priority: P1)

**Goal**: Users can enroll solved problems into the SRS system and manually add any problem to today's queue

**Independent Test**: Add a problem to review system, verify it appears in the queue with correct initial SM-2 values

### Components for User Story 2

- [X] T025 [P] [US2] Create AddToReviewButton component for adding problem to review system in src/components/AddToReviewButton.tsx
- [X] T026 [P] [US2] Create NextReviewDate component to display scheduled review date in src/components/NextReviewDate.tsx

### Integration for User Story 2

- [X] T027 [US2] Add AddToReviewButton to Problem page for solved problems in src/pages/Problem.tsx
- [X] T028 [US2] Add NextReviewDate display when problem is in review system in src/pages/Problem.tsx
- [X] T029 [US2] Add "Add to Today's Queue" option in Problem page for manual override in src/pages/Problem.tsx

**Checkpoint**: User Story 2 complete - users can add problems to review and see scheduled dates

---

## Phase 5: User Story 3 - View Progress Dashboard (Priority: P2)

**Goal**: Users can view topic mastery, review statistics, streak counter, and suggested next problem

**Independent Test**: Complete some reviews, verify dashboard shows updated stats, streak, and relevant suggestions

### Hook Tests for User Story 3 (Constitution: Test-First)

- [X] T030a [P] [US3] Write tests for useStreak hook in src/hooks/useStreak.test.ts
- [X] T031a [P] [US3] Write tests for useStats hook in src/hooks/useStats.test.ts
- [X] T032a [P] [US3] Write tests for useSuggestedProblem hook in src/hooks/useSuggestedProblem.test.ts

### Hooks for User Story 3

- [X] T030 [P] [US3] Create useStreak hook with streak info and hasReviewedToday in src/hooks/useStreak.ts
- [X] T031 [P] [US3] Create useStats hook with weeklyStats, weeklyTotal, dailyAverage in src/hooks/useStats.ts
- [X] T032 [P] [US3] Create useSuggestedProblem hook with suggestion, reason, topic, refresh in src/hooks/useSuggestedProblem.ts

### Components for User Story 3

- [X] T033 [P] [US3] Create StreakCounter component (flame icon with count, active state) in src/components/StreakCounter.tsx
- [X] T034 [P] [US3] Create WeeklyStatsChart component using Recharts BarChart in src/components/WeeklyStatsChart.tsx
- [X] T035 [P] [US3] Create SuggestedNext component (problem card with reason and refresh) in src/components/SuggestedNext.tsx
- [X] T036 [P] [US3] Create NextToUnlock component (progress bar to next topic) in src/components/NextToUnlock.tsx

### Dashboard Integration for User Story 3

- [X] T037 [US3] Create Dashboard component combining all progress elements in src/components/Dashboard.tsx
- [X] T038 [US3] Update Home page to use Dashboard layout in src/pages/Home.tsx

**Checkpoint**: User Story 3 complete - users can view comprehensive progress dashboard

---

## Phase 6: User Story 4 - Review Session Flow (Priority: P2)

**Goal**: Users experience complete review session with progress tracking and summary at end

**Independent Test**: Start multi-problem review, complete session, verify progress indicator and summary screen

### Components for User Story 4

- [ ] T039 [P] [US4] Create ReviewSession container component with session state management in src/components/ReviewSession.tsx
- [ ] T040 [P] [US4] Create ReviewSessionProgress component (e.g., "2/5") in src/components/ReviewSessionProgress.tsx
- [ ] T041 [P] [US4] Create ReviewSessionSummary component (ratings breakdown, duration) in src/components/ReviewSessionSummary.tsx

### Integration for User Story 4

- [ ] T042 [US4] Update Review page to use ReviewSession with progress and summary in src/pages/Review.tsx
- [ ] T043 [US4] Add "End Session" button with partial summary support in src/pages/Review.tsx

**Checkpoint**: User Story 4 complete - users experience full review session flow with progress and summary

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Edge cases, performance, and refinements

- [X] T044 [P] Handle edge case: empty queue state in DueToday component *(Completed in Phase 3: shows "All caught up!" message)*
- [ ] T045 [P] Handle edge case: problem reviewed multiple times in one day in src/lib/db.ts
- [X] T046 [P] Handle edge case: problems with 0 solutions in review (show message instead of blank) *(Completed in Phase 3: shows "No solutions recorded" with link)*
- [ ] T047 [P] Handle edge case: streak break logic (no review for a day)
- [ ] T048 Add loading states to Dashboard and Review pages
- [X] T049 Add keyboard navigation for rating buttons (1=Again, 2=Hard, 3=Good, 4=Easy) *(Completed in Phase 3: keyboard shortcuts work)*
- [ ] T050 Ensure responsive layout for Dashboard (320px to 1920px)
- [ ] T051 Run quickstart.md validation checklist

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies - can start immediately
- **Phase 2 (Foundational)**: Depends on Setup - BLOCKS all user stories
- **Phase 3-6 (User Stories)**: All depend on Foundational phase completion
- **Phase 7 (Polish)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Phase 2 - Core review functionality
- **User Story 2 (P1)**: Can start after Phase 2 - Independent, adds enrollment
- **User Story 3 (P2)**: Can start after Phase 2 - Independent dashboard (benefits from US1 data)
- **User Story 4 (P2)**: Depends on User Story 1 (extends review flow)

### Within Each User Story

- SM-2 tests MUST be written and FAIL before implementation (Phase 2)
- Hooks before components that use them
- Components before pages that integrate them
- Core implementation before integration

### Parallel Opportunities

- Phase 1: T001 and T002 can run in parallel
- Phase 2: T006, T008, T010 (tests) can run in parallel; then T007, T009, T011 after respective tests
- Phase 3: T017-T018 (hooks) can run in parallel; T019-T020 (components) can run in parallel
- Phase 4: T025-T026 (components) can run in parallel
- Phase 5: T030-T032 (hooks) can run in parallel; T033-T036 (components) can run in parallel
- Phase 6: T039-T041 (components) can run in parallel
- Phase 7: T044-T047 (edge cases) can run in parallel

---

## Parallel Example: Phase 2 (Foundational)

```bash
# Launch all test files together (must fail first):
Task: T006 "Write SM-2 algorithm tests in src/lib/sm2.test.ts"
Task: T008 "Write streak calculation tests in src/lib/streak.test.ts"
Task: T010 "Write weekly stats calculation tests in src/lib/stats.test.ts"

# Then implement (after tests fail):
Task: T007 "Implement SM-2 algorithm in src/lib/sm2.ts"
Task: T009 "Implement calculateStreak in src/lib/streak.ts"
Task: T011 "Implement calculateWeeklyStats in src/lib/stats.ts"
```

## Parallel Example: Phase 5 (Dashboard Components)

```bash
# Launch all dashboard components together:
Task: T033 "Create StreakCounter component in src/components/StreakCounter.tsx"
Task: T034 "Create WeeklyStatsChart component in src/components/WeeklyStatsChart.tsx"
Task: T035 "Create SuggestedNext component in src/components/SuggestedNext.tsx"
Task: T036 "Create NextToUnlock component in src/components/NextToUnlock.tsx"
```

---

## Implementation Strategy

### MVP First (User Stories 1 + 2)

1. Complete Phase 1: Setup (dependencies, types, schema)
2. Complete Phase 2: Foundational (SM-2, streak, stats)
3. Complete Phase 3: User Story 1 (core review flow)
4. Complete Phase 4: User Story 2 (add to review)
5. **STOP and VALIDATE**: Test reviewing problems end-to-end
6. Deploy/demo core SRS functionality

### Incremental Delivery

1. Setup + Foundational → Core algorithms ready
2. Add User Story 1 + 2 → Core SRS MVP (review + enrollment)
3. Add User Story 3 → Progress dashboard visible
4. Add User Story 4 → Enhanced session experience
5. Add Polish → Production-ready

### Performance Targets (from plan.md)

- SM-2 calculation: <10ms
- Queue load: <200ms
- Chart render: <500ms
- Bundle: <500KB total (Recharts adds ~50KB)

---

## Notes

- SM-2 algorithm MUST have tests before implementation (constitution requirement)
- User Stories 1 and 2 together form the minimal useful SRS feature
- Dashboard (US3) provides motivation but isn't required for core flow
- Session flow (US4) enhances UX but review works without it
- All edge cases in Phase 7 address scenarios from spec.md
```
