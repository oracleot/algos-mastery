// hooks/usePreferences.ts - User preferences management hook

import { useCallback, useEffect, useSyncExternalStore } from 'react';
import type { UserPreferences } from '../types';
import { 
  getPreferences, 
  setPreferences as storePreferences, 
  resetPreferences as clearPreferences,
  DEFAULT_PREFERENCES 
} from '../lib/preferences';

export interface UsePreferencesReturn {
  preferences: UserPreferences;
  updatePreference: <K extends keyof UserPreferences>(
    key: K,
    value: UserPreferences[K]
  ) => void;
  resetPreferences: () => void;
}

// Store for preferences synchronization
let preferencesCache: UserPreferences = DEFAULT_PREFERENCES;
const listeners = new Set<() => void>();

function subscribe(callback: () => void) {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

function getSnapshot() {
  return preferencesCache;
}

function emitChange() {
  preferencesCache = getPreferences();
  for (const listener of listeners) {
    listener();
  }
}

// Initialize cache
if (typeof window !== 'undefined') {
  preferencesCache = getPreferences();
}

/**
 * Hook for managing user preferences
 * Syncs with localStorage and provides reactive updates
 */
export function usePreferences(): UsePreferencesReturn {
  const preferences = useSyncExternalStore(subscribe, getSnapshot, () => DEFAULT_PREFERENCES);

  // Listen for storage events from other tabs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'algomasteryPreferences') {
        emitChange();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const updatePreference = useCallback(<K extends keyof UserPreferences>(
    key: K,
    value: UserPreferences[K]
  ) => {
    storePreferences({ [key]: value });
    emitChange();
  }, []);

  const resetPreferences = useCallback(() => {
    clearPreferences();
    emitChange();
  }, []);

  return {
    preferences,
    updatePreference,
    resetPreferences,
  };
}
