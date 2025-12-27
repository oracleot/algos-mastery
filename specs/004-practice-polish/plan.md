# Implementation Plan: Timed Practice & Polish

**Branch**: `004-practice-polish` | **Date**: 2025-12-27 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/004-practice-polish/spec.md`
**Depends On**: `001-mvp-project-setup`, `002-solution-journal`, `003-spaced-repetition`

## Summary

Final polish phase adding timed practice mode for interview simulation, data export/import for backup and portability, dark mode theming, keyboard shortcuts for power users, and PWA support for offline use. This phase focuses on UX refinement and production readiness.

## Technical Context

**Language/Version**: TypeScript ^5.0.0 (strict mode enabled)  
**Primary Dependencies**: vite-plugin-pwa (PWA), existing stack  
**Storage**: IndexedDB + localStorage (preferences)  
**Testing**: Vitest + React Testing Library, Playwright (E2E for PWA)  
**Target Platform**: Modern browsers + PWA installation, responsive 320px-1920px  
**Project Type**: Single-page web application (React SPA → PWA)  
**Performance Goals**: Theme toggle <100ms, shortcut response <50ms, export <1s  
**Constraints**: Service worker for offline, final bundle <500KB gzipped  
**Scale/Scope**: Full feature parity offline, all data exportable

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### I. Code Quality Standards

| Requirement | Status | Notes |
|-------------|--------|-------|
| TypeScript strict mode | ✅ PASS | Inherited |
| Component isolation | ✅ PASS | Timer, ExportDialog, ThemeToggle, ShortcutHelp separate |
| Custom hooks for business logic | ✅ PASS | useTimer, useTheme, useKeyboardShortcuts, useExport |
| Explicit type annotations | ✅ PASS | PracticeSession, UserPreferences interfaces |
| Max 200 lines per file | ✅ PASS | Will enforce |
| No dead code | ✅ PASS | Will enforce |

### II. Testing Discipline

| Requirement | Status | Notes |
|-------------|--------|-------|
| Test-first for data layer | ✅ PASS | Export/import serialization tests first |
| Component tests required | ✅ PASS | Timer, ExportDialog get tests |
| Edge case coverage | ✅ PASS | Timer edge cases, invalid import data |
| Test file collocation | ✅ PASS | *.test.ts alongside source |
| No mocking IndexedDB | ✅ PASS | fake-indexeddb continues |

### III. User Experience Consistency

| Requirement | Status | Notes |
|-------------|--------|-------|
| Tailwind CSS only | ✅ PASS | Dark mode via Tailwind dark: variants |
| Loading & error states | ✅ PASS | Export/import progress, error handling |
| Keyboard navigation | ✅ PASS | Core feature of this phase |
| Responsive (320px-1920px) | ✅ PASS | Core feature of this phase |
| Data persistence feedback | ✅ PASS | Export/import completion feedback |
| Confirmation for destructive | ✅ PASS | Import overwrite confirmation |

**Gate Status**: ✅ ALL GATES PASS

## Project Structure

### Documentation (this feature)

```text
specs/004-practice-polish/
├── plan.md              # This file
├── research.md          # Timer, PWA, export format
├── data-model.md        # PracticeSession, preferences
├── quickstart.md        # PWA setup, dark mode
├── contracts/           # Hook and component interfaces
└── tasks.md             # Implementation tasks
```

### Source Code (additions)

```text
src/
├── components/
│   ├── Timer.tsx               # Countdown timer display
│   ├── TimerControls.tsx       # Play/pause/reset buttons
│   ├── TimerPresets.tsx        # 25/45/60/custom selector
│   ├── PracticeSession.tsx     # Timed practice flow
│   ├── ExportDialog.tsx        # Export data modal
│   ├── ImportDialog.tsx        # Import data modal
│   ├── ThemeToggle.tsx         # Light/dark toggle button
│   ├── ShortcutHelp.tsx        # Keyboard shortcut overlay
│   └── InstallPrompt.tsx       # PWA install banner
├── hooks/
│   ├── useTimer.ts             # Timer state and controls
│   ├── useTheme.ts             # Theme management
│   ├── useKeyboardShortcuts.ts # Global shortcut handler
│   ├── useExport.ts            # Export functionality
│   ├── useImport.ts            # Import functionality
│   └── usePWA.ts               # PWA install state
├── lib/
│   ├── export.ts               # Data serialization
│   ├── import.ts               # Data deserialization + validation
│   ├── timer.ts                # Timer logic (pure functions)
│   └── preferences.ts          # localStorage wrapper
├── pages/
│   └── Practice.tsx            # Timed practice page
├── styles/
│   └── themes.css              # CSS variables for theming
├── sw.ts                       # Service worker (generated)
└── manifest.json               # PWA manifest
```

## Complexity Tracking

*No constitution violations. Standard implementation.*
