// components/CodeRunnerPanel.tsx - Run button + output panel for code execution

import { useCallback, useMemo } from 'react';
import { Play, Loader2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useCodeRunner } from '@/hooks/useCodeRunner';
import { isExecutableLanguage, getLanguageTooltip } from '@/lib/codeRunner';
import type { SupportedLanguage } from '@/types';
import type { ConsoleOutput } from '@/lib/codeRunner';

interface CodeRunnerPanelProps {
  /** Code to execute */
  code: string;
  /** Language of the code */
  language: SupportedLanguage;
  /** Whether the panel is disabled (e.g., timer not running) */
  disabled?: boolean;
}

/**
 * Get style class for different console output types
 */
function getOutputTypeClass(type: ConsoleOutput['type']): string {
  switch (type) {
    case 'error':
      return 'text-red-500 dark:text-red-400';
    case 'warn':
      return 'text-yellow-600 dark:text-yellow-400';
    case 'info':
      return 'text-blue-500 dark:text-blue-400';
    default:
      return 'text-foreground';
  }
}

/**
 * Panel containing Run button and output display for code execution
 * Only enables execution for JavaScript and TypeScript
 */
export function CodeRunnerPanel({
  code,
  language,
  disabled = false,
}: CodeRunnerPanelProps) {
  const { run, result, clear } = useCodeRunner();

  const canExecute = useMemo(
    () => isExecutableLanguage(language),
    [language]
  );

  const tooltip = useMemo(
    () => getLanguageTooltip(language),
    [language]
  );

  const isDisabled = disabled || !canExecute || result.isRunning;

  const handleRun = useCallback(async () => {
    if (!canExecute || disabled) return;
    await run(code);
  }, [run, code, canExecute, disabled]);

  const hasOutput = result.output.length > 0 || result.error;

  return (
    <div className="space-y-2">
      {/* Run Button Row */}
      <div className="flex items-center justify-between">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <span>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleRun}
                  disabled={isDisabled}
                  className="gap-1.5"
                >
                  {result.isRunning ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Running...
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4" />
                      Run
                    </>
                  )}
                </Button>
              </span>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>{tooltip}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {hasOutput && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={clear}
            className="gap-1.5 text-muted-foreground"
          >
            <X className="h-4 w-4" />
            Clear
          </Button>
        )}
      </div>

      {/* Output Panel */}
      {hasOutput && (
        <div className="rounded-md border bg-muted/30 p-3 max-h-48 overflow-auto">
          <div className="font-mono text-xs space-y-0.5">
            {result.output.map((line, index) => (
              <div
                key={`${line.timestamp}-${index}`}
                className={getOutputTypeClass(line.type)}
              >
                <span className="opacity-50 mr-2">[{line.type}]</span>
                <span className="whitespace-pre-wrap break-all">{line.message}</span>
              </div>
            ))}
            {result.error && (
              <div className="text-red-500 dark:text-red-400">
                <span className="opacity-50 mr-2">[error]</span>
                <span className="whitespace-pre-wrap break-all">{result.error}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
