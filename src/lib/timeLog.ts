// lib/timeLog.ts - Time logging utilities for tracking practice time

import { db } from './db';
import type { TimeSession, ProblemTimeLog } from '../types';

/**
 * Log a time session for a problem
 * Adds to existing log or creates new one
 */
export async function logTime(
  problemId: string,
  session: TimeSession
): Promise<void> {
  const existing = await db.timeLogs.get(problemId);

  if (existing) {
    await db.timeLogs.update(problemId, {
      totalSeconds: existing.totalSeconds + session.durationSeconds,
      sessions: [...existing.sessions, session],
    });
  } else {
    await db.timeLogs.add({
      problemId,
      totalSeconds: session.durationSeconds,
      sessions: [session],
    });
  }
}

/**
 * Get total time spent on a problem in seconds
 */
export async function getTimeForProblem(problemId: string): Promise<number> {
  const log = await db.timeLogs.get(problemId);
  return log?.totalSeconds ?? 0;
}

/**
 * Get the full time log for a problem
 */
export async function getTimeLog(
  problemId: string
): Promise<ProblemTimeLog | undefined> {
  return await db.timeLogs.get(problemId);
}

/**
 * Get all time logs
 */
export async function getAllTimeLogs(): Promise<ProblemTimeLog[]> {
  return await db.timeLogs.toArray();
}

/**
 * Delete time log for a problem
 */
export async function deleteTimeLog(problemId: string): Promise<void> {
  await db.timeLogs.delete(problemId);
}

/**
 * Format total seconds to human-readable string
 * e.g., "1h 30m", "45m", "2h"
 */
export function formatTotalTime(totalSeconds: number): string {
  if (totalSeconds < 60) {
    return `${totalSeconds}s`;
  }

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);

  if (hours === 0) {
    return `${minutes}m`;
  }

  if (minutes === 0) {
    return `${hours}h`;
  }

  return `${hours}h ${minutes}m`;
}
