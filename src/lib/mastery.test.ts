// lib/mastery.test.ts - Tests for mastery calculation logic

import { describe, it, expect, beforeEach } from 'vitest';
import { addProblem, clearAllProblems } from './db';
import { calculateTopicProgress, calculateMasteryPercent, isTopicUnlocked } from './mastery';
import type { Problem } from '../types';

// Helper to create a test problem
function createTestProblem(overrides: Partial<Problem> = {}): Problem {
  return {
    id: crypto.randomUUID(),
    title: 'Test Problem',
    url: null,
    topic: 'arrays-hashing',
    difficulty: 'easy',
    status: 'unsolved',
    notes: '',
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  };
}

describe('Mastery Calculation', () => {
  beforeEach(async () => {
    await clearAllProblems();
  });

  describe('calculateMasteryPercent', () => {
    it('should return 0 for no solved problems', () => {
      const percent = calculateMasteryPercent(0, 5);
      expect(percent).toBe(0);
    });

    it('should return 0 when total is 0', () => {
      const percent = calculateMasteryPercent(0, 0);
      expect(percent).toBe(0);
    });

    it('should return 100 when all problems solved', () => {
      const percent = calculateMasteryPercent(5, 5);
      expect(percent).toBe(100);
    });

    it('should round to nearest integer', () => {
      const percent = calculateMasteryPercent(1, 3);
      expect(percent).toBe(33); // 33.33... rounded down

      const percent2 = calculateMasteryPercent(2, 3);
      expect(percent2).toBe(67); // 66.66... rounded up
    });

    it('should calculate 70% correctly', () => {
      const percent = calculateMasteryPercent(7, 10);
      expect(percent).toBe(70);
    });
  });

  describe('isTopicUnlocked', () => {
    it('should unlock first topic (arrays-hashing) by default', () => {
      const progress = [
        { topic: 'arrays-hashing' as const, topicName: 'Arrays & Hashing', totalProblems: 0, solvedProblems: 0, masteryPercent: 0, unlocked: true },
      ];
      expect(isTopicUnlocked('arrays-hashing', progress, 0)).toBe(true);
    });

    it('should lock second topic when first has 0 problems', () => {
      const progress = [
        { topic: 'arrays-hashing' as const, topicName: 'Arrays & Hashing', totalProblems: 0, solvedProblems: 0, masteryPercent: 0, unlocked: true },
        { topic: 'two-pointers' as const, topicName: 'Two Pointers', totalProblems: 0, solvedProblems: 0, masteryPercent: 0, unlocked: false },
      ];
      expect(isTopicUnlocked('two-pointers', progress, 1)).toBe(false);
    });

    it('should unlock second topic when first has >=70% mastery', () => {
      const progress = [
        { topic: 'arrays-hashing' as const, topicName: 'Arrays & Hashing', totalProblems: 10, solvedProblems: 7, masteryPercent: 70, unlocked: true },
        { topic: 'two-pointers' as const, topicName: 'Two Pointers', totalProblems: 0, solvedProblems: 0, masteryPercent: 0, unlocked: true },
      ];
      expect(isTopicUnlocked('two-pointers', progress, 1)).toBe(true);
    });

    it('should NOT unlock second topic when first has <70% mastery', () => {
      const progress = [
        { topic: 'arrays-hashing' as const, topicName: 'Arrays & Hashing', totalProblems: 10, solvedProblems: 6, masteryPercent: 60, unlocked: true },
        { topic: 'two-pointers' as const, topicName: 'Two Pointers', totalProblems: 0, solvedProblems: 0, masteryPercent: 0, unlocked: false },
      ];
      expect(isTopicUnlocked('two-pointers', progress, 1)).toBe(false);
    });

    it('should handle exactly 70% threshold', () => {
      const progress = [
        { topic: 'arrays-hashing' as const, topicName: 'Arrays & Hashing', totalProblems: 10, solvedProblems: 7, masteryPercent: 70, unlocked: true },
        { topic: 'two-pointers' as const, topicName: 'Two Pointers', totalProblems: 0, solvedProblems: 0, masteryPercent: 0, unlocked: true },
      ];
      expect(isTopicUnlocked('two-pointers', progress, 1)).toBe(true);
    });

    it('should handle 69% as NOT unlocking next topic', () => {
      const progress = [
        { topic: 'arrays-hashing' as const, topicName: 'Arrays & Hashing', totalProblems: 100, solvedProblems: 69, masteryPercent: 69, unlocked: true },
        { topic: 'two-pointers' as const, topicName: 'Two Pointers', totalProblems: 0, solvedProblems: 0, masteryPercent: 0, unlocked: false },
      ];
      expect(isTopicUnlocked('two-pointers', progress, 1)).toBe(false);
    });
  });

  describe('calculateTopicProgress', () => {
    it('should return all 15 topics', async () => {
      const progress = await calculateTopicProgress();
      expect(progress).toHaveLength(15);
    });

    it('should have first topic always unlocked', async () => {
      const progress = await calculateTopicProgress();
      const first = progress[0];
      expect(first?.topic).toBe('arrays-hashing');
      expect(first?.unlocked).toBe(true);
    });

    it('should have second topic locked when first has no problems', async () => {
      const progress = await calculateTopicProgress();
      const second = progress[1];
      expect(second?.topic).toBe('two-pointers');
      expect(second?.unlocked).toBe(false);
    });

    it('should calculate correct mastery for topic with problems', async () => {
      // Add 10 problems, 7 solved
      for (let i = 0; i < 10; i++) {
        await addProblem(createTestProblem({
          id: `test-${i}`,
          title: `Problem ${i}`,
          topic: 'arrays-hashing',
          status: i < 7 ? 'solved' : 'unsolved',
        }));
      }

      const progress = await calculateTopicProgress();
      const arraysHashing = progress.find((p) => p.topic === 'arrays-hashing');

      expect(arraysHashing?.totalProblems).toBe(10);
      expect(arraysHashing?.solvedProblems).toBe(7);
      expect(arraysHashing?.masteryPercent).toBe(70);
    });

    it('should unlock next topic when previous has 70% mastery', async () => {
      // Add 10 problems to first topic, 7 solved (70%)
      for (let i = 0; i < 10; i++) {
        await addProblem(createTestProblem({
          id: `arrays-${i}`,
          title: `Arrays Problem ${i}`,
          topic: 'arrays-hashing',
          status: i < 7 ? 'solved' : 'unsolved',
        }));
      }

      const progress = await calculateTopicProgress();
      const twoPointers = progress.find((p) => p.topic === 'two-pointers');

      expect(twoPointers?.unlocked).toBe(true);
    });

    it('should NOT unlock next topic when previous has 69% mastery', async () => {
      // Add 100 problems to first topic, 69 solved (69%)
      for (let i = 0; i < 100; i++) {
        await addProblem(createTestProblem({
          id: `arrays-${i}`,
          title: `Arrays Problem ${i}`,
          topic: 'arrays-hashing',
          status: i < 69 ? 'solved' : 'unsolved',
        }));
      }

      const progress = await calculateTopicProgress();
      const twoPointers = progress.find((p) => p.topic === 'two-pointers');

      expect(twoPointers?.unlocked).toBe(false);
    });

    it('should handle empty database', async () => {
      const progress = await calculateTopicProgress();

      // All topics should have 0 problems
      progress.forEach((p) => {
        expect(p.totalProblems).toBe(0);
        expect(p.solvedProblems).toBe(0);
        expect(p.masteryPercent).toBe(0);
      });

      // Only first topic should be unlocked
      expect(progress[0]?.unlocked).toBe(true);
      expect(progress[1]?.unlocked).toBe(false);
    });

    it('should handle multiple topics with different progress', async () => {
      // First topic: 10 problems, 8 solved (80%)
      for (let i = 0; i < 10; i++) {
        await addProblem(createTestProblem({
          id: `arrays-${i}`,
          topic: 'arrays-hashing',
          status: i < 8 ? 'solved' : 'unsolved',
        }));
      }

      // Second topic: 5 problems, 4 solved (80%)
      for (let i = 0; i < 5; i++) {
        await addProblem(createTestProblem({
          id: `pointers-${i}`,
          topic: 'two-pointers',
          status: i < 4 ? 'solved' : 'unsolved',
        }));
      }

      const progress = await calculateTopicProgress();

      const arrays = progress.find((p) => p.topic === 'arrays-hashing');
      expect(arrays?.masteryPercent).toBe(80);
      expect(arrays?.unlocked).toBe(true);

      const pointers = progress.find((p) => p.topic === 'two-pointers');
      expect(pointers?.masteryPercent).toBe(80);
      expect(pointers?.unlocked).toBe(true);

      // Third topic should also be unlocked (previous has 80%)
      const slidingWindow = progress.find((p) => p.topic === 'sliding-window');
      expect(slidingWindow?.unlocked).toBe(true);
    });

    it('should count only solved status as solved', async () => {
      await addProblem(createTestProblem({
        id: 'unsolved-1',
        topic: 'arrays-hashing',
        status: 'unsolved',
      }));
      await addProblem(createTestProblem({
        id: 'attempted-1',
        topic: 'arrays-hashing',
        status: 'attempted',
      }));
      await addProblem(createTestProblem({
        id: 'solved-1',
        topic: 'arrays-hashing',
        status: 'solved',
      }));

      const progress = await calculateTopicProgress();
      const arrays = progress.find((p) => p.topic === 'arrays-hashing');

      expect(arrays?.totalProblems).toBe(3);
      expect(arrays?.solvedProblems).toBe(1);
      expect(arrays?.masteryPercent).toBe(33);
    });
  });
});
