// components/NextReviewDate.tsx - Display scheduled review date

import { Calendar, Clock } from 'lucide-react';
import { format, isToday, isTomorrow, differenceInDays, isPast } from 'date-fns';

interface NextReviewDateProps {
  /** Scheduled next review date */
  date: Date;
  /** Whether to show compact view */
  compact?: boolean;
  /** Optional additional CSS classes */
  className?: string;
}

/**
 * Formats the next review date into a human-readable string.
 * Shows relative dates for today/tomorrow, otherwise shows the actual date.
 */
function formatReviewDate(date: Date): { text: string; isOverdue: boolean; isDue: boolean } {
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  const reviewDate = new Date(date);
  reviewDate.setHours(0, 0, 0, 0);

  // Check if overdue (in the past but not today)
  if (isPast(reviewDate) && !isToday(reviewDate)) {
    const daysOverdue = differenceInDays(now, reviewDate);
    return {
      text: daysOverdue === 1 ? '1 day overdue' : `${daysOverdue} days overdue`,
      isOverdue: true,
      isDue: true,
    };
  }

  // Today
  if (isToday(reviewDate)) {
    return { text: 'Due today', isOverdue: false, isDue: true };
  }

  // Tomorrow
  if (isTomorrow(reviewDate)) {
    return { text: 'Due tomorrow', isOverdue: false, isDue: false };
  }

  // Within a week - show day name
  const daysUntil = differenceInDays(reviewDate, now);
  if (daysUntil <= 7) {
    return { text: format(reviewDate, "'Due' EEEE"), isOverdue: false, isDue: false };
  }

  // Further out - show date
  return { text: format(reviewDate, "'Due' MMM d"), isOverdue: false, isDue: false };
}

/**
 * Component to display the next scheduled review date.
 * Shows different styling for overdue, due today, and future dates.
 */
export function NextReviewDate({
  date,
  compact = false,
  className = '',
}: NextReviewDateProps) {
  const { text, isOverdue, isDue } = formatReviewDate(date);

  // Color classes based on status
  const colorClass = isOverdue
    ? 'text-destructive'
    : isDue
      ? 'text-orange-600 dark:text-orange-400'
      : 'text-muted-foreground';

  // Icon based on status
  const Icon = isDue ? Clock : Calendar;

  if (compact) {
    return (
      <span className={`text-sm ${colorClass} ${className}`}>
        {text}
      </span>
    );
  }

  return (
    <div className={`flex items-center gap-2 ${colorClass} ${className}`}>
      <Icon className="h-4 w-4" />
      <span className="text-sm font-medium">{text}</span>
    </div>
  );
}
