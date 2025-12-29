````markdown
# Tasks: Timed Practice & Polish

**Input**: Design documents from `/specs/004-practice-polish/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Tests are OPTIONAL - included only if explicitly requested. These tasks focus on implementation.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and PWA configuration

- [X] T001 Install PWA dependencies: `vite-plugin-pwa` and `workbox-window` in package.json
- [X] T002 Configure vite-plugin-pwa in vite.config.ts with manifest and workbox settings
- [X] T003 [P] Create PWA icons (pwa-192x192.png, pwa-512x512.png, apple-touch-icon.png) in public/
- [X] T004 [P] Add theme initialization script to index.html (before </head>) to prevent flash
- [X] T005 Configure Tailwind dark mode with class strategy in tailwind.config.js

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T006 Add v4 schema to lib/db.ts with timeLogs table for ProblemTimeLog entity
- [X] T007 [P] Create TypeScript interfaces for PracticeSession, TimeSession, ProblemTimeLog, UserPreferences, ExportData, ImportResult in src/types/index.ts
- [X] T008 [P] Create lib/preferences.ts with getPreferences, setPreferences, resetPreferences for localStorage
- [X] T009 [P] Create lib/timer.ts with pure timer utility functions (formatTime, parseTime, createTimerState)
- [X] T010 Create hooks/usePreferences.ts for user preferences management
- [X] T011 [P] Create context/ThemeContext.tsx with ThemeProvider and useThemeContext hook
- [X] T012 Update deleteProblemCascade in lib/db.ts to include timeLogs table cascade deletion

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Timed Practice Session (Priority: P1) 🎯 MVP

**Goal**: Users can practice under time pressure with countdown timer, pause/resume, and time tracking per problem

**Independent Test**: Start a timed session, work through problems, verify timer countdown, pause/resume, and time logging works

### Implementation for User Story 1

- [X] T013 [P] [US1] Create lib/timeLog.ts with logTime and getTimeForProblem functions
- [X] T014 [US1] Create hooks/useTimer.ts with requestAnimationFrame-based timer (start, pause, resume, reset, elapsed, remaining)
- [X] T015 [US1] Create hooks/useTimeLog.ts for tracking time spent on problems (startTracking, stopTracking, getTimeForProblem)
- [X] T016 [P] [US1] Create components/Timer.tsx with circular progress display and MM:SS format
- [X] T017 [P] [US1] Create components/TimerControls.tsx with play/pause/reset buttons
- [X] T018 [P] [US1] Create components/TimerPresets.tsx with 25/45/60 minute preset buttons
- [X] T019 [US1] Create components/PracticeSession.tsx combining Timer, TimerControls, TimerPresets with problem display
- [X] T020 [US1] Create pages/Practice.tsx with timed practice flow including problem selection and session summary
- [X] T021 [US1] Add /practice route to App.tsx router configuration
- [X] T022 [US1] Add "Timed Practice" navigation link to layout/navigation components
- [X] T023 [US1] Implement "Reveal Template" functionality in PracticeSession.tsx using existing TemplateSelector
- [X] T023b [US1] Implement "Reveal Solution" functionality in PracticeSession.tsx using existing solution display components
- [X] T024 [US1] Implement timer expiration notification with option to continue or end session
- [X] T024b [US1] Handle browser tab close during timed session (save state to sessionStorage for recovery)
- [X] T024c [US1] Implement session recovery on page reload (restore timer state from sessionStorage)

**Checkpoint**: User Story 1 should be fully functional - timed practice sessions work with time tracking

---

## Phase 4: User Story 2 - Export/Import Data (Priority: P1)

**Goal**: Users can back up data to JSON and restore from backup for data portability

**Independent Test**: Export data, clear IndexedDB, import from exported file, verify all data restored

### Tests for User Story 2 (Constitution Principle II: Test-First for Data Layer)

- [X] T025a [P] [US2] Write tests for lib/export.ts (checksum generation, all tables included, valid JSON output)
- [X] T026a [P] [US2] Write tests for lib/import.ts (validation, checksum verification, version handling, error cases)

### Implementation for User Story 2

- [X] T025 [P] [US2] Create lib/export.ts with exportAllData function including checksum generation
- [X] T026 [P] [US2] Create lib/import.ts with importData, validateExport functions and checksum verification
- [X] T027 [US2] Create hooks/useExport.ts with exportData, isExporting state, getExportPreview
- [X] T028 [US2] Create hooks/useImport.ts with importData, validateFile, isImporting state
- [X] T029 [P] [US2] Create components/ExportDialog.tsx with export preview and download trigger
- [X] T030 [P] [US2] Create components/ImportDialog.tsx with file picker, validation results, and import trigger
- [X] T031 [US2] Add export/import buttons to settings page and integrate dialogs
- [X] T032 [US2] Implement import overwrite confirmation dialog using existing ConfirmDialog component
- [X] T032b [US2] Handle import version mismatch (show warning for newer/older export versions, attempt migration)

**Checkpoint**: User Stories 1 AND 2 should both work independently - practice sessions and data backup functional

---

## Phase 5: User Story 3 - Dark Mode (Priority: P2)

**Goal**: Users can toggle dark/light theme with persistence and system preference detection

**Independent Test**: Toggle dark mode, refresh page, verify preference persists and all components render correctly

### Implementation for User Story 3

- [ ] T033 [US3] Create hooks/useTheme.ts implementing theme toggle with localStorage persistence and system detection
- [ ] T034 [US3] Create components/ThemeToggle.tsx with light/dark/system dropdown or toggle button
- [ ] T035 [US3] Add dark: variants to all existing components (audit and update Tailwind classes)
- [ ] T036 [US3] Configure CodeMirror theme switching in SolutionEditor.tsx (githubLight/githubDark based on theme)
- [ ] T037 [US3] Add theme transitions CSS in src/index.css for smooth theme changes
- [ ] T038 [US3] Add ThemeToggle to navigation/header component

**Checkpoint**: User Stories 1, 2, AND 3 should all work independently - dark mode functional across app

---

## Phase 6: User Story 4 - Keyboard Shortcuts (Priority: P2)

**Goal**: Power users can navigate efficiently with keyboard shortcuts for common actions

**Independent Test**: Press `?` to see shortcuts, test rating shortcuts 1/2/3/4 in review, Space for timer pause

### Implementation for User Story 4

- [ ] T039 [P] [US4] Define SHORTCUTS constant with all shortcut definitions in src/types/index.ts or lib/shortcuts.ts
- [ ] T040 [US4] Create hooks/useKeyboardShortcuts.ts with global keyboard event handler and condition support
- [ ] T041 [US4] Create context/ShortcutsContext.tsx with ShortcutsProvider for global shortcut registration
- [ ] T042 [US4] Create components/ShortcutHelp.tsx modal showing grouped shortcuts by context
- [ ] T043 [US4] Register global shortcuts in App.tsx (`?` for help, `/` for search, `Escape` for close)
- [ ] T044 [US4] Add rating shortcuts (1/2/3/4) to ReviewSession.tsx for Again/Hard/Good/Easy
- [ ] T045 [US4] Add Space shortcut to Practice.tsx for timer pause/resume
- [ ] T046 [US4] Add `n` shortcut to Problems.tsx for new problem creation
- [ ] T047 [US4] Add `r` shortcut to ReviewSession.tsx for reveal solution

**Checkpoint**: User Stories 1-4 should all work independently - keyboard shortcuts enhance all features

---

## Phase 7: User Story 5 - PWA Support (Priority: P3)

**Goal**: App can be installed and works fully offline like a native app

**Independent Test**: Install PWA from browser, disconnect internet, verify all features work offline

### Implementation for User Story 5

- [ ] T048 [US5] Create hooks/usePWA.ts with install prompt handling, isInstallable, isInstalled, isOnline states
- [ ] T049 [P] [US5] Create components/InstallPrompt.tsx banner for PWA installation
- [ ] T050 [P] [US5] Create components/OfflineIndicator.tsx showing offline/online status
- [ ] T051 [US5] Add InstallPrompt to App.tsx layout (show when installable and not dismissed)
- [ ] T052 [US5] Add OfflineIndicator to navigation/header component
- [ ] T053 [US5] Implement service worker update notification with reload prompt
- [ ] T054 [US5] Configure workbox runtime caching for fonts and static assets in vite.config.ts

**Checkpoint**: User Stories 1-5 should all work - PWA installation and offline mode functional

---

## Phase 8: User Story 6 - Mobile Responsiveness Polish (Priority: P3)

**Goal**: App is fully usable on mobile devices with touch-friendly UI

**Independent Test**: Open app at 320px viewport width, verify all features usable with touch

### Implementation for User Story 6

- [ ] T055 [US6] Audit and update Timer component for mobile (large touch targets, responsive sizing)
- [ ] T056 [P] [US6] Audit and update RatingButtons component for mobile (full-width on small screens)
- [ ] T057 [P] [US6] Audit and update ProblemCard for mobile (vertical stack, touch-friendly)
- [ ] T058 [P] [US6] Audit and update navigation for mobile (hamburger menu or bottom nav)
- [ ] T059 [US6] Add viewport meta tags to index.html if not present
- [ ] T060 [US6] Test and fix any overflow/scrolling issues on small viewports

**Checkpoint**: All user stories complete - app is production-ready

---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories and final cleanup

- [ ] T061 Create pages/Settings.tsx combining theme, shortcuts, export/import, preferences sections
- [ ] T062 Add /settings route to App.tsx router configuration
- [ ] T063 Add Settings navigation link to layout/navigation
- [ ] T064 [P] Add loading states to export/import operations
- [ ] T065 [P] Add error boundary and error states for failed operations
- [ ] T066 Run quickstart.md validation checklist
- [ ] T067 Verify final bundle size is <500KB gzipped
- [ ] T068 Run Lighthouse PWA audit and address any issues (target 90+ score)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phases 3-8)**: All depend on Foundational phase completion
  - User stories can proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Phase 9)**: Depends on all desired user stories being complete

### User Story Dependencies

| Story | Priority | Can Start After | Dependencies on Other Stories |
|-------|----------|-----------------|-------------------------------|
| US1 (Timed Practice) | P1 | Foundational | None |
| US2 (Export/Import) | P1 | Foundational | None |
| US3 (Dark Mode) | P2 | Foundational | None |
| US4 (Keyboard Shortcuts) | P2 | Foundational | Can integrate with US1 (timer pause) |
| US5 (PWA) | P3 | Foundational | None |
| US6 (Mobile Polish) | P3 | Foundational | Better to complete after US1-US3 for full audit |

### Within Each User Story

- Lib utilities before hooks
- Hooks before components
- Components before pages
- Core implementation before integration

### Parallel Opportunities

**Setup Phase (all [P] tasks):**
- T003, T004 can run in parallel

**Foundational Phase (all [P] tasks):**
- T007, T008, T009, T011 can run in parallel

**User Story 1 (all [P] tasks):**
- T013, T016, T017, T018 can run in parallel

**User Story 2 (all [P] tasks):**
- T025, T026, T029, T030 can run in parallel

**User Story 4 (all [P] tasks):**
- T039 can run in parallel with other stories

**User Story 5 (all [P] tasks):**
- T049, T050 can run in parallel

**User Story 6 (all [P] tasks):**
- T056, T057, T058 can run in parallel

---

## Parallel Example: User Story 1 Launch

```bash
# Launch all parallel tasks for User Story 1 together:
Task: "T013 - Create lib/timeLog.ts"
Task: "T016 - Create components/Timer.tsx"
Task: "T017 - Create components/TimerControls.tsx"  
Task: "T018 - Create components/TimerPresets.tsx"

