// hooks/useTimer.ts - Timer hook with requestAnimationFrame-based updates

import { useState, useCallback, useRef, useEffect } from 'react';
import {
  type TimerState,
  createTimerState,
  tickTimer,
  startTimer as startTimerFn,
  pauseTimer as pauseTimerFn,
  resumeTimer as resumeTimerFn,
  resetTimer as resetTimerFn,
  stopTimer as stopTimerFn,
} from '@/lib/timer';

interface UseTimerOptions {
  /** Initial duration in minutes */
  initialMinutes?: number;
  /** Initial elapsed time in seconds (for session recovery) */
  initialElapsed?: number;
  /** Called when timer completes */
  onComplete?: () => void;
  /** Called on each tick with current state */
  onTick?: (state: TimerState) => void;
}

interface UseTimerReturn {
  /** Current timer state */
  state: TimerState;
  /** Start the timer */
  start: () => void;
  /** Pause the timer */
  pause: () => void;
  /** Resume from paused state */
  resume: () => void;
  /** Reset timer to initial state */
  reset: (newDurationMinutes?: number) => void;
  /** Stop timer (preserves elapsed) */
  stop: () => void;
  /** Toggle between running and paused */
  toggle: () => void;
  /** Set a new duration and reset */
  setDuration: (minutes: number) => void;
}

/**
 * Timer hook using requestAnimationFrame for precise timing
 */
export function useTimer(options: UseTimerOptions = {}): UseTimerReturn {
  const { initialMinutes = 45, initialElapsed = 0, onComplete, onTick } = options;

  const [state, setState] = useState<TimerState>(() => {
    const base = createTimerState(initialMinutes);
    // If we have initial elapsed time, adjust the state
    if (initialElapsed > 0) {
      return {
        ...base,
        elapsed: initialElapsed,
        remaining: Math.max(0, base.duration - initialElapsed),
        isPaused: true, // Start paused when recovering
      };
    }
    return base;
  });

  const rafRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);
  const onCompleteRef = useRef(onComplete);
  const onTickRef = useRef(onTick);

  // Keep refs updated
  useEffect(() => {
    onCompleteRef.current = onComplete;
    onTickRef.current = onTick;
  }, [onComplete, onTick]);

  // Animation frame loop
  useEffect(() => {
    if (!state.isRunning || state.isPaused || state.isComplete) {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
        lastTimeRef.current = null;
      }
      return;
    }

    const tick = (timestamp: number) => {
      if (lastTimeRef.current === null) {
        lastTimeRef.current = timestamp;
      }

      const deltaMs = timestamp - lastTimeRef.current;
      const deltaSeconds = deltaMs / 1000;

      if (deltaSeconds >= 0.1) {
        // Update every 100ms for smooth display
        lastTimeRef.current = timestamp;

        setState((prev) => {
          const next = tickTimer(prev, deltaSeconds);

          // Call onTick callback
          if (onTickRef.current) {
            onTickRef.current(next);
          }

          // Check for completion
          if (next.isComplete && !prev.isComplete) {
            if (onCompleteRef.current) {
              onCompleteRef.current();
            }
          }

          return next;
        });
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
        lastTimeRef.current = null;
      }
    };
  }, [state.isRunning, state.isPaused, state.isComplete]);

  const start = useCallback(() => {
    setState((prev) => startTimerFn(prev));
  }, []);

  const pause = useCallback(() => {
    setState((prev) => pauseTimerFn(prev));
  }, []);

  const resume = useCallback(() => {
    setState((prev) => resumeTimerFn(prev));
  }, []);

  const reset = useCallback((newDurationMinutes?: number) => {
    setState((prev) => resetTimerFn(prev, newDurationMinutes));
  }, []);

  const stop = useCallback(() => {
    setState((prev) => stopTimerFn(prev));
  }, []);

  const toggle = useCallback(() => {
    setState((prev) => {
      if (prev.isComplete) return prev;
      if (prev.isRunning) return pauseTimerFn(prev);
      if (prev.isPaused) return resumeTimerFn(prev);
      return startTimerFn(prev);
    });
  }, []);

  const setDuration = useCallback((minutes: number) => {
    setState(createTimerState(minutes));
  }, []);

  return {
    state,
    start,
    pause,
    resume,
    reset,
    stop,
    toggle,
    setDuration,
  };
}

export type { UseTimerOptions, UseTimerReturn };
