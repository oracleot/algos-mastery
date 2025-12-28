// hooks/useProblems.ts - Hook for managing problems with CRUD operations

import { useState, useCallback } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/db';
import { generateId } from '@/lib/utils';
import type { Problem, ProblemFormData, ProblemFilters, Status } from '@/types';

interface UseProblemsReturn {
  /** List of problems matching current filters, undefined while loading */
  problems: Problem[] | undefined;
  /** Whether the initial load is in progress */
  isLoading: boolean;
  /** Error if the last operation failed */
  error: Error | null;
  /** Add a new problem */
  addProblem: (data: ProblemFormData) => Promise<string>;
  /** Update an existing problem */
  updateProblem: (id: string, data: Partial<ProblemFormData>) => Promise<void>;
  /** Delete a problem by ID */
  deleteProblem: (id: string) => Promise<void>;
  /** Update only the status of a problem */
  updateStatus: (id: string, status: Status) => Promise<void>;
  /** Get a single problem by ID */
  getProblem: (id: string) => Promise<Problem | undefined>;
}

/**
 * Hook for managing problems with CRUD operations
 * Automatically subscribes to database changes via useLiveQuery
 *
 * @param filters - Optional filters to apply to the problem list
 * @returns Problem list and CRUD operations
 */
export function useProblems(filters?: ProblemFilters): UseProblemsReturn {
  const [error, setError] = useState<Error | null>(null);

  // Reactive query for problems list
  const problems = useLiveQuery(async () => {
    const collection = db.problems.orderBy('createdAt').reverse();
    let results = await collection.toArray();

    // Apply filters if provided
    if (filters) {
      if (filters.topic) {
        results = results.filter((p) => p.topic === filters.topic);
      }
      if (filters.difficulty) {
        results = results.filter((p) => p.difficulty === filters.difficulty);
      }
      if (filters.status) {
        results = results.filter((p) => p.status === filters.status);
      }
      if (filters.search && filters.search.trim()) {
        const searchLower = filters.search.toLowerCase().trim();
        results = results.filter(
          (p) =>
            p.title.toLowerCase().includes(searchLower) ||
            p.notes.toLowerCase().includes(searchLower)
        );
      }
    }

    return results;
  }, [filters?.topic, filters?.difficulty, filters?.status, filters?.search]);

  const isLoading = problems === undefined;

  /**
   * Add a new problem to the database
   */
  const addProblem = useCallback(async (data: ProblemFormData): Promise<string> => {
    try {
      setError(null);
      const now = new Date();
      const id = generateId();

      const problem: Problem = {
        id,
        title: data.title.trim(),
        url: data.url.trim() || null,
        topic: data.topic as Problem['topic'],
        difficulty: data.difficulty as Problem['difficulty'],
        status: 'unsolved',
        notes: data.notes.trim(),
        createdAt: now,
        updatedAt: now,
      };

      await db.problems.add(problem);
      return id;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to add problem');
      setError(error);
      throw error;
    }
  }, []);

  /**
   * Update an existing problem
   */
  const updateProblem = useCallback(
    async (id: string, data: Partial<ProblemFormData>): Promise<void> => {
      try {
        setError(null);

        const updates: Partial<Omit<Problem, 'id' | 'createdAt'>> = {
          updatedAt: new Date(),
        };

        if (data.title !== undefined) {
          updates.title = data.title.trim();
        }
        if (data.url !== undefined) {
          updates.url = data.url.trim() || null;
        }
        if (data.topic !== undefined && data.topic !== '') {
          updates.topic = data.topic as Problem['topic'];
        }
        if (data.difficulty !== undefined && data.difficulty !== '') {
          updates.difficulty = data.difficulty as Problem['difficulty'];
        }
        if (data.notes !== undefined) {
          updates.notes = data.notes.trim();
        }

        await db.problems.update(id, updates);
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to update problem');
        setError(error);
        throw error;
      }
    },
    []
  );

  /**
   * Delete a problem by ID
   */
  const deleteProblem = useCallback(async (id: string): Promise<void> => {
    try {
      setError(null);
      await db.problems.delete(id);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to delete problem');
      setError(error);
      throw error;
    }
  }, []);

  /**
   * Update only the status of a problem
   */
  const updateStatus = useCallback(async (id: string, status: Status): Promise<void> => {
    try {
      setError(null);
      await db.problems.update(id, {
        status,
        updatedAt: new Date(),
      });
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to update status');
      setError(error);
      throw error;
    }
  }, []);

  /**
   * Get a single problem by ID
   */
  const getProblem = useCallback(async (id: string): Promise<Problem | undefined> => {
    try {
      setError(null);
      return await db.problems.get(id);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to get problem');
      setError(error);
      throw error;
    }
  }, []);

  return {
    problems,
    isLoading,
    error,
    addProblem,
    updateProblem,
    deleteProblem,
    updateStatus,
    getProblem,
  };
}
