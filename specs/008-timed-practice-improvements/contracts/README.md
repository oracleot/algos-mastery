# Contracts: Timed Practice Improvements

**Feature**: 008-timed-practice-improvements  
**Date**: 1 January 2026

## Overview

This feature is UI-focused and does not introduce any API contracts. All functionality is implemented client-side with no backend communication.

## Internal Contracts

### useCodeRunner Hook Interface

```typescript
/**
 * Hook for executing JavaScript/TypeScript code in the browser
 */
interface UseCodeRunnerReturn {
  /**
   * Execute code and capture output
   * @param code - JavaScript/TypeScript code to execute
   * @returns Promise that resolves when execution completes or times out
   */
  run: (code: string) => Promise<void>;
  
  /**
   * Current execution result
   */
  result: {
    output: Array<{
      type: 'log' | 'warn' | 'error' | 'info';
      message: string;
      timestamp: number;
    }>;
    error: string | null;
    isRunning: boolean;
  };
  
  /**
   * Clear all output and errors
   */
  clear: () => void;
}
```

### Component Prop Contracts

See [data-model.md](./data-model.md) for complete prop type definitions.
