# Research: Timed Practice Improvements

**Feature**: 008-timed-practice-improvements  
**Date**: 1 January 2026

## Research Tasks

### 1. JavaScript Code Execution in Browser

**Question**: What is the safest and most efficient way to execute user-provided JavaScript code in a browser environment with timeout protection?

**Decision**: Use `new Function()` with console interception and Web Worker timeout fallback

**Rationale**:
- `new Function()` is lighter than eval() and runs in a slightly more isolated scope
- For algorithm practice, users write self-contained functions that don't need module imports
- Console output can be intercepted by temporarily overriding console methods
- For timeout protection, wrap execution in a try/catch with a Promise.race against a timeout

**Alternatives Considered**:
- **Web Worker**: Would provide true isolation and natural timeout via `worker.terminate()`, but adds complexity for console output capture since workers have separate console. Could be a future enhancement.
- **iframe sandbox**: Overkill for this use case; adds DOM overhead and cross-origin messaging complexity
- **External API**: Would require backend and break offline-first principle

**Implementation Approach**:
```typescript
// Simplified pattern
async function runCode(code: string, timeoutMs: number = 5000) {
  const logs: string[] = [];
  const originalConsole = { ...console };
  
  // Intercept console
  console.log = (...args) => logs.push(args.map(String).join(' '));
  // ... same for warn, error, info
  
  try {
    const fn = new Function(code);
    await Promise.race([
      Promise.resolve(fn()),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Execution timeout')), timeoutMs)
      )
    ]);
    return { output: logs, error: null };
  } catch (e) {
    return { output: logs, error: e.message };
  } finally {
    // Restore console
    Object.assign(console, originalConsole);
  }
}
```

**Note**: The timeout approach with `Promise.race` won't stop an actual infinite loop in synchronous code - it will still block. For true protection against infinite loops, Web Workers with `terminate()` would be needed. For MVP, we document this limitation and accept that synchronous infinite loops may freeze the tab briefly until the browser's own protection kicks in.

---

### 2. Fullscreen Overlay Implementation

**Question**: What is the best approach for implementing a fullscreen focus mode that overlays the entire viewport?

**Decision**: Use React Portal with fixed positioning (`position: fixed; inset: 0; z-index: 50`)

**Rationale**:
- React Portal (`createPortal`) renders content outside the component tree into document.body, avoiding z-index stacking context issues
- Fixed positioning with `inset: 0` covers the entire viewport regardless of scroll position
- z-index: 50 matches shadcn/ui Dialog patterns for consistency
- Component state remains in PracticeSession, only rendering location changes

**Alternatives Considered**:
- **Browser Fullscreen API**: Requires user gesture to enter, shows browser chrome, different behavior across browsers. Too invasive for this use case.
- **CSS-only with fixed positioning (no portal)**: Could work but may have z-index conflicts with other modals/toasts

**Implementation Approach**:
```tsx
{isFullscreen && createPortal(
  <div className="fixed inset-0 z-50 bg-background flex flex-col">
    {/* Header with timer + exit button */}
    {/* Collapsible problem description */}
    {/* Editor (flex-1 to fill space) */}
    {/* Run button + output panel */}
  </div>,
  document.body
)}
```

---

### 3. Timer State for Editor Disable Logic

**Question**: How should we determine when the editor should be read-only based on timer state?

**Decision**: Derive from existing `TimerState` interface: `readOnly = !timerState.isRunning && !timerState.isComplete`

**Rationale**:
- Existing `useTimer` hook provides `isRunning`, `isPaused`, and `isComplete` states
- Timer state transitions are already well-defined:
  - Not started: `isRunning=false, isPaused=false, isComplete=false` → **Disabled**
  - Running: `isRunning=true, isPaused=false, isComplete=false` → **Enabled**
  - Paused: `isRunning=false, isPaused=true, isComplete=false` → **Disabled**
  - Completed: `isRunning=false, isPaused=false, isComplete=true` → **Enabled**
- Simple boolean logic covers all cases

