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
} from './db';
import type { Problem } from '../types';

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
    ...overrides,
  };
}

describe('Database Operations', () => {
  beforeEach(async () => {
    // Clear database before each test
    await clearAllProblems();
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
});
