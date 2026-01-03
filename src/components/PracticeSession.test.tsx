// components/PracticeSession.test.tsx - Tests for navigation button visibility

import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { PracticeSession } from './PracticeSession';
import type { Problem } from '@/types';

// Mock dependencies
vi.mock('@/lib/db', () => ({
  db: {
    solutions: {
      where: () => ({
        equals: () => ({
          reverse: () => ({
            sortBy: async () => [],
          }),
        }),
      }),
    },
  },
}));

vi.mock('@/hooks/useTimeLog', () => ({
  useTimeLog: () => ({
    startTracking: vi.fn(),
    stopTracking: vi.fn(),
  }),
}));

vi.mock('@/hooks/useTemplates', () => ({
  useTemplates: () => ({
    getTemplatesForTopic: () => [],
  }),
}));

vi.mock('@/lib/preferences', () => ({
  getPreferences: () => ({
    defaultTimerMinutes: 25,
    keyboardShortcutsEnabled: true,
    theme: 'light',
  }),
}));

vi.mock('@/lib/practiceSession', () => ({
  loadSessionState: () => null,
  saveSessionState: vi.fn(),
  clearSavedSession: vi.fn(),
}));

// Mock problem
const mockProblem: Problem = {
  id: 'test-problem-id',
  title: 'Two Sum',
  topic: 'arrays-hashing',
  difficulty: 'easy',
  status: 'attempted',
  createdAt: new Date(),
  updatedAt: new Date(),
  url: 'https://leetcode.com/problems/two-sum',
  notes: '',
  resources: [],
};

function renderWithRouter(component: React.ReactElement) {
  return render(<BrowserRouter>{component}</BrowserRouter>);
}

describe('PracticeSession Navigation Buttons', () => {
  const defaultProps = {
    problem: mockProblem,
    onComplete: vi.fn(),
    onExit: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Next Problem Button Visibility', () => {
    it('shows Next Problem button when onNext is provided and hasMoreProblems is true', () => {
      renderWithRouter(
        <PracticeSession
          {...defaultProps}
          onNext={vi.fn()}
          availableProblemsCount={5}
          practiceQueue={['problem-1', 'problem-2']}
          currentQueueIndex={0}
        />
      );

      expect(screen.getByRole('button', { name: /next problem/i })).toBeInTheDocument();
    });

    it('hides Next Problem button when at end of queue and no more available problems', () => {
      renderWithRouter(
        <PracticeSession
          {...defaultProps}
          onNext={vi.fn()}
          availableProblemsCount={2}
          practiceQueue={['problem-1', 'problem-2']}
          currentQueueIndex={1}
        />
      );

      expect(screen.queryByRole('button', { name: /next problem/i })).not.toBeInTheDocument();
    });

    it('shows Next Problem button when at end of queue but more problems available', () => {
      renderWithRouter(
        <PracticeSession
          {...defaultProps}
          onNext={vi.fn()}
          availableProblemsCount={5}
          practiceQueue={['problem-1', 'problem-2']}
          currentQueueIndex={1}
        />
      );

      expect(screen.getByRole('button', { name: /next problem/i })).toBeInTheDocument();
    });

    it('hides Next Problem button when onNext is not provided', () => {
      renderWithRouter(
        <PracticeSession
          {...defaultProps}
          availableProblemsCount={5}
          practiceQueue={['problem-1']}
          currentQueueIndex={0}
        />
      );

      expect(screen.queryByRole('button', { name: /next problem/i })).not.toBeInTheDocument();
    });

    it('shows Next Problem button when not at end of queue', () => {
      renderWithRouter(
        <PracticeSession
          {...defaultProps}
          onNext={vi.fn()}
          availableProblemsCount={3}
          practiceQueue={['problem-1', 'problem-2', 'problem-3']}
          currentQueueIndex={1}
        />
      );

      expect(screen.getByRole('button', { name: /next problem/i })).toBeInTheDocument();
    });
  });

  describe('Exit Practice Button', () => {
    it('always shows Exit Practice button', () => {
      renderWithRouter(
        <PracticeSession
          {...defaultProps}
          availableProblemsCount={0}
          practiceQueue={[]}
          currentQueueIndex={0}
        />
      );

      expect(screen.getByRole('button', { name: /exit practice/i })).toBeInTheDocument();
    });
  });
});
