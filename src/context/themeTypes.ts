// context/themeTypes.ts - Theme context type definitions

import { createContext } from 'react';
import type { Theme } from '../types';

export interface ThemeContextValue {
  theme: Theme;
  resolvedTheme: 'light' | 'dark';
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextValue | null>(null);
