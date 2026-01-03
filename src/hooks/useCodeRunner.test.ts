// hooks/useCodeRunner.test.ts - Tests for useCodeRunner hook

import { describe, it, expect } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useCodeRunner } from './useCodeRunner';

describe('useCodeRunner', () => {
  describe('initial state', () => {
    it('should return empty result initially', () => {
      const { result } = renderHook(() => useCodeRunner());

      expect(result.current.result.output).toEqual([]);
      expect(result.current.result.error).toBeNull();
      expect(result.current.result.isRunning).toBe(false);
    });
  });

  describe('run', () => {
    it('should capture console.log output', async () => {
      const { result } = renderHook(() => useCodeRunner());

      await act(async () => {
        await result.current.run('console.log("hello world")');
      });

      expect(result.current.result.output.length).toBe(1);
      expect(result.current.result.output[0].type).toBe('log');
      expect(result.current.result.output[0].message).toBe('hello world');
      expect(result.current.result.error).toBeNull();
    });

    it('should capture console.error output', async () => {
      const { result } = renderHook(() => useCodeRunner());

      await act(async () => {
        await result.current.run('console.error("error message")');
      });

      expect(result.current.result.output.length).toBe(1);
      expect(result.current.result.output[0].type).toBe('error');
      expect(result.current.result.output[0].message).toBe('error message');
    });

    it('should capture console.warn output', async () => {
      const { result } = renderHook(() => useCodeRunner());

      await act(async () => {
        await result.current.run('console.warn("warning message")');
      });

      expect(result.current.result.output.length).toBe(1);
      expect(result.current.result.output[0].type).toBe('warn');
      expect(result.current.result.output[0].message).toBe('warning message');
    });

    it('should capture console.info output', async () => {
      const { result } = renderHook(() => useCodeRunner());

      await act(async () => {
        await result.current.run('console.info("info message")');
      });

      expect(result.current.result.output.length).toBe(1);
      expect(result.current.result.output[0].type).toBe('info');
      expect(result.current.result.output[0].message).toBe('info message');
    });

    it('should capture multiple console outputs', async () => {
      const { result } = renderHook(() => useCodeRunner());

      const code = `
        console.log("first");
        console.warn("second");
        console.error("third");
      `;

      await act(async () => {
        await result.current.run(code);
      });

      expect(result.current.result.output.length).toBe(3);
      expect(result.current.result.output[0].message).toBe('first');
      expect(result.current.result.output[1].message).toBe('second');
      expect(result.current.result.output[2].message).toBe('third');
    });

    it('should format object output as JSON', async () => {
      const { result } = renderHook(() => useCodeRunner());

      await act(async () => {
        await result.current.run('console.log({ name: "test", value: 42 })');
      });

      expect(result.current.result.output.length).toBe(1);
      expect(result.current.result.output[0].message).toContain('"name": "test"');
      expect(result.current.result.output[0].message).toContain('"value": 42');
    });

    it('should format array output as JSON', async () => {
      const { result } = renderHook(() => useCodeRunner());

      await act(async () => {
        await result.current.run('console.log([1, 2, 3])');
      });

      expect(result.current.result.output.length).toBe(1);
      expect(result.current.result.output[0].message).toContain('1');
      expect(result.current.result.output[0].message).toContain('2');
      expect(result.current.result.output[0].message).toContain('3');
    });

    it('should handle multiple arguments in console.log', async () => {
      const { result } = renderHook(() => useCodeRunner());

      await act(async () => {
        await result.current.run('console.log("value:", 42, "items")');
      });

      expect(result.current.result.output.length).toBe(1);
      expect(result.current.result.output[0].message).toBe('value: 42 items');
    });
  });

  describe('error handling', () => {
    it('should report syntax errors', async () => {
      const { result } = renderHook(() => useCodeRunner());

      await act(async () => {
        await result.current.run('const x = {');
      });

      expect(result.current.result.error).toBeTruthy();
      expect(result.current.result.error).toContain('Unexpected');
    });

    it('should report runtime errors', async () => {
      const { result } = renderHook(() => useCodeRunner());

      await act(async () => {
        await result.current.run('throw new Error("test error")');
      });

      expect(result.current.result.error).toBe('test error');
    });

    it('should report undefined variable errors', async () => {
      const { result } = renderHook(() => useCodeRunner());

      await act(async () => {
        await result.current.run('console.log(undefinedVariable)');
      });

      expect(result.current.result.error).toBeTruthy();
      expect(result.current.result.error).toContain('undefinedVariable');
    });
  });

  describe('running state', () => {
    it('should set isRunning to true during execution', async () => {
      const { result } = renderHook(() => useCodeRunner());

      // Start execution
      let runPromise: Promise<void>;
      act(() => {
        runPromise = result.current.run('console.log("test")');
      });

      // After completion, isRunning should be false
      await act(async () => {
        await runPromise!;
      });

      expect(result.current.result.isRunning).toBe(false);
    });

    it('should set isRunning to false after execution completes', async () => {
      const { result } = renderHook(() => useCodeRunner());

      await act(async () => {
        await result.current.run('console.log("done")');
      });

      expect(result.current.result.isRunning).toBe(false);
    });

    it('should set isRunning to false after error', async () => {
      const { result } = renderHook(() => useCodeRunner());

      await act(async () => {
        await result.current.run('throw new Error("fail")');
      });

      expect(result.current.result.isRunning).toBe(false);
    });
  });

  describe('clear', () => {
    it('should clear previous output on new run', async () => {
      const { result } = renderHook(() => useCodeRunner());

      // First run
      await act(async () => {
        await result.current.run('console.log("first")');
      });

      expect(result.current.result.output.length).toBe(1);

      // Second run should clear and replace output
      await act(async () => {
        await result.current.run('console.log("second")');
      });

      expect(result.current.result.output.length).toBe(1);
      expect(result.current.result.output[0].message).toBe('second');
    });

    it('should clear output when clear is called', async () => {
      const { result } = renderHook(() => useCodeRunner());

      // Run some code
      await act(async () => {
        await result.current.run('console.log("test")');
      });

      expect(result.current.result.output.length).toBe(1);

      // Clear output
      act(() => {
        result.current.clear();
      });

      expect(result.current.result.output).toEqual([]);
      expect(result.current.result.error).toBeNull();
      expect(result.current.result.isRunning).toBe(false);
    });

    it('should clear errors when clear is called', async () => {
      const { result } = renderHook(() => useCodeRunner());

      // Run code that throws
      await act(async () => {
        await result.current.run('throw new Error("test")');
      });

      expect(result.current.result.error).toBeTruthy();

      // Clear output
      act(() => {
        result.current.clear();
      });

      expect(result.current.result.error).toBeNull();
    });
  });

  describe('output truncation', () => {
    it('should truncate output over 1000 lines', async () => {
      const { result } = renderHook(() => useCodeRunner());

      // Generate code that outputs 1100 lines
      const code = `
        for (let i = 0; i < 1100; i++) {
          console.log("line " + i);
        }
      `;

      await act(async () => {
        await result.current.run(code);
      });

      // Should have 1000 lines + truncation warning
      expect(result.current.result.output.length).toBeLessThanOrEqual(1001);
      
      // Last output should be truncation warning
      const lastOutput = result.current.result.output[result.current.result.output.length - 1];
      expect(lastOutput.type).toBe('warn');
      expect(lastOutput.message).toContain('truncated');
    });
  });

  describe('async code execution', () => {
    it('should handle promises in code', async () => {
      const { result } = renderHook(() => useCodeRunner());

      const code = `
        Promise.resolve().then(() => {
          console.log("async done");
        });
      `;

      await act(async () => {
        await result.current.run(code);
      });

      // Give time for promise to resolve
      await waitFor(() => {
        expect(result.current.result.isRunning).toBe(false);
      });
    });
  });
});
