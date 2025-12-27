# Research: Timed Practice & Polish

**Feature**: 004-practice-polish  
**Date**: 2025-12-27  
**Status**: Complete

## Overview

Research findings for timer implementation, export/import format, dark mode, keyboard shortcuts, and PWA setup.

---

## 1. Timer Implementation

### Decision: Use requestAnimationFrame with performance.now() for accuracy

**Rationale**: setInterval can drift over long periods. requestAnimationFrame + performance.now() provides sub-millisecond accuracy.

### Implementation

```typescript
// lib/timer.ts

export interface TimerState {
  duration: number;      // Total duration in seconds
  remaining: number;     // Remaining seconds
  elapsed: number;       // Elapsed seconds
  isRunning: boolean;
  isPaused: boolean;
}

export function createTimer(durationSeconds: number): TimerState {
  return {
    duration: durationSeconds,
    remaining: durationSeconds,
    elapsed: 0,
    isRunning: false,
    isPaused: false,
  };
}

// hooks/useTimer.ts
export function useTimer(initialDuration: number) {
  const [state, setState] = useState(() => createTimer(initialDuration));
  const startTimeRef = useRef<number | null>(null);
  const pausedAtRef = useRef<number>(0);
  const rafRef = useRef<number>();
  
  const tick = useCallback(() => {
    if (!startTimeRef.current) return;
    
    const now = performance.now();
    const elapsed = Math.floor((now - startTimeRef.current) / 1000) + pausedAtRef.current;
    const remaining = Math.max(0, state.duration - elapsed);
    
    setState(prev => ({
      ...prev,
      elapsed,
      remaining,
      isRunning: remaining > 0,
    }));
    
    if (remaining > 0) {
      rafRef.current = requestAnimationFrame(tick);
    }
  }, [state.duration]);
  
  const start = useCallback(() => {
    startTimeRef.current = performance.now();
    setState(prev => ({ ...prev, isRunning: true, isPaused: false }));
    rafRef.current = requestAnimationFrame(tick);
  }, [tick]);
  
  const pause = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    pausedAtRef.current = state.elapsed;
    setState(prev => ({ ...prev, isRunning: false, isPaused: true }));
  }, [state.elapsed]);
  
  const resume = useCallback(() => {
    startTimeRef.current = performance.now();
    setState(prev => ({ ...prev, isRunning: true, isPaused: false }));
    rafRef.current = requestAnimationFrame(tick);
  }, [tick]);
  
  const reset = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    pausedAtRef.current = 0;
    startTimeRef.current = null;
    setState(createTimer(initialDuration));
  }, [initialDuration]);
  
  return { ...state, start, pause, resume, reset };
}
```

### Timer Presets

```typescript
export const TIMER_PRESETS = [
  { label: '25 min', seconds: 25 * 60 },
  { label: '45 min', seconds: 45 * 60 },
  { label: '60 min', seconds: 60 * 60 },
] as const;
```

---

## 2. Export/Import Format

### Decision: JSON with version and checksums

**Rationale**: JSON is human-readable and widely supported. Version field enables migration. Checksum detects corruption.

### Export Schema

```typescript
interface ExportData {
  version: string;           // '1.0.0'
  exportedAt: string;        // ISO date
  appVersion: string;        // App version that created export
  checksum: string;          // SHA-256 of data payload
  data: {
    problems: Problem[];
    solutions: Solution[];
    reviews: Review[];
    reviewHistory: ReviewHistory[];
  };
}
```

### Implementation

```typescript
// lib/export.ts
import { db } from './db';

export async function exportAllData(): Promise<string> {
  const problems = await db.problems.toArray();
  const solutions = await db.solutions.toArray();
  const reviews = await db.reviews.toArray();
  const reviewHistory = await db.reviewHistory.toArray();
  
  const data = { problems, solutions, reviews, reviewHistory };
  const dataString = JSON.stringify(data);
  const checksum = await generateChecksum(dataString);
  
  const exportData: ExportData = {
    version: '1.0.0',
    exportedAt: new Date().toISOString(),
    appVersion: import.meta.env.VITE_APP_VERSION || '0.0.0',
    checksum,
    data,
  };
  
  return JSON.stringify(exportData, null, 2);
}

async function generateChecksum(data: string): Promise<string> {
  const encoder = new TextEncoder();
  const buffer = await crypto.subtle.digest('SHA-256', encoder.encode(data));
  return Array.from(new Uint8Array(buffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}
```

### Import with Validation

