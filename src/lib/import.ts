// lib/import.ts - Data import functionality with validation and checksum verification

import { db } from './db';
import { generateChecksum, APP_VERSION } from './export';
import type { ExportData, ImportResult, Problem, Solution, Review, ReviewHistory, ProblemTimeLog } from '@/types';

/**
 * Validation result for export data
 */
export interface ValidationResult {
  isValid: boolean;
  version: string;
  stats: {
    problems: number;
    solutions: number;
    reviews: number;
    reviewHistory: number;
    timeLogs: number;
    estimatedSize: string;
  };
  warnings: string[];
  errors: string[];
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
 * Compare semantic versions
 * Returns: -1 if a < b, 0 if a == b, 1 if a > b
 */
function compareVersions(a: string, b: string): number {
  const partsA = a.split('.').map(Number);
  const partsB = b.split('.').map(Number);

  for (let i = 0; i < 3; i++) {
    const numA = partsA[i] ?? 0;
    const numB = partsB[i] ?? 0;
    if (numA < numB) return -1;
    if (numA > numB) return 1;
  }
  return 0;
}

/**
 * Validate export data structure and checksum
 */
export async function validateExport(
  exportData: unknown
): Promise<ValidationResult> {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Type guard for basic structure
  if (!exportData || typeof exportData !== 'object') {
    return {
      isValid: false,
      version: 'unknown',
      stats: {
        problems: 0,
        solutions: 0,
        reviews: 0,
        reviewHistory: 0,
        timeLogs: 0,
        estimatedSize: '0 B',
      },
      warnings: [],
      errors: ['Invalid export data: not an object'],
    };
  }

  const data = exportData as Record<string, unknown>;

  // Check required fields
  if (!data.version || typeof data.version !== 'string') {
    errors.push('Missing version field');
  }

  if (!data.data || typeof data.data !== 'object') {
    errors.push('Missing data field');
  }

  // If basic structure is invalid, return early
  if (errors.length > 0) {
    return {
      isValid: false,
      version: (data.version as string) || 'unknown',
      stats: {
        problems: 0,
        solutions: 0,
        reviews: 0,
        reviewHistory: 0,
        timeLogs: 0,
        estimatedSize: '0 B',
      },
      warnings,
      errors,
    };
  }

  const payload = data.data as Record<string, unknown>;

  // Validate data arrays
  const requiredArrays = [
    'problems',
    'solutions',
    'reviews',
    'reviewHistory',
    'timeLogs',
  ] as const;

  for (const field of requiredArrays) {
    if (!Array.isArray(payload[field])) {
      errors.push(`Invalid ${field}: expected array`);
    }
  }

  // If arrays are invalid, return early
  if (errors.length > 0) {
    return {
      isValid: false,
      version: data.version as string,
      stats: {
        problems: 0,
        solutions: 0,
        reviews: 0,
        reviewHistory: 0,
        timeLogs: 0,
        estimatedSize: '0 B',
      },
      warnings,
      errors,
    };
  }

  // Verify checksum
  if (data.checksum && typeof data.checksum === 'string') {
    const expectedChecksum = await generateChecksum(payload);
    if (data.checksum !== expectedChecksum) {
      errors.push('Invalid checksum: data may be corrupted or modified');
    }
  } else {
    warnings.push('No checksum found: cannot verify data integrity');
  }

  // Check app version compatibility
  if (data.appVersion && typeof data.appVersion === 'string') {
    const comparison = compareVersions(data.appVersion as string, APP_VERSION);
    if (comparison > 0) {
      warnings.push(
        `Export from newer app version (${data.appVersion}). Some features may not import correctly.`
      );
    }
  }

  // Calculate stats
  const problems = payload.problems as unknown[];
  const solutions = payload.solutions as unknown[];
  const reviews = payload.reviews as unknown[];
  const reviewHistory = payload.reviewHistory as unknown[];
  const timeLogs = payload.timeLogs as unknown[];

  const json = JSON.stringify(payload);
  const estimatedSize = formatBytes(json.length);

  return {
    isValid: errors.length === 0,
    version: data.version as string,
    stats: {
      problems: problems.length,
      solutions: solutions.length,
      reviews: reviews.length,
      reviewHistory: reviewHistory.length,
      timeLogs: timeLogs.length,
      estimatedSize,
    },
    warnings,
    errors,
  };
}

/**
 * Parse date strings back to Date objects
 */
function parseDates<T>(obj: T): T {
  if (obj === null || obj === undefined) return obj;
  if (typeof obj === 'string') {
    // Check if it looks like an ISO date string
    if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(obj)) {
      return new Date(obj) as unknown as T;
    }
    return obj;
  }
  if (Array.isArray(obj)) {
    return obj.map(parseDates) as unknown as T;
  }
  if (typeof obj === 'object') {
    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
      // Known date fields
      const dateFields = [
        'createdAt',
        'updatedAt',
        'nextReview',
        'lastReviewed',
        'reviewedAt',
        'startedAt',
        'endedAt',
      ];
      if (dateFields.includes(key) && typeof value === 'string') {
        result[key] = new Date(value);
      } else {
        result[key] = parseDates(value);
      }
    }
    return result as T;
  }
  return obj;
}

/**
 * Import data from export file, replacing all existing data
 */
export async function importData(exportData: unknown): Promise<ImportResult> {
  // Validate first
  const validation = await validateExport(exportData);

  if (!validation.isValid) {
    return {
      success: false,
      error: validation.errors.join('; '),
    };
  }

  const data = (exportData as ExportData).data;

  try {
    // Parse dates and prepare data
    const problems = parseDates(data.problems) as Problem[];
    const solutions = parseDates(data.solutions) as Solution[];
    const reviews = parseDates(data.reviews) as Review[];
    const reviewHistory = parseDates(data.reviewHistory) as ReviewHistory[];
    const timeLogs = parseDates(data.timeLogs) as ProblemTimeLog[];

    // Use a transaction to ensure atomicity
    await db.transaction(
      'rw',
      [db.problems, db.solutions, db.reviews, db.reviewHistory, db.timeLogs],
      async () => {
        // Clear all existing data
        await db.problems.clear();
        await db.solutions.clear();
        await db.reviews.clear();
        await db.reviewHistory.clear();
        await db.timeLogs.clear();

        // Import new data
        if (problems.length > 0) {
          await db.problems.bulkAdd(problems);
        }
        if (solutions.length > 0) {
          await db.solutions.bulkAdd(solutions);
        }
        if (reviews.length > 0) {
          await db.reviews.bulkAdd(reviews);
        }
        if (reviewHistory.length > 0) {
          await db.reviewHistory.bulkAdd(reviewHistory);
        }
        if (timeLogs.length > 0) {
          await db.timeLogs.bulkAdd(timeLogs);
        }
      }
    );

    return {
      success: true,
      stats: {
        problems: problems.length,
        solutions: solutions.length,
        reviews: reviews.length,
        reviewHistory: reviewHistory.length,
        timeLogs: timeLogs.length,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Import failed',
    };
  }
}

/**
 * Read and parse a JSON file
 */
export async function readJsonFile(file: File): Promise<unknown> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const data = JSON.parse(text);
        resolve(data);
      } catch {
        reject(new Error('Invalid JSON file'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
}