# Then sequential tasks that depend on above:
Task: "T014 - Create hooks/useTimer.ts"
Task: "T015 - Create hooks/useTimeLog.ts"
Task: "T019 - Create components/PracticeSession.tsx"
# ... etc
```

---

## Parallel Example: User Stories 1 & 2 Simultaneously

```bash
# Developer A works on User Story 1:
Task: "T013-T024 (Timed Practice)"

# Developer B works on User Story 2 in parallel:
Task: "T025-T032 (Export/Import)"

# Both stories are independently testable
```

---

## Implementation Strategy

### MVP First (User Story 1 + 2)

1. Complete Phase 1: Setup (T001-T005)
2. Complete Phase 2: Foundational (T006-T012) - CRITICAL
3. Complete Phase 3: User Story 1 - Timed Practice (T013-T024)
4. Complete Phase 4: User Story 2 - Export/Import (T025-T032)
5. **STOP and VALIDATE**: Both P1 stories independently testable
6. Deploy MVP with timed practice and data backup

### Incremental Delivery

1. **Setup + Foundational** → Foundation ready
2. **Add US1** → Timed practice works → Deploy (MVP-1!)
3. **Add US2** → Data export/import works → Deploy (MVP-2!)
4. **Add US3** → Dark mode works → Deploy
5. **Add US4** → Keyboard shortcuts work → Deploy
6. **Add US5** → PWA installable → Deploy
7. **Add US6** → Mobile polished → Deploy (Full release!)

### Parallel Team Strategy

With 2 developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 (Timed Practice)
   - Developer B: User Story 2 (Export/Import)
3. Then:
   - Developer A: User Story 3 (Dark Mode)
   - Developer B: User Story 4 (Keyboard Shortcuts)
4. Finally:
   - Developer A: User Story 5 (PWA)
   - Developer B: User Story 6 (Mobile Polish)
5. Both tackle Polish phase together

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- This phase builds on existing infrastructure from phases 001-003
- Many components (ConfirmDialog, TemplateSelector, RatingButtons) already exist and should be reused

````