# Research: App Onboarding

**Feature**: 005-onboarding  
**Date**: 2024-12-29  
**Status**: Complete

## Research Tasks

### 1. Onboarding Library Selection

**Question**: Which React onboarding/tour library best fits this project's needs?

**Research Findings**:

| Library | Bundle Size | React 19 | TypeScript | Benchmark | Active |
|---------|-------------|----------|------------|-----------|--------|
| react-joyride | ~15KB gzipped | ✅ | ✅ | 87.7 | ✅ |
| @reactour/tour | ~12KB gzipped | ✅ | ✅ | N/A | ✅ |
| intro.js-react | ~20KB gzipped | ⚠️ | ⚠️ | N/A | ⚠️ |
| shepherd.js | ~30KB gzipped | ✅ | ✅ | N/A | ✅ |

**Decision**: **react-joyride**

**Rationale**:
- Highest benchmark score (87.7) with High source reputation
- Built-in spotlight overlay effect matching FR-003
- Built-in scroll-to-element behavior matching FR-007
- Excellent callback API for handling step navigation and completion
- Active maintenance (gilbarbara/react-joyride)
- Good TypeScript support with exported types (`CallBackProps`, `Step`, `ACTIONS`, `STATUS`, `EVENTS`)
- Controlled mode available for external state management

**Alternatives Considered**:
- **@reactour/tour**: Slightly smaller but less comprehensive documentation, lower snippet coverage
- **shepherd.js**: Larger bundle size, more complex API for simple use case
- **Custom implementation**: Would require significant effort for spotlight effects, scroll handling, positioning

---

### 2. State Persistence Strategy

**Question**: How to persist onboarding completion state across sessions?

**Research Findings**:

The app already has `UserPreferences` in `lib/preferences.ts` using localStorage. Current structure:

```typescript
interface UserPreferences {
  theme: Theme;
  defaultTimerMinutes: number;
  keyboardShortcutsEnabled: boolean;
  showInstallPrompt: boolean;
}
```

**Decision**: Extend `UserPreferences` with `onboardingCompleted: boolean`

**Rationale**:
- Consistent with existing preference storage pattern
- Synchronizes across tabs via existing `storage` event listener in `usePreferences`
- Simple boolean flag is sufficient (no need to track partial completion)
- Easy to reset via Settings page

**Alternatives Considered**:
- **IndexedDB via Dexie**: Overkill for a single boolean flag
- **Separate localStorage key**: Inconsistent with existing patterns

---

### 3. Tour Step Targeting Strategy

**Question**: How to reliably target UI elements for tour steps?

**Research Findings**:

react-joyride supports:
- CSS selectors (class, id, attribute)
- Direct element references
- Center placement for modal-only steps (no target)

Current Home page structure analysis:

| Step | Target Element | Current Selector |
|------|---------------|------------------|
| 1. Welcome | No target (modal) | `placement: 'center'` |
| 2. View Problems | Link button | Need to add `data-tour="view-problems"` |
| 3. Timed Practice | Link button | Need to add `data-tour="timed-practice"` |
| 4. Progress Ladder | Link button | Need to add `data-tour="progress-ladder"` |
| 5. Dashboard stats | Stats section | Need to add `data-tour="dashboard-stats"` |
| 6. Due Today | DueToday component | Need to add `data-tour="due-today"` |

**Decision**: Use `data-tour="step-name"` attributes for targeting

**Rationale**:
- Decoupled from styling (won't break if class names change)
- Semantic and self-documenting
- Standard pattern for UI automation and testing
- Joyride supports attribute selectors: `[data-tour="step-name"]`

**Alternatives Considered**:
- **IDs**: Works but pollutes the ID namespace
- **Classes**: Coupling to styling, harder to maintain
- **Refs**: Requires prop drilling, more complex

---

### 4. Mobile Responsiveness

**Question**: How to ensure tooltips display correctly on mobile devices?

**Research Findings**:

react-joyride features:
- Automatic tooltip repositioning when near viewport edges
- `scrollOffset` prop to control scroll position (default: 20px)
- `spotlightPadding` for spacing around highlighted elements
- `disableScrolling` per-step option
- Responsive tooltip width via `styles.options.width`

**Decision**: Configure responsive tooltip styling

```typescript
styles: {
  options: {
    width: undefined, // Auto-width, max based on viewport
    zIndex: 10000,
  },
  tooltip: {
    maxWidth: '90vw', // Never exceed viewport
  }
}
```

**Rationale**:
- Joyride handles positioning automatically
- Custom max-width ensures mobile compatibility
- High z-index ensures visibility over existing UI

---

### 5. Edge Case Handling

**Question**: How to handle missing elements, navigation during tour, and browser resize?

**Research Findings**:

react-joyride provides:
- `EVENTS.TARGET_NOT_FOUND` event when element is missing
- Tour automatically pauses if target not found
- Built-in resize observer for tooltip repositioning
- `continuous` mode keeps tour active between steps

**Decision**: Implement callback handlers for edge cases

```typescript
const handleCallback = (data: CallBackProps) => {
  const { type, status } = data;
  
  // Handle missing target - skip to next step
  if (type === EVENTS.TARGET_NOT_FOUND) {
    // Automatically advances in continuous mode
  }
  
  // Handle completion/skip
  if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
    markOnboardingComplete();
  }
};
```

**Rationale**:
- Joyride's built-in behavior handles most edge cases
- Simple callback for persisting completion state
- No custom resize handling needed (built-in)

---

### 6. Restart Tour from Settings

**Question**: How to implement the "Restart Tour" functionality?

**Research Findings**:

Settings page already has a pattern for action cards with buttons (Export/Import).

**Decision**: Add "Restart Tour" card in Settings that:
1. Resets `onboardingCompleted` to `false` in preferences
2. Navigates to Home page (`/`)
3. Tour auto-starts because `!onboardingCompleted`

**Rationale**:
- Follows existing Settings UI patterns
- Simple implementation with existing hooks
- Clear user feedback via navigation

---

## Summary of Decisions

| Topic | Decision | Key Rationale |
|-------|----------|---------------|
| Library | react-joyride | Best benchmark, TypeScript, active maintenance |
| Storage | UserPreferences extension | Consistent with existing patterns |
| Targeting | data-tour attributes | Decoupled, semantic, maintainable |
| Mobile | Joyride defaults + max-width | Built-in responsiveness |
| Edge cases | Joyride callbacks | Built-in handling, simple completion logic |
| Restart | Settings card + navigate | Follows existing patterns |

## Dependencies to Install

```bash
pnpm add react-joyride
```

## Types to Import

```typescript
import Joyride, {
  ACTIONS,
  CallBackProps,
  EVENTS,
  STATUS,
  Step,
} from 'react-joyride';
```
