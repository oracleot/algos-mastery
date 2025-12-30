# Feature Specification: App Onboarding

**Feature Branch**: `005-onboarding`  
**Created**: 2024-12-29  
**Status**: Draft  
**Input**: User description: "Add an onboarding feature to the app. this shows the user how to use the app"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - First-Time User Guided Tour (Priority: P1)

A new user opens the Algorithms Mastery Tracker app for the first time and sees an interactive guided tour that walks them through the main features of the app. The tour highlights key UI elements such as adding problems, viewing the dashboard, starting a review session, and using timed practice. Users can navigate through tour steps, skip the tour entirely, or complete it to learn how the app works.

**Why this priority**: First-time users need orientation to understand the app's value proposition and core workflows. Without guidance, users may not discover key features like spaced repetition reviews or the topic unlock system, leading to poor adoption.

**Independent Test**: Can be fully tested by launching the app in a fresh browser session (no prior data) and verifying the tour appears, steps can be navigated, and completion state is remembered on subsequent visits.

**Acceptance Scenarios**:

1. **Given** a user visits the app for the first time, **When** the home page loads, **Then** an onboarding tour overlay appears with a welcome message and "Get Started" button
2. **Given** the onboarding tour is active, **When** the user clicks "Next", **Then** the tour highlights the next UI element with an explanation tooltip
3. **Given** the onboarding tour is active, **When** the user clicks "Skip Tour", **Then** the tour closes and the user sees the normal app interface
4. **Given** the user completes or skips the onboarding tour, **When** they refresh the page or return later, **Then** the onboarding tour does not appear again automatically
5. **Given** the onboarding tour is highlighting a step, **When** the user clicks "Previous", **Then** the tour navigates back to the previous step

---

### User Story 2 - Step-by-Step Feature Highlights (Priority: P1)

During the onboarding tour, each step focuses on a specific feature area of the app with a clear visual highlight (spotlight effect) on the relevant UI element and an explanatory tooltip. The tour covers the essential workflows: navigating to problems, understanding the dashboard, starting a review session, and viewing progress.

**Why this priority**: The quality of individual tour steps directly impacts user comprehension. Clear, focused highlights with concise explanations are essential for effective onboarding.

**Independent Test**: Can be tested by going through each tour step and verifying that the correct UI element is highlighted and the explanation text is relevant and readable.

**Acceptance Scenarios**:

1. **Given** the tour reaches the "View Problems" step, **When** the step is displayed, **Then** the "View Problems" button is visually highlighted with a spotlight effect
2. **Given** any tour step is active, **When** the user views the tooltip, **Then** it displays a title, description, and navigation buttons (Previous/Next/Skip)
3. **Given** the tour highlights an element, **When** the element is below the visible viewport, **Then** the page scrolls to bring the element into view
4. **Given** the final tour step is reached, **When** the user clicks "Finish", **Then** the tour closes and the completion state is saved

---

### User Story 3 - Restart Onboarding Tour from Settings (Priority: P2)

A returning user who previously completed the onboarding tour wants to review how to use certain features. They navigate to Settings and find an option to restart the onboarding tour, which takes them back to the home page and begins the tour again.

**Why this priority**: Users may forget features over time or want a refresher. Providing a way to re-access the tour improves long-term usability without cluttering the main interface.

**Independent Test**: Can be tested by first completing the tour, then navigating to Settings, clicking "Restart Tour", and verifying the tour begins again from step 1.

**Acceptance Scenarios**:

1. **Given** a user has completed the onboarding tour, **When** they navigate to Settings, **Then** they see a "Restart Onboarding Tour" option
2. **Given** the user is in Settings, **When** they click "Restart Onboarding Tour", **Then** they are redirected to the home page with the onboarding tour starting from step 1

---

### User Story 4 - Responsive Onboarding Experience (Priority: P3)

The onboarding tour works seamlessly on both desktop and mobile devices. On smaller screens, tooltips are positioned appropriately to remain visible and readable, and touch interactions are fully supported.

**Why this priority**: The app already supports mobile use. The onboarding experience should not degrade on smaller screens, though core functionality (desktop) is prioritized first.

**Independent Test**: Can be tested by running through the tour on a mobile device or using browser dev tools to simulate mobile viewport sizes.

