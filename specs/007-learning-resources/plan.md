# Implementation Plan: Learning Resources

**Branch**: `007-learning-resources` | **Date**: 30 December 2025 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/007-learning-resources/spec.md`

## Summary

Add a Learning Resources section to problems, enabling users to attach educational videos, articles, and documentation links. Resources are stored as an embedded array within the Problem entity in IndexedDB. The feature includes URL-based source auto-detection for 15+ platforms, type-specific icons, collapsible add form in edit mode, and resource count badges on problem cards.

## Technical Context

**Language/Version**: TypeScript ^5.0.0 (strict mode)  
**Primary Dependencies**: React ^19.0.0, Dexie.js ^4.0.0 (IndexedDB), Tailwind CSS ^4.0.0, Lucide React  
**Storage**: IndexedDB via Dexie.js (local-first, offline-capable)  
**Testing**: Vitest + React Testing Library + fake-indexeddb  
**Target Platform**: Web (PWA, 320px–1920px viewport)
**Project Type**: Single (web)  
**Performance Goals**: Resource add operation < 30 seconds user time  
**Constraints**: Offline-capable, < 500KB gzipped bundle  
**Scale/Scope**: Single user, local data only

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Requirement | Status |
|-----------|-------------|--------|
| I.1 TypeScript Strict Mode | All code compiles with `strict: true`, no `any` types | ✅ Will comply |
| I.2 Component Isolation | Single-purpose components (ResourceList, ResourceForm) | ✅ Will comply |
| I.3 Custom Hooks First | Resource form state stays in component (no business logic) | ✅ Will comply |
| I.4 Explicit Over Implicit | All function parameters and return types annotated | ✅ Will comply |
| I.5 Maximum File Length | New files < 200 lines each | ✅ Will comply |
| I.6 No Dead Code | No unused exports or commented code | ✅ Will comply |
| II.1 Test-First for Data Layer | Database migration tested with fake-indexeddb | ✅ Will comply |
| II.2 Component Tests Required | ResourceList, ResourceForm have primary behavior tests | ✅ Will comply |
| II.3 Edge Case Coverage | Title limits, invalid URLs, empty states tested | ✅ Will comply |
| II.4 Test File Collocation | Tests colocated (e.g., `resourceUtils.test.ts`) | ✅ Will comply |
| II.5 No Mocking IndexedDB | Use fake-indexeddb for integration tests | ✅ Will comply |
| III.1 Design System Adherence | Tailwind CSS only, no custom CSS | ✅ Will comply |
| III.2 Loading & Error States | Validation errors shown inline | ✅ Will comply |
| III.3 Keyboard Navigation | Form inputs keyboard accessible, proper focus management | ✅ Will comply |
| III.4 Responsive by Default | Works 320px–1920px, no horizontal scroll | ✅ Will comply |
| III.5 Data Persistence Feedback | Toast on resource add, inline state change on remove | ✅ Will comply |
| III.6 Undo Support | Remove is instant (no confirmation per clarification) | ✅ Confirmed in spec |

**Gate Status**: ✅ PASS (no violations)

## Project Structure

### Documentation (this feature)

```text
specs/007-learning-resources/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output (N/A - no API)
├── checklists/          # Quality checklists
└── tasks.md             # Phase 2 output (/speckit.tasks command)
```

### Source Code (repository root)

```text
src/
├── types/
│   └── index.ts                 # MODIFY: Add LearningResource, ResourceType
├── lib/
│   ├── db.ts                    # MODIFY: Add v5 migration for resources field
│   ├── validation.ts            # MODIFY: Add validateResource()
│   └── resourceUtils.ts         # CREATE: Source detection, type helpers
├── components/
│   ├── ResourceList.tsx         # CREATE: Display list with type icons
│   ├── ResourceForm.tsx         # CREATE: Add resource form (collapsible)
│   ├── ProblemForm.tsx          # MODIFY: Add Resources section
│   └── ProblemCard.tsx          # MODIFY: Add resource count badge
├── pages/
│   └── Problem.tsx              # MODIFY: Add Learning Resources section
└── hooks/
    └── useProblems.ts           # MODIFY: Handle resources in add/update

tests/
├── src/lib/
│   ├── resourceUtils.test.ts    # Unit tests for source detection
│   └── validation.test.ts       # Add resource validation tests
└── src/components/
    ├── ResourceList.test.tsx    # Component tests
    └── ResourceForm.test.tsx    # Component tests
```

**Structure Decision**: Single project structure (existing). New files for resource-specific logic; modifications to existing Problem-related files.

## Complexity Tracking

> No Constitution violations requiring justification.
