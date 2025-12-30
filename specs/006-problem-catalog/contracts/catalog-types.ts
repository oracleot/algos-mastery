/**
 * Catalog Types Contract
 * 
 * @feature 006-problem-catalog
 * @description TypeScript interfaces for the Problem Catalog feature
 */

import type { TopicSlug, Difficulty } from '@/types';

// =========================================
// Catalog Source Constants
// =========================================

/**
 * Valid sources for catalog problems
 */
export const CATALOG_SOURCES = ['blind-75', 'neetcode-150', 'grind-75', 'curated'] as const;

/**
 * Type for catalog problem source attribution
 */
export type CatalogSource = (typeof CATALOG_SOURCES)[number];

// =========================================
// Catalog Problem Entity
// =========================================

/**
 * Represents a curated problem in the static catalog.
 * This is read-only data bundled with the application.
 */
export interface CatalogProblem {
  /** Unique slug identifier (e.g., "two-sum", "valid-parentheses") */
  id: string;
  
  /** Problem title as shown on LeetCode */
  title: string;
  
  /** Direct LeetCode problem URL */
  url: string;
  
  /** Algorithm topic category */
  topic: TopicSlug;
  
  /** Difficulty level */
  difficulty: Difficulty;
  
  /** Source attribution for the problem */
  source: CatalogSource;
  
  /** Suggested order within topic (1 = do first) */
  order: number;
  
  /** Optional: LeetCode problem number for reference */
  leetcodeNumber?: number;
}

// =========================================
// Catalog Filter State
// =========================================

/**
 * Filter state for the catalog page
 */
export interface CatalogFilters {
  /** Filter by algorithm topic */
  topic: TopicSlug | null;
  
  /** Filter by difficulty level */
  difficulty: Difficulty | null;
  
  /** Filter by problem source */
  source: CatalogSource | null;
  
  /** Text search on problem title */
  search: string;
}

// =========================================
// Hook Return Types
// =========================================

/**
 * Return type for useCatalogRecommendations hook
 */
export interface UseCatalogRecommendationsReturn {
  /** Top recommended problems to add next */
  recommendations: CatalogProblem[];
  
  /** All catalog problems not yet added by user */
  availableProblems: CatalogProblem[];
  
  /** Check if a catalog problem URL is already in user's list */
  isAdded: (url: string) => boolean;
  
  /** Whether data is still loading */
  isLoading: boolean;
}

// =========================================
// Component Props
// =========================================

/**
 * Props for CatalogCard component
 */
export interface CatalogCardProps {
  /** The catalog problem to display */
  problem: CatalogProblem;
  
  /** Whether this problem is already in user's list */
  isAdded: boolean;
  
  /** Callback when user clicks "Add to My Problems" */
  onAdd: () => void;
}

/**
 * Props for CatalogFilters component
 */
export interface CatalogFiltersProps {
  /** Current filter values */
  filters: CatalogFilters;
  
  /** Called when topic filter changes */
  onTopicChange: (topic: TopicSlug | null) => void;
  
  /** Called when difficulty filter changes */
  onDifficultyChange: (difficulty: Difficulty | null) => void;
  
  /** Called when source filter changes */
  onSourceChange: (source: CatalogSource | null) => void;
  
  /** Called when search text changes */
  onSearchChange: (search: string) => void;
  
  /** Called when clear all button clicked */
  onClearAll: () => void;
  
  /** Whether any filter is active */
  hasActiveFilters: boolean;
}

/**
 * Props for SourceBadge component
 */
export interface SourceBadgeProps {
  /** The source to display */
  source: CatalogSource;
  
  /** Additional CSS classes */
  className?: string;
}

/**
 * Props for CatalogRecommendationRow component
 */
export interface CatalogRecommendationRowProps {
  /** The catalog problem to display */
  problem: CatalogProblem;
  
  /** Callback when user clicks "Add" */
  onAdd: () => void;
}

// =========================================
// Helper Function Signatures
// =========================================

/**
 * Get catalog problems filtered by topic
 * @param topic - The topic slug to filter by
 * @returns Sorted array of catalog problems for that topic
 */
export type GetCatalogByTopic = (topic: TopicSlug) => CatalogProblem[];

/**
 * Get catalog problems filtered by source
 * @param source - The source to filter by
 * @returns Array of catalog problems from that source
 */
export type GetCatalogBySource = (source: CatalogSource) => CatalogProblem[];

/**
 * Normalize a URL for comparison
 * @param url - The URL to normalize
 * @returns Normalized URL (lowercase, no trailing slash)
 */
export type NormalizeUrl = (url: string) => string;
