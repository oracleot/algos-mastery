# Data Model: App Onboarding

**Feature**: 005-onboarding  
**Date**: 2024-12-29  
**Status**: Complete

## Entities

### OnboardingStep (Static Configuration)

Tour step definition used by react-joyride. Stored in `lib/onboarding-steps.ts` as static configuration.

```typescript
import type { Step } from 'react-joyride';

/**
 * Extended step type with additional metadata
 */
export interface OnboardingStep extends Step {
  /** Step identifier for tracking */
  id: string;
}
```

**Fields**:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | string | ✅ | Unique step identifier |
| target | string \| Element | ✅ | CSS selector or element reference |
| content | ReactNode | ✅ | Tooltip content (title + description) |
| placement | string | ❌ | Tooltip position ('center', 'bottom', 'top', 'left', 'right') |
| disableBeacon | boolean | ❌ | Skip pulsing beacon, show tooltip immediately |
| spotlightPadding | number | ❌ | Padding around highlighted element |
| title | string | ❌ | Step title displayed in tooltip |

**Validation Rules**:
- `id` must be unique across all steps
- `target` must be valid CSS selector or 'body' for centered modals
- `content` must be non-empty

---

### UserPreferences (Modified)

Extended to include onboarding state. Already persisted in localStorage.

```typescript
export interface UserPreferences {
  theme: Theme;
  defaultTimerMinutes: number;
  keyboardShortcutsEnabled: boolean;
  showInstallPrompt: boolean;
  /** Whether user has completed or skipped the onboarding tour */
  onboardingCompleted: boolean;  // NEW FIELD
}
```

**New Field**:

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| onboardingCompleted | boolean | `false` | True when tour finished or skipped |

**State Transitions**:
- `false` → `true`: When tour completed OR skipped
- `true` → `false`: When user clicks "Restart Tour" in Settings

---

### OnboardingState (Runtime State)

In-memory state for managing active tour. Managed by `useOnboarding` hook.

```typescript
export interface OnboardingState {
  /** Whether the tour is currently running */
  isRunning: boolean;
  /** Current step index (0-based) */
  stepIndex: number;
  /** Whether tour has been completed/skipped (synced with preferences) */
  isCompleted: boolean;
}
```

**Fields**:

| Field | Type | Description |
|-------|------|-------------|
| isRunning | boolean | Tour overlay is visible and active |
| stepIndex | number | Current step (0-5 for 6 steps) |
| isCompleted | boolean | Mirrors `onboardingCompleted` from preferences |

**State Transitions**:

```
Initial Load:
  preferences.onboardingCompleted === false → isRunning: true, stepIndex: 0
  preferences.onboardingCompleted === true  → isRunning: false

During Tour:
  Next clicked    → stepIndex++
  Previous clicked → stepIndex--
  Skip clicked    → isRunning: false, isCompleted: true
  Finish clicked  → isRunning: false, isCompleted: true

From Settings:
  Restart Tour clicked → isCompleted: false, isRunning: true, stepIndex: 0
```

---

## Step Configuration Data

Static configuration in `lib/onboarding-steps.ts`:

```typescript
export const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    id: 'welcome',
    target: 'body',
    placement: 'center',
    disableBeacon: true,
    title: 'Welcome to Algorithms Mastery Tracker',
    content: 'Track your algorithm problem-solving journey with spaced repetition. Let me show you around!',
  },
  {
    id: 'view-problems',
    target: '[data-tour="view-problems"]',
    placement: 'bottom',
    title: 'Browse Your Problems',
    content: 'Add and manage algorithm problems from LeetCode, HackerRank, or any source.',
  },
  {
    id: 'timed-practice',
    target: '[data-tour="timed-practice"]',
    placement: 'bottom',
    title: 'Timed Practice Sessions',
    content: 'Challenge yourself with timed problem-solving to simulate interview conditions.',
  },
  {
    id: 'progress-ladder',
    target: '[data-tour="progress-ladder"]',
    placement: 'bottom',
    title: 'Track Your Progress',
    content: 'Follow a structured 15-topic learning path and unlock new topics as you master each one.',
  },
  {
    id: 'dashboard-stats',
    target: '[data-tour="dashboard-stats"]',
    placement: 'bottom',
    title: 'Your Dashboard',
    content: 'View your streak, weekly stats, and daily averages at a glance.',
  },
  {
    id: 'due-today',
    target: '[data-tour="due-today"]',
    placement: 'top',
    title: 'Spaced Repetition Reviews',
    content: 'The app schedules reviews using the SM-2 algorithm to help you retain what you have learned.',
  },
];
```

---

## Relationships

```
┌─────────────────────┐
│  UserPreferences    │
│  (localStorage)     │
├─────────────────────┤
│ onboardingCompleted │◄───────┐
└─────────────────────┘        │
                               │ syncs
                               │
┌─────────────────────┐        │
│  OnboardingState    │────────┘
│  (in-memory)        │
├─────────────────────┤
│ isRunning           │
│ stepIndex           │
│ isCompleted         │
└─────────────────────┘
         │
         │ uses
         ▼
┌─────────────────────┐
│  ONBOARDING_STEPS   │
│  (static config)    │
├─────────────────────┤
│ Step[]              │
└─────────────────────┘
```

---

## Data Access Patterns

### Read Operations

| Operation | Source | Hook |
|-----------|--------|------|
| Get onboarding completion status | localStorage | `useOnboarding` → `usePreferences` |
| Get current step | In-memory state | `useOnboarding` |
| Get step definitions | Static import | Direct import from `lib/onboarding-steps` |

### Write Operations

| Operation | Target | Method |
|-----------|--------|--------|
| Mark tour complete | localStorage | `usePreferences.updatePreference('onboardingCompleted', true)` |
| Restart tour | localStorage | `usePreferences.updatePreference('onboardingCompleted', false)` |
| Update current step | In-memory | `setStepIndex(n)` |

---

## Migration Notes

### Default Value Handling

When `onboardingCompleted` field is missing from existing preferences:
- `DEFAULT_PREFERENCES` includes `onboardingCompleted: false`
- Spread operator in `getPreferences()` ensures backward compatibility:

```typescript
return { ...DEFAULT_PREFERENCES, ...JSON.parse(stored) };
```

This means existing users will see the tour on their next visit (expected behavior for new feature rollout).
