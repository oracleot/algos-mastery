// lib/export.ts - Data export functionality with checksum generation

import { db } from './db';
import type { ExportData, Problem, Solution, Review, ReviewHistory, ProblemTimeLog } from '@/types';

/**
 * Current export format version
 */
export const EXPORT_VERSION = '1.0.0';

/**
 * App version for export metadata
 */
export const APP_VERSION = '0.0.0';

/**
 * Generate SHA-256 checksum for data integrity verification
 */
export async function generateChecksum(data: object): Promise<string> {
  const json = JSON.stringify(data);
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(json);
  const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Format bytes to human-readable size
 */
function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * Export preview stats
 */
export interface ExportStats {
  problems: number;
  solutions: number;
  reviews: number;
  reviewHistory: number;
  timeLogs: number;
  estimatedSize: string;
}

/**
 * Get export preview with counts and estimated size
 */
export async function getExportPreview(): Promise<ExportStats> {
  const [problems, solutions, reviews, reviewHistory, timeLogs] = await Promise.all([
    db.problems.toArray(),
    db.solutions.toArray(),
    db.reviews.toArray(),
    db.reviewHistory.toArray(),
    db.timeLogs.toArray(),
  ]);

  // Estimate size by serializing a sample
  const data = { problems, solutions, reviews, reviewHistory, timeLogs };
  const json = JSON.stringify(data);
  const estimatedSize = formatBytes(json.length);

  return {
    problems: problems.length,
    solutions: solutions.length,
    reviews: reviews.length,
    reviewHistory: reviewHistory.length,
    timeLogs: timeLogs.length,
    estimatedSize,
  };
}

/**
 * Serialize date fields in objects for JSON export
 */
function serializeDates<T>(obj: T): T {
  if (obj === null || obj === undefined) return obj;
  if (obj instanceof Date) return obj.toISOString() as unknown as T;
  if (Array.isArray(obj)) {
    return obj.map(serializeDates) as unknown as T;
  }
  if (typeof obj === 'object') {
    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj)) {
      result[key] = serializeDates(value);
    }
    return result as T;
  }
  return obj;
}

/**
 * Export all data from IndexedDB with checksum
 */
export async function exportAllData(): Promise<ExportData> {
  // Get all data from all tables
  const [problems, solutions, reviews, reviewHistory, timeLogs] = await Promise.all([
    db.problems.toArray(),
    db.solutions.toArray(),
    db.reviews.toArray(),
    db.reviewHistory.toArray(),
    db.timeLogs.toArray(),
  ]);

  // Serialize dates for JSON compatibility
  const data = {
    problems: serializeDates(problems) as Problem[],
    solutions: serializeDates(solutions) as Solution[],
    reviews: serializeDates(reviews) as Review[],
    reviewHistory: serializeDates(reviewHistory) as ReviewHistory[],
    timeLogs: serializeDates(timeLogs) as ProblemTimeLog[],
  };

  // Generate checksum for data integrity
  const checksum = await generateChecksum(data);

  return {
    version: EXPORT_VERSION,
    exportedAt: new Date().toISOString(),
    appVersion: APP_VERSION,
    checksum,
    data,
  };
}

/**
 * Trigger download of export data as JSON file
 */
export function downloadJson(data: object, filename: string): void {
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}

/**
 * Generate export filename with timestamp
 */
export function getExportFilename(): string {
  const date = new Date().toISOString().split('T')[0];
  return `algos-mastery-backup-${date}.json`;
}
