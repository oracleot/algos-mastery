// lib/db.ts - Dexie database schema for IndexedDB

import Dexie, { type Table } from 'dexie';
import type { Problem, Solution } from '../types';

/**
 * Database singleton for the Algorithms Mastery Tracker
 * Uses IndexedDB via Dexie.js for local-first persistence
 */
export class AlgoMasteryDB extends Dexie {
  problems!: Table<Problem>;
  solutions!: Table<Solution>;

  constructor() {
    super('AlgoMasteryDB');

    this.version(1).stores({
      // Primary key: id
      // Indexed fields: topic, difficulty, status, createdAt
      problems: 'id, topic, difficulty, status, createdAt',
    });

    // v2: Add solutions table for solution journal feature
    this.version(2).stores({
      problems: 'id, topic, difficulty, status, createdAt',
      solutions: 'id, problemId, language, createdAt',
    });
  }
}

// Database singleton instance
export const db = new AlgoMasteryDB();

// CRUD Operations

/**
 * Add a new problem to the database
 */
export async function addProblem(problem: Problem): Promise<string> {
  return await db.problems.add(problem);
}

/**
 * Get a problem by ID
 */
export async function getProblem(id: string): Promise<Problem | undefined> {
  return await db.problems.get(id);
}

/**
 * Get all problems
 */
export async function getAllProblems(): Promise<Problem[]> {
  return await db.problems.orderBy('createdAt').reverse().toArray();
}

/**
 * Update an existing problem
 */
export async function updateProblem(
  id: string,
  updates: Partial<Omit<Problem, 'id' | 'createdAt'>>
): Promise<void> {
  await db.problems.update(id, {
    ...updates,
    updatedAt: new Date(),
  });
}

/**
 * Delete a problem by ID
 */
export async function deleteProblem(id: string): Promise<void> {
  await db.problems.delete(id);
}

/**
 * Delete a problem and all its associated solutions (cascade delete)
 * @param problemId - The ID of the problem to delete
 */
export async function deleteProblemWithSolutions(problemId: string): Promise<void> {
  await db.transaction('rw', [db.problems, db.solutions], async () => {
    // First delete all solutions for this problem
    await db.solutions.where('problemId').equals(problemId).delete();
    // Then delete the problem itself
    await db.problems.delete(problemId);
  });
}

/**
 * Clear all problems from the database
 */
export async function clearAllProblems(): Promise<void> {
  await db.problems.clear();
}

/**
 * Get problem count
 */
export async function getProblemCount(): Promise<number> {
  return await db.problems.count();
}

// Solution CRUD Operations

/**
 * Add a new solution to the database
 */
export async function addSolution(solution: Solution): Promise<string> {
  return await db.solutions.add(solution);
}

/**
 * Get a solution by ID
 */
export async function getSolution(id: string): Promise<Solution | undefined> {
  return await db.solutions.get(id);
}

/**
 * Get all solutions for a specific problem
 */
export async function getSolutionsForProblem(problemId: string): Promise<Solution[]> {
  return await db.solutions
    .where('problemId')
    .equals(problemId)
    .reverse()
    .sortBy('createdAt');
}

/**
 * Update an existing solution
 */
export async function updateSolution(
  id: string,
  updates: Partial<Omit<Solution, 'id' | 'problemId' | 'createdAt'>>
): Promise<void> {
  await db.solutions.update(id, {
    ...updates,
    updatedAt: new Date(),
  });
}

/**
 * Delete a solution by ID
 */
export async function deleteSolution(id: string): Promise<void> {
  await db.solutions.delete(id);
}

/**
 * Delete all solutions for a specific problem
 */
export async function deleteSolutionsForProblem(problemId: string): Promise<number> {
  return await db.solutions.where('problemId').equals(problemId).delete();
}

/**
 * Get solution count for a specific problem
 */
export async function getSolutionCount(problemId: string): Promise<number> {
  return await db.solutions.where('problemId').equals(problemId).count();
}

/**
 * Clear all solutions from the database
 */
export async function clearAllSolutions(): Promise<void> {
  await db.solutions.clear();
}
