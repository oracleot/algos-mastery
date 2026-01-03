// components/FullscreenOverlay.test.tsx - Tests for fullscreen focus mode overlay

import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { FullscreenOverlay } from './FullscreenOverlay';
import type { Problem } from '@/types';
import type { TimerState } from '@/lib/timer';

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
  notes: 'Test notes for the problem',
  resources: [],
};

// Base timer state factory
function createTimerState(overrides: Partial<TimerState> = {}): TimerState {
  return {
    duration: 1500, // 25 minutes
    elapsed: 300, // 5 minutes elapsed
    remaining: 1200, // 20 minutes remaining
    isRunning: true,
    isPaused: false,
    isComplete: false,
    ...overrides,
  };
}

describe('FullscreenOverlay', () => {
  const defaultProps = {
    problem: mockProblem,
    timerState: createTimerState(),
    onPause: vi.fn(),
    onResume: vi.fn(),
    code: '',
    language: 'javascript' as const,
    onCodeChange: vi.fn(),
    onExit: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    // Clean up React components first, then DOM
    cleanup();
    // Remove any leftover portals from document.body
    const overlay = document.body.querySelector('[data-testid="fullscreen-overlay"]');
    if (overlay && overlay.parentNode) {
      overlay.parentNode.removeChild(overlay);
    }
  });

  it('renders via portal to document.body', () => {
    render(<FullscreenOverlay {...defaultProps} />);
    
    // The overlay should be rendered in document.body via portal
    const overlay = document.body.querySelector('[data-testid="fullscreen-overlay"]');
    expect(overlay).toBeInTheDocument();
  });

  it('shows timer display', () => {
    render(<FullscreenOverlay {...defaultProps} />);
    
    // Should show remaining time (20:00 for 1200 seconds)
    expect(screen.getByText('20:00')).toBeInTheDocument();
  });

  it('shows problem title', () => {
    render(<FullscreenOverlay {...defaultProps} />);
    
    // There are multiple instances (header for desktop, button for mobile), use getAllByText
    const titles = screen.getAllByText('Two Sum');
    expect(titles.length).toBeGreaterThan(0);
  });

  it('shows problem description when expanded', () => {
    render(<FullscreenOverlay {...defaultProps} />);
    
    // Click to expand problem description
    const expandButton = screen.getByRole('button', { name: /toggle problem details/i });
    fireEvent.click(expandButton);
    
    // Should show the problem notes
    expect(screen.getByText('Test notes for the problem')).toBeInTheDocument();
  });

  it('shows editor in readOnly state when timer is paused', () => {
    const timerState = createTimerState({ isRunning: false, isPaused: true });
    render(<FullscreenOverlay {...defaultProps} timerState={timerState} />);
    
    // Editor should show disabled message
    expect(screen.getByText('Resume timer to continue')).toBeInTheDocument();
  });

  it('shows editor in editable state when timer is running', () => {
    render(<FullscreenOverlay {...defaultProps} />);
    
    // Editor should not show disabled message
    expect(screen.queryByText('Start timer to begin coding')).not.toBeInTheDocument();
    expect(screen.queryByText('Resume timer to continue')).not.toBeInTheDocument();
  });

  it('calls onExit when Escape key is pressed', () => {
    render(<FullscreenOverlay {...defaultProps} />);
    
    // Press Escape key
    fireEvent.keyDown(document, { key: 'Escape' });
    
    expect(defaultProps.onExit).toHaveBeenCalledTimes(1);
  });

  it('calls onExit when minimize button is clicked', () => {
    render(<FullscreenOverlay {...defaultProps} />);
    
    // Click minimize button
    const minimizeButton = screen.getByRole('button', { name: /exit fullscreen/i });
    fireEvent.click(minimizeButton);
    
    expect(defaultProps.onExit).toHaveBeenCalledTimes(1);
  });

  it('calls onPause when pause button is clicked while running', () => {
    render(<FullscreenOverlay {...defaultProps} />);
    
    // Click pause button
    const pauseButton = screen.getByRole('button', { name: /pause/i });
    fireEvent.click(pauseButton);
    
    expect(defaultProps.onPause).toHaveBeenCalledTimes(1);
  });

  it('calls onResume when resume button is clicked while paused', () => {
    const timerState = createTimerState({ isRunning: false, isPaused: true });
    render(<FullscreenOverlay {...defaultProps} timerState={timerState} />);
    
    // Click resume button
    const resumeButton = screen.getByRole('button', { name: /resume/i });
    fireEvent.click(resumeButton);
    
    expect(defaultProps.onResume).toHaveBeenCalledTimes(1);
  });

  it('shows code runner panel for JavaScript', () => {
    render(<FullscreenOverlay {...defaultProps} language="javascript" />);
    
    // Should show Run button
    expect(screen.getByRole('button', { name: /run/i })).toBeInTheDocument();
  });

  it('shows code runner panel for TypeScript', () => {
    render(<FullscreenOverlay {...defaultProps} language="typescript" />);
    
    // Should show Run button
    expect(screen.getByRole('button', { name: /run/i })).toBeInTheDocument();
  });

  it('disables Run button when timer is paused', () => {
    const timerState = createTimerState({ isRunning: false, isPaused: true });
    render(<FullscreenOverlay {...defaultProps} timerState={timerState} />);
    
    const runButton = screen.getByRole('button', { name: /run/i });
    expect(runButton).toBeDisabled();
  });

  it('shows external link to problem when URL is available', () => {
    render(<FullscreenOverlay {...defaultProps} />);
    
    // Click to expand problem description
    const expandButton = screen.getByRole('button', { name: /toggle problem details/i });
    fireEvent.click(expandButton);
    
    // Should have a link to the problem
    const link = screen.getByRole('link', { name: /view problem/i });
    expect(link).toHaveAttribute('href', 'https://leetcode.com/problems/two-sum');
  });

  it('handles timer completion state', () => {
    const timerState = createTimerState({ 
      isRunning: false, 
      isPaused: false, 
      isComplete: true,
      remaining: 0,
    });
    render(<FullscreenOverlay {...defaultProps} timerState={timerState} />);
    
    // Editor should be enabled when complete
    expect(screen.queryByText('Start timer to begin coding')).not.toBeInTheDocument();
    expect(screen.queryByText('Resume timer to continue')).not.toBeInTheDocument();
  });
});
