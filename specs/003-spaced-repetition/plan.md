# Implementation Plan: Spaced Repetition System

**Branch**: `003-spaced-repetition` | **Date**: 2025-12-27 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/003-spaced-repetition/spec.md`
**Depends On**: `001-mvp-project-setup`, `002-solution-journal`

## Summary

Implement the SM-2 spaced repetition algorithm for long-term problem retention. Features include automatic review scheduling, a "Due Today" queue, review session flow with rating system, streak tracking, and a progress dashboard with weekly statistics charts using Recharts.

## Technical Context

**Language/Version**: TypeScript ^5.0.0 (strict mode enabled)  
**Primary Dependencies**: Recharts ^2.0.0 (charts), date-fns (date calculations), existing stack  
**Storage**: IndexedDB via Dexie.js (extends schema with reviews table)  
**Testing**: Vitest + React Testing Library, fake-indexeddb  
**Target Platform**: Modern browsers (320px to 1920px responsive)  
**Project Type**: Single-page web application (React SPA)  
**Performance Goals**: SM-2 calculation <10ms, queue load <200ms, chart render <500ms  
**Constraints**: Recharts adds ~50KB, bundle still under 500KB target  
**Scale/Scope**: All problems can have review data, track 30+ days of history

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### I. Code Quality Standards

| Requirement | Status | Notes |
|-------------|--------|-------|
| TypeScript strict mode | ✅ PASS | Inherited |
| Component isolation | ✅ PASS | ReviewCard, ReviewSession, Dashboard, StatsChart separate |
| Custom hooks for business logic | ✅ PASS | useReviewQueue, useStreak, useStats hooks |
| Explicit type annotations | ✅ PASS | Review, ReviewRating, ReviewStats interfaces |
| Max 200 lines per file | ✅ PASS | SM-2 logic extracted to lib/sm2.ts |
| No dead code | ✅ PASS | Will enforce |

### II. Testing Discipline

| Requirement | Status | Notes |
|-------------|--------|-------|
| Test-first for data layer | ✅ PASS | SM-2 algorithm MUST have tests before implementation |
| Component tests required | ✅ PASS | ReviewSession, Dashboard get tests |
| Edge case coverage | ✅ PASS | Empty queue, streak break, same-day review |
| Test file collocation | ✅ PASS | sm2.test.ts alongside sm2.ts |
| No mocking IndexedDB | ✅ PASS | fake-indexeddb continues |

### III. User Experience Consistency

| Requirement | Status | Notes |
|-------------|--------|-------|
| Tailwind CSS only | ✅ PASS | Recharts uses SVG, minimal custom styling needed |
| Loading & error states | ✅ PASS | Dashboard loading, empty queue state |
| Keyboard navigation | ✅ PASS | Rating buttons keyboard-accessible |
| Responsive (320px-1920px) | ✅ PASS | Dashboard and charts responsive |
| Data persistence feedback | ✅ PASS | Immediate visual feedback on rating |
| Confirmation for destructive | ✅ PASS | Not applicable (no destructive review actions) |

**Gate Status**: ✅ ALL GATES PASS

## Project Structure

### Documentation (this feature)

```text
specs/003-spaced-repetition/
├── plan.md              # This file
├── research.md          # SM-2 algorithm, date handling
├── data-model.md        # Review entity, stats aggregation
├── quickstart.md        # Integration guide
├── contracts/           # Hook and component interfaces
└── tasks.md             # Implementation tasks
```

### Source Code (additions)

```text
src/
├── components/
│   ├── ReviewCard.tsx          # Problem card in review mode
│   ├── ReviewSession.tsx       # Review session flow container
│   ├── RatingButtons.tsx       # Again/Hard/Good/Easy buttons
│   ├── DueToday.tsx            # Due today queue list
│   ├── StreakCounter.tsx       # Current streak display
│   ├── WeeklyStatsChart.tsx    # Recharts weekly review chart
│   ├── SuggestedNext.tsx       # Next problem recommendation
│   └── Dashboard.tsx           # Main dashboard page component
├── hooks/
│   ├── useReviewQueue.ts       # Due today queue management
│   ├── useReview.ts            # Individual review operations
│   ├── useStreak.ts            # Streak calculation
│   └── useStats.ts             # Review statistics
├── lib/
│   ├── sm2.ts                  # SM-2 algorithm implementation
│   ├── streak.ts               # Streak calculation logic
│   ├── stats.ts                # Stats aggregation
│   └── db.ts                   # Extended with reviews table
└── pages/
    ├── Dashboard.tsx           # Home/Dashboard page
    └── Review.tsx              # Active review session page
```

## Complexity Tracking

*No constitution violations. Standard implementation.*
