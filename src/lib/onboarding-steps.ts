// lib/onboarding-steps.ts - Tour step definitions for app onboarding

import type { OnboardingStep } from '../types';

/**
 * Onboarding tour steps configuration
 * 6 steps highlighting key app features for first-time users
 * Each step explains WHAT the feature does and HOW to use it
 */
export const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    id: 'welcome',
    target: 'body',
    placement: 'center',
    disableBeacon: true,
    title: 'Welcome to Algorithms Mastery Tracker',
    content:
      'Master algorithm problems with spaced repetition learning. This quick tour will show you how to add problems, practice under time pressure, and build lasting knowledge.',
  },
  {
    id: 'view-problems',
    target: '[data-tour="view-problems"]',
    placement: 'bottom',
    disableBeacon: true,
    title: 'Step 1: Add Your First Problem',
    content:
      'Click here to view and add problems. Use the "Add Problem" button to enter a problem from LeetCode, HackerRank, or any source. Include the URL, topic, difficulty, and your notes.',
  },
  {
    id: 'timed-practice',
    target: '[data-tour="timed-practice"]',
    placement: 'bottom',
    disableBeacon: true,
    title: 'Step 2: Practice Under Pressure',
    content:
      'Simulate interview conditions with timed practice. Select a problem, start the 25/45/60 minute timer, and challenge yourself to solve it. You can reveal templates or solutions if you get stuck.',
  },
  {
    id: 'progress-ladder',
    target: '[data-tour="progress-ladder"]',
    placement: 'bottom',
    disableBeacon: true,
    title: 'Step 3: Follow the Learning Path',
    content:
      'Progress through 15 topics in a structured order. Start with "Arrays & Hashing", solve 3 problems to unlock the next topic. This ensures you build skills in the right sequence.',
  },
  {
    id: 'dashboard-stats',
    target: '[data-tour="dashboard-stats"]',
    placement: 'bottom',
    disableBeacon: true,
    title: 'Step 4: Track Your Consistency',
    content:
      'Your streak counter shows consecutive days of practice. Aim to review at least one problem daily to build the habit. Weekly stats help you see your progress over time.',
  },
  {
    id: 'due-today',
    target: '[data-tour="due-today"]',
    placement: 'top',
    disableBeacon: true,
    title: 'Step 5: Never Forget What You Learned',
    content:
      'After solving a problem, add it to the review queue. The app uses the SM-2 algorithm to schedule reviews at optimal intervals. Rate your recall (Again/Hard/Good/Easy) and the app adjusts timing automatically. Start by adding a solved problem to review!',
  },
];
