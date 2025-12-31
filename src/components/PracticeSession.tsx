// components/PracticeSession.tsx - Timed practice session with timer and problem display

import { useState, useCallback, useMemo, useEffect, lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, Eye, EyeOff, ChevronDown, ChevronUp, FileCode, Code, Copy, Check } from 'lucide-react';
import { toast } from 'sonner';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/db';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Timer } from '@/components/Timer';
import { TimerControls } from '@/components/TimerControls';
import { TimerPresets } from '@/components/TimerPresets';
import { TopicBadge } from '@/components/TopicBadge';
import { DifficultyBadge } from '@/components/DifficultyBadge';
import { EditorSkeleton } from '@/components/EditorSkeleton';
import { LanguageSelector } from '@/components/LanguageSelector';
import { useTimer } from '@/hooks/useTimer';
import { useTimeLog } from '@/hooks/useTimeLog';
import { useTemplates } from '@/hooks/useTemplates';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { getPreferences } from '@/lib/preferences';
import { LANGUAGE_DISPLAY_NAMES } from '@/lib/editor';
import {
  loadSessionState,
  saveSessionState,
  clearSavedSession,
} from '@/lib/practiceSession';
import type { Problem, Solution, Template, SupportedLanguage } from '@/types';

// Lazy load SolutionEditor
const SolutionEditor = lazy(() =>
  import('@/components/SolutionEditor').then((mod) => ({ default: mod.SolutionEditor }))
);

interface PracticeSessionProps {
  /** Problem to practice */
  problem: Problem;
  /** Called when session ends (timer complete or user stops) */
  onComplete: (result: PracticeSessionResult) => void;
  /** Called when user wants to skip to next problem */
  onNext?: () => void;
  /** Called when user wants to exit */
  onExit?: () => void;
}

export interface PracticeSessionResult {
  problemId: string;
  durationSeconds: number;
  completed: boolean;
  revealedSolution: boolean;
  revealedTemplate: boolean;
}

/**
 * Timed practice session component
 */
