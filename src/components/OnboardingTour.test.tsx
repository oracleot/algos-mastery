// components/OnboardingTour.test.tsx - Tests for OnboardingTour component

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { OnboardingTour } from './OnboardingTour';

// Mock Joyride to avoid complex DOM interactions
vi.mock('react-joyride', () => ({
  default: vi.fn(({ run, steps, stepIndex }) => {
    if (!run) return null;
    const currentStep = steps[stepIndex];
    return (
      <div data-testid="joyride-mock">
        <div data-testid="joyride-running">{run ? 'running' : 'stopped'}</div>
        <div data-testid="joyride-step-index">{stepIndex}</div>
        <div data-testid="joyride-step-count">{steps.length}</div>
        {currentStep && (
          <div data-testid="joyride-current-title">{String(currentStep.title)}</div>
        )}
      </div>
    );
  }),
}));

// Mock useOnboarding hook
const mockUseOnboarding = {
  isRunning: true,
  stepIndex: 0,
  isCompleted: false,
  steps: [
    { id: 'welcome', target: 'body', content: 'Welcome', title: 'Welcome' },
    { id: 'step-1', target: '[data-tour="step-1"]', content: 'Step 1', title: 'Step 1' },
  ],
  startTour: vi.fn(),
  completeTour: vi.fn(),
  handleCallback: vi.fn(),
  goToStep: vi.fn(),
};

vi.mock('../hooks/useOnboarding', () => ({
  useOnboarding: () => mockUseOnboarding,
}));

describe('OnboardingTour', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseOnboarding.isRunning = true;
    mockUseOnboarding.isCompleted = false;
    mockUseOnboarding.stepIndex = 0;
  });

  it('renders Joyride when tour is running', () => {
    render(<OnboardingTour />);

    expect(screen.getByTestId('joyride-mock')).toBeInTheDocument();
    expect(screen.getByTestId('joyride-running')).toHaveTextContent('running');
  });

  it('passes correct step count to Joyride', () => {
    render(<OnboardingTour />);

    expect(screen.getByTestId('joyride-step-count')).toHaveTextContent('2');
  });

  it('passes current step index to Joyride', () => {
    mockUseOnboarding.stepIndex = 1;

    render(<OnboardingTour />);

    expect(screen.getByTestId('joyride-step-index')).toHaveTextContent('1');
  });

  it('does not render when tour is completed', () => {
    mockUseOnboarding.isCompleted = true;
    mockUseOnboarding.isRunning = false;

    const { container } = render(<OnboardingTour />);

    expect(container.firstChild).toBeNull();
  });

  it('renders when autoStart is true even if completed', () => {
    mockUseOnboarding.isCompleted = true;
    mockUseOnboarding.isRunning = true;

    render(<OnboardingTour autoStart />);

    expect(screen.getByTestId('joyride-mock')).toBeInTheDocument();
  });

  it('does not render when autoStart is false and not running', () => {
    mockUseOnboarding.isRunning = false;

    const { container } = render(<OnboardingTour autoStart={false} />);

    expect(container.firstChild).toBeNull();
  });

  it('displays current step title', () => {
    render(<OnboardingTour />);

    expect(screen.getByTestId('joyride-current-title')).toHaveTextContent('Welcome');
  });

  it('displays second step title when on step 1', () => {
    mockUseOnboarding.stepIndex = 1;

    render(<OnboardingTour />);

    expect(screen.getByTestId('joyride-current-title')).toHaveTextContent('Step 1');
  });
});
