# Quickstart: Timed Practice & Polish

**Feature**: 004-practice-polish  
**Date**: 2025-12-27

---

## Prerequisites

Ensure Phase 3 (Spaced Repetition) is complete:
- [ ] SM-2 spaced repetition implemented
- [ ] Review queue functional
- [ ] Dashboard with charts working

---

## Phase 4 Setup Steps

### 1. Install PWA Plugin

```bash
npm install vite-plugin-pwa workbox-window --save-dev
```

### 2. Configure Vite for PWA

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
      },
      includeAssets: ['favicon.ico', 'apple-touch-icon.png'],
      manifest: {
        name: 'Algorithms Mastery Tracker',
        short_name: 'AlgoMastery',
        description: 'Track and master LeetCode-style algorithm problems',
        theme_color: '#3b82f6',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
      },
    }),
  ],
});
```

### 3. Configure Dark Mode in Tailwind

```javascript
// tailwind.config.js
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      // Add dark mode color overrides if needed
    },
  },
  plugins: [],
};
```

### 4. Add PWA Icons

Generate icons and place in `public/`:
- `pwa-192x192.png` (192x192)
- `pwa-512x512.png` (512x512)
- `apple-touch-icon.png` (180x180)
- `favicon.ico`

Use a tool like [PWA Asset Generator](https://github.com/nicobrinkkemper/pwa-asset-generator) or create manually.

### 5. Update Database Schema

```typescript
// lib/db.ts - Add v4 schema
this.version(4).stores({
  problems: 'id, topic, difficulty, status, createdAt',
  solutions: 'id, problemId, language, createdAt',
  reviews: 'problemId, nextReview',
  reviewHistory: 'id, problemId, reviewedAt',
  timeLogs: 'problemId',  // NEW
});
```

### 6. Add Theme Script to index.html

Prevent flash of wrong theme on load:

```html
<!-- index.html - Add before </head> -->
<script>
  (function() {
    const stored = localStorage.getItem('algomasteryPreferences');
    const prefs = stored ? JSON.parse(stored) : {};
    const theme = prefs.theme || 'system';
    
    if (theme === 'dark' || 
        (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
    }
  })();
</script>
```

---

## Implementation Checklist

### Timer Implementation

- [ ] Create `hooks/useTimer.ts` with requestAnimationFrame
- [ ] Create `components/Timer.tsx` with circular progress
- [ ] Create `components/TimerControls.tsx`
- [ ] Create `components/TimerPresets.tsx`
- [ ] Create `pages/PracticePage.tsx`
- [ ] Add keyboard shortcut: Space for pause/resume

### Theme Implementation

- [ ] Create `lib/preferences.ts` for localStorage
- [ ] Create `hooks/useTheme.ts`
- [ ] Create `context/ThemeContext.tsx`
- [ ] Create `components/ThemeToggle.tsx`
- [ ] Add `dark:` variants to all components
- [ ] Test system preference detection

### Keyboard Shortcuts

- [ ] Create `hooks/useKeyboardShortcuts.ts`
- [ ] Create `context/ShortcutsContext.tsx`
- [ ] Create `components/ShortcutHelp.tsx` modal
- [ ] Register global shortcuts in App.tsx
- [ ] Add `?` shortcut to show help

### Export/Import

- [ ] Create `lib/export.ts` with checksum generation
- [ ] Create `lib/import.ts` with validation
- [ ] Create `hooks/useExport.ts`
- [ ] Create `hooks/useImport.ts`
- [ ] Create `components/ExportDialog.tsx`
- [ ] Create `components/ImportDialog.tsx`
- [ ] Add to settings page

### PWA Features

- [ ] Create `hooks/usePWA.ts`
- [ ] Create `components/InstallPrompt.tsx`
- [ ] Create `components/OfflineIndicator.tsx`
- [ ] Add update prompt on new version
- [ ] Test offline functionality

### Mobile Polish

- [ ] Audit touch targets (min 44x44)
- [ ] Test swipe gestures
- [ ] Add viewport meta tags
- [ ] Test on real devices

### Settings Page

- [ ] Create `pages/SettingsPage.tsx`
- [ ] Add route `/settings`
- [ ] Add link in navigation

---

## Testing Checklist

### Timer Tests

```typescript
// hooks/useTimer.test.ts
describe('useTimer', () => {
  it('starts with correct initial state');
  it('counts down when running');
  it('pauses and resumes correctly');
  it('calls onComplete when finished');
  it('resets to initial duration');
});
```

### Theme Tests

```typescript
// hooks/useTheme.test.ts
describe('useTheme', () => {
  it('loads from localStorage');
  it('defaults to system');
  it('applies dark class to documentElement');
  it('responds to system preference changes');
});
```

### Export/Import Tests

```typescript
// lib/export.test.ts
describe('export', () => {
  it('includes all data tables');
  it('generates valid checksum');
  it('creates downloadable file');
});

// lib/import.test.ts
describe('import', () => {
  it('validates checksum');
  it('rejects invalid version');
  it('handles corrupt data');
  it('imports all data correctly');
});
```

---

## Development Workflow

```bash
# Start development server
npm run dev

# Test PWA locally
npm run build
npm run preview

# Run tests
npm test

# Type check
npm run typecheck

# Lint
npm run lint
```

---

## Verification Steps

1. **Timer**: Start 25-min session, pause, resume, verify countdown
2. **Dark Mode**: Toggle theme, verify all components update
3. **Keyboard Shortcuts**: Press `?` to see help, test shortcuts
4. **Export**: Export data, verify JSON structure and checksum
5. **Import**: Import exported file, verify data restored
6. **PWA Install**: Visit in Chrome, verify install prompt appears
7. **Offline**: Disconnect, verify app still works
8. **Mobile**: Test on phone, verify touch targets and responsiveness

---

## Troubleshooting

### PWA Not Installing

- Check DevTools > Application > Manifest for errors
- Ensure HTTPS (or localhost)
- Verify all icons exist
- Check console for service worker errors

### Dark Mode Flash

- Ensure theme script is in `<head>` before any CSS
- Use `class` strategy, not `media`

### Timer Drift

- Use `performance.now()`, not `Date.now()`
- Calculate elapsed from start time, don't increment

### Export Large Data

- Consider streaming for very large datasets
- Show progress indicator during export/import
