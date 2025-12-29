# Internal Contracts: App Onboarding

**Feature**: 005-onboarding  
**Date**: 2024-12-29  
**Type**: Internal Component APIs (no REST/GraphQL - client-side only feature)

---

## useOnboarding Hook Contract

### Interface

```typescript
// hooks/useOnboarding.ts

export interface UseOnboardingReturn {
  /** Whether the tour is currently running */
  isRunning: boolean;
  
  /** Current step index (0-based) */
  stepIndex: number;
  
  /** Whether user has completed/skipped the onboarding */
  isCompleted: boolean;
  
  /** Array of step definitions for Joyride */
  steps: OnboardingStep[];
  
  /** Start the tour from the beginning */
  startTour: () => void;
  
  /** Stop the tour and mark as complete */
  completeTour: () => void;
  
  /** Handle Joyride callback events */
  handleCallback: (data: CallBackProps) => void;
  
  /** Go to a specific step */
  goToStep: (index: number) => void;
}

export function useOnboarding(): UseOnboardingReturn;
```

### Behavior Contract

| Method | Preconditions | Postconditions | Side Effects |
|--------|--------------|----------------|--------------|
| `startTour()` | None | `isRunning: true`, `stepIndex: 0`, `isCompleted: false` | Updates localStorage |
| `completeTour()` | Tour is running | `isRunning: false`, `isCompleted: true` | Updates localStorage |
| `handleCallback(data)` | Tour is running | State updated based on Joyride events | May update localStorage on finish/skip |
| `goToStep(index)` | `0 <= index < steps.length` | `stepIndex: index` | None |

### Callback Event Handling

```typescript
handleCallback(data: CallBackProps) {
  const { action, index, status, type } = data;
  
  // Step navigation
  if (type === EVENTS.STEP_AFTER || type === EVENTS.TARGET_NOT_FOUND) {
    const nextIndex = index + (action === ACTIONS.PREV ? -1 : 1);
    setStepIndex(nextIndex);
  }
  
  // Tour completion
  if (status === STATUS.FINISHED || status === STATUS.SKIPPED) {
    completeTour();
  }
}
```

---

## OnboardingTour Component Contract

### Interface

```typescript
// components/OnboardingTour.tsx

export interface OnboardingTourProps {
  /** Whether to auto-start the tour (default: based on preferences) */
  autoStart?: boolean;
}

export function OnboardingTour(props: OnboardingTourProps): JSX.Element | null;
```

### Behavior Contract

| Condition | Renders |
|-----------|---------|
| `!isCompleted && autoStart !== false` | `<Joyride>` with tour steps |
| `isCompleted` | `null` (nothing) |
| `autoStart === false` | `null` until `startTour()` called |

### Joyride Configuration

```typescript
<Joyride
  steps={steps}
  run={isRunning}
  stepIndex={stepIndex}
  continuous={true}
  showSkipButton={true}
  showProgress={true}
  scrollToFirstStep={true}
  scrollOffset={100}
  disableOverlayClose={true}
  spotlightPadding={8}
  callback={handleCallback}
  styles={{
    options: {
      primaryColor: 'hsl(var(--primary))',
      textColor: 'hsl(var(--foreground))',
      backgroundColor: 'hsl(var(--background))',
      overlayColor: 'rgba(0, 0, 0, 0.5)',
      zIndex: 10000,
    },
    tooltip: {
      borderRadius: 'var(--radius)',
    },
    buttonNext: {
      backgroundColor: 'hsl(var(--primary))',
    },
    buttonBack: {
      color: 'hsl(var(--muted-foreground))',
    },
  }}
  locale={{
    back: 'Previous',
    close: 'Close',
    last: 'Finish',
    next: 'Next',
    skip: 'Skip Tour',
  }}
/>
```

---

## Settings Integration Contract

### Restart Tour Button

```typescript
// In pages/Settings.tsx

interface RestartTourCardProps {
  onRestart: () => void;
}

// Behavior:
// 1. Display card with tour restart option
// 2. On click: reset onboardingCompleted to false
// 3. Navigate to "/" (home page)
// 4. Tour auto-starts on Home page load
```

### Implementation Pattern

```typescript
const { updatePreference } = usePreferences();
const navigate = useNavigate();

const handleRestartTour = () => {
  updatePreference('onboardingCompleted', false);
  navigate('/');
};
```

---

## Data Tour Attributes Contract

Elements on Home page that need `data-tour` attributes for targeting:

| Attribute Value | Element | Location |
|-----------------|---------|----------|
| `data-tour="view-problems"` | "View Problems" Button | Home.tsx |
| `data-tour="timed-practice"` | "Timed Practice" Button | Home.tsx |
| `data-tour="progress-ladder"` | "Progress Ladder" Button | Home.tsx |
| `data-tour="dashboard-stats"` | Stats section container | Dashboard.tsx |
| `data-tour="due-today"` | DueToday wrapper | Dashboard.tsx |

### Example Usage

```tsx
// Home.tsx
<Button data-tour="view-problems" size="lg" asChild>
  <Link to="/problems">View Problems</Link>
</Button>

// Dashboard.tsx
<div data-tour="dashboard-stats" className="flex gap-6">
  {/* Stats content */}
</div>

<div data-tour="due-today">
  <DueToday items={dueToday} />
</div>
```

---

## Type Exports Contract

### From types/index.ts

```typescript
// NEW: Add to existing types file

/** Extended Joyride step with ID for tracking */
export interface OnboardingStep extends Step {
  id: string;
}

// MODIFIED: Add to UserPreferences
export interface UserPreferences {
  theme: Theme;
  defaultTimerMinutes: number;
  keyboardShortcutsEnabled: boolean;
  showInstallPrompt: boolean;
  onboardingCompleted: boolean;  // NEW
}
```

### From lib/preferences.ts

```typescript
// MODIFIED: Update DEFAULT_PREFERENCES
export const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'system',
  defaultTimerMinutes: 45,
  keyboardShortcutsEnabled: true,
  showInstallPrompt: true,
  onboardingCompleted: false,  // NEW
};
```
