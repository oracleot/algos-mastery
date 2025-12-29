// pages/Progress.tsx - Progress ladder page showing topic mastery

import { Link, useNavigate } from 'react-router-dom';
import { Home } from 'lucide-react';
import { ProgressLadder } from '@/components/ProgressLadder';
import { ThemeToggle } from '@/components/ThemeToggle';
import { OfflineIndicator } from '@/components/OfflineIndicator';
import { useProgress } from '@/hooks/useProgress';
import { usePWA } from '@/hooks/usePWA';
import type { TopicSlug } from '@/types';

function Progress() {
  const navigate = useNavigate();
  const { progress, isLoading, nextToUnlock } = useProgress();
  const { isOnline } = usePWA();

  const handleTopicClick = (topic: TopicSlug) => {
    // Navigate to problems filtered by this topic
    navigate(`/problems?topic=${topic}`);
  };

  // Loading state
  if (isLoading || !progress) {
    return (
      <div className="min-h-screen bg-background">
        <header className="bg-card border-b border-border">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <h1 className="text-xl font-semibold text-foreground">Progress Ladder</h1>
          </div>
        </header>
        <main className="max-w-4xl mx-auto px-4 py-8">
          <div className="space-y-4">
            <div className="h-32 bg-muted animate-pulse rounded-lg" />
            <div className="h-24 bg-muted animate-pulse rounded-lg" />
            <div className="h-24 bg-muted animate-pulse rounded-lg" />
            <div className="h-24 bg-muted animate-pulse rounded-lg" />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link
                to="/"
                className="p-2 -ml-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors"
                aria-label="Go to home"
              >
                <Home className="h-5 w-5" />
              </Link>
              <div>
                <h1 className="text-xl font-semibold text-foreground">Progress Ladder</h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Master each topic by solving 70% of problems to unlock the next level
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <OfflineIndicator isOnline={isOnline} />
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Next to unlock hint */}
        {nextToUnlock && (
          <div className="mb-6 p-4 bg-primary/5 border border-primary/20 rounded-lg">
            <p className="text-sm">
              <span className="font-medium">Next goal:</span>{' '}
              Unlock <span className="font-semibold">{nextToUnlock.topicName}</span> by 
              reaching 70% mastery in the previous topic
            </p>
          </div>
        )}

        <ProgressLadder
          progress={progress}
          onTopicClick={handleTopicClick}
          orientation="vertical"
        />
      </main>
    </div>
  );
}

export { Progress };
