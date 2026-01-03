// lib/codeRunner.ts - Code execution utilities for in-editor JavaScript/TypeScript validation

import type { SupportedLanguage } from '@/types';

/**
 * Console output type for captured logs
 */
export type ConsoleOutputType = 'log' | 'warn' | 'error' | 'info';

/**
 * Individual console output entry
 */
export interface ConsoleOutput {
  /** The output type (log, warn, error, info) */
  type: ConsoleOutputType;
  /** The formatted output string */
  message: string;
  /** Timestamp for ordering */
  timestamp: number;
}

/**
 * Result of code execution
 */
export interface CodeExecutionResult {
  /** Captured console output lines with type information */
  output: ConsoleOutput[];
  /** Error message if execution failed (syntax error, runtime error, or timeout) */
  error: string | null;
  /** Whether code is currently being executed */
  isRunning: boolean;
}

/**
 * Maximum execution time in milliseconds (5 seconds)
 */
const EXECUTION_TIMEOUT_MS = 5000;

/**
 * Maximum output lines before truncation
 */
const MAX_OUTPUT_LINES = 1000;

/**
 * Maximum output size in bytes before truncation (100KB)
 */
const MAX_OUTPUT_BYTES = 100 * 1024;

/**
 * Check if a language supports in-browser execution
 */
export function isExecutableLanguage(language: SupportedLanguage): boolean {
  return language === 'javascript' || language === 'typescript';
}

/**
 * Get tooltip message for unsupported languages
 */
export function getLanguageTooltip(language: SupportedLanguage): string {
  if (isExecutableLanguage(language)) {
    return 'Run code (JavaScript/TypeScript only)';
  }
  return `Code execution is only available for JavaScript and TypeScript. Current language: ${language}`;
}

/**
 * Format a value for console output display
 */
function formatValue(value: unknown): string {
  if (value === undefined) return 'undefined';
  if (value === null) return 'null';
  if (typeof value === 'string') return value;
  if (typeof value === 'function') return value.toString();
  if (value instanceof Error) return `${value.name}: ${value.message}`;
  
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value);
  }
}

/**
 * Check if output exceeds limits
 */
function checkOutputLimits(
  output: ConsoleOutput[],
  totalBytes: number
): { truncated: boolean; reason?: string } {
  if (output.length >= MAX_OUTPUT_LINES) {
    return { truncated: true, reason: `Output truncated: exceeded ${MAX_OUTPUT_LINES} lines` };
  }
  if (totalBytes >= MAX_OUTPUT_BYTES) {
    return { truncated: true, reason: `Output truncated: exceeded ${MAX_OUTPUT_BYTES / 1024}KB` };
  }
  return { truncated: false };
}

/**
 * Execute JavaScript/TypeScript code in a sandboxed environment
 * 
 * @param code - The code to execute
 * @returns Promise<CodeExecutionResult> - The execution result with captured output
 */
export async function executeCode(code: string): Promise<CodeExecutionResult> {
  const output: ConsoleOutput[] = [];
  let totalBytes = 0;
  let truncated = false;
  let truncationReason = '';

  // Create captured console methods
  const addOutput = (type: ConsoleOutputType, ...args: unknown[]): void => {
    if (truncated) return;
    
    const message = args.map(formatValue).join(' ');
    totalBytes += message.length;
    
    const limits = checkOutputLimits(output, totalBytes);
    if (limits.truncated) {
      truncated = true;
      truncationReason = limits.reason!;
      output.push({
        type: 'warn',
        message: truncationReason,
        timestamp: Date.now(),
      });
      return;
    }
    
    output.push({
      type,
      message,
      timestamp: Date.now(),
    });
  };

  // Create mock console object
  const mockConsole = {
    log: (...args: unknown[]) => addOutput('log', ...args),
    warn: (...args: unknown[]) => addOutput('warn', ...args),
    error: (...args: unknown[]) => addOutput('error', ...args),
    info: (...args: unknown[]) => addOutput('info', ...args),
  };

  return new Promise((resolve) => {
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    let resolved = false;

    const cleanup = () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
    };

    // Set up timeout
    timeoutId = setTimeout(() => {
      if (!resolved) {
        resolved = true;
        resolve({
          output,
          error: `Execution timed out after ${EXECUTION_TIMEOUT_MS / 1000} seconds. Check for infinite loops.`,
          isRunning: false,
        });
      }
    }, EXECUTION_TIMEOUT_MS);

    try {
      // Create a function from the code with mocked console
      // Using new Function to create sandboxed execution
      const wrappedCode = `
        "use strict";
        return (function(console) {
          ${code}
        })
      `;
      
      const fn = new Function(wrappedCode)();
      
      // Execute the function with our mock console
      const result = fn(mockConsole);
      
      // Handle async results (promises)
      if (result && typeof result.then === 'function') {
        result
          .then(() => {
            if (!resolved) {
              resolved = true;
              cleanup();
              resolve({ output, error: null, isRunning: false });
            }
          })
          .catch((err: Error) => {
            if (!resolved) {
              resolved = true;
              cleanup();
              resolve({
                output,
                error: err.message || String(err),
                isRunning: false,
              });
            }
          });
      } else {
        // Synchronous execution completed
        if (!resolved) {
          resolved = true;
          cleanup();
          resolve({ output, error: null, isRunning: false });
        }
      }
    } catch (err) {
      if (!resolved) {
        resolved = true;
        cleanup();
        const error = err instanceof Error ? err : new Error(String(err));
        resolve({
          output,
          error: error.message,
          isRunning: false,
        });
      }
    }
  });
}

/**
 * Create initial empty execution result
 */
export function createEmptyResult(): CodeExecutionResult {
  return {
    output: [],
    error: null,
    isRunning: false,
  };
}
