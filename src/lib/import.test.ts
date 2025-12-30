// lib/import.test.ts - Tests for import functionality

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { db } from '@/lib/db';
import { exportAllData, generateChecksum } from './export';
import {
  validateExport,
  importData,
} from './import';
import type { ExportData } from '@/types';

// Helper to create valid export data
async function createValidExportData(
  overrides: Partial<ExportData> = {}
): Promise<ExportData> {
  const data = {
    problems: [],
    solutions: [],
    reviews: [],
    reviewHistory: [],
    timeLogs: [],
  };

  return {
    version: '1.0.0',
    exportedAt: new Date().toISOString(),
    appVersion: '0.0.0',
    checksum: await generateChecksum(data),
    data,
    ...overrides,
  };
}

describe('import', () => {
  beforeEach(async () => {
    // Clear all data before each test
    await db.problems.clear();
    await db.solutions.clear();
    await db.reviews.clear();
    await db.reviewHistory.clear();
    await db.timeLogs.clear();
  });

  afterEach(async () => {
    await db.problems.clear();
    await db.solutions.clear();
    await db.reviews.clear();
    await db.reviewHistory.clear();
    await db.timeLogs.clear();
  });

  describe('validateExport', () => {
    it('validates correct export data successfully', async () => {
      const exportData = await createValidExportData();
      const result = await validateExport(exportData);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('returns error for missing version', async () => {
      const exportData = await createValidExportData();
      // @ts-expect-error - Testing invalid data
      delete exportData.version;

      const result = await validateExport(exportData);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Missing version field');
    });

    it('returns error for missing data field', async () => {
      const exportData = await createValidExportData();
      // @ts-expect-error - Testing invalid data
      delete exportData.data;

      const result = await validateExport(exportData);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Missing data field');
    });

    it('returns error for invalid checksum', async () => {
      const exportData = await createValidExportData();
      exportData.checksum = 'invalid-checksum';

      const result = await validateExport(exportData);

      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.includes('checksum'))).toBe(true);
    });

    it('returns warning for newer app version', async () => {
      const exportData = await createValidExportData({
        appVersion: '99.0.0',
      });

      const result = await validateExport(exportData);

      expect(result.warnings.some((w) => w.includes('newer'))).toBe(true);
    });

    it('returns correct stats from validation', async () => {
      const data = {
        problems: [
          {
            id: 'p1',
            title: 'Test',
            url: null,
            topic: 'arrays-hashing',
            difficulty: 'easy',
            status: 'unsolved',
            notes: '',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ],
        solutions: [],
        reviews: [],
        reviewHistory: [],
        timeLogs: [],
      };

      const exportData: ExportData = {
        version: '1.0.0',
        exportedAt: new Date().toISOString(),
        appVersion: '0.0.0',
        checksum: await generateChecksum(data),
        // @ts-expect-error - dates are stringified for export
        data,
      };

      const result = await validateExport(exportData);

      expect(result.stats.problems).toBe(1);
      expect(result.stats.solutions).toBe(0);
    });

    it('validates array types for all data tables', async () => {
      const exportData = await createValidExportData();
      // @ts-expect-error - Testing invalid data
      exportData.data.problems = 'not-an-array';

      const result = await validateExport(exportData);

      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.includes('problems'))).toBe(true);
    });
  });

  describe('importData', () => {
    it('imports valid export data successfully', async () => {
      const originalExport = await exportAllData();
      const result = await importData(originalExport);

      expect(result.success).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('imports problems correctly', async () => {
      const data = {
        problems: [
          {
            id: 'imported-problem',
            title: 'Imported Problem',
            url: 'https://example.com',
            topic: 'arrays-hashing',
            difficulty: 'medium',
            status: 'solved',
            notes: 'Imported notes',
            createdAt: '2025-01-01T00:00:00.000Z',
            updatedAt: '2025-01-02T00:00:00.000Z',
          },
        ],
        solutions: [],
        reviews: [],
        reviewHistory: [],
        timeLogs: [],
      };

      const exportData: ExportData = {
        version: '1.0.0',
        exportedAt: new Date().toISOString(),
        appVersion: '0.0.0',
        checksum: await generateChecksum(data),
        // @ts-expect-error - dates are stringified for export
        data,
      };

      const result = await importData(exportData);

      expect(result.success).toBe(true);
      expect(result.stats?.problems).toBe(1);

      const imported = await db.problems.get('imported-problem');
      expect(imported).toBeDefined();
      expect(imported?.title).toBe('Imported Problem');
    });

    it('imports solutions correctly', async () => {
      const data = {
        problems: [],
        solutions: [
          {
            id: 'imported-solution',
            problemId: 'problem-1',
            code: 'function test() {}',
            language: 'javascript',
            createdAt: '2025-01-01T00:00:00.000Z',
            updatedAt: '2025-01-01T00:00:00.000Z',
          },
        ],
        reviews: [],
        reviewHistory: [],
        timeLogs: [],
      };

      const exportData: ExportData = {
        version: '1.0.0',
        exportedAt: new Date().toISOString(),
        appVersion: '0.0.0',
        checksum: await generateChecksum(data),
        // @ts-expect-error - dates are stringified for export
        data,
      };

      const result = await importData(exportData);

      expect(result.success).toBe(true);
      expect(result.stats?.solutions).toBe(1);

      const imported = await db.solutions.get('imported-solution');
      expect(imported).toBeDefined();
      expect(imported?.code).toBe('function test() {}');
    });

    it('imports reviews and history correctly', async () => {
      const data = {
        problems: [],
        solutions: [],
        reviews: [
          {
            problemId: 'problem-1',
            easeFactor: 2.5,
            interval: 3,
            repetitions: 1,
            nextReview: '2025-01-05T00:00:00.000Z',
            lastReviewed: '2025-01-02T00:00:00.000Z',
          },
        ],
        reviewHistory: [
          {
            id: 'history-1',
            problemId: 'problem-1',
            quality: 4,
            reviewedAt: '2025-01-02T00:00:00.000Z',
            intervalBefore: 1,
            intervalAfter: 3,
          },
        ],
        timeLogs: [],
      };

      const exportData: ExportData = {
        version: '1.0.0',
        exportedAt: new Date().toISOString(),
        appVersion: '0.0.0',
        checksum: await generateChecksum(data),
        // @ts-expect-error - dates are stringified for export
        data,
      };

      const result = await importData(exportData);

      expect(result.success).toBe(true);
      expect(result.stats?.reviews).toBe(1);
      expect(result.stats?.reviewHistory).toBe(1);
    });

    it('imports time logs correctly', async () => {
      const data = {
        problems: [],
        solutions: [],
        reviews: [],
        reviewHistory: [],
        timeLogs: [
          {
            problemId: 'problem-1',
            totalSeconds: 600,
            sessions: [
              {
                startedAt: '2025-01-01T10:00:00.000Z',
                endedAt: '2025-01-01T10:10:00.000Z',
                durationSeconds: 600,
              },
            ],
          },
        ],
      };

      const exportData: ExportData = {
        version: '1.0.0',
        exportedAt: new Date().toISOString(),
        appVersion: '0.0.0',
        checksum: await generateChecksum(data),
        // @ts-expect-error - dates are stringified for export
        data,
      };

      const result = await importData(exportData);

      expect(result.success).toBe(true);
      expect(result.stats?.timeLogs).toBe(1);

      const imported = await db.timeLogs.get('problem-1');
      expect(imported).toBeDefined();
      expect(imported?.totalSeconds).toBe(600);
    });

    it('clears existing data before import', async () => {
      // Add some existing data
      await db.problems.add({
        id: 'existing-problem',
        title: 'Existing',
        url: null,
        topic: 'trees',
        difficulty: 'hard',
        status: 'unsolved',
        notes: '',
        resources: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // Import empty data
      const exportData = await createValidExportData();
      await importData(exportData);

      const count = await db.problems.count();
      expect(count).toBe(0);
    });

    it('returns error for invalid export data', async () => {
      const invalidData = { invalid: 'data' };
      const result = await importData(invalidData);

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('returns stats with correct counts', async () => {
      const data = {
        problems: [
          {
            id: 'p1',
            title: 'Test 1',
            url: null,
            topic: 'arrays-hashing',
            difficulty: 'easy',
            status: 'unsolved',
            notes: '',
            createdAt: '2025-01-01T00:00:00.000Z',
            updatedAt: '2025-01-01T00:00:00.000Z',
          },
          {
            id: 'p2',
            title: 'Test 2',
            url: null,
            topic: 'trees',
            difficulty: 'medium',
            status: 'solved',
            notes: '',
            createdAt: '2025-01-01T00:00:00.000Z',
            updatedAt: '2025-01-01T00:00:00.000Z',
          },
        ],
        solutions: [
          {
            id: 's1',
            problemId: 'p1',
            code: 'test',
            language: 'javascript',
            createdAt: '2025-01-01T00:00:00.000Z',
            updatedAt: '2025-01-01T00:00:00.000Z',
          },
        ],
        reviews: [],
        reviewHistory: [],
        timeLogs: [],
      };

      const exportData: ExportData = {
        version: '1.0.0',
        exportedAt: new Date().toISOString(),
        appVersion: '0.0.0',
        checksum: await generateChecksum(data),
        // @ts-expect-error - dates are stringified for export
        data,
      };

      const result = await importData(exportData);

      expect(result.stats?.problems).toBe(2);
      expect(result.stats?.solutions).toBe(1);
    });
  });

  describe('round-trip export/import', () => {
    it('preserves all data through export and import cycle', async () => {
      // Add comprehensive test data
      const now = new Date();
      await db.problems.add({
        id: 'test-problem',
        title: 'Test Problem',
        url: 'https://leetcode.com/test',
        topic: 'dynamic-programming',
        difficulty: 'hard',
        status: 'solved',
        notes: 'Test notes with special chars: <>&"\'',
        resources: [],
        createdAt: now,
        updatedAt: now,
      });

      await db.solutions.add({
        id: 'test-solution',
        problemId: 'test-problem',
        code: 'function dp() { return "test"; }',
        language: 'javascript',
        createdAt: now,
        updatedAt: now,
      });

      await db.reviews.add({
        problemId: 'test-problem',
        easeFactor: 2.7,
        interval: 6,
        repetitions: 3,
        nextReview: now,
        lastReviewed: now,
      });

      // Export
      const exportData = await exportAllData();

      // Clear database
      await db.problems.clear();
      await db.solutions.clear();
      await db.reviews.clear();

      // Import
      const result = await importData(exportData);
      expect(result.success).toBe(true);

      // Verify data preserved
      const problem = await db.problems.get('test-problem');
      expect(problem).toBeDefined();
      expect(problem?.title).toBe('Test Problem');
      expect(problem?.notes).toBe('Test notes with special chars: <>&"\'');

      const solution = await db.solutions.get('test-solution');
      expect(solution).toBeDefined();
      expect(solution?.code).toBe('function dp() { return "test"; }');

      const review = await db.reviews.get('test-problem');
      expect(review).toBeDefined();
      expect(review?.easeFactor).toBe(2.7);
    });
  });
});
