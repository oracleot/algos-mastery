// pages/Review.tsx - Active review session page

import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { ReviewSession } from '@/components/ReviewSession';
import { PageHeader } from '@/components/PageHeader';
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
        <PageHeader title="Review Session" />
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
      {/* Page header with exit button and settings toggle */}
      <PageHeader 
        title="Review Session"
        actions={
          <Button
            variant="outline"
            size="sm"
            onClick={handleExit}
          >
            End Session
          </Button>
        }
      />

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
