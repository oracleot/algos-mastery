// lib/db.ts - Dexie database schema for IndexedDB

import Dexie, { type Table } from 'dexie';
import type { Problem, Solution, Review, ReviewHistory, ReviewQuality, ProblemTimeLog } from '../types';
import { calculateSM2, SM2_DEFAULTS } from './sm2';
import { calculateStreak } from './streak';
import { calculateWeeklyStats, type DailyStat } from './stats';
import { startOfDay } from 'date-fns';

/**
 * Database singleton for the Algorithms Mastery Tracker
 * Uses IndexedDB via Dexie.js for local-first persistence
 */
export class AlgoMasteryDB extends Dexie {
  problems!: Table<Problem>;
  solutions!: Table<Solution>;
  reviews!: Table<Review>;
  reviewHistory!: Table<ReviewHistory>;
  timeLogs!: Table<ProblemTimeLog>;

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

    // v3: Add reviews and reviewHistory tables for spaced repetition
    this.version(3).stores({
      problems: 'id, topic, difficulty, status, createdAt',
      solutions: 'id, problemId, language, createdAt',
      reviews: 'problemId, nextReview',
      reviewHistory: 'id, problemId, reviewedAt',
    });

    // v4: Add timeLogs table for timed practice feature
    this.version(4).stores({
      problems: 'id, topic, difficulty, status, createdAt',
      solutions: 'id, problemId, language, createdAt',
      reviews: 'problemId, nextReview',
      reviewHistory: 'id, problemId, reviewedAt',
      timeLogs: 'problemId',
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
 * Delete a problem and all its associated data (cascade delete)
 * Deletes: solutions, reviews, reviewHistory, timeLogs
 * @param problemId - The ID of the problem to delete
 */
export async function deleteProblemWithSolutions(problemId: string): Promise<void> {
  await db.transaction('rw', [db.problems, db.solutions, db.reviews, db.reviewHistory, db.timeLogs], async () => {
    // Delete time logs for this problem
    await db.timeLogs.delete(problemId);
    // Delete all review history for this problem
    await db.reviewHistory.where('problemId').equals(problemId).delete();
    // Delete the review record
    await db.reviews.delete(problemId);
    // Delete all solutions for this problem
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

// =========================================
// Review CRUD Operations (Spaced Repetition)
// =========================================

/**
 * Get problems due for review today (or overdue)
 */
export async function getDueToday(): Promise<Array<{ problem: Problem; review: Review }>> {
  const today = startOfDay(new Date());
  
  // Get reviews due today or earlier
  const dueReviews = await db.reviews
    .where('nextReview')
    .belowOrEqual(today)
    .toArray();
  
  const results: Array<{ problem: Problem; review: Review }> = [];
  
  for (const review of dueReviews) {
    const problem = await db.problems.get(review.problemId);
    if (problem) {
      results.push({ problem, review });
    }
  }
  
  return results;
}

/**
 * Add a problem to the review system
 */
export async function addToReview(problemId: string): Promise<void> {
  const existing = await db.reviews.get(problemId);
  if (existing) return; // Already in review system
  
  const today = startOfDay(new Date());
  
  await db.reviews.add({
    problemId,
    easeFactor: SM2_DEFAULTS.easeFactor,
    interval: SM2_DEFAULTS.interval,
    repetitions: SM2_DEFAULTS.repetitions,
    nextReview: today, // Due immediately
    lastReviewed: null,
  });
}

/**
 * Force add a problem to today's queue (override next review date)
 */
export async function addToTodayQueue(problemId: string): Promise<void> {
  const existing = await db.reviews.get(problemId);
  const today = startOfDay(new Date());
  
  if (existing) {
    // Update nextReview to today
    await db.reviews.update(problemId, { nextReview: today });
  } else {
    // Add to review system with today as next review
    await addToReview(problemId);
  }
}

/**
 * Record a review rating for a problem with SM-2 calculation
 */
export async function recordReview(
  problemId: string,
  quality: ReviewQuality
): Promise<void> {
  const review = await db.reviews.get(problemId);
  if (!review) throw new Error('Problem not in review system');
  
  const sm2Result = calculateSM2({
    quality,
    repetitions: review.repetitions,
    easeFactor: review.easeFactor,
    interval: review.interval,
  });
  
  const now = new Date();
  
  await db.transaction('rw', [db.reviews, db.reviewHistory], async () => {
    // Update review record
    await db.reviews.update(problemId, {
      easeFactor: sm2Result.easeFactor,
      interval: sm2Result.interval,
      repetitions: sm2Result.repetitions,
      nextReview: sm2Result.nextReview,
      lastReviewed: now,
    });
    
    // Add to history
    await db.reviewHistory.add({
      id: crypto.randomUUID(),
      problemId,
      quality,
      reviewedAt: now,
      intervalBefore: review.interval,
      intervalAfter: sm2Result.interval,
    });
  });
}

/**
 * Get review data for a specific problem
 */
export async function getReview(problemId: string): Promise<Review | undefined> {
  return await db.reviews.get(problemId);
}

/**
 * Get all reviews
 */
export async function getAllReviews(): Promise<Review[]> {
  return await db.reviews.toArray();
}

/**
 * Get streak information calculated from review history
 */
export async function getStreak(): Promise<{
  currentStreak: number;
  longestStreak: number;
  lastReviewDate: Date | null;
}> {
  const history = await db.reviewHistory
    .orderBy('reviewedAt')
    .reverse()
    .toArray();
  
  const reviewDates = history.map((h) => h.reviewedAt);
  return calculateStreak(reviewDates);
}

/**
 * Get weekly statistics for the dashboard chart
 */
export async function getWeeklyStats(): Promise<DailyStat[]> {
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  weekAgo.setHours(0, 0, 0, 0);
  
  const history = await db.reviewHistory
    .where('reviewedAt')
    .above(weekAgo)
    .toArray();
  
  return calculateWeeklyStats(history);
}

/**
 * Get suggested next problem from weakest unlocked topic
 */
export async function getSuggestedProblem(): Promise<{
  problem: Problem | null;
  reason: string;
  topic: string | null;
}> {
  const problems = await db.problems.toArray();
  
  if (problems.length === 0) {
    return { problem: null, reason: 'No problems added yet', topic: null };
  }
  
  // Calculate topic progress
  const topicStats = new Map<string, { total: number; solved: number }>();
  
  for (const problem of problems) {
    const stats = topicStats.get(problem.topic) || { total: 0, solved: 0 };
    stats.total++;
    if (problem.status === 'solved') {
      stats.solved++;
    }
    topicStats.set(problem.topic, stats);
  }
  
  // Find weakest topic with unsolved problems
  let weakestTopic: string | null = null;
  let lowestMastery = Infinity;
  
  for (const [topic, stats] of topicStats.entries()) {
    const mastery = stats.total > 0 ? (stats.solved / stats.total) * 100 : 0;
    if (mastery < 100 && mastery < lowestMastery) {
      lowestMastery = mastery;
      weakestTopic = topic;
    }
  }
  
  if (!weakestTopic) {
    return { problem: null, reason: 'All problems solved!', topic: null };
  }
  
  // Get unsolved problems from weakest topic
  const candidates = problems.filter(
    (p) => p.topic === weakestTopic && p.status !== 'solved'
  );
  
  if (candidates.length === 0) {
    return { problem: null, reason: 'No unsolved problems in weakest topic', topic: weakestTopic };
  }
  
  // Return random unsolved problem from weakest topic
  const randomIndex = Math.floor(Math.random() * candidates.length);
  const suggestion = candidates[randomIndex]!;
  
  return {
    problem: suggestion,
    reason: `Strengthen your ${weakestTopic.replace('-', ' ')} skills`,
    topic: weakestTopic,
  };
}
