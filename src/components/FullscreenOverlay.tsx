// components/FullscreenOverlay.tsx - Fullscreen focus mode overlay for timed practice

import { useEffect, useMemo, useState, lazy, Suspense } from 'react';
import { createPortal } from 'react-dom';
import { Minimize2, Pause, Play, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EditorSkeleton } from '@/components/EditorSkeleton';
import { CodeRunnerPanel } from '@/components/CodeRunnerPanel';
import { EditorDisabledBanner } from '@/components/EditorDisabledBanner';
import { TopicBadge } from '@/components/TopicBadge';
import { DifficultyBadge } from '@/components/DifficultyBadge';
import { formatTime, type TimerState } from '@/lib/timer';
import type { Problem, SupportedLanguage } from '@/types';

// Lazy load SolutionEditor for better initial load
const SolutionEditor = lazy(() =>
  import('@/components/SolutionEditor').then((mod) => ({ default: mod.SolutionEditor }))
);

export interface FullscreenOverlayProps {
  /** Problem being practiced */
  problem: Problem;
  /** Timer state from useTimer hook */
  timerState: TimerState;
  /** Timer control: pause */
  onPause: () => void;
  /** Timer control: resume */
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

/**
 * Fullscreen focus mode overlay for distraction-free timed practice.
 * Renders via React Portal to document.body.
 */
export function FullscreenOverlay({
  problem,
  timerState,
  onPause,
  onResume,
  code,
  language,
  onCodeChange,
  onExit,
}: FullscreenOverlayProps) {
  const [showProblemDetails, setShowProblemDetails] = useState(false);

  // Compute editor disabled state based on timer
  const isEditorDisabled = !timerState.isRunning && !timerState.isComplete;

  // Compute disabled message for editor based on timer state
  const disabledMessage = useMemo((): string | undefined => {
    if (timerState.isRunning || timerState.isComplete) return undefined;
    if (timerState.isPaused) return 'Resume timer to continue';
    return 'Start timer to begin coding';
  }, [timerState.isRunning, timerState.isComplete, timerState.isPaused]);

  // Handle Escape key to exit fullscreen
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onExit();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onExit]);

  // Get timer color based on remaining time
  const getTimerColor = () => {
    if (timerState.isComplete) return 'text-red-500';
    if (timerState.remaining <= 60) return 'text-orange-500'; // Last minute
    if (timerState.remaining <= 300) return 'text-yellow-500'; // Last 5 minutes
    return 'text-primary';
  };

  const content = (
    <div
      data-testid="fullscreen-overlay"
      className="fixed inset-0 z-50 bg-background flex flex-col"
    >
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center gap-4">
          {/* Timer Display */}
          <div className={`font-mono text-3xl font-bold tabular-nums ${getTimerColor()}`}>
            {formatTime(timerState.remaining)}
          </div>
          
          {/* Timer Controls */}
          {timerState.isRunning && !timerState.isPaused && (
            <Button
              variant="outline"
              size="sm"
              onClick={onPause}
              className="gap-1.5"
              aria-label="Pause timer"
            >
              <Pause className="h-4 w-4" />
              Pause
            </Button>
          )}
          {timerState.isPaused && (
            <Button
              variant="outline"
              size="sm"
              onClick={onResume}
              className="gap-1.5"
              aria-label="Resume timer"
            >
              <Play className="h-4 w-4" />
              Resume
            </Button>
          )}
        </div>

        <div className="flex items-center gap-3">
          {/* Problem Title */}
          <span className="font-medium text-lg hidden sm:inline">
            {problem.title}
          </span>
          
          {/* Exit Fullscreen */}
          <Button
            variant="outline"
            size="sm"
            onClick={onExit}
            className="gap-1.5"
            aria-label="Exit fullscreen"
          >
            <Minimize2 className="h-4 w-4" />
            <span className="hidden sm:inline">Exit</span>
          </Button>
        </div>
      </header>

      {/* Collapsible Problem Description */}
      <div className="border-b">
        <button
          onClick={() => setShowProblemDetails(!showProblemDetails)}
          className="w-full flex items-center justify-between px-4 py-2 hover:bg-muted/50 transition-colors"
          aria-label="Toggle problem details"
        >
          <div className="flex items-center gap-2">
            <span className="font-medium sm:hidden">{problem.title}</span>
            <span className="text-sm text-muted-foreground hidden sm:inline">Problem Details</span>
            <TopicBadge topic={problem.topic} />
            <DifficultyBadge difficulty={problem.difficulty} />
          </div>
          {showProblemDetails ? (
            <ChevronUp className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          )}
        </button>
        
        {showProblemDetails && (
          <div className="px-4 pb-4 space-y-3">
            {problem.url && (
              <a
                href={problem.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                aria-label="View problem on LeetCode"
              >
                View Problem <ExternalLink className="h-3 w-3" />
              </a>
            )}
            {problem.notes && (
              <div className="bg-muted/50 p-3 rounded-md">
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {problem.notes}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Main Editor Area */}
      <div className="flex-1 flex flex-col overflow-hidden p-4">
        <div className="flex-1 flex flex-col min-h-0">
          <div className="relative flex-1 overflow-hidden">
            <Suspense fallback={<EditorSkeleton height="100%" />}>
              <SolutionEditor
                value={code}
                language={language}
                onChange={onCodeChange}
                readOnly={isEditorDisabled}
                height="100%"
                placeholder="Write your solution here..."
                showRunButton={false}
                borderless
              />
            </Suspense>
            {disabledMessage && (
              <EditorDisabledBanner message={disabledMessage} />
            )}
          </div>
        </div>

        {/* Code Runner Panel */}
        <div className="mt-3">
          <CodeRunnerPanel
            code={code}
            language={language}
            disabled={isEditorDisabled}
          />
        </div>
      </div>
    </div>
  );

  return createPortal(content, document.body);
}
