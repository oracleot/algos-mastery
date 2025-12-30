// hooks/useSuggestedProblem.test.ts - Tests for useSuggestedProblem hook

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { db } from '@/lib/db';
import { useSuggestedProblem } from './useSuggestedProblem';
import type { Problem } from '@/types';

describe('useSuggestedProblem', () => {
  const createProblem = (
    id: string,
    topic: Problem['topic'],
    status: Problem['status']
  ): Problem => ({
    id,
    title: `Problem ${id}`,
    url: null,
    topic,
    difficulty: 'medium',
    status,
    notes: '',
    resources: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  beforeEach(async () => {
    // Clear all data before each test
    await db.problems.clear();
  });

  afterEach(async () => {
    await db.problems.clear();
  });

  it('returns null suggestion when no problems exist', async () => {
    const { result } = renderHook(() => useSuggestedProblem());

    await waitFor(() => {
      expect(result.current.reason).toBe('No problems added yet');
    });

    expect(result.current.suggestion).toBeNull();
    expect(result.current.topic).toBeNull();
  });

  it('returns unsolved problem from weakest topic', async () => {
    // Add problems: arrays-hashing has 50% mastery (1/2), two-pointers has 100% (1/1)
    await db.problems.bulkAdd([
      createProblem('p1', 'arrays-hashing', 'solved'),
      createProblem('p2', 'arrays-hashing', 'unsolved'),
      createProblem('p3', 'two-pointers', 'solved'),
    ]);

    const { result } = renderHook(() => useSuggestedProblem());

    await waitFor(() => {
      expect(result.current.suggestion).not.toBeNull();
    });

    // Should suggest the unsolved problem from arrays-hashing (weaker topic)
    expect(result.current.suggestion?.id).toBe('p2');
    expect(result.current.topic?.topic).toBe('arrays-hashing');
    expect(result.current.reason).toContain('arrays');
  });

  it('returns null when all problems are solved', async () => {
    await db.problems.bulkAdd([
      createProblem('p1', 'arrays-hashing', 'solved'),
      createProblem('p2', 'two-pointers', 'solved'),
    ]);

    const { result } = renderHook(() => useSuggestedProblem());

    await waitFor(() => {
      expect(result.current.reason).toBe('All problems solved!');
    });

    expect(result.current.suggestion).toBeNull();
  });

  it('refresh function gets a new suggestion', async () => {
    // Add multiple unsolved problems in the same topic
    await db.problems.bulkAdd([
      createProblem('p1', 'arrays-hashing', 'unsolved'),
      createProblem('p2', 'arrays-hashing', 'unsolved'),
      createProblem('p3', 'arrays-hashing', 'unsolved'),
    ]);

    const { result } = renderHook(() => useSuggestedProblem());

    await waitFor(() => {
      expect(result.current.suggestion).not.toBeNull();
    });

    // Refresh multiple times to potentially get different suggestions
    // Due to randomness, we can't guarantee a different result, but we can verify
    // the function executes without error
    act(() => {
      result.current.refresh();
    });

    await waitFor(() => {
      expect(result.current.suggestion).not.toBeNull();
    });

    // The suggestion should still be a valid problem from the topic
    expect(result.current.suggestion?.topic).toBe('arrays-hashing');
    expect(['p1', 'p2', 'p3']).toContain(result.current.suggestion?.id);
  });

  it('provides meaningful reason for suggestion', async () => {
    await db.problems.bulkAdd([
      createProblem('p1', 'dynamic-programming', 'unsolved'),
    ]);

    const { result } = renderHook(() => useSuggestedProblem());

    await waitFor(() => {
      expect(result.current.suggestion).not.toBeNull();
    });

    expect(result.current.reason).toContain('Strengthen');
    expect(result.current.reason).toContain('dynamic programming');
  });

  it('prioritizes topic with lowest mastery percentage', async () => {
    // Topic A: 0% mastery (0/2)
    // Topic B: 50% mastery (1/2)
    await db.problems.bulkAdd([
      createProblem('p1', 'stack', 'unsolved'),
      createProblem('p2', 'stack', 'unsolved'),
      createProblem('p3', 'binary-search', 'solved'),
      createProblem('p4', 'binary-search', 'unsolved'),
    ]);

    const { result } = renderHook(() => useSuggestedProblem());

    await waitFor(() => {
      expect(result.current.suggestion).not.toBeNull();
    });

    // Should suggest from stack (0% mastery) not binary-search (50%)
    expect(result.current.topic?.topic).toBe('stack');
    expect(['p1', 'p2']).toContain(result.current.suggestion?.id);
  });
});
