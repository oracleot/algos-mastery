// lib/db.ts - Dexie database schema for IndexedDB

import Dexie, { type Table } from 'dexie';
import type { Problem } from '../types';

/**
 * Database singleton for the Algorithms Mastery Tracker
 * Uses IndexedDB via Dexie.js for local-first persistence
 */
export class AlgoMasteryDB extends Dexie {
  problems!: Table<Problem>;

  constructor() {
    super('AlgoMasteryDB');

    this.version(1).stores({
      // Primary key: id
      // Indexed fields: topic, difficulty, status, createdAt
      problems: 'id, topic, difficulty, status, createdAt',
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
