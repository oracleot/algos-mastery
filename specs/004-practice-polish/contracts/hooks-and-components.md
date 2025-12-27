# Contracts: Timed Practice & Polish

**Feature**: 004-practice-polish  
**Date**: 2025-12-27  
**Status**: Complete

---

## Hook Contracts

### useTimer

Manages timed practice sessions with precision timing.

```typescript
interface UseTimerOptions {
  initialMinutes?: number;
  onComplete?: () => void;
  onTick?: (elapsed: number, remaining: number) => void;
}

interface UseTimerReturn {
  elapsed: number;          // Seconds elapsed
  remaining: number;        // Seconds remaining
  isRunning: boolean;
  isPaused: boolean;
  isComplete: boolean;
  formattedRemaining: string;  // "MM:SS"
  formattedElapsed: string;    // "MM:SS"
  progress: number;         // 0-1 progress
  
  // Actions
  start: (minutes?: number) => void;
  pause: () => void;
  resume: () => void;
  reset: () => void;
  stop: () => void;
}

// Example
const { remaining, isRunning, start, pause, reset } = useTimer({
  initialMinutes: 45,
  onComplete: () => toast('Time\'s up!'),
});
```

### useTheme

Manages theme preference with system detection.

```typescript
interface UseThemeReturn {
  theme: 'light' | 'dark' | 'system';
  resolvedTheme: 'light' | 'dark';  // Actual applied theme
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  toggleTheme: () => void;  // Cycles: light -> dark -> system
}

// Example
const { resolvedTheme, toggleTheme } = useTheme();
```

### useKeyboardShortcuts

Registers and manages global keyboard shortcuts.

```typescript
interface ShortcutHandler {
  key: string;              // e.g., 'n', '/', 'Escape', 'Ctrl+s'
  handler: (e: KeyboardEvent) => void;
  preventDefault?: boolean;
  condition?: () => boolean;  // Only fire if true
}

interface UseKeyboardShortcutsOptions {
  shortcuts: ShortcutHandler[];
  enabled?: boolean;
}

// Example
useKeyboardShortcuts({
  shortcuts: [
    { 
      key: 'n', 
      handler: () => openNewProblem(), 
      condition: () => !isModalOpen 
    },
    { 
      key: 'Escape', 
      handler: () => closeModal() 
    },
  ],
  enabled: preferences.keyboardShortcutsEnabled,
});
```

### useExport

Handles data export with checksum generation.

```typescript
interface UseExportReturn {
  isExporting: boolean;
  error: string | null;
  exportData: () => Promise<void>;
  getExportPreview: () => Promise<ExportStats>;
}

interface ExportStats {
  problems: number;
  solutions: number;
  reviews: number;
  reviewHistory: number;
  timeLogs: number;
  estimatedSize: string;  // "1.2 MB"
}

// Example
const { exportData, isExporting } = useExport();
await exportData();  // Downloads JSON file
```

### useImport

Handles data import with validation.

```typescript
interface UseImportReturn {
  isImporting: boolean;
  error: string | null;
  importData: (file: File) => Promise<ImportResult>;
  validateFile: (file: File) => Promise<ValidationResult>;
}

interface ValidationResult {
  isValid: boolean;
  version: string;
  stats: ExportStats;
  warnings: string[];  // e.g., "Newer app version"
  errors: string[];    // e.g., "Invalid checksum"
}

// Example
const { importData, validateFile, error } = useImport();
const validation = await validateFile(file);
if (validation.isValid) {
  const result = await importData(file);
}
```

### usePWA

Manages PWA installation state.

```typescript
interface UsePWAReturn {
  isInstallable: boolean;
  isInstalled: boolean;
  isOnline: boolean;
  isUpdateAvailable: boolean;
  
  install: () => Promise<boolean>;
  dismissInstall: () => void;
  update: () => void;
}

// Example
const { isInstallable, install } = usePWA();
if (isInstallable) {
  // Show install prompt
}
```

### useTimeLog

Tracks time spent on problems.

```typescript
interface UseTimeLogReturn {
  isTracking: boolean;
  currentProblemId: string | null;
  elapsedSeconds: number;
  
  startTracking: (problemId: string) => void;
  stopTracking: () => Promise<TimeSession | null>;
  getTimeForProblem: (problemId: string) => Promise<number>;
}

// Example
const { startTracking, stopTracking, elapsedSeconds } = useTimeLog();
startTracking(problemId);
// ... user works on problem ...
const session = await stopTracking();  // Persists to DB
```

### usePreferences

Manages user preferences.

```typescript
interface UsePreferencesReturn {
  preferences: UserPreferences;
  updatePreference: <K extends keyof UserPreferences>(
    key: K, 
    value: UserPreferences[K]
  ) => void;
  resetPreferences: () => void;
}

// Example
const { preferences, updatePreference } = usePreferences();
updatePreference('defaultTimerMinutes', 60);
```

---

