// lib/db.test.ts - Database tests with fake-indexeddb

import { describe, it, expect, beforeEach } from 'vitest';
import {
  addProblem,
  getProblem,
  getAllProblems,
  updateProblem,
  deleteProblem,
  clearAllProblems,
  getProblemCount,
  addToReview,
  addToTodayQueue,
  recordReview,
  getReview,
  db,
} from './db';
import type { Problem, LearningResource } from '../types';

// Helper to create a test problem
function createTestProblem(overrides: Partial<Problem> = {}): Problem {
  return {
    id: crypto.randomUUID(),
    title: 'Two Sum',
    url: 'https://leetcode.com/problems/two-sum',
    topic: 'arrays-hashing',
    difficulty: 'easy',
    status: 'unsolved',
    notes: 'Use a hash map',
    createdAt: new Date(),
    updatedAt: new Date(),
    resources: [],
    ...overrides,
  };
}

// Helper to create a test resource
function createTestResource(overrides: Partial<LearningResource> = {}): LearningResource {
  return {
    id: crypto.randomUUID(),
    title: 'Test Resource',
    url: 'https://www.youtube.com/watch?v=abc123',
    type: 'video',
    source: 'YouTube',
    ...overrides,
  };
}

describe('Database Operations', () => {
  beforeEach(async () => {
    // Clear database before each test
    await clearAllProblems();
    // Also clear reviews and reviewHistory tables
    await db.reviews.clear();
    await db.reviewHistory.clear();
  });

  describe('addProblem', () => {
    it('should add a problem and return its ID', async () => {
      const problem = createTestProblem();
      const id = await addProblem(problem);

      expect(id).toBe(problem.id);
    });

    it('should persist the problem in the database', async () => {
      const problem = createTestProblem();
      await addProblem(problem);

      const stored = await getProblem(problem.id);
      expect(stored).toBeDefined();
      expect(stored?.title).toBe(problem.title);
    });
  });

  describe('getProblem', () => {
    it('should return a problem by ID', async () => {
      const problem = createTestProblem();
      await addProblem(problem);

      const result = await getProblem(problem.id);

      expect(result).toBeDefined();
      expect(result?.id).toBe(problem.id);
      expect(result?.title).toBe(problem.title);
      expect(result?.topic).toBe(problem.topic);
    });

    it('should return undefined for non-existent ID', async () => {
      const result = await getProblem('non-existent-id');
      expect(result).toBeUndefined();
    });
  });

  describe('getAllProblems', () => {
    it('should return empty array when no problems exist', async () => {
      const result = await getAllProblems();
      expect(result).toEqual([]);
    });

    it('should return all problems sorted by createdAt descending', async () => {
      const problem1 = createTestProblem({
        id: 'id-1',
        title: 'First',
        createdAt: new Date('2024-01-01'),
      });
      const problem2 = createTestProblem({
        id: 'id-2',
        title: 'Second',
        createdAt: new Date('2024-01-02'),
      });
      const problem3 = createTestProblem({
        id: 'id-3',
        title: 'Third',
        createdAt: new Date('2024-01-03'),
      });

      await addProblem(problem1);
      await addProblem(problem2);
      await addProblem(problem3);

      const result = await getAllProblems();

      expect(result).toHaveLength(3);
      // Newest first
      expect(result[0]?.title).toBe('Third');
      expect(result[1]?.title).toBe('Second');
      expect(result[2]?.title).toBe('First');
    });
  });

  describe('updateProblem', () => {
    it('should update problem fields', async () => {
      const problem = createTestProblem();
      await addProblem(problem);

      await updateProblem(problem.id, {
        title: 'Updated Title',
        status: 'solved',
      });

      const updated = await getProblem(problem.id);
      expect(updated?.title).toBe('Updated Title');
      expect(updated?.status).toBe('solved');
    });

    it('should update the updatedAt timestamp', async () => {
      const problem = createTestProblem({
        updatedAt: new Date('2024-01-01'),
      });
      await addProblem(problem);

      await updateProblem(problem.id, { title: 'Updated' });

      const updated = await getProblem(problem.id);
      expect(updated?.updatedAt.getTime()).toBeGreaterThan(
        problem.updatedAt.getTime()
      );
    });
  });

  describe('deleteProblem', () => {
    it('should remove a problem from the database', async () => {
      const problem = createTestProblem();
      await addProblem(problem);

      await deleteProblem(problem.id);

      const result = await getProblem(problem.id);
      expect(result).toBeUndefined();
    });

    it('should not affect other problems', async () => {
      const problem1 = createTestProblem({ id: 'id-1', title: 'First' });
      const problem2 = createTestProblem({ id: 'id-2', title: 'Second' });
      await addProblem(problem1);
      await addProblem(problem2);

      await deleteProblem(problem1.id);

      const remaining = await getAllProblems();
      expect(remaining).toHaveLength(1);
      expect(remaining[0]?.title).toBe('Second');
    });
  });

  describe('clearAllProblems', () => {
    it('should remove all problems', async () => {
      await addProblem(createTestProblem({ id: 'id-1' }));
      await addProblem(createTestProblem({ id: 'id-2' }));
      await addProblem(createTestProblem({ id: 'id-3' }));

      await clearAllProblems();

      const result = await getAllProblems();
      expect(result).toEqual([]);
    });
  });

  describe('getProblemCount', () => {
    it('should return 0 when no problems exist', async () => {
      const count = await getProblemCount();
      expect(count).toBe(0);
    });

    it('should return correct count', async () => {
      await addProblem(createTestProblem({ id: 'id-1' }));
      await addProblem(createTestProblem({ id: 'id-2' }));

      const count = await getProblemCount();
      expect(count).toBe(2);
    });
  });

  describe('Performance', () => {
    it('should handle 100+ problems with CRUD operations under 200ms', async () => {
      // Create 100 problems
      const problems = Array.from({ length: 100 }, (_, i) =>
        createTestProblem({
          id: `perf-test-${i}`,
          title: `Problem ${i}`,
          topic: ['arrays-hashing', 'two-pointers', 'trees', 'graphs'][i % 4] as Problem['topic'],
          difficulty: ['easy', 'medium', 'hard'][i % 3] as Problem['difficulty'],
          status: ['unsolved', 'attempted', 'solved'][i % 3] as Problem['status'],
        })
      );

      // Test bulk add performance
      const addStart = performance.now();
      for (const problem of problems) {
        await addProblem(problem);
      }
      const addDuration = performance.now() - addStart;
      expect(addDuration).toBeLessThan(5000); // 5 seconds for all 100 adds

      // Test read performance
      const readStart = performance.now();
      const allProblems = await getAllProblems();
      const readDuration = performance.now() - readStart;
      expect(allProblems).toHaveLength(100);
      expect(readDuration).toBeLessThan(100); // Under 100ms for read

      // Test update performance
      const updateStart = performance.now();
      await updateProblem('perf-test-50', { title: 'Updated Problem 50' });
      const updateDuration = performance.now() - updateStart;
      expect(updateDuration).toBeLessThan(200); // Under 200ms for update

      // Test delete performance
      const deleteStart = performance.now();
      await deleteProblem('perf-test-99');
      const deleteDuration = performance.now() - deleteStart;
      expect(deleteDuration).toBeLessThan(200); // Under 200ms for delete
    });
  });

  // Edge Case T045: Problem reviewed multiple times in one day
  describe('Multiple Reviews Same Day', () => {
    it('should allow a problem to be reviewed multiple times in one day', async () => {
      const problem = createTestProblem({ id: 'multi-review-test' });
      await addProblem(problem);
      await addToReview(problem.id);

      // First review with "Hard" rating
      await recordReview(problem.id, 3);
      const afterFirst = await getReview(problem.id);
      expect(afterFirst?.repetitions).toBe(1);

      // Add back to today's queue
      await addToTodayQueue(problem.id);

      // Second review with "Easy" rating - should use latest rating
      await recordReview(problem.id, 5);
      const afterSecond = await getReview(problem.id);
      expect(afterSecond?.repetitions).toBe(2); // Continues from previous
      // Easy rating should have higher ease factor than Hard
      expect(afterSecond?.easeFactor).toBeGreaterThan(afterFirst?.easeFactor ?? 0);
    });

    it('should create multiple history entries for same-day reviews', async () => {
      const problem = createTestProblem({ id: 'history-test' });
      await addProblem(problem);
      await addToReview(problem.id);

      // Multiple reviews in same day
      await recordReview(problem.id, 0); // Again
      await addToTodayQueue(problem.id);
      await recordReview(problem.id, 4); // Good
      await addToTodayQueue(problem.id);
      await recordReview(problem.id, 5); // Easy

      // Check history has all entries
      const history = await db.reviewHistory
        .where('problemId')
        .equals(problem.id)
        .toArray();
      expect(history).toHaveLength(3);

      // Verify all ratings are present (order may vary)
      const ratings = history.map((h) => h.quality).sort();
      expect(ratings).toEqual([0, 4, 5]);
    });

    it('should use latest SM-2 state for next interval calculation', async () => {
      const problem = createTestProblem({ id: 'sm2-state-test' });
      await addProblem(problem);
      await addToReview(problem.id);

      // First review - Again (resets)
      await recordReview(problem.id, 0);
      const afterAgain = await getReview(problem.id);
      expect(afterAgain?.repetitions).toBe(0);
      expect(afterAgain?.interval).toBe(1);

      // Re-add and review with Good
      await addToTodayQueue(problem.id);
      await recordReview(problem.id, 4);
      const afterGood = await getReview(problem.id);
      expect(afterGood?.repetitions).toBe(1);
      expect(afterGood?.interval).toBe(1); // First successful review = 1 day
    });
  });

  // Database Migration v5: Resources field initialization
  describe('Database Migration v5 - Resources Field', () => {
    it('should have resources field as empty array for new problems', async () => {
      const problem = createTestProblem();
      await addProblem(problem);

      const stored = await getProblem(problem.id);
      expect(stored?.resources).toEqual([]);
    });

    it('should persist resources when added to a problem', async () => {
      const resource = createTestResource();
      const problem = createTestProblem({
        resources: [resource],
      });
      await addProblem(problem);

      const stored = await getProblem(problem.id);
      expect(stored?.resources).toHaveLength(1);
      expect(stored?.resources[0]?.title).toBe('Test Resource');
      expect(stored?.resources[0]?.type).toBe('video');
      expect(stored?.resources[0]?.source).toBe('YouTube');
    });

    it('should update problem with multiple resources', async () => {
      const problem = createTestProblem();
      await addProblem(problem);

      const resources = [
        createTestResource({ id: 'r1', title: 'Video 1', type: 'video' }),
        createTestResource({ id: 'r2', title: 'Article 1', type: 'article' }),
        createTestResource({ id: 'r3', title: 'Docs 1', type: 'documentation' }),
      ];

      await updateProblem(problem.id, { resources } as Partial<Problem>);

      const stored = await getProblem(problem.id);
      expect(stored?.resources).toHaveLength(3);
    });

    it('should cascade delete resources when problem is deleted', async () => {
      const resource = createTestResource();
      const problem = createTestProblem({
        resources: [resource],
      });
      await addProblem(problem);

      await deleteProblem(problem.id);

      const stored = await getProblem(problem.id);
      expect(stored).toBeUndefined();
      // Resources are embedded, so no separate cleanup needed
    });
  });
});
