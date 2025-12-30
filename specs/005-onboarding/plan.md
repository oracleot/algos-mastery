# Implementation Plan: App Onboarding

**Branch**: `005-onboarding` | **Date**: 2024-12-29 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/005-onboarding/spec.md`

## Summary

Implement an interactive guided onboarding tour for first-time users using **react-joyride** library. The tour consists of 6 steps highlighting key app features (View Problems, Timed Practice, Progress Ladder, Dashboard, Due Today reviews). Tour completion state persists via localStorage through existing `UserPreferences`. Users can restart the tour from Settings. The implementation is fully client-side with responsive tooltip positioning for mobile/desktop.

## Technical Context

**Language/Version**: TypeScript 5.9 (strict mode)  
**Primary Dependencies**: React 19, react-router-dom 7, react-joyride (new dependency)  
**Storage**: localStorage (via existing `lib/preferences.ts`)  
**Testing**: Vitest + React Testing Library  
**Target Platform**: Web (PWA), responsive 320px-1920px  
**Project Type**: Single-page web application (React + Vite)  
**Performance Goals**: Tour loads instantly, no perceptible lag during step transitions  
**Constraints**: Offline-capable (PWA), bundle size <500KB gzipped  
**Scale/Scope**: Single app, ~20 components, 7 pages

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Pre-Design Check (Phase 0)

| Principle | Status | Notes |
|-----------|--------|-------|
| **I. Code Quality Standards** | ✅ PASS | TypeScript strict mode, component isolation (OnboardingTour, useOnboarding hook), explicit types |
| **II. Testing Discipline** | ✅ PASS | Component tests required for OnboardingTour, tests for useOnboarding hook |
| **III. User Experience Consistency** | ✅ PASS | Tailwind styling, keyboard navigation (Joyride built-in), responsive tooltips, immediate persistence feedback |
| **Technology Stack** | ✅ PASS | Adding react-joyride - justified by spec requirement for guided tours (no existing tool sufficient) |
| **Quality Gates** | ✅ PASS | ESLint clean, TypeScript strict, tests required, bundle size impact minimal (~15KB gzipped) |

### Post-Design Re-Check (Phase 1)

| Principle | Status | Verification |
|-----------|--------|--------------|
| **I. Code Quality** | ✅ PASS | OnboardingTour single-purpose (rendering), useOnboarding handles logic, all types explicit |
| **II. Testing** | ✅ PASS | Test files specified: `useOnboarding.test.ts`, `OnboardingTour.test.tsx` |
| **III. UX Consistency** | ✅ PASS | Uses existing Tailwind patterns, responsive design, keyboard nav via Joyride |
| **Technology Stack** | ✅ PASS | react-joyride is only new dependency, fully justified |
| **Quality Gates** | ✅ PASS | Implementation follows patterns from existing codebase |

**New Dependency Justification (react-joyride)**:
1. **Why existing tools insufficient**: No tour/onboarding library exists in current dependencies. Building from scratch would require significant effort for spotlight effects, scroll handling, and tooltip positioning.
2. **Bundle size impact**: ~15KB gzipped (acceptable given 500KB budget)
3. **Maintenance status**: Active (gilbarbara/react-joyride), 87.7 benchmark score, High source reputation, 38 code snippets available

## Project Structure

### Documentation (this feature)

```text
specs/005-onboarding/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output (internal API contracts)
└── tasks.md             # Phase 2 output (created by /speckit.tasks)
```

### Source Code (repository root)

```text
src/
├── components/
│   ├── OnboardingTour.tsx      # NEW: Main tour component wrapping Joyride
│   └── OnboardingTour.test.tsx # NEW: Component tests
├── hooks/
│   ├── useOnboarding.ts        # NEW: Onboarding state management hook
│   └── useOnboarding.test.ts   # NEW: Hook tests
├── lib/
│   ├── preferences.ts          # MODIFIED: Add onboardingCompleted field
│   └── onboarding-steps.ts     # NEW: Tour step definitions
├── types/
│   └── index.ts                # MODIFIED: Add OnboardingStep type, update UserPreferences
├── pages/
│   ├── Home.tsx                # MODIFIED: Integrate OnboardingTour
│   └── Settings.tsx            # MODIFIED: Add "Restart Tour" option
└── tests/
    └── onboarding.test.tsx     # NEW: Integration tests
```

**Structure Decision**: Single web application with React components. New files follow established patterns (hooks for logic, components for UI, lib for utilities/data). Tests colocated with source files per Constitution.

## Complexity Tracking

> No Constitution violations requiring justification.

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| N/A | N/A | N/A |