**Implementation**:
```typescript
const isEditorDisabled = !timerState.isRunning && !timerState.isComplete;

// Message logic
const disabledMessage = !timerState.isRunning && !timerState.isPaused && !timerState.isComplete
  ? "Start timer to begin coding"
  : timerState.isPaused
    ? "Resume timer to continue"
    : null;
```

---

### 4. Navigation Button Visibility Logic

**Question**: How should "Next Problem" visibility be calculated to only show when there are valid problems available?

**Decision**: Compute availability based on practice-eligible problems (attempted + solved status only)

**Rationale**:
- Current code uses `unsolvedProblems` which includes problems with `status === 'attempted'`
- But timed practice page filters to `status === 'attempted' || status === 'solved'` for the main problem list
- "Next Problem" should only show if there are other problems in the current queue OR other attempted/solved problems not yet in queue

**Implementation**:
```typescript
// In PracticeSession.tsx
const hasMoreProblems = useMemo(() => {
  // Check if more problems in queue
  if (currentQueueIndex < practiceQueue.length - 1) return true;
  
  // Check if there are other attempted/solved problems not in queue
  // This requires passing available problems as prop or via context
  return availableProblemsCount > practiceQueue.length;
}, [currentQueueIndex, practiceQueue, availableProblemsCount]);

// Only show Next Problem button when hasMoreProblems is true
```

For Practice.tsx "Random Unsolved Problem":
```typescript
// Already has unsolvedProblems filter
// Just need to conditionally render based on unsolvedProblems.length > 0
{unsolvedProblems.length > 0 ? (
  <Button onClick={handleRandomProblem}>Random Unsolved Problem</Button>
) : (
  <p>No unsolved problems available for practice</p>
)}
```

---

### 5. Output Panel Design

**Question**: How should the code execution output panel be designed for clarity and usability?

**Decision**: Collapsible panel below editor with color-coded output types

**Rationale**:
- Panel should be visible only when there's output to show
- Different console methods (log, warn, error) should have distinct visual styling
- Clear button to dismiss output
- Auto-scroll to show latest output

**UI Design**:
- Background: `bg-muted` for contrast with editor
- Console types:
  - `log`: default text color
  - `warn`: yellow/amber text (`text-yellow-600`)
  - `error`: red text (`text-destructive`)
  - `info`: blue text (`text-blue-500`)
- Execution error: red background with error icon
- Timeout error: specific message explaining the 5-second limit
- Max height with scroll: `max-h-48 overflow-y-auto`

---

### 6. Tooltip for Disabled Run Button

**Question**: What's the best way to show a tooltip on a disabled button for non-JS/TS languages?

**Decision**: Use existing shadcn/ui Tooltip component wrapping the Button

**Rationale**:
- Tooltip component already exists in `src/components/ui/tooltip.tsx`
- Works with disabled buttons when wrapping the trigger element
- Consistent with existing UI patterns

**Implementation**:
```tsx
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

<TooltipProvider>
  <Tooltip>
    <TooltipTrigger asChild>
      <span tabIndex={0}> {/* Wrapper for disabled button accessibility */}
        <Button disabled={!canRun}>
          <Play className="h-4 w-4" /> Run Code
        </Button>
      </span>
    </TooltipTrigger>
    {!isJavaScriptOrTypeScript && (
      <TooltipContent>
        Code execution is only available for JavaScript and TypeScript
      </TooltipContent>
    )}
  </Tooltip>
</TooltipProvider>
```

---

## Summary of Decisions

| Topic | Decision |
|-------|----------|
| Code Execution | `new Function()` with console interception + timeout via Promise.race |
| Timeout Protection | 5-second Promise.race (sync infinite loops still block briefly) |
| Fullscreen Mode | React Portal with `fixed inset-0 z-50` |
| Editor Disable | `readOnly = !isRunning && !isComplete` |
| Disable Messages | Contextual: "Start timer..." or "Resume timer..." |
| Next Problem Visibility | Check queue position + count of available attempted/solved problems |
| Random Problem Visibility | Show only when `unsolvedProblems.length > 0` |
| Output Panel | Collapsible, color-coded by console method, max-h-48 with scroll |
| Disabled Button Tooltip | shadcn/ui Tooltip wrapping span > disabled Button |
