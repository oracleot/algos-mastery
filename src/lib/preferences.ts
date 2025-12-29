// lib/preferences.ts - User preferences management using localStorage

import type { UserPreferences } from '../types';

const PREFERENCES_KEY = 'algomasteryPreferences';

export const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'system',
  defaultTimerMinutes: 45,
  keyboardShortcutsEnabled: true,
  showInstallPrompt: true,
};

/**
 * Get user preferences from localStorage
 * Returns default preferences if none are stored or on parse error
 */
export function getPreferences(): UserPreferences {
  try {
    const stored = localStorage.getItem(PREFERENCES_KEY);
    if (!stored) return DEFAULT_PREFERENCES;
    return { ...DEFAULT_PREFERENCES, ...JSON.parse(stored) };
  } catch {
    return DEFAULT_PREFERENCES;
  }
}

/**
 * Update user preferences in localStorage
 * Merges with existing preferences
 */
export function setPreferences(prefs: Partial<UserPreferences>): UserPreferences {
  const current = getPreferences();
  const updated = { ...current, ...prefs };
  localStorage.setItem(PREFERENCES_KEY, JSON.stringify(updated));
  return updated;
}

/**
 * Reset preferences to defaults
 */
export function resetPreferences(): void {
  localStorage.removeItem(PREFERENCES_KEY);
}
