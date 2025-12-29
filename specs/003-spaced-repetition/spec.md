# Feature Specification: Spaced Repetition System

**Feature Branch**: `003-spaced-repetition`  
**Created**: 2025-12-27  
**Status**: Draft  
**Input**: Phase 3 V2 from PRODUCT_PLAN.md

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Review Due Problems (Priority: P1)

A user opens the app and sees a "Due Today" section showing problems scheduled for review. They click "Start Review" and are presented with problems one at a time. After attempting each, they rate their recall (Again/Hard/Good/Easy), and the system calculates the next review date.

**Why this priority**: Core SRS functionality - the entire feature revolves around scheduled reviews.

**Independent Test**: Can be fully tested by marking problems for review, waiting for due date, completing review session, and verifying next review dates are calculated.

**Acceptance Scenarios**:

1. **Given** problems have review data, **When** user opens dashboard, **Then** "Due Today" section shows problems where `nextReview <= today`
2. **Given** review queue has problems, **When** user clicks "Start Review", **Then** first problem is displayed with "Reveal Solution" button
3. **Given** problem is displayed in review, **When** user clicks "Reveal Solution", **Then** their saved solutions are shown
4. **Given** solution is revealed, **When** user selects rating (Again/Hard/Good/Easy), **Then** SM-2 algorithm calculates new interval and next review date
5. **Given** review is rated, **When** moving to next problem, **Then** review data is persisted immediately

---

### User Story 2 - Add Problem to Review Queue (Priority: P1)

A user marks a solved problem for spaced repetition. They can also manually add any problem to today's review queue for extra practice.

**Why this priority**: Users need a way to enroll problems into the SRS system.

**Independent Test**: Can be tested by adding a problem to review and verifying it appears in the queue.

**Acceptance Scenarios**:

1. **Given** a solved problem, **When** user clicks "Add to Review", **Then** review record is created with default SM-2 values
2. **Given** any problem, **When** user clicks "Add to Today's Queue", **Then** problem appears in today's review regardless of scheduled date
3. **Given** problem is in review system, **When** viewing problem, **Then** next review date is displayed

---

### User Story 3 - View Progress Dashboard (Priority: P2)

A user wants to see their overall progress: topic mastery ladder, review statistics, current streak, and a suggested next problem.

**Why this priority**: Dashboard provides motivation and guidance but isn't required for core review flow.

**Independent Test**: Can be tested by viewing dashboard after completing reviews and verifying stats update.

**Acceptance Scenarios**:

1. **Given** user has review history, **When** opening dashboard, **Then** weekly review stats chart is displayed
2. **Given** user has completed reviews today, **When** viewing dashboard, **Then** current streak counter is updated
3. **Given** user has unlocked topics with unsolved problems, **When** viewing dashboard, **Then** "Suggested Next" shows a problem from weakest topic
4. **Given** user views dashboard, **When** topic ladder is displayed, **Then** "Next to Unlock" shows progress bar to next topic

---

### User Story 4 - Review Session Flow (Priority: P2)

A user completes a review session with multiple problems, seeing progress through the queue and a summary at the end.

**Why this priority**: Enhanced UX for review sessions, builds on core review functionality.

**Independent Test**: Can be tested by starting a multi-problem review session and completing it.

**Acceptance Scenarios**:

1. **Given** review session started with 5 problems, **When** reviewing, **Then** progress indicator shows "2/5"
2. **Given** review session in progress, **When** user completes last problem, **Then** summary screen shows ratings breakdown
3. **Given** review session in progress, **When** user clicks "End Session", **Then** session ends with partial summary

---

### Edge Cases

- What happens when there are no problems due for review?
- How does the system handle a problem reviewed multiple times in one day?
- What if a problem is deleted while it has review data?
- How are problems with 0 solutions handled in review (nothing to reveal)?
- What happens if streak is broken (no review for a day)?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST implement SM-2 spaced repetition algorithm
- **FR-002**: System MUST track review data: ease factor, interval, next review date, review count
- **FR-003**: System MUST provide four rating options: Again (0), Hard (3), Good (4), Easy (5)
- **FR-004**: System MUST display "Due Today" queue on dashboard
- **FR-005**: System MUST allow manual override to add any problem to today's queue
- **FR-006**: System MUST provide review session flow with problem display and solution reveal
- **FR-007**: System MUST calculate and display current streak (consecutive days with reviews)
- **FR-008**: System MUST display weekly review statistics chart (using Recharts)
- **FR-009**: System MUST suggest next problem based on weakest unlocked topic
- **FR-010**: System MUST show "Next to Unlock" indicator with progress bar
- **FR-011**: System MUST delete review data when associated problem is deleted

### Key Entities

- **Review**: Spaced repetition data for a problem. Attributes: problemId, easeFactor, interval, repetitions, nextReview, lastReviewed
- **ReviewSession**: Temporary state for an active review session (component-local, not persisted)
- **Streak**: Calculated from review history (consecutive days)

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: SM-2 calculation completes in under 10ms
- **SC-002**: Due today queue loads in under 200ms
- **SC-003**: Review rating updates persist immediately
- **SC-004**: Dashboard charts render in under 500ms
- **SC-005**: Streak calculation is accurate to the day
- **SC-006**: Suggested next problem is from the unlocked topic with lowest mastery
