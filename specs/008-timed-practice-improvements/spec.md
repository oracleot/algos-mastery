# Feature Specification: Timed Practice Improvements

**Feature Branch**: `008-timed-practice-improvements`  
**Created**: 1 January 2026  
**Status**: Ready  
**Input**: User description: "Enhance the timed practice experience by enforcing timer discipline, adding JavaScript code validation to the shared solution editor, enabling fullscreen focus mode, and fixing navigation button logic inconsistencies"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Timer-Enforced Coding Discipline (Priority: P1)

As a learner practicing algorithm problems, I want the solution editor to be disabled when the timer isn't running, so that I develop the discipline of coding under time pressure and accurately track my actual solving time.

**Why this priority**: This is the core behavioral change that enforces intentional practice. Without timer discipline, users can pause indefinitely while thinking, which defeats the purpose of timed practice and leads to inaccurate time tracking.

**Independent Test**: Can be fully tested by starting a practice session, attempting to type before starting the timer, and verifying the editor is locked. Delivers the discipline enforcement value immediately.

**Acceptance Scenarios**:

1. **Given** a practice session has just started (timer not yet running), **When** I attempt to type in the solution editor, **Then** the editor is read-only and I see a message "Start timer to begin coding"

2. **Given** the timer is actively running, **When** I type in the solution editor, **Then** my code is accepted and saved normally

3. **Given** the timer is paused mid-session, **When** I attempt to type in the solution editor, **Then** the editor is read-only and I see a message "Resume timer to continue"

4. **Given** the timer has completed (time ran out or I marked complete), **When** I type in the solution editor, **Then** I can edit freely to complete my solution

---

### User Story 2 - In-Editor JavaScript Code Validation (Priority: P2)

As a learner working on JavaScript/TypeScript solutions, I want to run and validate my code directly in the editor, so that I can quickly test my logic without switching to an external IDE or tool.

**Why this priority**: Code validation significantly improves the practice workflow by providing immediate feedback. It's second priority because users can still practice without it (by using external tools), but it removes a major friction point.

**Independent Test**: Can be tested by writing a simple JavaScript function with console.log statements, clicking Run, and verifying output appears below the editor.

**Acceptance Scenarios**:

1. **Given** I am editing a JavaScript or TypeScript solution, **When** I click the "Run Code" button, **Then** my code executes and I see console output and any errors in an output panel below the editor

2. **Given** my code contains a syntax error, **When** I run the code, **Then** I see a clear error message indicating the problem

3. **Given** my code uses console.log statements, **When** I run the code, **Then** all logged values appear in the output panel in order

4. **Given** I am editing a solution in Python or another non-JavaScript language, **When** I view the editor, **Then** I see the Run button disabled with a tooltip explaining "Code execution is only available for JavaScript and TypeScript"

5. **Given** the editor is in read-only mode (timer not running), **When** I view the Run button, **Then** the button is disabled

6. **Given** I have previous output displayed, **When** I run code again, **Then** the output panel clears and shows only the new results

---

### User Story 3 - Fullscreen Focus Mode (Priority: P3)

As a learner who is easily distracted, I want to enter a fullscreen focus mode during timed practice, so that I can concentrate fully on solving the problem without UI distractions.

**Why this priority**: While valuable for focus, this is an enhancement to the existing workflow rather than fixing a core issue. Users can already practice effectively without fullscreen mode.

**Independent Test**: Can be tested by clicking the fullscreen button during a practice session, verifying the editor expands to fill the screen, and pressing Escape to exit.

**Acceptance Scenarios**:

1. **Given** I am in a practice session, **When** I click the fullscreen button, **Then** the editor expands to cover the entire viewport with a minimal interface

2. **Given** I am in fullscreen mode, **When** I look at the screen, **Then** I see only the timer, the editor, the run button with output panel, and a collapsed problem description

3. **Given** I am in fullscreen mode with problem description collapsed, **When** I expand the problem description, **Then** I can read the full problem statement without exiting fullscreen

4. **Given** I am in fullscreen mode, **When** I press the Escape key or click the minimize button, **Then** I return to the normal practice session view

5. **Given** I am in fullscreen mode with the timer paused, **When** I view the editor, **Then** it remains read-only with the appropriate message displayed

---

### User Story 4 - Accurate Navigation Button Visibility (Priority: P4)

As a learner navigating between problems, I want navigation buttons to only appear when they are actually usable, so that I'm not confused by buttons that do nothing when clicked.

**Why this priority**: This is a bug fix / UX polish item. While important for a polished experience, the current behavior is confusing but not blocking.

**Independent Test**: Can be tested by reaching the last problem in a queue and verifying "Next Problem" disappears, and by having only one unsolved problem and verifying "Random Unsolved Problem" disappears.

**Acceptance Scenarios**:

1. **Given** I am on the last problem in my practice queue and there are no other attempted or solved problems available, **When** I view the practice session, **Then** the "Next Problem" button is not displayed

2. **Given** there are more attempted or solved problems available (in queue or outside queue), **When** I view the practice session, **Then** the "Next Problem" button is displayed

