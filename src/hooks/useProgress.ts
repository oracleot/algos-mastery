// hooks/useProgress.ts - Hook for topic mastery and unlock status

import { useMemo, useCallback } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/db';
import { TOPICS } from '@/data/topics';
import { calculateMasteryPercent, isTopicUnlocked } from '@/lib/mastery';
import type { TopicProgress, TopicSlug } from '@/types';

interface UseProgressReturn {
  /** Progress for all topics, undefined while loading */
  progress: TopicProgress[] | undefined;
  /** Whether loading */
  isLoading: boolean;
  /** Get progress for a specific topic */
  getTopicProgress: (topic: TopicSlug) => TopicProgress | undefined;
  /** Check if a topic is unlocked */
  isTopicUnlocked: (topic: TopicSlug) => boolean;
  /** Get the next topic to unlock */
  nextToUnlock: TopicProgress | null;
}

/**
 * Hook for topic mastery and unlock status
 * Automatically recalculates when problems change
 */
export function useProgress(): UseProgressReturn {
  // Subscribe to problems table for reactive updates
  const problems = useLiveQuery(() => db.problems.toArray());

  // Calculate progress from problems
  const progress = useMemo(() => {
    if (problems === undefined) {
      return undefined;
    }

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
    progressData.forEach((p, index) => {
      p.unlocked = isTopicUnlocked(p.topic, progressData, index);
    });

    return progressData;
  }, [problems]);

  const isLoading = progress === undefined;

  const getTopicProgressFn = useCallback(
    (topic: TopicSlug): TopicProgress | undefined => {
      return progress?.find((p) => p.topic === topic);
    },
    [progress]
  );

  const isTopicUnlockedFn = useCallback(
    (topic: TopicSlug): boolean => {
      const topicProgress = progress?.find((p) => p.topic === topic);
      return topicProgress?.unlocked ?? false;
    },
    [progress]
  );

  const nextToUnlock = useMemo((): TopicProgress | null => {
    if (!progress) return null;

    // Find the first locked topic that has a previous topic with problems
    for (let i = 1; i < progress.length; i++) {
      const current = progress[i];
      const prev = progress[i - 1];

      if (current && prev && !current.unlocked && prev.totalProblems > 0) {
        return current;
      }
    }

    return null;
  }, [progress]);

  return {
    progress,
    isLoading,
    getTopicProgress: getTopicProgressFn,
    isTopicUnlocked: isTopicUnlockedFn,
    nextToUnlock,
  };
}
