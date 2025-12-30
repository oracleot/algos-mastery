# Quickstart: App Onboarding Implementation

**Feature**: 005-onboarding  
**Date**: 2024-12-29  
**Estimated Time**: 4-6 hours

## Prerequisites

- Node.js 18+ and pnpm installed
- Project cloned and dependencies installed
- Feature branch created: `005-onboarding`

## Quick Setup

### 1. Install Dependency

```bash
pnpm add react-joyride
```

### 2. Update Types

Add to `src/types/index.ts`:

```typescript
import type { Step } from 'react-joyride';

// Add to existing UserPreferences interface
export interface UserPreferences {
  // ... existing fields
  onboardingCompleted: boolean;  // NEW
}

// NEW: Onboarding step type
export interface OnboardingStep extends Step {
  id: string;
}
```

### 3. Update Preferences

In `src/lib/preferences.ts`, add to `DEFAULT_PREFERENCES`:

```typescript
export const DEFAULT_PREFERENCES: UserPreferences = {
  // ... existing fields
  onboardingCompleted: false,  // NEW
};
```

### 4. Create Step Definitions

Create `src/lib/onboarding-steps.ts`:

```typescript
import type { OnboardingStep } from '@/types';

export const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    id: 'welcome',
    target: 'body',
    placement: 'center',
    disableBeacon: true,
    title: 'Welcome to Algorithms Mastery Tracker',
    content: 'Track your algorithm problem-solving journey with spaced repetition. Let me show you around!',
  },
  // ... (see data-model.md for full list)
];
```

### 5. Create useOnboarding Hook

Create `src/hooks/useOnboarding.ts`:

```typescript
import { useState, useCallback } from 'react';
import { ACTIONS, EVENTS, STATUS, type CallBackProps } from 'react-joyride';
import { usePreferences } from './usePreferences';
import { ONBOARDING_STEPS } from '@/lib/onboarding-steps';

export function useOnboarding() {
  const { preferences, updatePreference } = usePreferences();
  const [isRunning, setIsRunning] = useState(!preferences.onboardingCompleted);
  const [stepIndex, setStepIndex] = useState(0);

  const startTour = useCallback(() => {
    updatePreference('onboardingCompleted', false);
    setStepIndex(0);
    setIsRunning(true);
  }, [updatePreference]);

  const completeTour = useCallback(() => {
    setIsRunning(false);
    updatePreference('onboardingCompleted', true);
  }, [updatePreference]);

  const handleCallback = useCallback((data: CallBackProps) => {
    const { action, index, status, type } = data;

    if ([EVENTS.STEP_AFTER, EVENTS.TARGET_NOT_FOUND].includes(type as typeof EVENTS.STEP_AFTER)) {
      setStepIndex(index + (action === ACTIONS.PREV ? -1 : 1));
    }

    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
      completeTour();
    }
  }, [completeTour]);

  return {
    isRunning,
    stepIndex,
    isCompleted: preferences.onboardingCompleted,
    steps: ONBOARDING_STEPS,
    startTour,
    completeTour,
    handleCallback,
    goToStep: setStepIndex,
  };
}
```

### 6. Create OnboardingTour Component

Create `src/components/OnboardingTour.tsx`:

```typescript
import Joyride from 'react-joyride';
import { useOnboarding } from '@/hooks/useOnboarding';

export function OnboardingTour() {
  const { isRunning, stepIndex, steps, handleCallback, isCompleted } = useOnboarding();

  if (isCompleted) return null;

  return (
    <Joyride
      steps={steps}
      run={isRunning}
      stepIndex={stepIndex}
      continuous
      showSkipButton
      showProgress
      scrollToFirstStep
      scrollOffset={100}
      disableOverlayClose
      spotlightPadding={8}
      callback={handleCallback}
      styles={{
        options: {
          primaryColor: 'hsl(221.2 83.2% 53.3%)', // primary color
          zIndex: 10000,
        },
      }}
      locale={{
        back: 'Previous',
        last: 'Finish',
        next: 'Next',
        skip: 'Skip Tour',
      }}
    />
  );
}
```

### 7. Add Data-Tour Attributes

In `src/pages/Home.tsx`, add attributes to buttons:

```tsx
<Button data-tour="view-problems" size="lg" asChild>
  <Link to="/problems">View Problems</Link>
</Button>

<Button data-tour="timed-practice" size="lg" variant="outline" asChild>
  <Link to="/practice">Timed Practice</Link>
</Button>

<Button data-tour="progress-ladder" size="lg" variant="outline" asChild>
  <Link to="/progress">Progress Ladder</Link>
</Button>
```

In `src/components/Dashboard.tsx`, wrap stats and DueToday:

```tsx
<div data-tour="dashboard-stats" className="flex gap-6">
  {/* Stats content */}
</div>

<div data-tour="due-today">
  <DueToday ... />
</div>
```

### 8. Integrate in Home Page

In `src/pages/Home.tsx`:

```tsx
import { OnboardingTour } from '@/components/OnboardingTour';

function Home() {
  return (
    <div className="min-h-screen bg-background">
      <OnboardingTour />
      {/* ... rest of content */}
    </div>
  );
}
```

### 9. Add Restart Tour to Settings

In `src/pages/Settings.tsx`, add a new card:

```tsx
import { RotateCcw } from 'lucide-react';
import { usePreferences } from '@/hooks/usePreferences';
import { useNavigate } from 'react-router-dom';

// In component:
const { updatePreference } = usePreferences();
const navigate = useNavigate();

const handleRestartTour = () => {
  updatePreference('onboardingCompleted', false);
  navigate('/');
};

// In JSX, add new card:
<Card>
  <CardHeader>
    <CardTitle className="flex items-center gap-2">
      <RotateCcw className="h-5 w-5" />
      Onboarding
    </CardTitle>
    <CardDescription>
      View the app tour again to learn about features.
    </CardDescription>
  </CardHeader>
  <CardContent>
    <Button onClick={handleRestartTour}>
      <RotateCcw className="h-4 w-4 mr-2" />
      Restart Tour
    </Button>
  </CardContent>
</Card>
```

## Verification

### Run Tests

```bash
pnpm test --run
```

### Manual Testing Checklist

1. [ ] Clear localStorage and refresh - tour should appear
2. [ ] Navigate through all 6 steps
3. [ ] Click "Skip Tour" - tour closes, doesn't reappear on refresh
4. [ ] Complete tour normally - doesn't reappear on refresh
5. [ ] Go to Settings → Restart Tour → verify tour starts again
6. [ ] Test on mobile viewport (320px width)
7. [ ] Test keyboard navigation (Tab, Enter, Escape)

### Build Check

```bash
pnpm typecheck && pnpm lint && pnpm build
```

## File Summary

| File | Action | Purpose |
|------|--------|---------|
| `package.json` | MODIFIED | Add react-joyride |
| `src/types/index.ts` | MODIFIED | Add OnboardingStep, update UserPreferences |
| `src/lib/preferences.ts` | MODIFIED | Add onboardingCompleted default |
| `src/lib/onboarding-steps.ts` | NEW | Tour step definitions |
| `src/hooks/useOnboarding.ts` | NEW | Onboarding state management |
| `src/components/OnboardingTour.tsx` | NEW | Tour component wrapper |
| `src/pages/Home.tsx` | MODIFIED | Integrate tour, add data-tour attributes |
| `src/components/Dashboard.tsx` | MODIFIED | Add data-tour attributes |
| `src/pages/Settings.tsx` | MODIFIED | Add Restart Tour option |
