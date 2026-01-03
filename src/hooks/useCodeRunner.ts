// hooks/useCodeRunner.ts - React hook for executing JavaScript/TypeScript code

import { useState, useCallback } from 'react';
import {
  executeCode,
  createEmptyResult,
  type CodeExecutionResult,
} from '@/lib/codeRunner';

/**
 * Return type for useCodeRunner hook
 */
export interface UseCodeRunnerReturn {
  /** Execute the provided code */
  run: (code: string) => Promise<void>;
  /** Current execution result */
  result: CodeExecutionResult;
  /** Clear output and errors */
  clear: () => void;
}

/**
 * React hook for executing JavaScript/TypeScript code in the browser
 * 
 * Provides:
 * - run(code): Execute code and capture console output
 * - result: Current execution result with output, errors, and running state
 * - clear(): Reset the output and error state
 * 
 * @example
 * ```tsx
 * const { run, result, clear } = useCodeRunner();
 * 
 * const handleRun = async () => {
 *   await run(code);
 * };
 * 
 * return (
 *   <div>
 *     {result.output.map((line, i) => (
 *       <div key={i}>{line.message}</div>
 *     ))}
 *     {result.error && <div className="error">{result.error}</div>}
 *   </div>
 * );
 * ```
 */
export function useCodeRunner(): UseCodeRunnerReturn {
  const [result, setResult] = useState<CodeExecutionResult>(createEmptyResult);

  const run = useCallback(async (code: string): Promise<void> => {
    // Clear previous results and set running state
    setResult({
      output: [],
      error: null,
      isRunning: true,
    });

    // Execute the code
    const executionResult = await executeCode(code);
    
    // Update with execution results
    setResult(executionResult);
  }, []);

  const clear = useCallback((): void => {
    setResult(createEmptyResult());
  }, []);

  return { run, result, clear };
}
