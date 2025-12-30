// hooks/useCatalogRecommendations.ts - Hook for catalog recommendations

import { useMemo } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/db';
import { TOPICS } from '@/data/topics';
import { PROBLEM_CATALOG } from '@/data/catalog';
import { normalizeUrl } from '@/lib/utils';
import type { CatalogProblem, TopicSlug, Difficulty } from '@/types';

interface UseCatalogRecommendationsReturn {
  /** Top recommended problems to add next */
  recommendations: CatalogProblem[];
  /** All catalog problems not yet added by user */
  availableProblems: CatalogProblem[];
  /** Check if a catalog problem URL is already in user's list */
  isAdded: (url: string) => boolean;
  /** Whether data is still loading */
  isLoading: boolean;
}

/** Difficulty sort order (easy first) */
const DIFFICULTY_ORDER: Record<Difficulty, number> = {
  easy: 0,
  medium: 1,
  hard: 2,
};

/**
 * Hook for getting catalog recommendations based on user's focus topic
 * @param count - Number of recommendations to return (default: 3)
 * @returns Recommendations, available problems, and utility functions
 */
export function useCatalogRecommendations(
  count = 3
): UseCatalogRecommendationsReturn {
  // Get all user problems to check for duplicates
  const problems = useLiveQuery(() => db.problems.toArray());

  const isLoading = problems === undefined;

  // Build a Set of normalized URLs for O(1) lookup
  const existingUrls = useMemo(() => {
    if (!problems) return new Set<string>();
    return new Set(
      problems
        .filter((p) => p.url)
        .map((p) => normalizeUrl(p.url!))
    );
  }, [problems]);

  // Check if a URL is already added
  const isAdded = useMemo(() => {
    return (url: string) => existingUrls.has(normalizeUrl(url));
  }, [existingUrls]);

  // Calculate topic progress to find focus topic
  const topicProgress = useMemo(() => {
    if (!problems) return null;

    return TOPICS.map((topic, index) => {
      const topicProblems = problems.filter((p) => p.topic === topic.slug);
      const solvedCount = topicProblems.filter(
        (p) => p.status === 'solved'
      ).length;
      const totalProblems = topicProblems.length;
      const masteryPercent =
        totalProblems === 0 ? 0 : Math.round((solvedCount / totalProblems) * 100);

      // Calculate unlock status
      let unlocked = false;
      if (index === 0) {
        unlocked = true;
      } else {
        const prevTopic = TOPICS[index - 1];
        const prevProblems = problems.filter((p) => p.topic === prevTopic.slug);
        const prevSolved = prevProblems.filter(
          (p) => p.status === 'solved'
        ).length;
        const prevTotal = prevProblems.length;
        const prevMastery =
          prevTotal === 0 ? 0 : Math.round((prevSolved / prevTotal) * 100);
        unlocked = prevTotal > 0 && prevMastery >= 70;
      }

      return {
        topic: topic.slug,
        masteryPercent,
        unlocked,
      };
    });
  }, [problems]);

  // Find the focus topic (lowest mastery unlocked topic with < 100% mastery)
  const focusTopic = useMemo((): TopicSlug | null => {
    if (!topicProgress) return null;

    const focusCandidates = topicProgress
      .filter((t) => t.unlocked && t.masteryPercent < 100)
      .sort((a, b) => a.masteryPercent - b.masteryPercent);

    return focusCandidates[0]?.topic ?? null;
  }, [topicProgress]);

  // Filter and sort available problems
  const { availableProblems, recommendations } = useMemo(() => {
    // Filter out already-added problems
    const available = PROBLEM_CATALOG.filter(
      (p) => !existingUrls.has(normalizeUrl(p.url))
    );

    if (available.length === 0 || !focusTopic) {
      return {
        availableProblems: available,
        recommendations: available.slice(0, count),
      };
    }

    // Sort by: focus topic first, then difficulty (easy→hard), then order
    const sorted = [...available].sort((a, b) => {
      // Focus topic problems come first
      const aIsFocus = a.topic === focusTopic ? 0 : 1;
      const bIsFocus = b.topic === focusTopic ? 0 : 1;
      if (aIsFocus !== bIsFocus) return aIsFocus - bIsFocus;

      // Then by difficulty (easy first)
      const diffA = DIFFICULTY_ORDER[a.difficulty];
      const diffB = DIFFICULTY_ORDER[b.difficulty];
      if (diffA !== diffB) return diffA - diffB;

      // Then by order within topic
      return a.order - b.order;
    });

    return {
      availableProblems: available,
      recommendations: sorted.slice(0, count),
    };
  }, [existingUrls, focusTopic, count]);

  return {
    recommendations,
    availableProblems,
    isAdded,
    isLoading,
  };
}
