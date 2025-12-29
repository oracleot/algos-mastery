// hooks/useOnboarding.ts - Onboarding tour state management hook

import { useState, useCallback } from 'react';
import { ACTIONS, EVENTS, STATUS, type CallBackProps } from 'react-joyride';
import { usePreferences } from './usePreferences';
import { ONBOARDING_STEPS } from '../lib/onboarding-steps';
import type { OnboardingStep } from '../types';

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

/**
 * Hook for managing onboarding tour state
 * Syncs completion state with user preferences in localStorage
 */
export function useOnboarding(): UseOnboardingReturn {
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

  const handleCallback = useCallback(
    (data: CallBackProps) => {
      const { action, index, status, type } = data;

      // Handle step navigation
      if (
        type === EVENTS.STEP_AFTER ||
        type === EVENTS.TARGET_NOT_FOUND
      ) {
        const nextIndex = index + (action === ACTIONS.PREV ? -1 : 1);
        setStepIndex(nextIndex);
      }

      // Handle tour completion (finished or skipped)
      if (status === STATUS.FINISHED || status === STATUS.SKIPPED) {
        completeTour();
      }
    },
    [completeTour]
  );

  const goToStep = useCallback((index: number) => {
    if (index >= 0 && index < ONBOARDING_STEPS.length) {
      setStepIndex(index);
    }
  }, []);

  return {
    isRunning,
    stepIndex,
    isCompleted: preferences.onboardingCompleted,
    steps: ONBOARDING_STEPS,
    startTour,
    completeTour,
    handleCallback,
    goToStep,
  };
}
