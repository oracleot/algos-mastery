// lib/mastery.ts - Topic mastery calculation logic

import { db } from './db';
import { TOPICS } from '../data/topics';
import type { TopicProgress, TopicSlug } from '../types';

/**
 * Calculate mastery percentage from solved and total counts
 * @param solved - Number of solved problems
 * @param total - Total number of problems
 * @returns Mastery percentage (0-100)
 */
export function calculateMasteryPercent(solved: number, total: number): number {
  if (total === 0) {
    return 0;
  }
  return Math.round((solved / total) * 100);
}

/**
 * Check if a topic is unlocked based on previous topic's mastery
 * @param _topic - The topic to check (unused, index-based lookup)
 * @param progress - All topic progress data
 * @param topicIndex - Index of the topic in the ordered list
 * @returns Whether the topic is unlocked
 */
export function isTopicUnlocked(
  _topic: TopicSlug,
  progress: TopicProgress[],
  topicIndex: number
): boolean {
  // First topic is always unlocked
  if (topicIndex === 0) {
    return true;
  }

  // Check previous topic's mastery
  const prevProgress = progress[topicIndex - 1];
  if (!prevProgress) {
    return false;
  }

  // Need >=70% mastery AND at least one problem in previous topic
  return prevProgress.totalProblems > 0 && prevProgress.masteryPercent >= 70;
}

/**
 * Calculate progress for all topics
 * @returns Array of topic progress data
 */
export async function calculateTopicProgress(): Promise<TopicProgress[]> {
  const problems = await db.problems.toArray();

  // First pass: calculate mastery for each topic
  const progressData: TopicProgress[] = TOPICS.map((topic) => {
    const topicProblems = problems.filter((p) => p.topic === topic.slug);
    const solvedCount = topicProblems.filter((p) => p.status === 'solved').length;
    const totalProblems = topicProblems.length;

    const masteryPercent = calculateMasteryPercent(solvedCount, totalProblems);

    return {
      topic: topic.slug,
      topicName: topic.name,
      totalProblems,
      solvedProblems: solvedCount,
      masteryPercent,
      unlocked: false, // Will be set in second pass
    };
  });

  // Second pass: determine unlock status based on previous topic's mastery
  progressData.forEach((progress, index) => {
    progress.unlocked = isTopicUnlocked(progress.topic, progressData, index);
  });

  return progressData;
}

/**
 * Get progress for a specific topic
 * @param topic - The topic slug to get progress for
 * @returns Topic progress data or undefined if not found
 */
export async function getTopicProgress(topic: TopicSlug): Promise<TopicProgress | undefined> {
  const allProgress = await calculateTopicProgress();
  return allProgress.find((p) => p.topic === topic);
}

/**
 * Get the next topic that can be unlocked
 * @returns The next locked topic that has a chance to be unlocked, or null
 */
export async function getNextToUnlock(): Promise<TopicProgress | null> {
  const allProgress = await calculateTopicProgress();

  // Find the first locked topic
  for (let i = 1; i < allProgress.length; i++) {
    const current = allProgress[i];
    const prev = allProgress[i - 1];

    if (current && prev && !current.unlocked && prev.totalProblems > 0) {
      return current;
    }
  }

  return null;
}
