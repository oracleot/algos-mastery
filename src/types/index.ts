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

// =========================================
// Solution Journal Types (002-solution-journal)
// =========================================

// Supported programming languages for solutions
export const SUPPORTED_LANGUAGES = [
  'javascript',
  'typescript',
  'python',
  'java',
  'cpp',
  'rust',
  'go',
  'plaintext',
] as const;
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

// Solution entity stored in IndexedDB
export interface Solution {
  id: string;
  problemId: string;
  code: string;
  language: SupportedLanguage;
  createdAt: Date;
  updatedAt: Date;
}

// Form data type for solution create/update operations
export interface SolutionFormData {
  code: string;
  language: SupportedLanguage;
}

// Solution validation error messages
export interface SolutionValidationErrors {
  code?: string;
  language?: string;
}

// Languages supported for template code generation
export type TemplateLanguage = Exclude<SupportedLanguage, 'plaintext'>;

// Pattern template for algorithm categories (static, not persisted)
export interface Template {
  id: string;
  topic: TopicSlug;
  name: string;
  description: string;
  /** Code snippets for each supported language */
  codeByLanguage: Partial<Record<TemplateLanguage, string>>;
  /** Fallback language when requested language is not available */
  defaultLanguage: TemplateLanguage;
}

// Computed topic mastery and unlock status
export interface TopicProgress {
  topic: TopicSlug;
  topicName: string;
  totalProblems: number;
  solvedProblems: number;
  masteryPercent: number;
  unlocked: boolean;
}

// =========================================
// Spaced Repetition Types (003-spaced-repetition)
// =========================================

// Review quality ratings for SM-2 algorithm
export type ReviewQuality = 0 | 3 | 4 | 5;

export const REVIEW_RATINGS = {
  AGAIN: 0,
  HARD: 3,
  GOOD: 4,
  EASY: 5,
} as const;

// Spaced repetition state for a problem
export interface Review {
  problemId: string;
  easeFactor: number;
  interval: number;
  repetitions: number;
  nextReview: Date;
  lastReviewed: Date | null;
}

// Individual review event for history tracking
export interface ReviewHistory {
  id: string;
  problemId: string;
  quality: ReviewQuality;
  reviewedAt: Date;
  intervalBefore: number;
  intervalAfter: number;
}

// Daily statistics for weekly chart
export interface DailyStat {
  date: string;
  reviewed: number;
  again: number;
  hard: number;
  good: number;
  easy: number;
}

// Streak information computed from review history
export interface StreakInfo {
  currentStreak: number;
  longestStreak: number;
  lastReviewDate: Date | null;
}

// Manual queue override for adding problems to today's queue
export interface QueueOverride {
  problemId: string;
  addedAt: Date;
}

// =========================================
// Timed Practice Types (004-practice-polish)
// =========================================

// Individual time session for a problem
export interface TimeSession {
  startedAt: Date;
  endedAt: Date;
  durationSeconds: number;
}

// Time log for a problem (persisted in IndexedDB)
export interface ProblemTimeLog {
  problemId: string;
  totalSeconds: number;
  sessions: TimeSession[];
}

// Timed practice session state (in-memory)
export interface PracticeSessionState {
  id: string;
  problemId: string | null;
  startedAt: Date;
  duration: number;
  elapsed: number;
  remaining: number;
  isRunning: boolean;
  isPaused: boolean;
  problemsCompleted: string[];
}

// Theme preference
export type Theme = 'light' | 'dark' | 'system';

// User preferences (stored in localStorage)
export interface UserPreferences {
  theme: Theme;
  defaultTimerMinutes: number;
  keyboardShortcutsEnabled: boolean;
  showInstallPrompt: boolean;
}

// Export data structure
export interface ExportData {
  version: string;
  exportedAt: string;
  appVersion: string;
  checksum: string;
  data: {
    problems: Problem[];
    solutions: Solution[];
    reviews: Review[];
    reviewHistory: ReviewHistory[];
    timeLogs: ProblemTimeLog[];
  };
}

// Import result
export interface ImportResult {
  success: boolean;
  error?: string;
  stats?: {
    problems: number;
    solutions: number;
    reviews: number;
    reviewHistory: number;
    timeLogs: number;
  };
}

// Keyboard shortcut definition
export interface ShortcutDefinition {
  key: string;
  description: string;
  context: 'global' | 'review' | 'practice' | 'problems';
}

// Predefined shortcuts
export const SHORTCUTS: ShortcutDefinition[] = [
  { key: '?', description: 'Show keyboard shortcuts', context: 'global' },
  { key: '/', description: 'Focus search', context: 'global' },
  { key: 'Escape', description: 'Close modal / Cancel', context: 'global' },
  { key: 'n', description: 'New problem', context: 'problems' },
  { key: 'r', description: 'Reveal solution', context: 'review' },
  { key: '1', description: 'Rate: Again', context: 'review' },
  { key: '2', description: 'Rate: Hard', context: 'review' },
  { key: '3', description: 'Rate: Good', context: 'review' },
  { key: '4', description: 'Rate: Easy', context: 'review' },
  { key: 'Space', description: 'Pause/Resume timer', context: 'practice' },
];
