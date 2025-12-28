// hooks/useProblems.test.ts - Tests for useProblems hook

import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useProblems } from './useProblems';
import { db } from '@/lib/db';
import type { ProblemFormData } from '@/types';

describe('useProblems', () => {
  beforeEach(async () => {
    // Clear database before each test
    await db.problems.clear();
  });

  describe('addProblem', () => {
    it('should add a new problem and return its ID', async () => {
      const { result } = renderHook(() => useProblems());

      const formData: ProblemFormData = {
        title: 'Two Sum',
        url: 'https://leetcode.com/problems/two-sum',
        topic: 'arrays-hashing',
        difficulty: 'easy',
        notes: 'Use a hash map',
      };

      let problemId: string | undefined;

      await act(async () => {
        problemId = await result.current.addProblem(formData);
      });

      expect(problemId).toBeDefined();
      expect(typeof problemId).toBe('string');

      // Verify problem was added to database
      const problem = await db.problems.get(problemId!);
      expect(problem).toBeDefined();
      expect(problem?.title).toBe('Two Sum');
      expect(problem?.topic).toBe('arrays-hashing');
      expect(problem?.difficulty).toBe('easy');
      expect(problem?.status).toBe('unsolved');
      expect(problem?.createdAt).toBeInstanceOf(Date);
      expect(problem?.updatedAt).toBeInstanceOf(Date);
    });

    it('should set default status to unsolved', async () => {
      const { result } = renderHook(() => useProblems());

      const formData: ProblemFormData = {
        title: 'Valid Parentheses',
        url: '',
        topic: 'stack',
        difficulty: 'easy',
        notes: '',
      };

      let problemId: string | undefined;

      await act(async () => {
        problemId = await result.current.addProblem(formData);
      });

      const problem = await db.problems.get(problemId!);
      expect(problem?.status).toBe('unsolved');
    });

    it('should handle null URL when empty string provided', async () => {
      const { result } = renderHook(() => useProblems());

      const formData: ProblemFormData = {
        title: 'Binary Search',
        url: '',
        topic: 'binary-search',
        difficulty: 'easy',
        notes: '',
      };

      let problemId: string | undefined;

      await act(async () => {
        problemId = await result.current.addProblem(formData);
      });

      const problem = await db.problems.get(problemId!);
      expect(problem?.url).toBeNull();
    });
  });

  describe('updateProblem', () => {
    it('should update an existing problem', async () => {
      const { result } = renderHook(() => useProblems());

      // First add a problem
      const formData: ProblemFormData = {
        title: 'Original Title',
        url: '',
        topic: 'arrays-hashing',
        difficulty: 'easy',
        notes: 'Original notes',
      };

      let problemId: string | undefined;

      await act(async () => {
        problemId = await result.current.addProblem(formData);
      });

      // Update the problem
      await act(async () => {
        await result.current.updateProblem(problemId!, {
          title: 'Updated Title',
          notes: 'Updated notes',
        });
      });

      const problem = await db.problems.get(problemId!);
      expect(problem?.title).toBe('Updated Title');
      expect(problem?.notes).toBe('Updated notes');
      expect(problem?.topic).toBe('arrays-hashing'); // Unchanged
    });

    it('should update the updatedAt timestamp', async () => {
      const { result } = renderHook(() => useProblems());

      const formData: ProblemFormData = {
        title: 'Test Problem',
        url: '',
        topic: 'trees',
        difficulty: 'medium',
        notes: '',
      };

      let problemId: string | undefined;

      await act(async () => {
        problemId = await result.current.addProblem(formData);
      });

      const problemBefore = await db.problems.get(problemId!);
      const createdAt = problemBefore?.createdAt;

      // Wait a bit to ensure timestamp difference
      await new Promise((resolve) => setTimeout(resolve, 10));

      await act(async () => {
        await result.current.updateProblem(problemId!, { title: 'New Title' });
      });

      const problemAfter = await db.problems.get(problemId!);
      expect(problemAfter?.createdAt.getTime()).toBe(createdAt?.getTime());
      expect(problemAfter?.updatedAt.getTime()).toBeGreaterThanOrEqual(
        createdAt?.getTime() ?? 0
      );
    });
  });

  describe('deleteProblem', () => {
    it('should delete a problem by ID', async () => {
      const { result } = renderHook(() => useProblems());

      const formData: ProblemFormData = {
        title: 'To Be Deleted',
        url: '',
        topic: 'graphs',
        difficulty: 'hard',
        notes: '',
      };

      let problemId: string | undefined;

      await act(async () => {
        problemId = await result.current.addProblem(formData);
      });

      // Verify problem exists
      let problem = await db.problems.get(problemId!);
      expect(problem).toBeDefined();

      // Delete the problem
      await act(async () => {
        await result.current.deleteProblem(problemId!);
      });

      // Verify problem is deleted
      problem = await db.problems.get(problemId!);
      expect(problem).toBeUndefined();
    });
  });

  describe('updateStatus', () => {
    it('should update problem status', async () => {
      const { result } = renderHook(() => useProblems());

      const formData: ProblemFormData = {
        title: 'Status Test',
        url: '',
        topic: 'dynamic-programming',
        difficulty: 'hard',
        notes: '',
      };

      let problemId: string | undefined;

      await act(async () => {
        problemId = await result.current.addProblem(formData);
      });

      // Check initial status
      let problem = await db.problems.get(problemId!);
      expect(problem?.status).toBe('unsolved');

      // Update to attempted
      await act(async () => {
        await result.current.updateStatus(problemId!, 'attempted');
      });

      problem = await db.problems.get(problemId!);
      expect(problem?.status).toBe('attempted');

      // Update to solved
      await act(async () => {
        await result.current.updateStatus(problemId!, 'solved');
      });

      problem = await db.problems.get(problemId!);
      expect(problem?.status).toBe('solved');
    });
  });

  describe('getProblem', () => {
    it('should get a problem by ID', async () => {
      const { result } = renderHook(() => useProblems());

      const formData: ProblemFormData = {
        title: 'Get Test',
        url: 'https://example.com',
        topic: 'heap',
        difficulty: 'medium',
        notes: 'Test notes',
      };

      let problemId: string | undefined;

      await act(async () => {
        problemId = await result.current.addProblem(formData);
      });

      let fetchedProblem;
      await act(async () => {
        fetchedProblem = await result.current.getProblem(problemId!);
      });

      expect(fetchedProblem).toBeDefined();
      expect(fetchedProblem?.title).toBe('Get Test');
      expect(fetchedProblem?.url).toBe('https://example.com');
    });

    it('should return undefined for non-existent problem', async () => {
      const { result } = renderHook(() => useProblems());

      let fetchedProblem;
      await act(async () => {
        fetchedProblem = await result.current.getProblem('non-existent-id');
      });

      expect(fetchedProblem).toBeUndefined();
    });
  });

  describe('problems list', () => {
    it('should return problems list via reactive query', async () => {
      const { result } = renderHook(() => useProblems());

      // Wait for initial load
      await waitFor(() => {
        expect(result.current.problems).toBeDefined();
      });

      expect(result.current.problems).toEqual([]);

      // Add a problem
      await act(async () => {
        await result.current.addProblem({
          title: 'Reactive Test',
          url: '',
          topic: 'tries',
          difficulty: 'medium',
          notes: '',
        });
      });

      // Wait for reactive update
      await waitFor(() => {
        expect(result.current.problems?.length).toBe(1);
      });

      expect(result.current.problems?.[0].title).toBe('Reactive Test');
    });
  });
});
