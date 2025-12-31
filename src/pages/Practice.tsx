// pages/Practice.tsx - Timed practice page with session flow

import { useState, useCallback, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Clock, Play, Shuffle, CheckCircle, RotateCcw } from 'lucide-react';
import { useLiveQuery } from 'dexie-react-hooks';
import { toast } from 'sonner';
import { db } from '@/lib/db';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PracticeSession, type PracticeSessionResult } from '@/components/PracticeSession';
import { TopicBadge } from '@/components/TopicBadge';
import { DifficultyBadge } from '@/components/DifficultyBadge';
import { PageHeader } from '@/components/PageHeader';
import { formatTotalTime } from '@/lib/timeLog';
import { formatTime } from '@/lib/timer';
import {
  getSavedSession,
  clearSavedSession,
  type SessionState,
} from '@/lib/practiceSession';
import type { Problem } from '@/types';

type PracticeState = 'selection' | 'session' | 'summary';

interface SessionSummary {
  problemId: string;
  problemTitle: string;
  durationSeconds: number;
  completed: boolean;
  revealedSolution: boolean;
  revealedTemplate: boolean;
}

/**
 * Get initial recovery session from sessionStorage (called once on mount)
 */
function getInitialRecoverySession(): SessionState | null {
  const savedSession = getSavedSession();
  if (savedSession && (savedSession.isRunning || savedSession.isPaused || savedSession.elapsed > 0)) {
    return savedSession;
  }
  return null;
}

/**
 * Timed practice page with problem selection and session management
 */
