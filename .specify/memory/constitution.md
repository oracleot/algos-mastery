<!--
  SYNC IMPACT REPORT
  ==================
  Version Change: N/A → 1.0.0 (Initial adoption)
  
  Modified Principles: N/A (initial version)
  
  Added Sections:
  - I. Code Quality Standards
  - II. Testing Discipline
  - III. User Experience Consistency
  - Technology Stack (constraints)
  - Quality Gates (workflow)
  - Governance
  
  Removed Sections: N/A (initial version)
  
  Templates Requiring Updates:
  - .specify/templates/plan-template.md ✅ (Constitution Check section exists, compatible)
  - .specify/templates/spec-template.md ✅ (Requirements & Success Criteria aligned)
  - .specify/templates/tasks-template.md ✅ (Testing phases aligned with Principle II)
  
  Follow-up TODOs: None
-->

# Algorithms Mastery Tracker Constitution

## Core Principles

### I. Code Quality Standards

All code MUST adhere to strict quality standards ensuring long-term maintainability and correctness:

- **TypeScript Strict Mode**: All TypeScript code MUST compile with `strict: true` enabled. No `any` types allowed except with explicit documented justification.
- **Component Isolation**: React components MUST be single-purpose. A component doing "X and Y" MUST be split into separate components.
- **Custom Hooks First**: Business logic MUST be extracted into custom hooks (`useX`). Components handle rendering only.
- **Explicit Over Implicit**: All function parameters and return types MUST have explicit TypeScript annotations. No reliance on inference for public APIs.
- **Maximum File Length**: Source files SHOULD NOT exceed 200 lines. Files exceeding 300 lines MUST be refactored.
- **No Dead Code**: Unused exports, commented-out code blocks, and unreachable branches are prohibited. Violations MUST be removed before merge.

**Rationale**: A learning tool MUST be built with code that itself exemplifies best practices. Technical debt compounds learning friction.

### II. Testing Discipline

Testing is mandatory for all user-facing features and data-critical operations:

- **Test-First for Data Layer**: All IndexedDB operations (Dexie.js), the SM-2 algorithm, and topic unlock logic MUST have tests written before implementation.
- **Component Tests Required**: Every user-interactive component MUST have at least one Vitest/React Testing Library test verifying its primary behavior.
- **Edge Case Coverage**: Boundary conditions (empty states, maximum values, malformed input) MUST be tested for any function handling user input or persisted data.
- **Test File Collocation**: Test files MUST be colocated with source files (e.g., `sm2.ts` → `sm2.test.ts`) OR in a parallel `__tests__/` directory.
- **No Mocking IndexedDB in Integration Tests**: Integration tests MUST use `fake-indexeddb` or similar to test real database behavior, not mocked responses.

**Rationale**: Spaced repetition and mastery tracking depend on algorithmic correctness. Bugs in SM-2 or unlock thresholds directly harm learning outcomes.

### III. User Experience Consistency

The user interface MUST be predictable, accessible, and friction-free:

- **Design System Adherence**: All UI MUST use Tailwind CSS utility classes following established patterns. Custom CSS is prohibited except for CodeMirror theming.
- **Loading & Error States**: Every async operation MUST display appropriate loading feedback. Failures MUST show actionable error messages, never silent failures.
- **Keyboard Navigation**: All interactive elements MUST be keyboard-accessible. Modal dialogs MUST trap focus. Practice timer MUST support keyboard shortcuts.
- **Responsive by Default**: All layouts MUST function on viewport widths from 320px (mobile) to 1920px (desktop). No horizontal scrolling allowed.
- **Data Persistence Feedback**: Any action that modifies IndexedDB MUST provide immediate visual confirmation (toast, inline feedback, or state change).
- **Undo Support**: Destructive actions (delete problem, clear solution) MUST either require confirmation OR provide undo capability.

**Rationale**: Learning requires focus. UI friction, unexpected behaviors, or lost data destroy concentration and discourage consistent practice.

## Technology Stack

The following technology constraints are non-negotiable to maintain consistency:

| Layer | Required Technology | Version Constraint |
|-------|--------------------|--------------------|
| Framework | React | ^19.0.0 |
| Language | TypeScript | ^5.0.0 (strict mode) |
| Build | Vite | ^5.0.0 |
| Styling | Tailwind CSS | ^3.0.0 |
| Storage | Dexie.js (IndexedDB) | ^4.0.0 |
| Editor | CodeMirror | ^6.0.0 |
| Testing | Vitest + React Testing Library | Latest stable |
| Icons | Lucide React | Latest stable |
| Charts | Recharts | ^2.0.0 |

**Deviation Policy**: Introducing a new dependency MUST be justified in the PR description, documenting: (1) why existing tools are insufficient, (2) bundle size impact, (3) maintenance status of the package.

## Quality Gates

All code changes MUST pass these gates before merge:

1. **Lint Clean**: ESLint MUST report zero errors. Warnings allowed only with inline justification comments.
2. **Type Check**: `tsc --noEmit` MUST pass with zero errors.
3. **Test Suite**: All tests MUST pass. New features MUST include tests (per Principle II).
4. **Build Success**: `npm run build` MUST complete without errors or warnings.
5. **Bundle Size Check**: Production bundle SHOULD NOT exceed 500KB gzipped. Exceeding 750KB requires optimization plan.

## Governance

This Constitution supersedes all other development practices for the Algorithms Mastery Tracker project.

**Amendment Process**:
1. Propose amendment with rationale in a dedicated PR
2. Document impact on existing code and any required migrations
3. Update version number according to semantic versioning:
   - MAJOR: Principle removal or incompatible redefinition
   - MINOR: New principle or section added
   - PATCH: Clarifications, typo fixes, non-semantic refinements
4. Propagate changes to dependent templates (plan, spec, tasks)

**Compliance Review**: All pull requests MUST verify adherence to these principles. Constitution violations MUST be resolved before merge, or documented with explicit justification in the Complexity Tracking section of the implementation plan.

**Version**: 1.0.0 | **Ratified**: 2025-12-27 | **Last Amended**: 2025-12-27
