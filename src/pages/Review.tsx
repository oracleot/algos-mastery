// pages/Review.tsx - Active review session page

import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, X } from 'lucide-react';
import { toast } from 'sonner';
import { useLiveQuery } from 'dexie-react-hooks';
import { Button } from '@/components/ui/button';
import { ReviewCard } from '@/components/ReviewCard';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { useReviewQueue } from '@/hooks/useReviewQueue';
import { useReview } from '@/hooks/useReview';
import { db } from '@/lib/db';
import type { ReviewQuality, Solution } from '@/types';
import type { Problem as ProblemType, Review as ReviewType } from '@/types';
import { REVIEW_RATINGS } from '@/types';

interface DueItem {
  problem: ProblemType;
  review: ReviewType;
}

function ReviewPage() {
  const navigate = useNavigate();
  const { dueToday, isLoading: queueLoading } = useReviewQueue();
  const { recordReview, previewIntervals } = useReview();

  // Session state
  const [sessionItems, setSessionItems] = useState<DueItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);
  const [isExitDialogOpen, setIsExitDialogOpen] = useState(false);
  const [isRating, setIsRating] = useState(false);
  const [sessionStarted, setSessionStarted] = useState(false);

  // Get current problem
  const currentItem = sessionItems[currentIndex];
  const currentProblem = currentItem?.problem;

  // Load solutions for current problem
  const solutions = useLiveQuery(
    async () => {
      if (!currentProblem?.id) return [];
      return await db.solutions
        .where('problemId')
        .equals(currentProblem.id)
        .reverse()
        .sortBy('createdAt');
    },
    [currentProblem?.id],
    []
  ) as Solution[];

  // Initialize session when queue loads
  useEffect(() => {
    if (!queueLoading && dueToday && !sessionStarted) {
      if (dueToday.length === 0) {
        toast.info('No problems due for review');
        navigate('/');
        return;
      }
      setSessionItems([...dueToday]);
      setSessionStarted(true);
    }
  }, [dueToday, queueLoading, sessionStarted, navigate]);

  const handleReveal = useCallback(() => {
    setIsRevealed(true);
  }, []);

  const handleRate = useCallback(
    async (quality: ReviewQuality) => {
      if (!currentProblem || isRating) return;

      setIsRating(true);
      try {
        await recordReview(currentProblem.id, quality);

        // Move to next problem or finish session
        if (currentIndex < sessionItems.length - 1) {
          setCurrentIndex((prev) => prev + 1);
          setIsRevealed(false);
          toast.success('Review recorded');
        } else {
          toast.success('Session complete! 🎉');
          navigate('/');
        }
      } catch (error) {
        console.error('Failed to record review:', error);
        toast.error('Failed to record review');
      } finally {
        setIsRating(false);
      }
    },
    [currentProblem, currentIndex, sessionItems.length, recordReview, navigate, isRating]
  );

  // Use ref to store the latest handleRate function for the keyboard handler
  const handleRateRef = useRef(handleRate);
  handleRateRef.current = handleRate;

  // Keyboard shortcuts for ratings
  useEffect(() => {
    if (!isRevealed || isRating || !currentProblem) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key;
      if (key === '1') {
        handleRateRef.current(REVIEW_RATINGS.AGAIN);
      } else if (key === '2') {
        handleRateRef.current(REVIEW_RATINGS.HARD);
      } else if (key === '3') {
        handleRateRef.current(REVIEW_RATINGS.GOOD);
      } else if (key === '4') {
        handleRateRef.current(REVIEW_RATINGS.EASY);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isRevealed, isRating, currentProblem]);

  const handleExit = useCallback(() => {
    setIsExitDialogOpen(true);
  }, []);

  const confirmExit = useCallback(() => {
    setIsExitDialogOpen(false);
    const completed = currentIndex;
    if (completed > 0) {
      toast.success(`Reviewed ${completed} problem${completed !== 1 ? 's' : ''}`);
    }
    navigate('/');
  }, [currentIndex, navigate]);

  // Loading state
  if (queueLoading || !sessionStarted) {
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

  // No current problem (should not happen, but safety check)
  if (!currentProblem) {
    return null;
  }

  const progress = `${currentIndex + 1} / ${sessionItems.length}`;
  const intervals = previewIntervals(currentProblem.id);

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
                <p className="text-sm text-muted-foreground">{progress}</p>
              </div>
            </div>

            {/* Progress indicator */}
            <div className="flex items-center gap-1">
              {sessionItems.map((_, idx) => (
                <div
                  key={idx}
                  className={`h-2 w-2 rounded-full transition-colors ${
                    idx < currentIndex
                      ? 'bg-green-500'
                      : idx === currentIndex
                        ? 'bg-primary'
                        : 'bg-muted'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 py-6 sm:py-8">
        <ReviewCard
          problem={currentProblem}
          solutions={solutions}
          isRevealed={isRevealed}
          onReveal={handleReveal}
          onRate={handleRate}
          intervalPreview={intervals}
        />
      </main>

      {/* Exit Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isExitDialogOpen}
        title="End Review Session?"
        message={
          currentIndex > 0
            ? `You've reviewed ${currentIndex} problem${currentIndex !== 1 ? 's' : ''}. The remaining ${sessionItems.length - currentIndex} will still be due.`
            : 'Are you sure you want to exit? No reviews have been recorded yet.'
        }
        confirmLabel="End Session"
        onConfirm={confirmExit}
        onCancel={() => setIsExitDialogOpen(false)}
      />
    </div>
  );
}

export { ReviewPage as Review };