3. **Given** I have only one problem valid for timed practice (attempted or solved), **When** I start a timed practice session with that problem, **Then** the "Next Problem" button is not displayed (unsolved problems don't count)

4. **Given** I have no unsolved problems, **When** I view the Practice page Quick Start section, **Then** I see a message "No unsolved problems available for practice" instead of the random problem button

---

### Edge Cases

- What happens when code execution runs into an infinite loop? The system should implement a timeout (5 seconds) to prevent browser freeze.
- What happens when the user is in fullscreen mode and navigates away? Fullscreen mode should automatically exit when leaving the practice session.
- What happens when the timer completes while in fullscreen mode? The user should see a completion notification within the fullscreen view.
- What happens when code execution produces very large output? Output should be truncated with a message indicating truncation after a reasonable limit (1000 lines or 100KB).

## Requirements *(mandatory)*

### Functional Requirements

**Timer-Enforced Editing**
- **FR-001**: System MUST disable the solution editor when the practice timer has not been started
- **FR-002**: System MUST disable the solution editor when the practice timer is paused
- **FR-003**: System MUST enable the solution editor when the practice timer is actively running
- **FR-004**: System MUST enable the solution editor after the practice timer has completed
- **FR-005**: System MUST display contextual messages explaining why the editor is disabled ("Start timer to begin coding" or "Resume timer to continue")

**Code Validation**
- **FR-006**: System MUST provide a "Run Code" button for JavaScript and TypeScript solutions
- **FR-007**: System MUST execute JavaScript/TypeScript code in an isolated execution context (via `new Function()`) when the Run button is clicked
- **FR-008**: System MUST capture and display console output (log, warn, error, info) in an output panel
- **FR-009**: System MUST display syntax and runtime errors clearly in the output panel
- **FR-010**: System MUST disable the Run button when the editor is in read-only mode
- **FR-011**: System MUST show the Run button disabled with a tooltip for non-JavaScript/TypeScript languages, explaining that code execution is only available for JavaScript and TypeScript
- **FR-012**: System MUST implement a timeout mechanism (5 seconds) to prevent infinite loop scenarios
- **FR-013**: System MUST clear previous output when running code again
- **FR-014**: Code validation MUST be available in both the timed practice session and the problem detail page solution form

**Fullscreen Focus Mode**
- **FR-015**: System MUST provide a fullscreen toggle button in the practice session
- **FR-016**: Fullscreen mode MUST display the timer, editor, run button, output panel, and collapsible problem description
- **FR-017**: Problem description MUST be collapsed by default in fullscreen mode
- **FR-018**: Users MUST be able to exit fullscreen mode by pressing Escape or clicking a minimize button
- **FR-019**: Fullscreen mode MUST automatically exit when leaving the practice session

**Navigation Buttons**
- **FR-020**: System MUST hide the "Next Problem" button in timed practice when there are no more problems valid for timed practice (only attempted or solved problems count; unsolved problems are excluded from this calculation)
- **FR-021**: System MUST hide the "Random Unsolved Problem" button when there are zero unsolved problems
- **FR-022**: System MUST display an informative message when no unsolved problems are available for practice

### Key Entities

- **Timer State**: Represents the current state of the practice timer (not started, running, paused, completed) - determines editor editability
- **Code Execution Result**: Contains console output array, error message (if any), and execution status - displayed in output panel
- **Fullscreen State**: Boolean indicating whether focus mode is active - controls UI rendering

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can only input code while the timer is actively running or after completion, enforcing disciplined practice timing
- **SC-002**: JavaScript/TypeScript solutions can be validated within 5 seconds of clicking Run, with output visible immediately
- **SC-003**: 100% of console.log, console.warn, console.error, and console.info calls are captured and displayed in the output panel
- **SC-004**: Users can enter and exit fullscreen mode within 1 second of interaction
- **SC-005**: Navigation buttons accurately reflect available options 100% of the time (no misleading buttons shown)
- **SC-006**: Infinite loop scenarios are handled gracefully with timeout, preventing browser freeze
- **SC-007**: Users report improved focus and discipline when using timed practice mode (qualitative feedback)

## Clarifications

### Session 2026-01-01
- Q: Should the Run button remain visible but disabled for non-JS/TS languages, or be completely hidden? → A: Show Run button disabled with tooltip explaining language limitation
- Q: Why only JS/TS for code validation? → A: JS/TS can run offline without module imports. Other languages could work online but are excluded to avoid unnecessary memory overhead (e.g., Pyodide ~10MB WASM). This keeps the PWA lightweight.
- Q: What problems should "Next Problem" consider in timed practice? → A: Only problems valid for timed practice (attempted or solved status). Unsolved problems are not valid for timed practice and should not be factored into the "Next Problem" availability calculation.

## Assumptions

- JavaScript/TypeScript code execution via `new Function()` is sufficient for algorithm practice validation (no complex module imports needed)
- Users primarily work with self-contained algorithm functions that use console.log for output verification
- The 5-second timeout is sufficient for typical algorithm test cases while catching infinite loops
- Fullscreen mode using React Portal with fixed positioning provides adequate browser compatibility
- The existing timer hook provides reliable state information (isRunning, isPaused, isComplete)
