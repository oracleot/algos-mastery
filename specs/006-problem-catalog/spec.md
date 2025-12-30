# Feature Specification: Problem Catalog

**Feature Branch**: `006-problem-catalog`  
**Created**: 30 December 2025  
**Status**: Draft  
**Input**: User description: "Add a static catalog of 150 curated algorithm problems (Blind 75 + 75 extras) to eliminate friction of finding problems to practice. Users can browse, filter, and one-click add problems to their practice list."

---

## Overview

Provide a pre-built catalog of 150 curated algorithm problems to eliminate the cold-start friction for new users. Users can browse the catalog, filter by topic/difficulty/source, and one-click add problems to their personal practice list. The catalog also powers smart recommendations on the Dashboard.

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Browse and Add Problems from Catalog (Priority: P1)

As a user who wants to practice algorithms, I want to browse a catalog of curated problems so I can quickly find and add relevant problems to my practice list without manually entering details.

**Why this priority**: This is the core value proposition—eliminating the friction of finding problems. New users get immediate value by seeing problems they can practice.

**Independent Test**: Can be tested by navigating to the catalog page, viewing the list of problems, and clicking "Add" on any problem to add it to the user's problem list.

**Acceptance Scenarios**:

1. **Given** I am on the home page, **When** I click "Browse Catalog", **Then** I see a page with all 150 curated problems displayed as cards
2. **Given** I am viewing the catalog, **When** I click "Add to My Problems" on a problem I haven't added, **Then** the problem is added to my practice list and a success message appears
3. **Given** I have already added a problem, **When** I view that problem in the catalog, **Then** it shows as "Already Added" and the add button is disabled
4. **Given** I am viewing a catalog problem card, **When** I click the external link icon, **Then** the LeetCode problem page opens in a new tab

---

### User Story 2 - Filter Catalog by Topic, Difficulty, and Source (Priority: P1)

As a user preparing for interviews, I want to filter the catalog by topic, difficulty, and source so I can focus on specific areas I need to improve.

**Why this priority**: Filtering is essential for the catalog to be usable—150 problems is too many to browse without filtering. This enables targeted practice.

**Independent Test**: Can be tested by applying filters and verifying the displayed problems match the selected criteria.

**Acceptance Scenarios**:

1. **Given** I am on the catalog page, **When** I select "Arrays & Hashing" from the topic filter, **Then** only problems with that topic are displayed
2. **Given** I am on the catalog page, **When** I select "Easy" from the difficulty filter, **Then** only easy problems are displayed
3. **Given** I am on the catalog page, **When** I select "Blind 75" from the source filter, **Then** only Blind 75 problems are displayed
4. **Given** I have filters applied, **When** I type in the search box, **Then** results are further filtered to match my search text against problem titles
5. **Given** I have multiple filters applied, **When** I view the stats bar, **Then** I see "Showing X of 150 problems • Y already added"

---

### User Story 3 - View Personalized Recommendations on Dashboard (Priority: P2)

As a returning user, I want to see recommended problems from the catalog on my Dashboard so I know what to practice next without navigating to the catalog.

**Why this priority**: This enhances engagement by surfacing relevant problems proactively, but requires the core catalog functionality to work first.

**Independent Test**: Can be tested by viewing the Dashboard and verifying that 3 recommended problems appear based on current progress.

**Acceptance Scenarios**:

1. **Given** I have not added all catalog problems, **When** I view my Dashboard, **Then** I see up to 3 recommended problems from the catalog
2. **Given** I have low mastery in a specific topic, **When** I view recommendations, **Then** problems from that topic are prioritized
3. **Given** a recommendation is displayed, **When** I click "Add", **Then** the problem is added to my list and the recommendation updates
4. **Given** recommendations are displayed, **When** I click "View full catalog", **Then** I am taken to the catalog page

---

### User Story 4 - Navigate to Catalog from Home (Priority: P2)

As a user on the home page, I want a clear navigation option to browse the catalog so I can discover new problems to practice.

**Why this priority**: Navigation is essential for discoverability, but is a supporting feature for the core catalog functionality.

