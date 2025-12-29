// hooks/useSolutions.ts - Hook for managing solutions with CRUD operations

import { useState, useCallback } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/db';
import { generateId } from '@/lib/utils';
import type { Solution, SolutionFormData } from '@/types';

interface UseSolutionsReturn {
  /** Solutions for the specified problem, undefined while loading */
  solutions: Solution[] | undefined;
  /** Whether the initial load is in progress */
  isLoading: boolean;
  /** Error if the last operation failed */
  error: Error | null;
  /** Add a new solution */
  addSolution: (data: SolutionFormData) => Promise<string>;
  /** Update an existing solution */
  updateSolution: (id: string, data: Partial<SolutionFormData>) => Promise<void>;
  /** Delete a solution by ID */
  deleteSolution: (id: string) => Promise<void>;
}

/**
 * Hook for managing solutions for a specific problem
 * Automatically subscribes to database changes via useLiveQuery
 *
 * @param problemId - The problem to get solutions for
 * @returns Solution list and CRUD operations
 */
export function useSolutions(problemId: string): UseSolutionsReturn {
  const [error, setError] = useState<Error | null>(null);

  // Reactive query for solutions list, sorted by createdAt descending
  const solutions = useLiveQuery(async () => {
    return await db.solutions
      .where('problemId')
      .equals(problemId)
      .reverse()
      .sortBy('createdAt');
  }, [problemId]);

  const isLoading = solutions === undefined;

  /**
   * Add a new solution to the database
   */
  const addSolution = useCallback(
    async (data: SolutionFormData): Promise<string> => {
      try {
        setError(null);
        const now = new Date();
        const id = generateId();

        const solution: Solution = {
          id,
          problemId,
          code: data.code,
          language: data.language,
          createdAt: now,
          updatedAt: now,
        };

        await db.solutions.add(solution);
        return id;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to add solution');
        setError(error);
        throw error;
      }
    },
    [problemId]
  );

  /**
   * Update an existing solution
   */
  const updateSolution = useCallback(
    async (id: string, data: Partial<SolutionFormData>): Promise<void> => {
      try {
        setError(null);

        const updates: Partial<Omit<Solution, 'id' | 'problemId' | 'createdAt'>> = {
          updatedAt: new Date(),
        };

        if (data.code !== undefined) {
          updates.code = data.code;
        }
        if (data.language !== undefined) {
          updates.language = data.language;
        }

        await db.solutions.update(id, updates);
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to update solution');
        setError(error);
        throw error;
      }
    },
    []
  );

  /**
   * Delete a solution by ID
   */
  const deleteSolution = useCallback(async (id: string): Promise<void> => {
    try {
      setError(null);
      await db.solutions.delete(id);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to delete solution');
      setError(error);
      throw error;
    }
  }, []);

  return {
    solutions,
    isLoading,
    error,
    addSolution,
    updateSolution,
    deleteSolution,
  };
}
