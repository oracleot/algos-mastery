// context/ThemeContext.tsx - Theme management context

import { useEffect, useMemo, useSyncExternalStore, useCallback, type ReactNode } from 'react';
import type { Theme } from '../types';
import { getPreferences, setPreferences } from '../lib/preferences';
import { ThemeContext } from './themeTypes';

// Re-export types from themeTypes
export { ThemeContext, type ThemeContextValue } from './themeTypes';

interface ThemeProviderProps {
  children: ReactNode;
}

/**
 * Get the system's preferred color scheme
 */
function getSystemTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

/**
 * Resolve theme preference to actual theme
 */
function resolveTheme(theme: Theme): 'light' | 'dark' {
  if (theme === 'system') {
    return getSystemTheme();
  }
  return theme;
}

/**
 * Apply theme to document
 */
function applyTheme(theme: 'light' | 'dark', withTransition: boolean = false): void {
  const root = document.documentElement;
  
  if (withTransition) {
    root.classList.add('theme-transition');
    setTimeout(() => root.classList.remove('theme-transition'), 200);
  }
  
  if (theme === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
}

// External store for theme
let themeCache: Theme = 'system';
const themeListeners = new Set<() => void>();

function subscribeTheme(callback: () => void) {
  themeListeners.add(callback);
  return () => themeListeners.delete(callback);
}

function getThemeSnapshot(): Theme {
  return themeCache;
}

function getThemeServerSnapshot(): Theme {
  return 'system';
}

function emitThemeChange(newTheme: Theme) {
  themeCache = newTheme;
  for (const listener of themeListeners) {
    listener();
  }
}

// Initialize cache
if (typeof window !== 'undefined') {
  themeCache = getPreferences().theme;
}

/**
 * Theme provider component
 * Manages theme state and applies it to the document
 */
export function ThemeProvider({ children }: ThemeProviderProps) {
  const theme = useSyncExternalStore(subscribeTheme, getThemeSnapshot, getThemeServerSnapshot);
  
  const resolvedTheme = useMemo(() => resolveTheme(theme), [theme]);

  // Apply theme when it changes
  useEffect(() => {
    applyTheme(resolvedTheme, true);
  }, [resolvedTheme]);

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = () => {
      if (theme === 'system') {
        applyTheme(resolveTheme('system'), true);
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  const setTheme = useCallback((newTheme: Theme) => {
    setPreferences({ theme: newTheme });
    emitThemeChange(newTheme);
  }, []);

  const toggleTheme = useCallback(() => {
    // Cycle: light -> dark -> system -> light
    const newTheme = theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light';
    setTheme(newTheme);
  }, [theme, setTheme]);

  const value = useMemo(() => ({
    theme,
    resolvedTheme,
    setTheme,
    toggleTheme,
  }), [theme, resolvedTheme, setTheme, toggleTheme]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}