**Independent Test**: Can be tested by verifying a "Browse Catalog" button exists on the home page and navigates correctly.

**Acceptance Scenarios**:

1. **Given** I am on the home page, **When** I look at the main actions, **Then** I see a "Browse Catalog" button
2. **Given** I am on the home page, **When** I click "Browse Catalog", **Then** I am navigated to `/catalog`

---

### Edge Cases

- What happens when a user tries to add a problem that was already added through manual entry with the same URL? → Problem shows as "Already Added" (duplicate detection by URL)
- How does the system handle problems with slightly different URL formats (trailing slashes, case differences)? → URLs are normalized (lowercase, trailing slash removed) before comparison
- What happens when the user has added all 150 catalog problems? → Recommendations section is hidden or shows "You've added all catalog problems!"
- How does the catalog work offline? → All catalog data is static and bundled with the app—no network requests needed

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST provide a static catalog of 150 curated algorithm problems (75 from Blind 75, 75 from NeetCode 150/Grind 75)
- **FR-002**: System MUST display each catalog problem with title, difficulty badge, topic badge, source badge, and external LeetCode link
- **FR-003**: System MUST allow users to add a catalog problem to their practice list with a single click
- **FR-004**: System MUST detect and indicate if a catalog problem is already in the user's practice list (using URL-based duplicate detection)
- **FR-005**: System MUST provide filters for topic, difficulty, and source on the catalog page
- **FR-006**: System MUST provide a text search to filter problems by title
- **FR-007**: System MUST display a stats summary showing filtered count and already-added count
- **FR-008**: System MUST provide a navigation link to the catalog from the home page
- **FR-009**: System MUST display up to 3 personalized recommendations on the Dashboard based on user's current focus topic
- **FR-010**: System MUST prioritize recommendations by: focus topic (lowest mastery unlocked topic), then difficulty (easy first), then order within topic
- **FR-011**: System MUST work 100% offline with all catalog data bundled statically
- **FR-012**: System MUST display external links to LeetCode that open in a new tab
- **FR-013**: System MUST show toast notifications when problems are added successfully or fail to add

### Key Entities

- **CatalogProblem**: A pre-defined algorithm problem in the catalog with id, title, url, topic, difficulty, source, order, and optional leetcodeNumber
- **CatalogSource**: The source attribution for a problem (blind-75, neetcode-150, grind-75, curated)
- **TopicSlug**: The algorithm topic category (arrays-hashing, two-pointers, sliding-window, stack, etc.)

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can browse and add a problem from the catalog in under 30 seconds
- **SC-002**: Catalog page displays all 150 problems correctly across all supported device sizes (mobile, tablet, desktop)
- **SC-003**: All filter combinations work correctly and update displayed results immediately
- **SC-004**: 100% of duplicate problems are detected and shown as "Already Added"
- **SC-005**: Dashboard recommendations update within 1 second of adding a problem
- **SC-006**: Catalog is fully functional without network connectivity (offline-first)
- **SC-007**: New users see relevant problems immediately on first visit without needing to add problems manually

---

## Assumptions

- The 150 problems will be distributed across all 15 existing topics (approximately 10 per topic)
- Problems within each topic will be ordered by difficulty (easy → medium → hard), then by foundational concepts first
- LeetCode URLs follow the standard format: `https://leetcode.com/problems/[problem-slug]/`
- The existing `addProblem` function from `useProblems` hook will be used to add catalog problems
- Toast notifications will use the existing `sonner` library already in use in the app
- Existing badge components (`DifficultyBadge`, `TopicBadge`) will be reused for consistency

---

## Out of Scope

- LeetCode API integration for real-time problem data
- User-submitted problem suggestions to the catalog
- Automatic difficulty adjustment based on user performance
- Syncing catalog problems with external sources
- Problem descriptions or hints from LeetCode (only links provided)
- Bulk add functionality (users add problems individually, one at a time)

---

## Clarifications

### Session 2024-12-30

- Q: Should there be a bulk add feature for adding multiple problems at once? → A: No, individual add only – users click once per problem, no bulk selection
