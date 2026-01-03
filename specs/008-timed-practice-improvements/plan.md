# Implementation Plan: Timed Practice Improvements

**Branch**: `008-timed-practice-improvements` | **Date**: 1 January 2026 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/008-timed-practice-improvements/spec.md`

## Summary

Enhance the timed practice experience with four improvements: (1) enforce timer discipline by disabling the solution editor when the timer isn't running, (2) add in-editor JavaScript/TypeScript code validation using `new Function()`, (3) implement fullscreen focus mode via React Portal, and (4) fix navigation button visibility to only show when actions are actually available.

## Technical Context

**Language/Version**: TypeScript 5.0+ (strict mode)  
**Primary Dependencies**: React 19, CodeMirror 6, Dexie.js 4, Lucide React, shadcn/ui  
**Storage**: IndexedDB via Dexie.js (existing)  
**Testing**: Vitest + React Testing Library + fake-indexeddb  
**Target Platform**: PWA (offline-capable, browser-based)  
**Project Type**: Single React application (Vite build)  
**Performance Goals**: Code execution feedback < 5s, fullscreen toggle < 1s  
**Constraints**: No new heavy dependencies (avoid WASM runtimes), offline-capable  
**Scale/Scope**: Single-user local-first app

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I.1 TypeScript Strict Mode | ✅ Pass | All new code will use strict mode with explicit types |
| I.2 Component Isolation | ✅ Pass | CodeRunner hook separate from SolutionEditor; FullscreenOverlay separate from PracticeSession |
| I.3 Custom Hooks First | ✅ Pass | New `useCodeRunner` hook for execution logic |
| I.4 Explicit Over Implicit | ✅ Pass | All function signatures will have explicit types |
| I.5 Maximum File Length | ✅ Pass | PracticeSession.tsx is ~400 lines; will extract FullscreenOverlay to new component |
| I.6 No Dead Code | ✅ Pass | No dead code introduced |
| II.1 Test-First for Data Layer | ✅ Pass | useCodeRunner hook will have tests before implementation |
| II.2 Component Tests Required | ✅ Pass | Tests for timer-disabled editor state, fullscreen toggle, navigation visibility |
| II.3 Edge Case Coverage | ✅ Pass | Infinite loops (timeout), large output (truncation), empty states |
| II.4 Test File Collocation | ✅ Pass | Tests alongside source files |
| II.5 No Mocking IndexedDB | ✅ Pass | Feature doesn't add new DB operations |
| III.1 Design System Adherence | ✅ Pass | Uses Tailwind CSS + shadcn/ui components only |
| III.2 Loading & Error States | ✅ Pass | Code execution shows running state; errors displayed in output panel |
| III.3 Keyboard Navigation | ✅ Pass | Escape exits fullscreen; existing Space shortcut preserved |
| III.4 Responsive by Default | ✅ Pass | Fullscreen overlay uses fixed positioning with responsive layout |
| III.5 Data Persistence Feedback | N/A | No new persistence operations |
| III.6 Undo Support | N/A | No destructive actions added |

**Quality Gates**:
- Lint Clean: Required
- Type Check: Required
- Test Suite: Required (new tests for hook + components)
- Build Success: Required
- Bundle Size: No new dependencies expected

## Project Structure

### Documentation (this feature)

```text
specs/008-timed-practice-improvements/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output (N/A - no API contracts)
└── tasks.md             # Phase 2 output (via /speckit.tasks)
```

### Source Code (repository root)

```text
src/
├── hooks/
│   ├── useTimer.ts              # EXISTING - timer state management
│   ├── useCodeRunner.ts         # CREATE - JavaScript code execution hook
│   └── useCodeRunner.test.ts    # CREATE - tests for code runner
├── components/
│   ├── PracticeSession.tsx      # MODIFY - add readOnly prop, fullscreen state, nav visibility
│   ├── SolutionEditor.tsx       # MODIFY - add showRunButton prop, output panel
│   ├── SolutionForm.tsx         # MODIFY - enable run button in problem detail
│   ├── CodeRunnerPanel.tsx      # CREATE - output panel with run button
│   ├── CodeRunnerPanel.test.tsx # CREATE - tests for code runner panel
│   ├── FullscreenOverlay.tsx    # CREATE - fullscreen focus mode overlay
│   ├── FullscreenOverlay.test.tsx # CREATE - tests for fullscreen overlay
│   └── EditorDisabledBanner.tsx # CREATE - contextual message banner
├── pages/
│   └── Practice.tsx             # MODIFY - fix random problem button visibility
└── lib/
    └── codeRunner.ts            # CREATE - code execution utilities (timeout, output capture)
```

**Structure Decision**: Single project structure following existing patterns. New hook follows `useX` convention. New components are single-purpose per Constitution I.2. FullscreenOverlay extracted to keep PracticeSession under 300 lines.

## Complexity Tracking

> No Constitution violations requiring justification.