export function Practice() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const problemIdFromUrl = searchParams.get('problemId');

  const [practiceState, setPracticeState] = useState<PracticeState>(
    problemIdFromUrl ? 'session' : 'selection'
  );
  const [selectedProblemId, setSelectedProblemId] = useState<string | null>(
    problemIdFromUrl
  );
  const [sessionResults, setSessionResults] = useState<SessionSummary[]>([]);
  const [practiceQueue, setPracticeQueue] = useState<string[]>([]);
  const [currentQueueIndex, setCurrentQueueIndex] = useState(0);
  // Initialize recovery session from sessionStorage (only runs once on mount)
  const [recoverySession, setRecoverySession] = useState<SessionState | null>(
    () => problemIdFromUrl ? null : getInitialRecoverySession()
  );

  // Load all problems (only those that have been attempted or solved for practice)
  const problems = useLiveQuery(
    async () => {
      const allProblems = await db.problems.toArray();
      // Filter to only include problems that have been attempted or solved
      return allProblems.filter(p => p.status === 'attempted' || p.status === 'solved');
    },
    [],
    [] as Problem[]
  );

  // Get selected problem
  const selectedProblem = useMemo(() => {
    if (!selectedProblemId) return null;
    return problems.find((p) => p.id === selectedProblemId) ?? null;
  }, [problems, selectedProblemId]);

  // Get unsolved (but attempted) problems for suggestions - exclude fully solved
  const unsolvedProblems = useMemo(
    () => problems.filter((p) => p.status === 'attempted'),
    [problems]
  );

  // Get recovery problem details
  const recoveryProblem = useMemo(() => {
    if (!recoverySession) return null;
    return problems.find((p) => p.id === recoverySession.problemId) ?? null;
  }, [problems, recoverySession]);

  // Handle starting practice with a specific problem
  const handleSelectProblem = useCallback((problem: Problem) => {
    setSelectedProblemId(problem.id);
    setPracticeQueue([problem.id]);
    setCurrentQueueIndex(0);
    setPracticeState('session');
  }, []);

  // Handle random problem selection
  const handleRandomProblem = useCallback(() => {
    if (unsolvedProblems.length === 0) {
      toast.error('No unsolved problems available');
      return;
    }
    const randomIndex = Math.floor(Math.random() * unsolvedProblems.length);
    const problem = unsolvedProblems[randomIndex]!;
    handleSelectProblem(problem);
  }, [unsolvedProblems, handleSelectProblem]);

  // Handle resuming a recovered session
  const handleResumeSession = useCallback(() => {
    if (recoverySession) {
      setSelectedProblemId(recoverySession.problemId);
      setPracticeQueue([recoverySession.problemId]);
      setCurrentQueueIndex(0);
      setPracticeState('session');
      setRecoverySession(null);
      toast.success('Session resumed');
    }
  }, [recoverySession]);

  // Handle discarding a recovered session
  const handleDiscardSession = useCallback(() => {
    clearSavedSession();
    setRecoverySession(null);
    toast.info('Previous session discarded');
  }, []);

  // Handle session completion
  const handleSessionComplete = useCallback(
    (result: PracticeSessionResult) => {
      const problem = problems.find((p) => p.id === result.problemId);
      
      setSessionResults((prev) => [
        ...prev,
        {
          ...result,
          problemTitle: problem?.title ?? 'Unknown',
        },
      ]);

      // Check if there are more problems in queue
      if (currentQueueIndex < practiceQueue.length - 1) {
        const nextIndex = currentQueueIndex + 1;
        setCurrentQueueIndex(nextIndex);
        setSelectedProblemId(practiceQueue[nextIndex]!);
        toast.success('Moving to next problem');
      } else {
        setPracticeState('summary');
      }
    },
    [problems, practiceQueue, currentQueueIndex]
  );

  // Handle moving to next problem
  const handleNextProblem = useCallback(() => {
    if (currentQueueIndex < practiceQueue.length - 1) {
      const nextIndex = currentQueueIndex + 1;
      setCurrentQueueIndex(nextIndex);
      setSelectedProblemId(practiceQueue[nextIndex]!);
    } else {
      // Pick a random unsolved problem
      const availableProblems = unsolvedProblems.filter(
        (p) => !practiceQueue.includes(p.id)
      );
      if (availableProblems.length > 0) {
        const randomIndex = Math.floor(Math.random() * availableProblems.length);
        const nextProblem = availableProblems[randomIndex]!;
        setPracticeQueue((prev) => [...prev, nextProblem.id]);
        setCurrentQueueIndex((prev) => prev + 1);
        setSelectedProblemId(nextProblem.id);
      } else {
        toast.info('No more unsolved problems');
      }
    }
  }, [currentQueueIndex, practiceQueue, unsolvedProblems]);

  // Handle exit from session
  const handleExit = useCallback(() => {
    if (sessionResults.length > 0) {
      setPracticeState('summary');
    } else {
      setPracticeState('selection');
    }
  }, [sessionResults.length]);

  // Handle new session from summary
  const handleNewSession = useCallback(() => {
    setSessionResults([]);
    setPracticeQueue([]);
    setCurrentQueueIndex(0);
    setSelectedProblemId(null);
    setPracticeState('selection');
  }, []);

  // Calculate total practice time
  const totalPracticeTime = useMemo(
    () => sessionResults.reduce((sum, r) => sum + r.durationSeconds, 0),
    [sessionResults]
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Page Header */}
      <PageHeader
        title="Timed Practice"
        subtitle="Practice problems under time pressure"
        icon={<Clock className="h-5 w-5" />}
      />
      
      <div className="max-w-4xl mx-auto px-4 py-6 sm:py-8">

        {/* Problem Selection View */}
        {practiceState === 'selection' && (
          <div className="space-y-6">
            {/* Session Recovery Banner */}
            {recoverySession && recoveryProblem && (
              <Card className="border-primary/50 bg-primary/5">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <RotateCcw className="h-5 w-5" />
                    Resume Previous Session?
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{recoveryProblem.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatTime(recoverySession.elapsed)} elapsed
                        {recoverySession.isPaused && ' • Paused'}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={handleDiscardSession}>
                        Discard
                      </Button>
                      <Button size="sm" onClick={handleResumeSession}>
                        Resume
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Start</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  size="lg"
                  className="w-full gap-2"
                  onClick={handleRandomProblem}
                  disabled={unsolvedProblems.length === 0}
                >
                  <Shuffle className="h-5 w-5" />
                  Random Unsolved Problem
                </Button>
                {unsolvedProblems.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center">
                    All problems solved! Add more problems to practice.
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Problem List */}
            <Card>
              <CardHeader>
                <CardTitle>Select a Problem</CardTitle>
              </CardHeader>
              <CardContent>
                {problems.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">
                      No problems available for practice yet.
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Mark problems as "Attempted" or "Solved" to practice them here.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-[400px] overflow-y-auto">
                    {problems.map((problem) => (
                      <button
                        key={problem.id}
                        onClick={() => handleSelectProblem(problem)}
                        className="w-full flex items-center justify-between p-3 rounded-lg border hover:bg-accent transition-colors text-left"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="font-medium truncate">
                            {problem.title}
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <TopicBadge topic={problem.topic} />
                            <DifficultyBadge
                              difficulty={problem.difficulty}
                            />
                          </div>
                        </div>
                        <Play className="h-5 w-5 text-muted-foreground flex-shrink-0 ml-2" />
                      </button>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Practice Session View */}
        {practiceState === 'session' && selectedProblem && (
          <PracticeSession
            problem={selectedProblem}
            onComplete={handleSessionComplete}
            onNext={handleNextProblem}
            onExit={handleExit}
          />
        )}

        {/* Session Summary View */}
        {practiceState === 'summary' && (
          <div className="space-y-6">
            <Card>
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-green-500/10 rounded-full">
                    <CheckCircle className="h-8 w-8 text-green-500" />
                  </div>
                </div>
                <CardTitle className="text-2xl">Session Complete!</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="bg-muted/50 rounded-lg p-4">
                    <div className="text-3xl font-bold text-primary">
                      {sessionResults.length}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Problems Practiced
                    </div>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-4">
                    <div className="text-3xl font-bold text-primary">
                      {formatTotalTime(totalPracticeTime)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Total Time
                    </div>
                  </div>
                </div>

                {/* Results List */}
                <div className="space-y-2">
                  <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                    Problems Practiced
                  </h3>
                  {sessionResults.map((result, index) => (
                    <div
                      key={`${result.problemId}-${index}`}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">
                          {result.problemTitle}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {formatTotalTime(result.durationSeconds)}
                          {result.revealedSolution && ' • Viewed solution'}
                          {result.revealedTemplate && ' • Used template'}
                        </div>
                      </div>
                      <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    </div>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex gap-4">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => navigate('/')}
                  >
                    Back to Home
                  </Button>
                  <Button className="flex-1" onClick={handleNewSession}>
                    New Session
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
