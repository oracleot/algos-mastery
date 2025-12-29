// components/OnboardingTour.tsx - Interactive onboarding tour component

import Joyride from 'react-joyride';
import { useOnboarding } from '../hooks/useOnboarding';

export interface OnboardingTourProps {
  /** Whether to auto-start the tour (default: based on preferences) */
  autoStart?: boolean;
}

/**
 * OnboardingTour component that renders the interactive guided tour
 * Uses react-joyride for spotlight effects, step navigation, and tooltips
 */
export function OnboardingTour({ autoStart }: OnboardingTourProps) {
  const { isRunning, stepIndex, steps, handleCallback, isCompleted } =
    useOnboarding();

  // Don't render if tour is completed and not explicitly started
  if (isCompleted && autoStart !== true) {
    return null;
  }

  // Don't render if autoStart is explicitly false
  if (autoStart === false && !isRunning) {
    return null;
  }

  return (
    <Joyride
      steps={steps}
      run={isRunning}
      stepIndex={stepIndex}
      continuous
      showSkipButton
      showProgress
      scrollToFirstStep
      scrollOffset={100}
      disableOverlayClose
      spotlightPadding={8}
      callback={handleCallback}
      styles={{
        options: {
          primaryColor: 'hsl(221.2 83.2% 53.3%)',
          textColor: 'hsl(222.2 47.4% 11.2%)',
          backgroundColor: 'hsl(0 0% 100%)',
          overlayColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 10000,
        },
        tooltip: {
          borderRadius: '8px',
          maxWidth: '90vw',
        },
        tooltipTitle: {
          fontSize: '16px',
          fontWeight: 600,
        },
        tooltipContent: {
          fontSize: '14px',
          padding: '8px 0',
        },
        buttonNext: {
          backgroundColor: 'hsl(221.2 83.2% 53.3%)',
          borderRadius: '6px',
          fontSize: '14px',
          padding: '8px 16px',
        },
        buttonBack: {
          color: 'hsl(215.4 16.3% 46.9%)',
          marginRight: '8px',
        },
        buttonSkip: {
          color: 'hsl(215.4 16.3% 46.9%)',
        },
      }}
      locale={{
        back: 'Previous',
        close: 'Close',
        last: 'Finish',
        next: 'Next',
        skip: 'Skip Tour',
      }}
    />
  );
}
