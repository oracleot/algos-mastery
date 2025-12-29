# Implementation Plan: Solution Journal & Pattern Templates

**Branch**: `002-solution-journal` | **Date**: 2025-12-27 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/002-solution-journal/spec.md`
**Depends On**: `001-mvp-project-setup` (Problem CRUD, IndexedDB setup)

## Summary

Implement the solution journal with CodeMirror 6 editor, pattern template library, and topic mastery/unlock system. Users can save multiple solutions per problem with syntax highlighting, insert pre-built algorithm templates, and track progress toward unlocking new topics via a visual progression ladder.

## Technical Context

**Language/Version**: TypeScript ^5.0.0 (strict mode enabled)  
**Primary Dependencies**: CodeMirror 6 (@codemirror/view, @codemirror/state, @codemirror/lang-*), existing React/Vite/Tailwind stack  
**Storage**: IndexedDB via Dexie.js (extends existing schema with solutions table)  
**Testing**: Vitest + React Testing Library, fake-indexeddb  
**Target Platform**: Modern browsers (320px to 1920px responsive)  
**Project Type**: Single-page web application (React SPA)  
**Performance Goals**: Editor load <500ms, template insertion <100ms, save <200ms  
**Constraints**: CodeMirror bundle adds ~150KB, must stay under 500KB total gzipped  
**Scale/Scope**: ~10 templates, unlimited solutions per problem

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### I. Code Quality Standards

| Requirement | Status | Notes |
|-------------|--------|-------|
| TypeScript strict mode | ✅ PASS | Inherited from MVP setup |
| Component isolation | ✅ PASS | SolutionEditor, SolutionList, TemplateSelector, ProgressLadder separate |
| Custom hooks for business logic | ✅ PASS | useSolutions, useProgress, useTemplates hooks planned |
| Explicit type annotations | ✅ PASS | Solution, Template, TopicProgress interfaces |
| Max 200 lines per file | ✅ PASS | CodeMirror setup may need extraction to lib/editor.ts |
| No dead code | ✅ PASS | Will enforce via ESLint |

### II. Testing Discipline

| Requirement | Status | Notes |
|-------------|--------|-------|
| Test-first for data layer | ✅ PASS | Solution CRUD, mastery calculation tests first |
| Component tests required | ✅ PASS | SolutionEditor, ProgressLadder get tests |
| Edge case coverage | ✅ PASS | Empty solutions, 0% mastery, locked topics |
| Test file collocation | ✅ PASS | *.test.ts alongside source |
| No mocking IndexedDB | ✅ PASS | fake-indexeddb continues |

### III. User Experience Consistency

| Requirement | Status | Notes |
|-------------|--------|-------|
| Tailwind CSS only | ⚠️ EXCEPTION | CodeMirror requires its own CSS theming - allowed per constitution |
| Loading & error states | ✅ PASS | Editor loading state, save feedback |
| Keyboard navigation | ✅ PASS | CodeMirror has built-in keyboard support |
| Responsive (320px-1920px) | ✅ PASS | Editor and ladder responsive |
| Data persistence feedback | ✅ PASS | Toast on solution save/delete |
| Confirmation for destructive | ✅ PASS | Confirm before solution delete |

### Quality Gates

| Gate | Status | Notes |
|------|--------|-------|
| Lint clean (zero errors) | ✅ Will enforce | ESLint configured |
| Type check passes | ✅ Will enforce | tsc --noEmit |
| All tests pass | ✅ Will enforce | Vitest |
| Build succeeds | ✅ Will enforce | npm run build |
| Bundle <500KB gzipped | ⚠️ Monitor | CodeMirror adds ~150KB, need lazy loading |

**Gate Status**: ✅ PASS with documented exception (CodeMirror CSS)

## Project Structure

### Documentation (this feature)

```text
specs/002-solution-journal/
├── plan.md              # This file
├── research.md          # CodeMirror setup, template patterns
├── data-model.md        # Solution entity, TopicProgress
├── quickstart.md        # CodeMirror integration guide
├── contracts/           # Hook and component interfaces
└── tasks.md             # Implementation tasks
```

### Source Code (additions to MVP structure)

```text
src/
├── components/
│   ├── SolutionEditor.tsx      # CodeMirror wrapper
│   ├── SolutionList.tsx        # Solutions for a problem
│   ├── SolutionCard.tsx        # Individual solution display
│   ├── TemplateSelector.tsx    # Template insertion dropdown
│   ├── ProgressLadder.tsx      # Topic progression visualization
│   ├── TopicProgressCard.tsx   # Individual topic in ladder
│   └── MasteryBadge.tsx        # Percentage/lock indicator
├── hooks/
│   ├── useSolutions.ts         # Solution CRUD
│   ├── useProgress.ts          # Mastery calculations
│   └── useTemplates.ts         # Template access
├── lib/
│   ├── editor.ts               # CodeMirror setup/config
│   ├── mastery.ts              # Mastery calculation logic
│   └── db.ts                   # Extended with solutions table
├── data/
│   └── templates.ts            # Pattern template definitions
└── pages/
    ├── Problem.tsx             # Problem detail with solutions
    └── Progress.tsx            # Progress ladder page
```

## Complexity Tracking

| Exception | Justification | Alternative Rejected |
|-----------|--------------|---------------------|
| CodeMirror CSS | Required for syntax highlighting themes; constitution explicitly allows for CodeMirror | Building custom editor would be massive scope |
| Lazy load CodeMirror | Bundle size concern; load editor only when needed | Eager load would exceed 500KB budget |