## Component Contracts

### Timer

Main timed practice component.

```typescript
interface TimerProps {
  className?: string;
  onComplete?: () => void;
  onSessionEnd?: (session: TimerSession) => void;
  showProblemsCompleted?: boolean;
}

interface TimerSession {
  duration: number;
  elapsed: number;
  problemsCompleted: string[];
}

// Usage
<Timer 
  onComplete={() => toast('Great practice session!')}
  showProblemsCompleted
/>
```

**Internal Structure**:
- Circular progress indicator
- MM:SS display (large, centered)
- Start/Pause/Reset buttons
- Preset buttons (25, 45, 60 min)

### TimerControls

Control buttons for timer.

```typescript
interface TimerControlsProps {
  isRunning: boolean;
  isPaused: boolean;
  isComplete: boolean;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onReset: () => void;
  onStop: () => void;
  className?: string;
}
```

### TimerPresets

Preset duration buttons.

```typescript
interface TimerPresetsProps {
  presets: number[];  // [25, 45, 60]
  selectedPreset: number;
  onSelect: (minutes: number) => void;
  disabled?: boolean;
}

// Usage
<TimerPresets 
  presets={[25, 45, 60]}
  selectedPreset={45}
  onSelect={setDuration}
/>
```

### ThemeToggle

Theme switcher button/dropdown.

```typescript
interface ThemeToggleProps {
  variant?: 'button' | 'dropdown';
  showLabel?: boolean;
  className?: string;
}

// Usage
<ThemeToggle variant="dropdown" showLabel />
```

### ExportDialog

Export confirmation and preview dialog.

```typescript
interface ExportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: () => void;
}

// Dialog shows:
// - Export preview (counts of each data type)
// - Estimated file size
// - Export button
```

### ImportDialog

Import file picker and validation dialog.

```typescript
interface ImportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (file: File) => Promise<void>;
}

// Dialog shows:
// - File drop zone
// - Validation results
// - Merge strategy options (replace all / merge)
// - Import button
```

### ShortcutHelp

Keyboard shortcuts help modal.

```typescript
interface ShortcutHelpProps {
  isOpen: boolean;
  onClose: () => void;
}

// Modal shows:
// - Grouped shortcuts by context
// - Key combination + description
// - Toggle to enable/disable shortcuts
```

### InstallPrompt

PWA install banner.

```typescript
interface InstallPromptProps {
  onInstall: () => void;
  onDismiss: () => void;
  className?: string;
}

// Banner shows:
// - App icon + name
// - "Install for offline access"
// - Install and Dismiss buttons
```

### OfflineIndicator

Shows offline status.

```typescript
interface OfflineIndicatorProps {
  className?: string;
}

// Shows:
// - "You're offline" indicator when disconnected
// - "Back online" toast when reconnected
```

### SettingsPanel

User preferences panel.

```typescript
interface SettingsPanelProps {
  className?: string;
}

// Panel contains:
// - Theme selector
// - Default timer duration
// - Keyboard shortcuts toggle
// - Export/Import buttons
// - Reset preferences
```

---

## Page Contracts

### PracticePage

Timed practice mode page.

```typescript
interface PracticePageProps {
  // No props - uses router params
}

// Route: /practice
// Features:
// - Large timer display
// - Optional problem selection
// - Session summary on complete
```

### SettingsPage

Settings and preferences page.

```typescript
interface SettingsPageProps {
  // No props
}

// Route: /settings
// Sections:
// - Appearance (theme)
// - Practice (default timer)
// - Keyboard shortcuts
// - Data (export/import)
// - About (version, PWA status)
```

---

## Context Contracts

### ThemeContext

Provides theme state to component tree.

```typescript
interface ThemeContextValue {
  theme: 'light' | 'dark' | 'system';
  resolvedTheme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
}

// Provider wraps App
<ThemeProvider>
  <App />
</ThemeProvider>

// Usage
const { resolvedTheme } = useThemeContext();
```

### ShortcutsContext

Manages global keyboard shortcuts.

```typescript
interface ShortcutsContextValue {
  enabled: boolean;
  setEnabled: (enabled: boolean) => void;
  registerShortcut: (shortcut: ShortcutHandler) => () => void;
  showHelp: () => void;
}
```

---

## Utility Functions

### formatTime

Format seconds to display string.

```typescript
function formatTime(seconds: number): string;
// 65 → "01:05"
// 3600 → "60:00"
```

### parseTime

Parse time string to seconds.

```typescript
function parseTime(timeString: string): number;
// "01:05" → 65
```

### generateChecksum

Generate SHA-256 checksum for data.

```typescript
async function generateChecksum(data: object): Promise<string>;
```

### verifyChecksum

Verify checksum matches data.

```typescript
async function verifyChecksum(data: object, checksum: string): Promise<boolean>;
```

### downloadJson

Trigger JSON file download.

```typescript
function downloadJson(data: object, filename: string): void;
```
