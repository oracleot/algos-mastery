// lib/practiceSession.ts - Practice session storage utilities

const SESSION_STORAGE_KEY = 'algomasteryPracticeSession';

export interface SessionState {
  problemId: string;
  startedAt: number;
  durationMinutes: number;
  elapsed: number;
  isRunning: boolean;
  isPaused: boolean;
  revealedSolution: boolean;
  revealedTemplate: boolean;
}

/**
 * Save practice session state to sessionStorage
 */
export function saveSessionState(state: SessionState): void {
  try {
    sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Ignore storage errors
  }
}

/**
 * Get any saved practice session from sessionStorage (for recovery on page load)
 */
export function getSavedSession(): SessionState | null {
  try {
    const stored = sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (!stored) return null;
    return JSON.parse(stored) as SessionState;
  } catch {
    return null;
  }
}

/**
 * Load session state for a specific problem (returns null if different problem)
 */
export function loadSessionState(problemId: string): SessionState | null {
  try {
    const stored = sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (!stored) return null;
    const parsed = JSON.parse(stored) as SessionState;
    // Only restore if same problem
    if (parsed.problemId === problemId) {
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Clear the saved practice session from sessionStorage
 */
export function clearSavedSession(): void {
  try {
    sessionStorage.removeItem(SESSION_STORAGE_KEY);
  } catch {
    // Ignore
  }
}
