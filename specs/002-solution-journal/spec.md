# Feature Specification: Solution Journal & Pattern Templates

**Feature Branch**: `002-solution-journal`  
**Created**: 2025-12-27  
**Status**: Draft  
**Input**: Phase 2 V1 from PRODUCT_PLAN.md

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Add Solution to Problem (Priority: P1)

A user has solved a problem and wants to save their solution. They open the problem, click "Add Solution", select their programming language, paste/type their code in the editor with syntax highlighting, and save. The solution appears in the problem's solution history with a timestamp.

**Why this priority**: Core functionality - the journal is meaningless without the ability to save solutions.

**Independent Test**: Can be fully tested by adding a solution to any problem and verifying it persists with correct syntax highlighting.

**Acceptance Scenarios**:

1. **Given** a problem exists, **When** user clicks "Add Solution", **Then** a CodeMirror editor opens with language selector
2. **Given** the solution editor is open, **When** user selects "Python" and enters code, **Then** Python syntax highlighting is applied
3. **Given** code is entered, **When** user clicks Save, **Then** solution is persisted with timestamp and language metadata
4. **Given** a solution is saved, **When** user views the problem, **Then** solution appears in the history list

---

### User Story 2 - View and Manage Solutions (Priority: P1)

A user wants to review their past solutions for a problem, compare approaches, copy code, or delete outdated solutions.

**Why this priority**: Users need to access and manage their solution history.

**Independent Test**: Can be tested by viewing existing solutions, copying code, editing, and deleting.

**Acceptance Scenarios**:

1. **Given** a problem has multiple solutions, **When** user views the problem, **Then** all solutions are listed with timestamps and languages
2. **Given** a solution exists, **When** user clicks copy icon, **Then** code is copied to clipboard with confirmation
3. **Given** a solution exists, **When** user clicks edit, **Then** editor opens with existing code for modification
4. **Given** a solution exists, **When** user clicks delete, **Then** confirmation dialog appears before deletion

---

### User Story 3 - Insert Pattern Template (Priority: P2)

A user is working on a sliding window problem and wants a starting template. They click "Insert Template" in the editor, select "Sliding Window", and the pattern code with explanatory comments is inserted.

**Why this priority**: Templates accelerate learning but aren't required for basic journaling.

**Independent Test**: Can be tested by inserting any template and verifying correct code appears.

**Acceptance Scenarios**:

1. **Given** the solution editor is open, **When** user clicks "Insert Template", **Then** dropdown shows all relevant templates
2. **Given** template dropdown is open, **When** user selects "Binary Search", **Then** binary search template with comments is inserted
3. **Given** editor has existing code, **When** user inserts template, **Then** template is inserted at cursor position (not replacing all)

---

### User Story 4 - Topic Mastery Tracking (Priority: P2)

A user wants to see their progress toward unlocking the next topic. The progress ladder shows mastery percentage for each topic, with locked topics greyed out.

**Why this priority**: Gamification encourages consistent practice but builds on existing problem data.

**Independent Test**: Can be tested by solving problems and verifying mastery percentages update.

**Acceptance Scenarios**:

1. **Given** Arrays & Hashing is the first topic, **When** user opens progress view, **Then** it shows as unlocked regardless of solved count
2. **Given** user has solved 7 of 10 Arrays & Hashing problems, **When** viewing progress, **Then** mastery shows 70%
3. **Given** topic reaches 70% mastery, **When** viewing progress, **Then** next topic becomes unlocked
4. **Given** a topic is locked, **When** user tries to add problem with that topic, **Then** topic appears greyed out in selector

---

### User Story 5 - Progress Ladder Visualization (Priority: P3)

A user wants a visual representation of their learning journey showing all 15 topics, their unlock status, and mastery levels.

**Why this priority**: Nice-to-have visualization that enhances but doesn't block core functionality.

**Independent Test**: Can be tested by viewing ladder and verifying correct lock/unlock states.

**Acceptance Scenarios**:

1. **Given** progress ladder is displayed, **When** user views it, **Then** all 15 topics are shown in order
2. **Given** a topic is locked, **When** displayed, **Then** it appears greyed with lock icon
3. **Given** a topic has partial progress, **When** displayed, **Then** progress bar shows percentage

---

### Edge Cases

- ~~What happens when inserting a template in a language different from the template's default?~~ **RESOLVED**: T046 implemented language-agnostic templates that generate code in the user's selected language
- How does mastery calculation handle problems with no topic assigned?
- What happens if a user has 0 problems in a topic?
- How are very long solutions handled in the editor (performance)?
- What happens when copying a solution fails (clipboard API unavailable)?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST provide a code editor with syntax highlighting (CodeMirror 6)
- **FR-002**: System MUST support syntax highlighting for Python, JavaScript, TypeScript, Java, C++, Go, Rust, and plain text
- **FR-003**: System MUST allow multiple solutions per problem, each with its own language and timestamp
- **FR-004**: System MUST provide copy-to-clipboard functionality for solutions
- **FR-005**: System MUST allow editing and deleting existing solutions
- **FR-006**: System MUST provide pre-populated code templates for each algorithm topic category (currently 17 templates across 14 topics)
- **FR-007**: System MUST insert templates at cursor position without replacing existing code
- **FR-008**: System MUST calculate mastery percentage as (solved problems / total problems) per topic
- **FR-009**: System MUST unlock topics when previous topic reaches 70% mastery
- **FR-010**: System MUST always keep first topic (Arrays & Hashing) unlocked
- **FR-011**: System MUST display progress ladder with all 15 topics showing lock/unlock status
- **FR-012**: System MUST grey out locked topics in problem creation/edit forms

### Key Entities

- **Solution**: Code entry associated with a problem. Attributes: id, problemId, code, language, createdAt, updatedAt
- **Template**: Pre-defined code pattern with explanatory comments. Attributes: id, topic, name, code, language (default)
- **TopicProgress**: Calculated view of mastery per topic. Attributes: topic, totalProblems, solvedProblems, masteryPercent, unlocked

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: CodeMirror editor loads in under 500ms (measured from user action to editor interactive state)
- **SC-002**: Syntax highlighting applies instantly on language change
- **SC-003**: Solution save completes in under 200ms
- **SC-004**: Template insertion completes in under 100ms
- **SC-005**: Mastery percentage updates immediately when problem status changes
- **SC-006**: Progress ladder renders correctly for all 15 topics
- **SC-007**: Copy-to-clipboard provides visual feedback within 100ms
