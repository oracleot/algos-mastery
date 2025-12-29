// components/ReviewSession.tsx - Review session container with state management

import { useState, useCallback, useRef, useEffect } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/db';
import { ReviewCard } from '@/components/ReviewCard';
import { ReviewSessionProgress } from '@/components/ReviewSessionProgress';
import { ReviewSessionSummary } from '@/components/ReviewSessionSummary';
import { useReview } from '@/hooks/useReview';
import { REVIEW_RATINGS } from '@/types';
import type { Problem, ReviewQuality, Solution } from '@/types';

/** Result of a single problem review */
export interface ReviewResult {
  problemId: string;
  quality: ReviewQuality;
}

interface ReviewSessionProps {
  /** Problems to review in this session */
  problems: Problem[];

  /** Called when session completes (all problems reviewed) */
  onComplete: (results: ReviewResult[]) => void;

  /** Called when session is cancelled early */
  onCancel: () => void;
}

/**
 * Container component managing review session state.
 * Handles progression through problems, recording reviews,
 * and displaying summary on completion.
 */
export function ReviewSession({
  problems,
  onComplete,
}: ReviewSessionProps) {
  const { recordReview, previewIntervals } = useReview();

  // Session state
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);
  const [isRating, setIsRating] = useState(false);
  const [results, setResults] = useState<ReviewResult[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const [sessionStartTime] = useState(() => Date.now());

  const currentProblem = problems[currentIndex];

  // Load solutions for current problem
  const solutions = useLiveQuery(
    async (): Promise<Solution[]> => {
      if (!currentProblem?.id) return [];
      return await db.solutions
        .where('problemId')
        .equals(currentProblem.id)
        .reverse()
        .sortBy('createdAt');
    },
    [currentProblem?.id],
    [] as Solution[]
  );

  const handleReveal = useCallback(() => {
    setIsRevealed(true);
  }, []);

  const handleRate = useCallback(
    async (quality: ReviewQuality) => {
      if (!currentProblem || isRating) return;

      setIsRating(true);
      try {
        await recordReview(currentProblem.id, quality);

        const newResult: ReviewResult = {
          problemId: currentProblem.id,
          quality,
        };

        const updatedResults = [...results, newResult];
        setResults(updatedResults);

        // Check if session is complete
        if (currentIndex >= problems.length - 1) {
          setIsComplete(true);
        } else {
          // Move to next problem
          setCurrentIndex((prev) => prev + 1);
          setIsRevealed(false);
        }
      } catch (error) {
        console.error('Failed to record review:', error);
      } finally {
        setIsRating(false);
      }
    },
    [currentProblem, currentIndex, problems.length, recordReview, results, isRating]
  );

  // Use ref for keyboard handler
  const handleRateRef = useRef(handleRate);
  handleRateRef.current = handleRate;

  // Keyboard shortcuts for ratings
  useEffect(() => {
    if (!isRevealed || isRating || !currentProblem || isComplete) return;

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
  }, [isRevealed, isRating, currentProblem, isComplete]);

  // Handle session complete
  const handleDone = useCallback(() => {
    onComplete(results);
  }, [onComplete, results]);

  // Calculate session duration
  const sessionDuration = Math.floor((Date.now() - sessionStartTime) / 1000);

  // Show summary when complete
  if (isComplete) {
    return (
      <ReviewSessionSummary
        results={results}
        duration={sessionDuration}
        onDone={handleDone}
      />
    );
  }

  // No current problem (safety check)
  if (!currentProblem) {
    return null;
  }

  const intervals = previewIntervals(currentProblem.id);

  return (
    <div className="space-y-4">
      {/* Progress indicator */}
      <ReviewSessionProgress
        current={currentIndex + 1}
        total={problems.length}
        completedResults={results}
      />

      {/* Review card */}
      <ReviewCard
        problem={currentProblem}
        solutions={solutions}
        isRevealed={isRevealed}
        onReveal={handleReveal}
        onRate={handleRate}
        intervalPreview={intervals}
      />
    </div>
  );
}

export type { ReviewSessionProps };
