// hooks/useOnboarding.test.ts - Tests for useOnboarding hook

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { ACTIONS, EVENTS, STATUS } from 'react-joyride';
import type { CallBackProps } from 'react-joyride';

// Mock usePreferences
const mockUpdatePreference = vi.fn();
const mockPreferences = {
  theme: 'system' as const,
  defaultTimerMinutes: 45,
  keyboardShortcutsEnabled: true,
  showInstallPrompt: true,
  onboardingCompleted: false,
};

vi.mock('./usePreferences', () => ({
  usePreferences: () => ({
    preferences: mockPreferences,
    updatePreference: mockUpdatePreference,
    resetPreferences: vi.fn(),
  }),
}));

// Import after mocking
import { useOnboarding } from './useOnboarding';
import { ONBOARDING_STEPS } from '../lib/onboarding-steps';

describe('useOnboarding', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockPreferences.onboardingCompleted = false;
  });

  it('returns initial state correctly for first-time user', () => {
    const { result } = renderHook(() => useOnboarding());

    expect(result.current.isRunning).toBe(true);
    expect(result.current.stepIndex).toBe(0);
    expect(result.current.isCompleted).toBe(false);
    expect(result.current.steps).toEqual(ONBOARDING_STEPS);
  });

  it('returns initial state correctly for returning user', () => {
    mockPreferences.onboardingCompleted = true;

    const { result } = renderHook(() => useOnboarding());

    expect(result.current.isRunning).toBe(false);
    expect(result.current.isCompleted).toBe(true);
  });

  it('startTour resets state and begins tour', () => {
    mockPreferences.onboardingCompleted = true;

    const { result } = renderHook(() => useOnboarding());

    act(() => {
      result.current.startTour();
    });

    expect(mockUpdatePreference).toHaveBeenCalledWith('onboardingCompleted', false);
    expect(result.current.isRunning).toBe(true);
    expect(result.current.stepIndex).toBe(0);
  });

  it('completeTour stops tour and marks as complete', () => {
    const { result } = renderHook(() => useOnboarding());

    act(() => {
      result.current.completeTour();
    });

    expect(result.current.isRunning).toBe(false);
    expect(mockUpdatePreference).toHaveBeenCalledWith('onboardingCompleted', true);
  });

  it('handleCallback advances step on STEP_AFTER event', () => {
    const { result } = renderHook(() => useOnboarding());

    const callbackData: CallBackProps = {
      action: ACTIONS.NEXT,
      index: 0,
      status: STATUS.RUNNING,
      type: EVENTS.STEP_AFTER,
      controlled: true,
      size: 6,
      step: ONBOARDING_STEPS[0],
      lifecycle: 'complete',
      origin: null,
    };

    act(() => {
      result.current.handleCallback(callbackData);
    });

    expect(result.current.stepIndex).toBe(1);
  });

  it('handleCallback goes back on PREV action', () => {
    const { result } = renderHook(() => useOnboarding());

    // First go to step 2
    act(() => {
      result.current.goToStep(2);
    });

    expect(result.current.stepIndex).toBe(2);

    // Now go back
    const callbackData: CallBackProps = {
      action: ACTIONS.PREV,
      index: 2,
      status: STATUS.RUNNING,
      type: EVENTS.STEP_AFTER,
      controlled: true,
      size: 6,
      step: ONBOARDING_STEPS[2],
      lifecycle: 'complete',
      origin: null,
    };

    act(() => {
      result.current.handleCallback(callbackData);
    });

    expect(result.current.stepIndex).toBe(1);
  });

  it('handleCallback completes tour on STATUS.FINISHED', () => {
    const { result } = renderHook(() => useOnboarding());

    const callbackData: CallBackProps = {
      action: ACTIONS.NEXT,
      index: 5,
      status: STATUS.FINISHED,
      type: EVENTS.TOUR_END,
      controlled: true,
      size: 6,
      step: ONBOARDING_STEPS[5],
      lifecycle: 'complete',
      origin: null,
    };

    act(() => {
      result.current.handleCallback(callbackData);
    });

    expect(result.current.isRunning).toBe(false);
    expect(mockUpdatePreference).toHaveBeenCalledWith('onboardingCompleted', true);
  });

  it('handleCallback completes tour on STATUS.SKIPPED', () => {
    const { result } = renderHook(() => useOnboarding());

    const callbackData: CallBackProps = {
      action: ACTIONS.SKIP,
      index: 2,
      status: STATUS.SKIPPED,
      type: EVENTS.TOUR_END,
      controlled: true,
      size: 6,
      step: ONBOARDING_STEPS[2],
      lifecycle: 'complete',
      origin: null,
    };

    act(() => {
      result.current.handleCallback(callbackData);
    });

    expect(result.current.isRunning).toBe(false);
    expect(mockUpdatePreference).toHaveBeenCalledWith('onboardingCompleted', true);
  });

  it('handleCallback handles TARGET_NOT_FOUND by advancing', () => {
    const { result } = renderHook(() => useOnboarding());

    const callbackData: CallBackProps = {
      action: ACTIONS.NEXT,
      index: 1,
      status: STATUS.RUNNING,
      type: EVENTS.TARGET_NOT_FOUND,
      controlled: true,
      size: 6,
      step: ONBOARDING_STEPS[1],
      lifecycle: 'complete',
      origin: null,
    };

    act(() => {
      result.current.handleCallback(callbackData);
    });

    expect(result.current.stepIndex).toBe(2);
  });

  it('goToStep updates step index within valid range', () => {
    const { result } = renderHook(() => useOnboarding());

    act(() => {
      result.current.goToStep(3);
    });

    expect(result.current.stepIndex).toBe(3);
  });

  it('goToStep does not update for invalid index', () => {
    const { result } = renderHook(() => useOnboarding());

    act(() => {
      result.current.goToStep(-1);
    });

    expect(result.current.stepIndex).toBe(0);

    act(() => {
      result.current.goToStep(100);
    });

    expect(result.current.stepIndex).toBe(0);
  });
});
