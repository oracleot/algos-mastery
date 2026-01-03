# Data Model: Timed Practice Improvements

**Feature**: 008-timed-practice-improvements  
**Date**: 1 January 2026

## Overview

This feature primarily modifies UI behavior and does not introduce new persisted entities. All state is managed in-memory via React hooks and component state.

## New Types

### CodeExecutionResult

Represents the result of running user code.

```typescript
/**
 * Result of code execution via useCodeRunner hook
 */
interface CodeExecutionResult {
  /** Captured console output lines with type information */
  output: ConsoleOutput[];
  
  /** Error message if execution failed (syntax error, runtime error, or timeout) */
  error: string | null;
  
  /** Whether code is currently being executed */
  isRunning: boolean;
}

/**
 * Individual console output entry
 */
interface ConsoleOutput {
  /** The output type (log, warn, error, info) */
  type: 'log' | 'warn' | 'error' | 'info';
  
  /** The formatted output string */
  message: string;
  
  /** Timestamp for ordering */
  timestamp: number;
}
```

**Location**: `src/hooks/useCodeRunner.ts` (inline, not exported to types/index.ts since it's hook-internal)

### UseCodeRunnerReturn

Hook return type for code execution.

```typescript
/**
 * Return type for useCodeRunner hook
 */
interface UseCodeRunnerReturn {
  /** Execute the provided code */
  run: (code: string) => Promise<void>;
  
  /** Current execution result */
  result: CodeExecutionResult;
  
  /** Clear output and errors */
  clear: () => void;
}
```

**Location**: `src/hooks/useCodeRunner.ts`

---

## Modified Component Props

### SolutionEditor Props (Extended)

```typescript
interface SolutionEditorProps {
  // Existing props
  value: string;
  language: SupportedLanguage;
  onChange: (value: string) => void;
  readOnly?: boolean;
  placeholder?: string;
  height?: string;
  
  // New props
  /** Show the Run Code button and output panel (default: false) */
  showRunButton?: boolean;
  
  /** Message to display when editor is disabled */
  disabledMessage?: string;
}
```

### PracticeSession Props (Extended)

```typescript
interface PracticeSessionProps {
  // Existing props
  problem: Problem;
  onComplete: (result: PracticeSessionResult) => void;
  onNext?: () => void;
  onExit?: () => void;
  
  // New props
  /** Total count of problems available for timed practice (attempted + solved) */
  availableProblemsCount: number;
  
  /** Current practice queue for visibility calculations */
  practiceQueue: string[];
  
  /** Current index in the practice queue */
  currentQueueIndex: number;
}
```

---

## Component State

### PracticeSession State (Extended)

```typescript
// Existing state preserved, new state added:

/** Whether fullscreen focus mode is active */
const [isFullscreen, setIsFullscreen] = useState(false);
```

### FullscreenOverlay Props

```typescript
interface FullscreenOverlayProps {
  /** Problem being practiced */
  problem: Problem;
  
  /** Timer state from useTimer hook */
  timerState: TimerState;
  
  /** Timer control functions */
  onPause: () => void;
  onResume: () => void;
  
  /** Current practice code */
  code: string;
  
  /** Language for syntax highlighting */
  language: SupportedLanguage;
  
  /** Code change handler */
  onCodeChange: (code: string) => void;
  
  /** Exit fullscreen mode */
  onExit: () => void;
}
```

### CodeRunnerPanel Props

```typescript
interface CodeRunnerPanelProps {
  /** Code to execute */
  code: string;
  
  /** Language of the code */
  language: SupportedLanguage;
  
  /** Whether the panel is disabled (e.g., timer not running) */
  disabled?: boolean;
  
  /** Tooltip message when disabled due to language */
  disabledTooltip?: string;
}
```

### EditorDisabledBanner Props

```typescript
interface EditorDisabledBannerProps {
  /** Message to display explaining why editor is disabled */
  message: string;
}
```

---

## Existing Types (No Changes)

The following existing types are used but not modified:

- `TimerState` (from `src/lib/timer.ts`) - Used to determine editor enabled state
- `SupportedLanguage` (from `src/types/index.ts`) - Used to check JS/TS for code execution
- `Problem` (from `src/types/index.ts`) - Used in fullscreen overlay for problem description
- `PracticeSessionResult` (from `src/components/PracticeSession.tsx`) - Unchanged

---

## State Flow Diagram

```
Timer State                    Editor State
─────────────────────────────────────────────────────
Not Started ──────────────────► readOnly=true
  │                              message="Start timer..."
  │ start()
  ▼
Running ──────────────────────► readOnly=false
  │                              message=null
  │ pause()
  ▼
Paused ───────────────────────► readOnly=true
  │                              message="Resume timer..."
  │ resume()
  ▼
Running ──────────────────────► readOnly=false
  │ 
  │ timer expires
  ▼
Completed ────────────────────► readOnly=false
                                 message=null
```

---

## Validation Rules

### Code Execution

| Rule | Constraint |
|------|------------|
| Language | Must be 'javascript' or 'typescript' to enable Run button |
| Timeout | Maximum 5 seconds execution time |
| Output limit | Maximum 1000 lines or 100KB before truncation |

### Navigation Visibility

| Button | Visible When |
|--------|--------------|
| Next Problem | `currentQueueIndex < practiceQueue.length - 1` OR `availableProblemsCount > practiceQueue.length` |
| Random Unsolved | `unsolvedProblems.length > 0` |