**Acceptance Scenarios**:

1. **Given** a user views the tour on a mobile device, **When** any step tooltip appears, **Then** it is fully visible within the viewport without horizontal scrolling
2. **Given** a user is on mobile, **When** they tap navigation buttons in the tooltip, **Then** the tour responds correctly to touch input

---

### Edge Cases

- What happens when a highlighted element is not present on the page (e.g., empty state)? The tour should display a fallback message or skip to the next relevant step.
- How does the tour handle browser back/forward navigation during the tour? The tour closes immediately when the user navigates away from the home page. The tour is NOT marked complete, so it will resume from step 1 on the user's next home page visit.
- What happens if the user resizes the browser window during the tour? Tooltips should reposition to remain visible.
- How does the tour behave if the user is offline (PWA mode)? The tour should still function since it's client-side only.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST display an onboarding tour overlay for first-time users upon initial app load
- **FR-002**: System MUST provide step-by-step navigation through tour steps (Next, Previous, Skip, Finish actions)
- **FR-003**: System MUST visually highlight the relevant UI element for each tour step using a spotlight/overlay effect
- **FR-004**: System MUST display a tooltip with title, description, and navigation controls for each step
- **FR-005**: System MUST persist the tour completion status so the tour does not reappear on subsequent visits
- **FR-006**: System MUST allow users to skip the tour at any point and mark it as completed
- **FR-007**: System MUST automatically scroll the page to bring highlighted elements into view when necessary
- **FR-008**: System MUST provide a "Restart Tour" option in Settings for users who want to view the tour again
- **FR-009**: System MUST redirect users to the home page and start the tour when "Restart Tour" is triggered from Settings
- **FR-010**: System MUST handle cases where a highlighted element is not present by showing a fallback or skipping to the next step
- **FR-011**: Tooltips MUST be responsive and remain fully visible on mobile and desktop viewports

### Key Entities

- **OnboardingStep**: Represents a single step in the tour - includes target element selector, title, description, and position preference for the tooltip
- **OnboardingState**: Tracks whether the user has completed onboarding and the current step if tour is active
- **OnboardingPreference**: Stored preference for tour completion status (persisted locally)

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can complete the full onboarding tour in under 2 minutes
- **SC-002**: The tour functions correctly on both desktop (1024px+) and mobile (< 768px) viewports
- **SC-003**: Tour state is correctly persisted - returning users do not see the tour again unless they explicitly restart it
- **SC-004**: All tour steps display properly with visible tooltips and highlighted elements
- **SC-005**: The "Restart Tour" option in Settings successfully initiates the tour from the beginning

## Assumptions

- The onboarding tour will be implemented client-side using existing browser storage mechanisms (localStorage or IndexedDB via Dexie.js already in use)
- Tour steps will be defined in a configuration array making it easy to add, remove, or reorder steps
- The spotlight/overlay effect will dim the rest of the page while highlighting the target element
- Standard tooltip positioning (top, bottom, left, right) will be used with automatic repositioning for edge cases

## Tour Steps Definition

The onboarding tour consists of **6 steps** in the following order:

| Step | Target Element | Title | Description |
|------|----------------|-------|-------------|
| 1 | Welcome overlay (no element) | Welcome to Algorithms Mastery Tracker | Introduction to the app's purpose - track your algorithm problem-solving journey with spaced repetition |
| 2 | "View Problems" button | Browse Your Problems | Add and manage algorithm problems from LeetCode, HackerRank, or any source |
| 3 | "Timed Practice" button | Timed Practice Sessions | Challenge yourself with timed problem-solving to simulate interview conditions |
| 4 | "Progress Ladder" button | Track Your Progress | Follow a structured 15-topic learning path and unlock new topics as you master each one |
| 5 | Dashboard stats section | Your Dashboard | View your streak, weekly stats, and daily averages at a glance |
| 6 | Due Today section | Spaced Repetition Reviews | The app schedules reviews using the SM-2 algorithm to help you retain what you've learned |

## Clarifications

### Session 2024-12-29

- Q: How many steps should the tour have and what should they cover? → A: 6 steps - Welcome, View Problems, Timed Practice, Progress Ladder, Dashboard Stats, Due Today/Reviews
