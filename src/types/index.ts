// types/index.ts - Core TypeScript types for Algorithms Mastery Tracker

// Difficulty levels for problems
export const DIFFICULTIES = ['easy', 'medium', 'hard'] as const;
export type Difficulty = (typeof DIFFICULTIES)[number];

// Problem progress statuses
export const STATUSES = ['unsolved', 'attempted', 'solved'] as const;
export type Status = (typeof STATUSES)[number];

// Topic slugs for algorithm categories (15 ordered topics)
export const TOPIC_SLUGS = [
  'arrays-hashing',
  'two-pointers',
  'sliding-window',
  'stack',
  'binary-search',
  'linked-list',
  'trees',
  'tries',
  'backtracking',
  'heap',
  'graphs',
  'dynamic-programming',
  'greedy',
  'intervals',
  'bit-manipulation',
] as const;
export type TopicSlug = (typeof TOPIC_SLUGS)[number];

// Static topic data structure
export interface Topic {
  slug: TopicSlug;
  name: string;
  order: number;
}

// Core Problem entity stored in IndexedDB
export interface Problem {
  id: string;
  title: string;
  url: string | null;
  topic: TopicSlug;
  difficulty: Difficulty;
  status: Status;
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

// Form data type for create/update operations
export interface ProblemFormData {
  title: string;
  url: string;
  topic: TopicSlug | '';
  difficulty: Difficulty | '';
  notes: string;
}

// Filter state for problem list
export interface ProblemFilters {
  topic: TopicSlug | null;
  difficulty: Difficulty | null;
  status: Status | null;
  search: string;
}

// Validation error messages
export interface ValidationErrors {
  title?: string;
  topic?: string;
  difficulty?: string;
  url?: string;
  notes?: string;
}