```typescript
// lib/import.ts
import { z } from 'zod'; // Optional: for runtime validation

export async function importData(jsonString: string): Promise<ImportResult> {
  let parsed: unknown;
  try {
    parsed = JSON.parse(jsonString);
  } catch {
    return { success: false, error: 'Invalid JSON format' };
  }
  
  // Validate structure
  if (!isValidExportData(parsed)) {
    return { success: false, error: 'Invalid export file structure' };
  }
  
  // Verify checksum
  const dataString = JSON.stringify(parsed.data);
  const expectedChecksum = await generateChecksum(dataString);
  if (parsed.checksum !== expectedChecksum) {
    return { success: false, error: 'File corrupted or tampered' };
  }
  
  // Import data
  await db.transaction('rw', [db.problems, db.solutions, db.reviews, db.reviewHistory], async () => {
    await db.problems.clear();
    await db.solutions.clear();
    await db.reviews.clear();
    await db.reviewHistory.clear();
    
    await db.problems.bulkAdd(parsed.data.problems);
    await db.solutions.bulkAdd(parsed.data.solutions);
    await db.reviews.bulkAdd(parsed.data.reviews);
    await db.reviewHistory.bulkAdd(parsed.data.reviewHistory);
  });
  
  return {
    success: true,
    stats: {
      problems: parsed.data.problems.length,
      solutions: parsed.data.solutions.length,
      reviews: parsed.data.reviews.length,
    },
  };
}
```

---

## 3. Dark Mode

### Decision: Use Tailwind's dark mode with class strategy + CSS variables

**Rationale**: Class strategy gives programmatic control. CSS variables enable smooth transitions.

### Setup

```javascript
// tailwind.config.js
export default {
  darkMode: 'class', // Enable class-based dark mode
  // ...
}
```

```css
/* src/index.css */
:root {
  --color-bg: theme('colors.white');
  --color-text: theme('colors.gray.900');
  --color-border: theme('colors.gray.200');
}

.dark {
  --color-bg: theme('colors.gray.900');
  --color-text: theme('colors.gray.100');
  --color-border: theme('colors.gray.700');
}

/* Smooth transitions */
* {
  transition: background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease;
}
```

### Theme Hook

```typescript
// hooks/useTheme.ts
type Theme = 'light' | 'dark' | 'system';

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    const stored = localStorage.getItem('theme') as Theme | null;
    return stored || 'system';
  });
  
  useEffect(() => {
    const root = document.documentElement;
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (theme === 'dark' || (theme === 'system' && systemDark)) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    
    localStorage.setItem('theme', theme);
  }, [theme]);
  
  return { theme, setTheme };
}
```

### CodeMirror Theme

```typescript
import { githubLight, githubDark } from '@uiw/codemirror-theme-github';

function SolutionEditor({ ... }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark' || 
    (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  
  return (
    <CodeMirror
      theme={isDark ? githubDark : githubLight}
      // ...
    />
  );
}
```

---

## 4. Keyboard Shortcuts

### Decision: Use a global keyboard handler with configurable shortcuts

### Shortcut Map

| Key | Action | Context |
|-----|--------|---------|
| `?` | Show shortcut help | Global |
| `/` | Focus search | Global |
| `n` | New problem | Problems page |
| `1` | Rate Again | Review session |
| `2` | Rate Hard | Review session |
| `3` | Rate Good | Review session |
| `4` | Rate Easy | Review session |
| `Space` | Pause/Resume timer | Practice session |
| `r` | Reveal solution | Review session |
| `Escape` | Close modal/cancel | Global |

### Implementation

```typescript
// hooks/useKeyboardShortcuts.ts
type ShortcutHandler = () => void;
type Shortcuts = Record<string, ShortcutHandler>;

export function useKeyboardShortcuts(shortcuts: Shortcuts, enabled = true) {
  useEffect(() => {
    if (!enabled) return;
    
    const handler = (e: KeyboardEvent) => {
      // Don't trigger in inputs
      if (e.target instanceof HTMLInputElement || 
          e.target instanceof HTMLTextAreaElement) {
        return;
      }
      
      const key = e.key.toLowerCase();
      const handler = shortcuts[key];
      
      if (handler) {
        e.preventDefault();
        handler();
      }
    };
    
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [shortcuts, enabled]);
}
```

---

## 5. PWA Setup

### Decision: Use vite-plugin-pwa for zero-config service worker

```bash
npm install -D vite-plugin-pwa
```

### Configuration

```typescript
// vite.config.ts
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'robots.txt', 'apple-touch-icon.png'],
      manifest: {
        name: 'Algorithms Mastery Tracker',
        short_name: 'AlgoMastery',
        description: 'Master LeetCode-style problems with spaced repetition',
        theme_color: '#3b82f6',
        background_color: '#ffffff',
        display: 'standalone',
        icons: [
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 },
            },
          },
        ],
      },
    }),
  ],
});
```

### Install Prompt

```typescript
// hooks/usePWA.ts
export function usePWA() {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  
  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }
    
    const handler = (e: BeforeInstallPromptEvent) => {
      e.preventDefault();
      setInstallPrompt(e);
    };
    
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);
  
  const install = async () => {
    if (!installPrompt) return;
    await installPrompt.prompt();
    const result = await installPrompt.userChoice;
    if (result.outcome === 'accepted') {
      setIsInstalled(true);
    }
    setInstallPrompt(null);
  };
  
  return { canInstall: !!installPrompt, isInstalled, install };
}
```

---

## Summary

All technical decisions documented. Ready for Phase 1 design.