export function PracticeSession({
  problem,
  onComplete,
  onNext,
  onExit,
}: PracticeSessionProps) {
  const preferences = getPreferences();
  const { getTemplatesForTopic } = useTemplates();

  // Try to recover session state
  const recoveredState = useMemo(
    () => loadSessionState(problem.id),
    [problem.id]
  );

  const [durationMinutes, setDurationMinutes] = useState(
    recoveredState?.durationMinutes ?? preferences.defaultTimerMinutes
  );
  const [showSolution, setShowSolution] = useState(
    recoveredState?.revealedSolution ?? false
  );
  const [showTemplate, setShowTemplate] = useState(
    recoveredState?.revealedTemplate ?? false
  );
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [expandedSolutions, setExpandedSolutions] = useState<Set<string>>(new Set());
  const [hasSessionStarted, setHasSessionStarted] = useState(
    recoveredState?.isRunning || recoveredState?.isPaused || false
  );
  const [timerExpired, setTimerExpired] = useState(false);
  
  // Practice code editor state - restore from session or default to open
  const [showPracticeEditor, setShowPracticeEditor] = useState(
    recoveredState?.showPracticeEditor ?? true
  );
  const [practiceCode, setPracticeCode] = useState(
    recoveredState?.practiceCode ?? ''
  );
  const [practiceLanguage, setPracticeLanguage] = useState<SupportedLanguage>(
    recoveredState?.practiceLanguage ?? 'python'
  );
  const [copied, setCopied] = useState(false);

  const { startTracking, stopTracking } = useTimeLog();

  // Handle copy practice code
  const handleCopyCode = useCallback(async () => {
    if (!practiceCode.trim()) {
      toast.error('No code to copy');
      return;
    }
    try {
      await navigator.clipboard.writeText(practiceCode);
      setCopied(true);
      toast.success('Code copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy code');
    }
  }, [practiceCode]);

  // Handle timer completion
  const handleTimerComplete = useCallback(() => {
    setTimerExpired(true);
  }, []);

  const {
    state: timerState,
    start,
    pause,
    resume,
    reset,
    setDuration,
  } = useTimer({
    initialMinutes: durationMinutes,
    initialElapsed: recoveredState?.elapsed ?? 0,
    onComplete: handleTimerComplete,
  });

  // Save session state on changes
  const saveState = useCallback(() => {
    saveSessionState({
      problemId: problem.id,
      startedAt: Date.now() - timerState.elapsed * 1000,
      durationMinutes,
      elapsed: timerState.elapsed,
      isRunning: timerState.isRunning,
      isPaused: timerState.isPaused,
      revealedSolution: showSolution,
      revealedTemplate: showTemplate,
      practiceCode,
      practiceLanguage,
      showPracticeEditor,
    });
  }, [problem.id, timerState, durationMinutes, showSolution, showTemplate, practiceCode, practiceLanguage, showPracticeEditor]);

  // Auto-save session state when timer is running (every 5 seconds)
  useEffect(() => {
    if (!timerState.isRunning) return;

    // Save immediately when timer starts running
    saveState();

    // Save periodically while running
    const intervalId = setInterval(saveState, 5000);
    return () => clearInterval(intervalId);
  }, [timerState.isRunning, saveState]);

  // Save session state when practice code, language, or editor visibility changes
  useEffect(() => {
    if (hasSessionStarted) {
      saveState();
    }
  }, [practiceCode, practiceLanguage, showPracticeEditor, hasSessionStarted, saveState]);

  // Load solutions for problem
  const solutions = useLiveQuery(
    async (): Promise<Solution[]> => {
      return await db.solutions
        .where('problemId')
        .equals(problem.id)
        .reverse()
        .sortBy('createdAt');
    },
    [problem.id],
    [] as Solution[]
  );

  // Get templates for this topic
  const templates = useMemo(
    () => getTemplatesForTopic(problem.topic),
    [getTemplatesForTopic, problem.topic]
  );

  // Handle session start
  const handleStart = useCallback(() => {
    setHasSessionStarted(true);
    start();
    startTracking(problem.id);
    saveState();
  }, [start, startTracking, problem.id, saveState]);

  // Handle preset change
  const handlePresetChange = useCallback(
    (minutes: number) => {
      setDurationMinutes(minutes);
      setDuration(minutes);
      reset(minutes);
    },
    [setDuration, reset]
  );

  // Handle pause
  const handlePause = useCallback(() => {
    pause();
    saveState();
  }, [pause, saveState]);

  // Handle resume
  const handleResume = useCallback(() => {
    resume();
    saveState();
  }, [resume, saveState]);

  // Handle reset
  const handleReset = useCallback(() => {
    reset();
    setShowSolution(false);
    setShowTemplate(false);
    setSelectedTemplate(null);
    setExpandedSolutions(new Set());
    setTimerExpired(false);
    setPracticeCode('');
    setShowPracticeEditor(true);
    clearSavedSession();
  }, [reset]);

  // Handle end session
  const handleEndSession = useCallback(async () => {
    await stopTracking();
    clearSavedSession();

    onComplete({
      problemId: problem.id,
      durationSeconds: timerState.elapsed,
      completed: timerState.isComplete,
      revealedSolution: showSolution,
      revealedTemplate: showTemplate,
    });
  }, [
    stopTracking,
    onComplete,
    problem.id,
    timerState.elapsed,
    timerState.isComplete,
    showSolution,
    showTemplate,
  ]);

  // Handle continue after timer expires
  const handleContinue = useCallback(() => {
    setTimerExpired(false);
  }, []);

  // Toggle timer start/pause/resume via keyboard
  const handleToggleTimer = useCallback(() => {
    if (!hasSessionStarted) {
      // Start the session
      handleStart();
    } else if (timerState.isRunning && !timerState.isPaused) {
      handlePause();
    } else if (timerState.isPaused) {
      handleResume();
    }
  }, [hasSessionStarted, timerState.isRunning, timerState.isPaused, handleStart, handlePause, handleResume]);

  // Keyboard shortcut: Space to start/pause/resume timer
  useKeyboardShortcuts([
    { 
      key: ' ', 
      handler: handleToggleTimer, 
      enabled: !timerExpired 
    },
  ]);

  // Toggle solution visibility
  const handleToggleSolution = useCallback(() => {
    setShowSolution((prev) => !prev);
  }, []);

  // Toggle template visibility
  const handleToggleTemplate = useCallback(() => {
    setShowTemplate((prev) => !prev);
    if (!selectedTemplate && templates.length > 0) {
      setSelectedTemplate(templates[0]!);
    }
  }, [templates, selectedTemplate]);

  // Toggle individual solution
  const toggleSolution = (solutionId: string) => {
    setExpandedSolutions((prev) => {
      const next = new Set(prev);
      if (next.has(solutionId)) {
        next.delete(solutionId);
      } else {
        next.add(solutionId);
      }
      return next;
    });
  };

  // Timer expired dialog
  if (timerExpired && !timerState.isComplete) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Time's Up!
          </h2>
          <p className="text-muted-foreground">
            You've completed {Math.floor(timerState.elapsed / 60)} minutes of practice.
          </p>
        </div>
        <div className="flex gap-4">
          <Button variant="outline" size="lg" onClick={handleContinue}>
            Continue Practicing
          </Button>
          <Button size="lg" onClick={handleEndSession}>
            End Session
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
      {/* Timer Section - Sticky on desktop */}
      <div className="lg:sticky lg:top-6 lg:self-start">
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center gap-4">
              {/* Timer Display */}
              <Timer state={timerState} size="lg" />

              {/* Timer Controls */}
              <TimerControls
                state={timerState}
                onStart={handleStart}
                onPause={handlePause}
                onResume={handleResume}
                onReset={handleReset}
                onStop={handleEndSession}
                showStop={hasSessionStarted}
                size="md"
              />

              {/* Duration Presets - only show before starting */}
              {!hasSessionStarted && (
                <TimerPresets
                  selectedMinutes={durationMinutes}
                  onSelect={handlePresetChange}
                  disabled={timerState.isRunning}
                  compact
                />
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Problem Card */}
      <Card>
        <CardHeader className="space-y-4">
          <div className="space-y-3">
            <CardTitle className="text-xl sm:text-2xl leading-tight">
              {problem.title}
            </CardTitle>
            <div className="flex flex-wrap items-center gap-2">
              <TopicBadge topic={problem.topic} />
              <DifficultyBadge difficulty={problem.difficulty} />
            </div>
          </div>

          {problem.url && (
            <a
              href={problem.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
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
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant={showPracticeEditor ? 'secondary' : 'default'}
              size="sm"
              onClick={() => setShowPracticeEditor(!showPracticeEditor)}
              className="gap-2"
            >
              <Code className="h-4 w-4" />
              {showPracticeEditor ? 'Hide Editor' : 'Practice Code'}
            </Button>
            
            <Button
              variant={showTemplate ? 'secondary' : 'outline'}
              size="sm"
              onClick={handleToggleTemplate}
              className="gap-2"
              disabled={templates.length === 0}
            >
              <FileCode className="h-4 w-4" />
              {showTemplate ? 'Hide Template' : 'Reveal Template'}
            </Button>

            <Button
              variant={showSolution ? 'secondary' : 'outline'}
              size="sm"
              onClick={handleToggleSolution}
              className="gap-2"
            >
              {showSolution ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
              {showSolution ? 'Hide Solution' : 'Reveal Solution'}
            </Button>
          </div>

          {/* Practice Code Editor */}
          {showPracticeEditor && (
            <div className="border rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                  Your Practice Code
                </h3>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCopyCode}
                    disabled={!practiceCode.trim()}
                    className="gap-1.5 h-8"
                  >
                    {copied ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                    <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy'}</span>
                  </Button>
                  <LanguageSelector
                    value={practiceLanguage}
                    onChange={setPracticeLanguage}
                  />
                </div>
              </div>
              <Suspense fallback={<EditorSkeleton height="300px" />}>
                <SolutionEditor
                  value={practiceCode}
                  language={practiceLanguage}
                  onChange={setPracticeCode}
                  height="300px"
                  placeholder="Write your solution here..."
                />
              </Suspense>
            </div>
          )}

          {/* Template Section */}
          {showTemplate && templates.length > 0 && (
            <div className="border rounded-lg p-4 space-y-3">
              <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                Pattern Template
              </h3>

              {/* Template Selector */}
              {templates.length > 1 && (
                <div className="flex flex-wrap gap-2">
                  {templates.map((template) => (
                    <Button
                      key={template.id}
                      variant={
                        selectedTemplate?.id === template.id
                          ? 'default'
                          : 'outline'
                      }
                      size="sm"
                      onClick={() => setSelectedTemplate(template)}
                    >
                      {template.name}
                    </Button>
                  ))}
                </div>
              )}

              {/* Template Code */}
              {selectedTemplate && (
                <div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {selectedTemplate.description}
                  </p>
                  <Suspense fallback={<EditorSkeleton height="200px" />}>
                    <SolutionEditor
                      value={
                        selectedTemplate.codeByLanguage[
                          selectedTemplate.defaultLanguage
                        ] ?? ''
                      }
                      language={selectedTemplate.defaultLanguage}
                      onChange={() => {}}
                      readOnly
                      height="200px"
                    />
                  </Suspense>
                </div>
              )}
            </div>
          )}

          {/* Solutions Section */}
          {showSolution && (
            <div className="border rounded-lg p-4 space-y-3">
              <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                Your Solutions ({solutions.length})
              </h3>

              {solutions.length === 0 ? (
                <div className="text-center py-6 bg-muted/50 rounded-lg">
                  <p className="text-muted-foreground mb-2">
                    No solutions recorded for this problem
                  </p>
                  <Button variant="link" asChild>
                    <Link to={`/problems/${problem.id}`}>Add a solution</Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  {solutions.map((solution) => {
                    const isExpanded = expandedSolutions.has(solution.id);
                    return (
                      <div
                        key={solution.id}
                        className="border rounded-lg overflow-hidden"
                      >
                        <button
                          onClick={() => toggleSolution(solution.id)}
                          className="w-full flex items-center justify-between p-3 bg-muted/30 hover:bg-muted/50 transition-colors"
                        >
                          <span className="font-medium text-sm">
                            {LANGUAGE_DISPLAY_NAMES[solution.language]}
                          </span>
                          {isExpanded ? (
                            <ChevronUp className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <ChevronDown className="h-4 w-4 text-muted-foreground" />
                          )}
                        </button>
                        {isExpanded && (
                          <pre className="text-sm p-4 overflow-x-auto bg-background">
                            <code>{solution.code}</code>
                          </pre>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-4 border-t">
            <Button 
              variant="outline" 
              onClick={onExit}
              disabled={timerState.isRunning && !timerState.isPaused}
            >
              Exit Practice
            </Button>
            {onNext && (
              <Button 
                onClick={onNext}
                disabled={hasSessionStarted && !timerState.isComplete}
              >
                Next Problem
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export type { PracticeSessionProps };
