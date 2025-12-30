# Feature Specification: Learning Resources

**Feature Branch**: `007-learning-resources`  
**Created**: 30 December 2025  
**Status**: Draft  
**Input**: User description: "Add a Learning Resources section to problems, allowing users to attach educational videos, articles, and documentation that explain how to solve each problem"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Add Resource to a Problem (Priority: P1)

As a user studying a problem, I want to attach a learning resource (video, article, or documentation link) so I can reference helpful materials that explain how to solve the problem.

**Why this priority**: This is the core functionality of the feature. Without the ability to add resources, no other functionality matters. Users need to quickly save helpful links they discover while studying.

**Independent Test**: Can be fully tested by navigating to a problem, adding a resource with title/URL/type, and confirming it appears in the resource list. Delivers immediate value by allowing users to save learning materials.

**Acceptance Scenarios**:

1. **Given** I am editing a problem (new or existing), **When** I click the "Add Resource" button, **Then** the resource form expands allowing me to enter title, URL, type, and source.
2. **Given** the resource form is expanded, **When** I enter a resource title, URL, and select a type (video/article/documentation), **Then** the resource is added to the problem's resource list and the form collapses.
3. **Given** I am adding a resource, **When** I paste a URL from a known source (e.g., YouTube, NeetCode) and leave the URL field, **Then** the source name is auto-detected and displayed.
4. **Given** I am adding a resource, **When** I paste a URL from an unknown source, **Then** I can manually enter the source name.
5. **Given** I am adding a resource, **When** I leave the title empty and try to add, **Then** I see a validation error indicating title is required.
6. **Given** I am adding a resource, **When** I enter an invalid URL, **Then** I see a validation error indicating the URL is invalid.

---

### User Story 2 - View Resources on Problem Detail (Priority: P1)

As a user viewing a problem's detail page, I want to see all attached learning resources so I can quickly access materials that help me understand the problem.

**Why this priority**: Equally critical as adding resources—users need to view and access saved resources to get value from the feature.

**Independent Test**: Can be fully tested by viewing a problem with attached resources and confirming they display with type icons, titles, and clickable links.

**Acceptance Scenarios**:

1. **Given** a problem has attached resources, **When** I view the problem detail page, **Then** I see a "Learning Resources" section (positioned after the solutions section) listing all resources with type-specific icons.
2. **Given** I am viewing a resource in the list, **When** I click the resource link, **Then** it opens in a new browser tab.
3. **Given** a problem has no resources, **When** I view the problem detail page, **Then** I see an empty state prompting me to add resources with a link to edit the problem.
4. **Given** resources of different types exist, **When** I view the list, **Then** each resource displays the appropriate icon (play icon for video, document icon for article, book icon for documentation).

---

### User Story 3 - Remove Resource from Problem (Priority: P2)

As a user managing my problem resources, I want to remove a resource I no longer need so I can keep my resource list clean and relevant.

**Why this priority**: Important for maintenance but secondary to adding/viewing. Users can still get value from the feature without removal capability initially.

**Independent Test**: Can be fully tested by removing a resource from a problem while editing and confirming it no longer appears.

**Acceptance Scenarios**:

1. **Given** I am editing a problem with resources, **When** I click the remove button on a resource, **Then** the resource is instantly removed from the list without a confirmation dialog.
2. **Given** I remove a resource, **When** I save the problem, **Then** the resource is permanently deleted.

---

### User Story 4 - View Resource Count on Problem Card (Priority: P3)

As a user browsing my problem list, I want to see a resource count indicator on problem cards so I can quickly identify which problems have learning materials attached.

**Why this priority**: Nice-to-have enhancement for discoverability. Core functionality works without this indicator.

**Independent Test**: Can be fully tested by viewing the problem list and confirming problems with resources show a count badge.

**Acceptance Scenarios**:

1. **Given** a problem has one or more resources, **When** I view the problem in a list (cards/table), **Then** I see a badge showing the resource count.
2. **Given** a problem has no resources, **When** I view the problem in a list, **Then** no resource badge is displayed.

---

### Edge Cases

- What happens when a user tries to add a resource with a very long title? Title is limited to 200 characters with validation error shown if exceeded.
- How does the system handle duplicate URLs for the same problem? Duplicates are allowed—user may want different titles for the same content.
- What happens when the auto-detected source is wrong? User can manually edit the source field to override.
- How are resources handled during data export/import? Resources are included as part of problem data.
- What happens to resources when a problem is deleted? Resources are deleted along with the problem.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST allow users to add learning resources to problems with title, URL, type, and optional source name.
- **FR-002**: System MUST validate that resource title is provided and is 200 characters or less.
- **FR-003**: System MUST validate that resource URL is provided and is a valid URL format.
- **FR-004**: System MUST validate that a resource type is selected (video, article, or documentation).
- **FR-005**: System MUST auto-detect the source name from known URL patterns (YouTube, NeetCode, Medium, etc.).
- **FR-006**: System MUST allow users to manually enter or override the source name.
- **FR-007**: System MUST display resources on the problem detail page with type-specific icons.
- **FR-008**: System MUST open resource links in a new browser tab when clicked.
- **FR-009**: System MUST show an empty state on problem detail when no resources exist, prompting users to add resources.
- **FR-010**: System MUST allow users to remove resources when editing a problem.
- **FR-011**: System MUST display a resource count badge on problem cards when resources exist.
- **FR-012**: System MUST persist resources in the local database as part of problem data.
- **FR-013**: System MUST include resources in data export/import operations.
- **FR-014**: System MUST work offline (all operations use local storage).

### Key Entities

- **LearningResource**: Represents an educational resource attached to a problem. Contains: unique identifier, resource type (video/article/documentation), title, URL, and source name. Always belongs to a single Problem.
- **Problem**: Existing entity extended with a collection of LearningResources. A problem can have zero or more resources.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can add a learning resource to a problem in under 30 seconds.
- **SC-002**: Users can access an attached resource from the problem detail page with a single click.
- **SC-003**: Source auto-detection correctly identifies at least 15 known platforms (YouTube, NeetCode, Medium, LeetCode, etc.).
- **SC-004**: Resource validation provides clear, actionable error messages for invalid input.
- **SC-005**: All resource operations work correctly offline without data loss.
- **SC-006**: Existing problems continue to function correctly after the feature is added (backward compatible).

## Assumptions

- Users are responsible for curating their own resources—no community sharing or recommendation system.
- Resource content is not embedded or scraped; only links are stored.
- No limit on number of resources per problem (users self-manage their lists).
- Source auto-detection is a convenience feature; manual entry is always available as fallback.
- Resource ordering is based on insertion order (no manual reordering).

## Out of Scope

- Embedding or previewing external content within the app
- Community-submitted or shared resource libraries
- Resource ratings or quality indicators
- AI-powered resource recommendations
- Broken link detection or validation
- Resource categorization beyond type (video/article/documentation)
- Inline editing of existing resources (users remove and re-add instead)

## Clarifications

### Session 2024-12-30

- Q: Should removing a resource show a confirmation dialog? → A: No confirmation dialog; instant removal for fast interaction.
- Q: Where should Learning Resources section appear on problem detail page? → A: After solutions section (solutions are primary, resources supplementary).
- Q: Can users edit existing resources or must they remove and re-add? → A: Remove and re-add only; no inline editing.
- Q: Should resource form be collapsed or always visible when editing? → A: Collapsed by default; show "Add Resource" button to expand.
- Q: When should source auto-detection trigger? → A: On blur (when user leaves the URL field), not on every keystroke.
