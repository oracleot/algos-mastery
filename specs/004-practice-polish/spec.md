# Feature Specification: Timed Practice & Polish

**Feature Branch**: `004-practice-polish`  
**Created**: 2025-12-27  
**Status**: Draft  
**Input**: Phase 4 V3 from PRODUCT_PLAN.md

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Timed Practice Session (Priority: P1)

A user wants to practice under time pressure like a real interview. They select a time preset (25/45/60 minutes or custom), optionally filter by topic, and start the timer. Problems are presented one at a time with the countdown visible. They can pause, reveal hints/templates, and see time logged per problem.

**Why this priority**: Core feature of this phase - simulates interview conditions.

**Independent Test**: Can be fully tested by starting a timed session, working through problems, and verifying time tracking works.

**Acceptance Scenarios**:

1. **Given** user clicks "Timed Practice", **When** selecting 45 minutes, **Then** timer starts counting down from 45:00
2. **Given** timer is running, **When** user clicks pause, **Then** timer stops and resumes on unpause
3. **Given** timed session active, **When** time expires, **Then** notification appears with option to continue or end
4. **Given** problem is active, **When** user completes it, **Then** time spent is logged to that problem
5. **Given** timed session active, **When** user clicks "Reveal Template", **Then** relevant pattern template is shown

---

### User Story 2 - Export/Import Data (Priority: P1)

A user wants to back up their data or move to a new device. They can export all data to a JSON file and import it elsewhere.

**Why this priority**: Data portability is critical for a local-first app without cloud sync.

**Independent Test**: Can be tested by exporting, clearing data, and importing to restore.

**Acceptance Scenarios**:

1. **Given** user has problems and solutions, **When** clicking Export, **Then** JSON file downloads with all data
2. **Given** user has an export file, **When** clicking Import and selecting file, **Then** data is restored
3. **Given** import would overwrite data, **When** importing, **Then** confirmation dialog appears
4. **Given** import file is invalid, **When** importing, **Then** error message explains the issue

---

### User Story 3 - Dark Mode (Priority: P2)

A user prefers dark interfaces for late-night study sessions. They can toggle dark mode, and the preference persists.

**Why this priority**: Quality of life feature that enhances usability but isn't core functionality.

**Independent Test**: Can be tested by toggling dark mode and verifying persistence after refresh.

**Acceptance Scenarios**:

1. **Given** user clicks theme toggle, **When** in light mode, **Then** switches to dark mode
2. **Given** dark mode is active, **When** refreshing page, **Then** dark mode persists
3. **Given** system preference is dark, **When** first visit, **Then** app defaults to dark mode

---

### User Story 4 - Keyboard Shortcuts (Priority: P2)

A user wants to navigate efficiently without reaching for the mouse. Common actions have keyboard shortcuts.

**Why this priority**: Power user feature that improves efficiency.

**Independent Test**: Can be tested by using keyboard shortcuts and verifying actions trigger.

**Acceptance Scenarios**:

1. **Given** any page, **When** pressing `?`, **Then** keyboard shortcut help appears
2. **Given** review session, **When** pressing 1/2/3/4, **Then** rates Again/Hard/Good/Easy
3. **Given** timer running, **When** pressing Space, **Then** timer pauses/resumes
4. **Given** any page, **When** pressing `/`, **Then** search field is focused

---

### User Story 5 - PWA Support (Priority: P3)

A user wants to use the app offline and have it feel like a native app. The app can be installed and works without internet.

**Why this priority**: Nice-to-have that enhances the local-first experience.

**Independent Test**: Can be tested by installing PWA and using offline.

**Acceptance Scenarios**:

1. **Given** modern browser, **When** visiting app, **Then** install prompt is available
2. **Given** app is installed, **When** launching, **Then** opens in standalone window
3. **Given** no internet connection, **When** using app, **Then** all features work normally

---

### User Story 6 - Mobile Responsiveness Polish (Priority: P3)

A user wants to review problems on their phone during commute. The UI works well on small screens with touch interactions.

**Why this priority**: Extends usability to mobile but desktop is primary target.

**Independent Test**: Can be tested by using app on 320px viewport.

**Acceptance Scenarios**:

1. **Given** mobile viewport, **When** viewing problem list, **Then** cards stack vertically and are touch-friendly
2. **Given** mobile viewport, **When** using timer, **Then** controls are large enough to tap
3. **Given** mobile viewport, **When** reviewing, **Then** rating buttons are full-width

---

### Edge Cases

- What happens if browser tab is closed during timed session?
- How is time tracked if user switches problems without completing?
- What happens if export file is from a different app version?
- How does dark mode affect CodeMirror syntax highlighting?
- What happens if PWA is opened on multiple devices?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST provide timer with presets: 25, 45, 60 minutes, and custom
- **FR-002**: System MUST allow pause/resume of timer
- **FR-003**: System MUST track and log time spent per problem
- **FR-004**: System MUST provide "Reveal Template" and "Reveal Solution" during timed practice
- **FR-005**: System MUST notify when timer expires with option to continue
- **FR-006**: System MUST export all data (problems, solutions, reviews) to JSON
- **FR-007**: System MUST import data from JSON with validation
- **FR-008**: System MUST support light/dark theme toggle
- **FR-009**: System MUST persist theme preference
- **FR-010**: System MUST respect system color scheme preference on first visit
- **FR-011**: System MUST provide keyboard shortcuts for common actions
- **FR-012**: System MUST display keyboard shortcut help overlay
- **FR-013**: System MUST be installable as PWA
- **FR-014**: System MUST work offline with full functionality
- **FR-015**: System MUST be fully usable on viewports 320px and above

### Key Entities

- **PracticeSession**: Active timed practice state (problemId, startedAt, elapsed, isPaused)
- **ProblemTimeLog**: Time spent on each problem (problemId, totalSeconds, sessions[])
- **UserPreferences**: Theme, shortcuts enabled, default timer (stored in localStorage)

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Timer accuracy within 1 second over 60 minutes
- **SC-002**: Export generates valid JSON that can be imported
- **SC-003**: Import restores 100% of exported data
- **SC-004**: Theme toggle applies in under 100ms
- **SC-005**: Keyboard shortcuts respond in under 50ms
- **SC-006**: PWA scores 90+ on Lighthouse PWA audit
- **SC-007**: All features usable at 320px viewport width
