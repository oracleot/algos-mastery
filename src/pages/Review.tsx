// pages/Review.tsx - Active review session page

import { useCallback, useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, X } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { ReviewSession } from '@/components/ReviewSession';
import { ThemeToggle } from '@/components/ThemeToggle';
import type { ReviewResult } from '@/components/ReviewSession';
import { useReviewQueue } from '@/hooks/useReviewQueue';
import type { Problem as ProblemType } from '@/types';

function ReviewPage() {
  const navigate = useNavigate();
  const { dueToday, isLoading: queueLoading } = useReviewQueue();

  // State for dialog and session
  const [isExitDialogOpen, setIsExitDialogOpen] = useState(false);
  const [sessionProblems, setSessionProblems] = useState<ProblemType[] | null>(null);
  const [hasInitialized, setHasInitialized] = useState(false);

  // Initialize session problems once data is available
  useEffect(() => {
    if (!queueLoading && dueToday && !hasInitialized) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setHasInitialized(true);
      if (dueToday.length === 0) {
        toast.info('No problems due for review');
        navigate('/');
      } else {
        setSessionProblems(dueToday.map((item) => item.problem));
      }
    }
  }, [queueLoading, dueToday, hasInitialized, navigate]);

  // Handle session completion
  const handleComplete = useCallback(
    (results: ReviewResult[]) => {
      toast.success(`Session complete! Reviewed ${results.length} problem${results.length !== 1 ? 's' : ''} 🎉`);
      navigate('/');
    },
    [navigate]
  );

  // Handle early exit
  const handleExit = useCallback(() => {
    setIsExitDialogOpen(true);
  }, []);

  const confirmExit = useCallback(() => {
    setIsExitDialogOpen(false);
    navigate('/');
  }, [navigate]);

  const handleCancel = useCallback(() => {
    // When ReviewSession calls onCancel, just exit without dialog
    navigate('/');
  }, [navigate]);

  // Loading state
  if (queueLoading || sessionProblems === null) {
    return (
      <div className="min-h-screen bg-background">
        <header className="bg-card border-b border-border">
          <div className="max-w-3xl mx-auto px-4 py-4">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" asChild>
                <Link to="/">
                  <ArrowLeft className="h-5 w-5" />
                </Link>
              </Button>
              <div className="h-6 w-32 bg-muted animate-pulse rounded" />
            </div>
          </div>
        </header>
        <main className="max-w-3xl mx-auto px-4 py-8">
          <div className="h-96 bg-muted animate-pulse rounded-lg" />
        </main>
      </div>
    );
  }

  // No problems (should not happen after initialization, but safety check)
  if (sessionProblems.length === 0) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleExit}
                aria-label="Exit review session"
              >
                <X className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-lg font-semibold">Review Session</h1>
              </div>
            </div>

            {/* End Session button */}
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Button
                variant="outline"
                size="sm"
                onClick={handleExit}
              >
                End Session
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 py-6 sm:py-8">
        <ReviewSession
          problems={sessionProblems}
          onComplete={handleComplete}
          onCancel={handleCancel}
        />
      </main>

      {/* Exit Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isExitDialogOpen}
        title="End Review Session?"
        message="Are you sure you want to exit? Any remaining problems will still be due for review."
        confirmLabel="End Session"
        onConfirm={confirmExit}
        onCancel={() => setIsExitDialogOpen(false)}
      />
    </div>
  );
}

export { ReviewPage as Review };
