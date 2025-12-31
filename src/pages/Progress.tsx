// pages/Progress.tsx - Progress ladder page showing topic mastery

import { useNavigate } from 'react-router-dom';
import { TrendingUp } from 'lucide-react';
import { ProgressLadder } from '@/components/ProgressLadder';
import { PageHeader } from '@/components/PageHeader';
import { useProgress } from '@/hooks/useProgress';
import type { TopicSlug } from '@/types';

function Progress() {
  const navigate = useNavigate();
  const { progress, isLoading, nextToUnlock } = useProgress();

  const handleTopicClick = (topic: TopicSlug) => {
    // Navigate to problems filtered by this topic
    navigate(`/problems?topic=${topic}`);
  };

  // Loading state
  if (isLoading || !progress) {
    return (
      <div className="min-h-screen bg-background">
        <PageHeader
          title="Progress Ladder"
          subtitle="Master each topic by solving 70% of problems to unlock the next level"
          icon={<TrendingUp className="h-5 w-5" />}
        />
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
      {/* Page Header */}
      <PageHeader
        title="Progress Ladder"
        subtitle="Master each topic by solving 70% of problems to unlock the next level"
        icon={<TrendingUp className="h-5 w-5" />}
      />

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
