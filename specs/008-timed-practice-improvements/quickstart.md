# Quickstart: Timed Practice Improvements

**Feature**: 008-timed-practice-improvements  
**Date**: 1 January 2026

## Files Overview

| File | Purpose | Action |
|------|---------|--------|
| `src/lib/codeRunner.ts` | Code execution utilities (timeout, console capture) | CREATE |
| `src/hooks/useCodeRunner.ts` | React hook for code execution | CREATE |
| `src/hooks/useCodeRunner.test.ts` | Tests for code runner hook | CREATE |
| `src/components/EditorDisabledBanner.tsx` | Banner showing why editor is disabled | CREATE |
| `src/components/CodeRunnerPanel.tsx` | Run button + output panel component | CREATE |
| `src/components/CodeRunnerPanel.test.tsx` | Tests for code runner panel | CREATE |
| `src/components/FullscreenOverlay.tsx` | Fullscreen focus mode overlay | CREATE |
| `src/components/FullscreenOverlay.test.tsx` | Tests for fullscreen overlay | CREATE |
| `src/components/SolutionEditor.tsx` | Add showRunButton prop, integrate CodeRunnerPanel | MODIFY |
| `src/components/PracticeSession.tsx` | Add disabled editor, fullscreen mode, nav visibility | MODIFY |
| `src/components/SolutionForm.tsx` | Enable run button for problem detail page | MODIFY |
| `src/pages/Practice.tsx` | Fix random problem button visibility | MODIFY |

## Implementation Order

### Phase 1: Timer-Enforced Editing (P1)

1. Create `EditorDisabledBanner.tsx` - simple banner component
2. Modify `SolutionEditor.tsx` - add `readOnly` visual feedback + `disabledMessage` prop
3. Modify `PracticeSession.tsx` - compute `isEditorDisabled` and pass to editor

### Phase 2: Code Validation (P2)

1. Create `src/lib/codeRunner.ts` - execution utilities
2. Create `src/hooks/useCodeRunner.ts` - React hook
3. Create `src/hooks/useCodeRunner.test.ts` - tests
4. Create `CodeRunnerPanel.tsx` - run button + output panel
5. Create `CodeRunnerPanel.test.tsx` - tests
6. Modify `SolutionEditor.tsx` - add `showRunButton` prop, integrate panel
7. Modify `SolutionForm.tsx` - enable run button
8. Modify `PracticeSession.tsx` - enable run button for practice editor

### Phase 3: Fullscreen Focus Mode (P3)

1. Create `FullscreenOverlay.tsx` - overlay component with portal
2. Create `FullscreenOverlay.test.tsx` - tests
3. Modify `PracticeSession.tsx` - add fullscreen toggle + state

### Phase 4: Navigation Button Fixes (P4)

1. Modify `PracticeSession.tsx` - fix Next Problem visibility
2. Modify `Practice.tsx` - fix Random Unsolved visibility

## Key Code Patterns

### Timer-Enforced Editing Logic

```typescript
// In PracticeSession.tsx
const isEditorDisabled = !timerState.isRunning && !timerState.isComplete;

const disabledMessage = useMemo(() => {
  if (timerState.isRunning || timerState.isComplete) return null;
  if (timerState.isPaused) return 'Resume timer to continue';
  return 'Start timer to begin coding';
}, [timerState]);

<SolutionEditor
  value={practiceCode}
  language={practiceLanguage}
  onChange={setPracticeCode}
  readOnly={isEditorDisabled}
  disabledMessage={disabledMessage}
  showRunButton={true}
/>
```

### Code Runner Hook Usage

```typescript
// In CodeRunnerPanel.tsx
import { useCodeRunner } from '@/hooks/useCodeRunner';

const { run, result, clear } = useCodeRunner();

const handleRun = async () => {
  await run(code);
};

// result.output - array of ConsoleOutput
// result.error - error message or null
// result.isRunning - loading state
```

### Fullscreen Portal Pattern

```typescript
// In FullscreenOverlay.tsx
import { createPortal } from 'react-dom';

export function FullscreenOverlay({ onExit, ...props }: FullscreenOverlayProps) {
  // Handle Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onExit();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onExit]);

  return createPortal(
    <div className="fixed inset-0 z-50 bg-background flex flex-col">
      {/* Content */}
    </div>,
    document.body
  );
}
```

### Navigation Visibility Logic

```typescript
// In PracticeSession.tsx
const hasMoreProblems = useMemo(() => {
  if (currentQueueIndex < practiceQueue.length - 1) return true;
  // Check if there are available problems not yet in queue
  return availableProblemsCount > practiceQueue.length;
}, [currentQueueIndex, practiceQueue, availableProblemsCount]);

// Only render Next Problem when available
{hasMoreProblems && onNext && (
  <Button onClick={onNext}>Next Problem</Button>
)}
```

## Testing Strategy

### useCodeRunner Tests

```typescript
// src/hooks/useCodeRunner.test.ts
describe('useCodeRunner', () => {
  it('captures console.log output');
  it('captures console.error output');
  it('reports syntax errors');
  it('reports runtime errors');
  it('times out after 5 seconds');
  it('clears previous output on new run');
  it('truncates output over 1000 lines');
});
```

### Component Tests

```typescript
// CodeRunnerPanel.test.tsx
describe('CodeRunnerPanel', () => {
  it('shows Run button for JavaScript');
  it('shows Run button for TypeScript');
  it('shows disabled Run button with tooltip for Python');
  it('displays output after execution');
  it('displays errors with red styling');
  it('disables Run button when disabled prop is true');
});

// FullscreenOverlay.test.tsx
describe('FullscreenOverlay', () => {
  it('renders via portal to document.body');
  it('shows timer display');
  it('shows editor with correct readOnly state');
  it('calls onExit when Escape pressed');
  it('calls onExit when minimize button clicked');
});
```

## Dependencies

No new dependencies required. Uses:

- `lucide-react` (existing): `Maximize2`, `Minimize2`, `Play`, `X`
- `react-dom` (existing): `createPortal`
- shadcn/ui (existing): `Tooltip`, `Button`, `Card`, `Collapsible` (manual implementation)
