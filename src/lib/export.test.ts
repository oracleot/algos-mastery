// lib/export.test.ts - Tests for export functionality

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { db } from '@/lib/db';
import { exportAllData, generateChecksum, getExportPreview } from './export';

describe('export', () => {
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

  describe('generateChecksum', () => {
    it('generates a SHA-256 hash string', async () => {
      const data = { test: 'data' };
      const checksum = await generateChecksum(data);

      expect(checksum).toBeDefined();
      expect(typeof checksum).toBe('string');
      expect(checksum.length).toBe(64); // SHA-256 produces 64 hex chars
    });

    it('produces consistent checksums for same data', async () => {
      const data = { test: 'data', nested: { value: 123 } };
      const checksum1 = await generateChecksum(data);
      const checksum2 = await generateChecksum(data);

      expect(checksum1).toBe(checksum2);
    });

    it('produces different checksums for different data', async () => {
      const data1 = { test: 'data1' };
      const data2 = { test: 'data2' };
      const checksum1 = await generateChecksum(data1);
      const checksum2 = await generateChecksum(data2);

      expect(checksum1).not.toBe(checksum2);
    });
  });

  describe('getExportPreview', () => {
    it('returns correct counts for empty database', async () => {
      const preview = await getExportPreview();

      expect(preview.problems).toBe(0);
      expect(preview.solutions).toBe(0);
      expect(preview.reviews).toBe(0);
      expect(preview.reviewHistory).toBe(0);
      expect(preview.timeLogs).toBe(0);
      expect(preview.estimatedSize).toBeDefined();
    });

    it('returns correct counts for populated database', async () => {
      // Add test data
      await db.problems.add({
        id: 'problem-1',
        title: 'Two Sum',
        url: 'https://leetcode.com/problems/two-sum',
        topic: 'arrays-hashing',
        difficulty: 'easy',
        status: 'solved',
        notes: 'Test notes',
        resources: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await db.solutions.add({
        id: 'solution-1',
        problemId: 'problem-1',
        code: 'console.log("hello")',
        language: 'javascript',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await db.reviews.add({
        problemId: 'problem-1',
        easeFactor: 2.5,
        interval: 1,
        repetitions: 0,
        nextReview: new Date(),
        lastReviewed: null,
      });

      const preview = await getExportPreview();

      expect(preview.problems).toBe(1);
      expect(preview.solutions).toBe(1);
      expect(preview.reviews).toBe(1);
      expect(preview.reviewHistory).toBe(0);
      expect(preview.timeLogs).toBe(0);
    });

    it('returns estimated size as formatted string', async () => {
      const preview = await getExportPreview();

      expect(typeof preview.estimatedSize).toBe('string');
      expect(preview.estimatedSize).toMatch(/\d+(\.\d+)?\s*(B|KB|MB)/);
    });
  });

  describe('exportAllData', () => {
    it('includes all required fields in export', async () => {
      const exportData = await exportAllData();

      expect(exportData).toHaveProperty('version');
      expect(exportData).toHaveProperty('exportedAt');
      expect(exportData).toHaveProperty('appVersion');
      expect(exportData).toHaveProperty('checksum');
      expect(exportData).toHaveProperty('data');
    });

    it('includes all tables in data field', async () => {
      const exportData = await exportAllData();

      expect(exportData.data).toHaveProperty('problems');
      expect(exportData.data).toHaveProperty('solutions');
      expect(exportData.data).toHaveProperty('reviews');
      expect(exportData.data).toHaveProperty('reviewHistory');
      expect(exportData.data).toHaveProperty('timeLogs');
    });

    it('exports all problems correctly', async () => {
      await db.problems.add({
        id: 'problem-1',
        title: 'Two Sum',
        url: 'https://leetcode.com/problems/two-sum',
        topic: 'arrays-hashing',
        difficulty: 'easy',
        status: 'solved',
        notes: 'Test notes',
        resources: [],
        createdAt: new Date('2025-01-01'),
        updatedAt: new Date('2025-01-02'),
      });

      const exportData = await exportAllData();

      expect(exportData.data.problems).toHaveLength(1);
      expect(exportData.data.problems[0].id).toBe('problem-1');
      expect(exportData.data.problems[0].title).toBe('Two Sum');
    });

    it('exports all solutions correctly', async () => {
      await db.solutions.add({
        id: 'solution-1',
        problemId: 'problem-1',
        code: 'function twoSum() {}',
        language: 'javascript',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const exportData = await exportAllData();

      expect(exportData.data.solutions).toHaveLength(1);
      expect(exportData.data.solutions[0].code).toBe('function twoSum() {}');
    });

    it('exports reviews and review history correctly', async () => {
      await db.reviews.add({
        problemId: 'problem-1',
        easeFactor: 2.5,
        interval: 3,
        repetitions: 1,
        nextReview: new Date(),
        lastReviewed: new Date(),
      });

      await db.reviewHistory.add({
        id: 'history-1',
        problemId: 'problem-1',
        quality: 4,
        reviewedAt: new Date(),
        intervalBefore: 1,
        intervalAfter: 3,
      });

      const exportData = await exportAllData();

      expect(exportData.data.reviews).toHaveLength(1);
      expect(exportData.data.reviewHistory).toHaveLength(1);
    });

    it('exports time logs correctly', async () => {
      await db.timeLogs.add({
        problemId: 'problem-1',
        totalSeconds: 600,
        sessions: [
          {
            startedAt: new Date('2025-01-01T10:00:00'),
            endedAt: new Date('2025-01-01T10:10:00'),
            durationSeconds: 600,
          },
        ],
      });

      const exportData = await exportAllData();

      expect(exportData.data.timeLogs).toHaveLength(1);
      expect(exportData.data.timeLogs[0].totalSeconds).toBe(600);
    });

    it('generates valid JSON output', async () => {
      const exportData = await exportAllData();
      const json = JSON.stringify(exportData);
      const parsed = JSON.parse(json);

      expect(parsed).toEqual(exportData);
    });

    it('generates valid checksum for the data', async () => {
      await db.problems.add({
        id: 'problem-1',
        title: 'Test',
        url: null,
        topic: 'arrays-hashing',
        difficulty: 'easy',
        status: 'unsolved',
        notes: '',
        resources: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const exportData = await exportAllData();
      const expectedChecksum = await generateChecksum(exportData.data);

      expect(exportData.checksum).toBe(expectedChecksum);
    });

    it('uses ISO format for exportedAt timestamp', async () => {
      const exportData = await exportAllData();

      expect(exportData.exportedAt).toMatch(
        /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/
      );
    });

    it('includes current version string', async () => {
      const exportData = await exportAllData();

      expect(exportData.version).toBeDefined();
      expect(typeof exportData.version).toBe('string');
    });
  });
});
