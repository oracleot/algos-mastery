// hooks/useTimeLog.ts - Hook for tracking time spent on problems

import { useState, useCallback, useRef, useEffect } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/db';
import { logTime, getTimeForProblem, formatTotalTime } from '@/lib/timeLog';
import type { TimeSession, ProblemTimeLog } from '@/types';

interface TrackingState {
  isTracking: boolean;
  problemId: string | null;
  startedAt: Date | null;
}

interface UseTimeLogReturn {
  /** Start tracking time for a problem */
  startTracking: (problemId: string) => void;
  /** Stop tracking and save the session */
  stopTracking: () => Promise<TimeSession | null>;
  /** Get total time for a problem */
  getTimeForProblem: (problemId: string) => Promise<number>;
  /** Current tracking state */
  trackingState: TrackingState;
  /** Format total seconds to human-readable */
  formatTime: (seconds: number) => string;
  /** All time logs (reactive) */
  timeLogs: ProblemTimeLog[];
}

const SESSION_STORAGE_KEY = 'algomasteryTimeTracking';

/**
 * Save tracking state to sessionStorage for recovery
 */
function saveTrackingState(state: TrackingState): void {
  try {
    sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify({
      isTracking: state.isTracking,
      problemId: state.problemId,
      startedAt: state.startedAt?.toISOString() ?? null,
    }));
  } catch {
    // Ignore storage errors
  }
}

/**
 * Load tracking state from sessionStorage
 */
function loadTrackingState(): TrackingState | null {
  try {
    const stored = sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (!stored) return null;
    
    const parsed = JSON.parse(stored);
    return {
      isTracking: parsed.isTracking,
      problemId: parsed.problemId,
      startedAt: parsed.startedAt ? new Date(parsed.startedAt) : null,
    };
  } catch {
    return null;
  }
}

/**
 * Clear tracking state from sessionStorage
 */
function clearTrackingState(): void {
  try {
    sessionStorage.removeItem(SESSION_STORAGE_KEY);
  } catch {
    // Ignore storage errors
  }
}

/**
 * Hook for tracking and managing time spent on problems
 */
export function useTimeLog(): UseTimeLogReturn {
  const [trackingState, setTrackingState] = useState<TrackingState>(() => {
    // Attempt to recover tracking state on mount
    const recovered = loadTrackingState();
    if (recovered && recovered.isTracking && recovered.problemId && recovered.startedAt) {
      return recovered;
    }
    return {
      isTracking: false,
      problemId: null,
      startedAt: null,
    };
  });

  const trackingRef = useRef(trackingState);

  // Keep ref in sync
  useEffect(() => {
    trackingRef.current = trackingState;
  }, [trackingState]);

  // Live query for all time logs
  const timeLogs = useLiveQuery(
    async () => await db.timeLogs.toArray(),
    [],
    [] as ProblemTimeLog[]
  );

  const startTracking = useCallback((problemId: string) => {
    const newState: TrackingState = {
      isTracking: true,
      problemId,
      startedAt: new Date(),
    };
    setTrackingState(newState);
    saveTrackingState(newState);
  }, []);

  const stopTracking = useCallback(async (): Promise<TimeSession | null> => {
    const { isTracking, problemId, startedAt } = trackingRef.current;

    if (!isTracking || !problemId || !startedAt) {
      return null;
    }

    const endedAt = new Date();
    const durationSeconds = Math.floor(
      (endedAt.getTime() - startedAt.getTime()) / 1000
    );

    // Only log if there's meaningful time (at least 1 second)
    if (durationSeconds < 1) {
      setTrackingState({
        isTracking: false,
        problemId: null,
        startedAt: null,
      });
      clearTrackingState();
      return null;
    }

    const session: TimeSession = {
      startedAt,
      endedAt,
      durationSeconds,
    };

    await logTime(problemId, session);

    setTrackingState({
      isTracking: false,
      problemId: null,
      startedAt: null,
    });
    clearTrackingState();

    return session;
  }, []);

  return {
    startTracking,
    stopTracking,
    getTimeForProblem,
    trackingState,
    formatTime: formatTotalTime,
    timeLogs,
  };
}

export type { UseTimeLogReturn, TrackingState };
