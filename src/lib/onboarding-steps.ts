// lib/onboarding-steps.ts - Tour step definitions for app onboarding

import type { OnboardingStep } from '../types';

/**
 * Onboarding tour steps configuration
 * 6 steps highlighting key app features for first-time users
 */
export const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    id: 'welcome',
    target: 'body',
    placement: 'center',
    disableBeacon: true,
    title: 'Welcome to Algorithms Mastery Tracker',
    content:
      'Track your algorithm problem-solving journey with spaced repetition. Let me show you around!',
  },
  {
    id: 'view-problems',
    target: '[data-tour="view-problems"]',
    placement: 'bottom',
    disableBeacon: true,
    title: 'Browse Your Problems',
    content:
      'Add and manage algorithm problems from LeetCode, HackerRank, or any source.',
  },
  {
    id: 'timed-practice',
    target: '[data-tour="timed-practice"]',
    placement: 'bottom',
    disableBeacon: true,
    title: 'Timed Practice Sessions',
    content:
      'Challenge yourself with timed problem-solving to simulate interview conditions.',
  },
  {
    id: 'progress-ladder',
    target: '[data-tour="progress-ladder"]',
    placement: 'bottom',
    disableBeacon: true,
    title: 'Track Your Progress',
    content:
      'Follow a structured 15-topic learning path and unlock new topics as you master each one.',
  },
  {
    id: 'dashboard-stats',
    target: '[data-tour="dashboard-stats"]',
    placement: 'bottom',
    disableBeacon: true,
    title: 'Your Dashboard',
    content:
      'View your streak, weekly stats, and daily averages at a glance.',
  },
  {
    id: 'due-today',
    target: '[data-tour="due-today"]',
    placement: 'top',
    disableBeacon: true,
    title: 'Spaced Repetition Reviews',
    content:
      'The app schedules reviews using the SM-2 algorithm to help you retain what you have learned.',
  },
];
