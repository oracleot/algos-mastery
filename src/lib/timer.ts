// lib/timer.ts - Pure timer utility functions

/**
 * Timer state representation
 */
export interface TimerState {
  elapsed: number;     // Seconds elapsed
  remaining: number;   // Seconds remaining
  duration: number;    // Total duration in seconds
  isRunning: boolean;
  isPaused: boolean;
  isComplete: boolean;
}

/**
 * Format seconds to MM:SS display string
 * @param seconds - Time in seconds
 * @returns Formatted time string (e.g., "01:05")
 */
export function formatTime(seconds: number): string {
  const absSeconds = Math.abs(Math.floor(seconds));
  const mins = Math.floor(absSeconds / 60);
  const secs = absSeconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Parse time string to seconds
 * @param timeString - Time string in MM:SS format
 * @returns Time in seconds
 */
export function parseTime(timeString: string): number {
  const [mins, secs] = timeString.split(':').map(Number);
  return (mins ?? 0) * 60 + (secs ?? 0);
}

/**
 * Create initial timer state
 * @param durationMinutes - Duration in minutes
 * @returns Initial timer state
 */
export function createTimerState(durationMinutes: number): TimerState {
  const duration = durationMinutes * 60;
  return {
    elapsed: 0,
    remaining: duration,
    duration,
    isRunning: false,
    isPaused: false,
    isComplete: false,
  };
}

/**
 * Calculate progress percentage (0-1)
 * @param state - Current timer state
 * @returns Progress as a decimal (0-1)
 */
export function calculateProgress(state: TimerState): number {
  if (state.duration === 0) return 0;
  return state.elapsed / state.duration;
}

/**
 * Update timer state by elapsed time
 * @param state - Current timer state
 * @param deltaSeconds - Seconds elapsed since last update
 * @returns Updated timer state
 */
export function tickTimer(state: TimerState, deltaSeconds: number): TimerState {
  if (!state.isRunning || state.isPaused || state.isComplete) {
    return state;
  }

  const newElapsed = state.elapsed + deltaSeconds;
  const newRemaining = Math.max(0, state.duration - newElapsed);
  const isComplete = newRemaining <= 0;

  return {
    ...state,
    elapsed: isComplete ? state.duration : newElapsed,
    remaining: newRemaining,
    isComplete,
    isRunning: !isComplete,
  };
}

/**
 * Start the timer
 * @param state - Current timer state
 * @returns Updated timer state
 */
export function startTimer(state: TimerState): TimerState {
  if (state.isComplete) return state;
  return {
    ...state,
    isRunning: true,
    isPaused: false,
  };
}

/**
 * Pause the timer
 * @param state - Current timer state
 * @returns Updated timer state
 */
export function pauseTimer(state: TimerState): TimerState {
  if (!state.isRunning || state.isComplete) return state;
  return {
    ...state,
    isRunning: false,
    isPaused: true,
  };
}

/**
 * Resume a paused timer
 * @param state - Current timer state
 * @returns Updated timer state
 */
export function resumeTimer(state: TimerState): TimerState {
  if (!state.isPaused || state.isComplete) return state;
  return {
    ...state,
    isRunning: true,
    isPaused: false,
  };
}

/**
 * Reset the timer to initial state
 * @param state - Current timer state
 * @param newDurationMinutes - Optional new duration in minutes
 * @returns Reset timer state
 */
export function resetTimer(state: TimerState, newDurationMinutes?: number): TimerState {
  const duration = newDurationMinutes !== undefined ? newDurationMinutes * 60 : state.duration;
  return {
    elapsed: 0,
    remaining: duration,
    duration,
    isRunning: false,
    isPaused: false,
    isComplete: false,
  };
}

/**
 * Stop the timer (preserves elapsed time)
 * @param state - Current timer state
 * @returns Updated timer state
 */
export function stopTimer(state: TimerState): TimerState {
  return {
    ...state,
    isRunning: false,
    isPaused: false,
  };
}
