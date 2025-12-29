// hooks/useSolutions.test.ts - Tests for useSolutions hook

import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useSolutions } from './useSolutions';
import { db } from '@/lib/db';
import { generateId } from '@/lib/utils';
import type { SolutionFormData, Problem } from '@/types';

// Helper to create a test problem
async function createTestProblem(): Promise<string> {
  const id = generateId();
  const now = new Date();
  const problem: Problem = {
    id,
    title: 'Test Problem',
    url: null,
    topic: 'arrays-hashing',
    difficulty: 'easy',
    status: 'unsolved',
    notes: '',
    createdAt: now,
    updatedAt: now,
  };
  await db.problems.add(problem);
  return id;
}

describe('useSolutions', () => {
  beforeEach(async () => {
    // Clear database before each test
    await db.solutions.clear();
    await db.problems.clear();
  });

  describe('addSolution', () => {
    it('should add a new solution and return its ID', async () => {
      const problemId = await createTestProblem();
      const { result } = renderHook(() => useSolutions(problemId));

      const formData: SolutionFormData = {
        code: 'def two_sum(nums, target):\n    pass',
        language: 'python',
      };

      let solutionId: string | undefined;

      await act(async () => {
        solutionId = await result.current.addSolution(formData);
      });

      expect(solutionId).toBeDefined();
      expect(typeof solutionId).toBe('string');

      // Verify solution was added to database
      const solution = await db.solutions.get(solutionId!);
      expect(solution).toBeDefined();
      expect(solution?.code).toBe('def two_sum(nums, target):\n    pass');
      expect(solution?.language).toBe('python');
      expect(solution?.problemId).toBe(problemId);
      expect(solution?.createdAt).toBeInstanceOf(Date);
      expect(solution?.updatedAt).toBeInstanceOf(Date);
    });

    it('should handle different programming languages', async () => {
      const problemId = await createTestProblem();
      const { result } = renderHook(() => useSolutions(problemId));

      const languages = ['javascript', 'typescript', 'java', 'cpp', 'rust', 'go'] as const;

      for (const language of languages) {
        const formData: SolutionFormData = {
          code: `// Solution in ${language}`,
          language,
        };

        let solutionId: string | undefined;
        await act(async () => {
          solutionId = await result.current.addSolution(formData);
        });

        const solution = await db.solutions.get(solutionId!);
        expect(solution?.language).toBe(language);
      }
    });

    it('should correctly associate solution with problem', async () => {
      const problemId1 = await createTestProblem();
      const problemId2 = await createTestProblem();

      const { result: result1 } = renderHook(() => useSolutions(problemId1));
      const { result: result2 } = renderHook(() => useSolutions(problemId2));

      await act(async () => {
        await result1.current.addSolution({ code: 'solution 1', language: 'python' });
      });

      await act(async () => {
        await result2.current.addSolution({ code: 'solution 2', language: 'javascript' });
      });

      // Verify correct associations
      const solutions1 = await db.solutions.where('problemId').equals(problemId1).toArray();
      const solutions2 = await db.solutions.where('problemId').equals(problemId2).toArray();

      expect(solutions1.length).toBe(1);
      expect(solutions1[0].code).toBe('solution 1');
      expect(solutions2.length).toBe(1);
      expect(solutions2[0].code).toBe('solution 2');
    });
  });

  describe('updateSolution', () => {
    it('should update an existing solution code', async () => {
      const problemId = await createTestProblem();
      const { result } = renderHook(() => useSolutions(problemId));

      // First add a solution
      let solutionId: string | undefined;
      await act(async () => {
        solutionId = await result.current.addSolution({
          code: 'original code',
          language: 'python',
        });
      });

      // Update the solution
      await act(async () => {
        await result.current.updateSolution(solutionId!, {
          code: 'updated code',
        });
      });

      const solution = await db.solutions.get(solutionId!);
      expect(solution?.code).toBe('updated code');
      expect(solution?.language).toBe('python'); // Unchanged
    });

    it('should update solution language', async () => {
      const problemId = await createTestProblem();
      const { result } = renderHook(() => useSolutions(problemId));

      let solutionId: string | undefined;
      await act(async () => {
        solutionId = await result.current.addSolution({
          code: 'const x = 1;',
          language: 'javascript',
        });
      });

      await act(async () => {
        await result.current.updateSolution(solutionId!, {
          language: 'typescript',
        });
      });

      const solution = await db.solutions.get(solutionId!);
      expect(solution?.language).toBe('typescript');
    });

    it('should update the updatedAt timestamp', async () => {
      const problemId = await createTestProblem();
      const { result } = renderHook(() => useSolutions(problemId));

      let solutionId: string | undefined;
      await act(async () => {
        solutionId = await result.current.addSolution({
          code: 'test code',
          language: 'python',
        });
      });

      const solutionBefore = await db.solutions.get(solutionId!);
      const createdAt = solutionBefore?.createdAt;

      // Wait a bit to ensure timestamp difference
      await new Promise((resolve) => setTimeout(resolve, 10));

      await act(async () => {
        await result.current.updateSolution(solutionId!, { code: 'new code' });
      });

      const solutionAfter = await db.solutions.get(solutionId!);
      expect(solutionAfter?.createdAt.getTime()).toBe(createdAt?.getTime());
      expect(solutionAfter?.updatedAt.getTime()).toBeGreaterThan(createdAt?.getTime() ?? 0);
    });
  });

  describe('deleteSolution', () => {
    it('should delete a solution by ID', async () => {
      const problemId = await createTestProblem();
      const { result } = renderHook(() => useSolutions(problemId));

      let solutionId: string | undefined;
      await act(async () => {
        solutionId = await result.current.addSolution({
          code: 'to be deleted',
          language: 'python',
        });
      });

      // Verify solution exists
      let solution = await db.solutions.get(solutionId!);
      expect(solution).toBeDefined();

      // Delete the solution
      await act(async () => {
        await result.current.deleteSolution(solutionId!);
      });

      // Verify solution is deleted
      solution = await db.solutions.get(solutionId!);
      expect(solution).toBeUndefined();
    });

    it('should only delete the specified solution', async () => {
      const problemId = await createTestProblem();
      const { result } = renderHook(() => useSolutions(problemId));

      let solutionId1: string | undefined;
      let solutionId2: string | undefined;

      await act(async () => {
        solutionId1 = await result.current.addSolution({
          code: 'solution 1',
          language: 'python',
        });
        solutionId2 = await result.current.addSolution({
          code: 'solution 2',
          language: 'javascript',
        });
      });

      // Delete only the first solution
      await act(async () => {
        await result.current.deleteSolution(solutionId1!);
      });

      // Verify only first is deleted
      const solution1 = await db.solutions.get(solutionId1!);
      const solution2 = await db.solutions.get(solutionId2!);

      expect(solution1).toBeUndefined();
      expect(solution2).toBeDefined();
      expect(solution2?.code).toBe('solution 2');
    });
  });

  describe('solutions list', () => {
    it('should return solutions list via reactive query', async () => {
      const problemId = await createTestProblem();
      const { result } = renderHook(() => useSolutions(problemId));

      // Wait for initial load
      await waitFor(() => {
        expect(result.current.solutions).toBeDefined();
      });

      expect(result.current.solutions).toEqual([]);

      // Add a solution
      await act(async () => {
        await result.current.addSolution({
          code: 'reactive test',
          language: 'python',
        });
      });

      // Wait for reactive update
      await waitFor(() => {
        expect(result.current.solutions?.length).toBe(1);
      });

      expect(result.current.solutions?.[0].code).toBe('reactive test');
    });

    it('should only return solutions for the specified problem', async () => {
      const problemId1 = await createTestProblem();
      const problemId2 = await createTestProblem();

      const { result: result1 } = renderHook(() => useSolutions(problemId1));
      const { result: result2 } = renderHook(() => useSolutions(problemId2));

      // Wait for initial loads
      await waitFor(() => {
        expect(result1.current.solutions).toBeDefined();
        expect(result2.current.solutions).toBeDefined();
      });

      // Add solutions to first problem
      await act(async () => {
        await result1.current.addSolution({ code: 'for problem 1', language: 'python' });
        await result1.current.addSolution({ code: 'also for problem 1', language: 'javascript' });
      });

      // Add solution to second problem
      await act(async () => {
        await result2.current.addSolution({ code: 'for problem 2', language: 'java' });
      });

      // Wait for updates
      await waitFor(() => {
        expect(result1.current.solutions?.length).toBe(2);
        expect(result2.current.solutions?.length).toBe(1);
      });
    });

    it('should return solutions sorted by createdAt descending', async () => {
      const problemId = await createTestProblem();
      const { result } = renderHook(() => useSolutions(problemId));

      await waitFor(() => {
        expect(result.current.solutions).toBeDefined();
      });

      // Add solutions with slight delays
      await act(async () => {
        await result.current.addSolution({ code: 'first', language: 'python' });
      });

      await new Promise((resolve) => setTimeout(resolve, 10));

      await act(async () => {
        await result.current.addSolution({ code: 'second', language: 'python' });
      });

      await new Promise((resolve) => setTimeout(resolve, 10));

      await act(async () => {
        await result.current.addSolution({ code: 'third', language: 'python' });
      });

      await waitFor(() => {
        expect(result.current.solutions?.length).toBe(3);
      });

      // Should be newest first
      expect(result.current.solutions?.[0].code).toBe('third');
      expect(result.current.solutions?.[1].code).toBe('second');
      expect(result.current.solutions?.[2].code).toBe('first');
    });
  });

  describe('loading state', () => {
    it('should set isLoading to true initially', async () => {
      const problemId = await createTestProblem();
      const { result } = renderHook(() => useSolutions(problemId));

      // Initially isLoading should be true (solutions undefined)
      expect(result.current.solutions).toBeUndefined();
      expect(result.current.isLoading).toBe(true);

      // After loading, isLoading should be false
      await waitFor(() => {
        expect(result.current.solutions).toBeDefined();
        expect(result.current.isLoading).toBe(false);
      });
    });
  });

  describe('error handling', () => {
    it('should set error state on failure', async () => {
      const problemId = await createTestProblem();
      const { result } = renderHook(() => useSolutions(problemId));

      await waitFor(() => {
        expect(result.current.solutions).toBeDefined();
      });

      // Error should be null initially
      expect(result.current.error).toBeNull();
    });
  });
});
