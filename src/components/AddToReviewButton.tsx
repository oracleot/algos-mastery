// components/AddToReviewButton.tsx - Button to add problem to review system

import { useState } from 'react';
import { BookMarked, Check, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

interface AddToReviewButtonProps {
  /** Called when button is clicked */
  onAdd: () => Promise<void>;
  /** Whether problem is already in review system */
  isInReview: boolean;
  /** Size variant */
  size?: 'sm' | 'default' | 'lg';
  /** Optional additional CSS classes */
  className?: string;
}

/**
 * Button component for adding a problem to the spaced repetition review system.
 * Shows different states: add, loading, and already in review.
 */
export function AddToReviewButton({
  onAdd,
  isInReview,
  size = 'default',
  className = '',
}: AddToReviewButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    if (isInReview || isLoading) return;

    setIsLoading(true);
    try {
      await onAdd();
      toast.success('Added to review queue');
    } catch {
      toast.error('Failed to add to review');
    } finally {
      setIsLoading(false);
    }
  };

  // Already in review - show success state
  if (isInReview) {
    return (
      <Button
        variant="secondary"
        size={size}
        disabled
        className={className}
      >
        <Check className="h-4 w-4" />
        In Review System
      </Button>
    );
  }

  // Default - show add button
  return (
    <Button
      variant="outline"
      size={size}
      onClick={handleClick}
      disabled={isLoading}
      className={className}
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <BookMarked className="h-4 w-4" />
      )}
      Add to Review
    </Button>
  );
}
