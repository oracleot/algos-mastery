// components/Dashboard.tsx - Main progress dashboard combining all elements

import { lazy, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { StreakCounter } from './StreakCounter';
import { SuggestedNext } from './SuggestedNext';
import { NextToUnlock } from './NextToUnlock';
import { DueToday } from './DueToday';
import { Card, CardContent } from '@/components/ui/card';
import { useStreak } from '@/hooks/useStreak';
import { useStats } from '@/hooks/useStats';
import { useSuggestedProblem } from '@/hooks/useSuggestedProblem';
import { useProgress } from '@/hooks/useProgress';
import { useReviewQueue } from '@/hooks/useReviewQueue';
import type { Problem } from '@/types';

// Lazy load WeeklyStatsChart to reduce initial bundle size (Recharts is ~100KB gzipped)
const WeeklyStatsChart = lazy(() => 
  import('./WeeklyStatsChart').then(module => ({ default: module.WeeklyStatsChart }))
);

// Loading placeholder for chart
function ChartSkeleton() {
  return (
    <Card>
      <CardContent className="py-6">
        <div className="h-[180px] bg-muted animate-pulse rounded-lg" />
      </CardContent>
    </Card>
  );
}

/**
 * Dashboard component combining all progress elements
 * Shows streak, weekly stats, due reviews, suggestions, and unlock progress
 */
export function Dashboard() {
  const navigate = useNavigate();

  // Hooks for dashboard data
  const { streak, isLoading: streakLoading, hasReviewedToday } = useStreak();
  const { weeklyStats, weeklyTotal, dailyAverage, isLoading: statsLoading } = useStats();
  const { suggestion, reason, topic, refresh } = useSuggestedProblem();
  const { progress, nextToUnlock } = useProgress();
  const { dueToday, isLoading: queueLoading } = useReviewQueue();

  // Find the current topic (last unlocked topic with incomplete mastery)
  const currentTopic = progress?.slice().reverse().find(
    (t) => t.unlocked && t.masteryPercent < 70
  ) ?? progress?.find((t) => t.unlocked);

  // Calculate problems needed to unlock next topic
  const problemsNeeded = currentTopic && nextToUnlock
    ? Math.max(0, Math.ceil(currentTopic.totalProblems * 0.7) - currentTopic.solvedProblems)
    : 0;

  // Handlers
  const handleStartReview = () => {
    navigate('/review');
  };

  const handleSelectProblem = (problem: Problem) => {
    navigate(`/problems/${problem.id}`);
  };

  const isLoading = streakLoading || statsLoading || queueLoading;

  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Skeleton loaders */}
        <Card>
          <CardContent className="py-8">
            <div className="h-8 bg-muted animate-pulse rounded-lg w-40" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-8">
            <div className="h-48 bg-muted animate-pulse rounded-lg" />
          </CardContent>
        </Card>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardContent className="py-8">
              <div className="h-32 bg-muted animate-pulse rounded-lg" />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-8">
              <div className="h-32 bg-muted animate-pulse rounded-lg" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Top row: Streak and quick stats */}
      <div className="flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center justify-between gap-3 sm:gap-4">
        <div className="flex items-center gap-4">
          <StreakCounter
            count={streak?.currentStreak ?? 0}
            isActive={hasReviewedToday}
            size="lg"
          />
          {streak && streak.longestStreak > streak.currentStreak && (
            <span className="text-sm text-muted-foreground">
              Best: {streak.longestStreak} days
            </span>
          )}
        </div>
        <div className="flex gap-6 text-sm">
          <div className="text-center">
            <p className="text-xl sm:text-2xl font-bold text-foreground">{weeklyTotal}</p>
            <p className="text-muted-foreground text-xs sm:text-sm">This week</p>
          </div>
          <div className="text-center">
            <p className="text-xl sm:text-2xl font-bold text-foreground">{dailyAverage}</p>
            <p className="text-muted-foreground text-xs sm:text-sm">Daily avg</p>
          </div>
        </div>
      </div>

      {/* Due Today section */}
      <DueToday
        items={dueToday ?? []}
        onStartReview={handleStartReview}
        compact={false}
      />

      {/* Weekly chart - lazy loaded to reduce initial bundle size */}
      {weeklyStats && (
        <Suspense fallback={<ChartSkeleton />}>
          <WeeklyStatsChart
            data={weeklyStats}
            height={180}
            showBreakdown={weeklyTotal > 0}
          />
        </Suspense>
      )}

      {/* Bottom row: Suggestions and Unlock progress */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SuggestedNext
          problem={suggestion}
          topic={topic}
          reason={reason}
          onSelect={handleSelectProblem}
          onRefresh={refresh}
        />

        {currentTopic && nextToUnlock && (
          <NextToUnlock
            currentTopic={currentTopic}
            nextTopic={nextToUnlock}
            problemsNeeded={problemsNeeded}
          />
        )}
      </div>
    </div>
  );
}
