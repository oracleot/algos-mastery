// pages/Home.tsx - Home page with navigation to Problems

import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, ArrowRight, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { DueToday } from '@/components/DueToday';
import { useReviewQueue } from '@/hooks/useReviewQueue';

function Home() {
  const navigate = useNavigate();
  const { dueToday, isLoading } = useReviewQueue();

  const handleStartReview = () => {
    navigate('/review');
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-16 sm:py-24">
        {/* Hero Section */}
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-primary/10 rounded-2xl">
              <BookOpen className="h-12 w-12 text-primary" />
            </div>
          </div>
          
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
            Algorithms Mastery Tracker
          </h1>
          
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Track your algorithm problem-solving journey. Add problems, organize by topic,
            and monitor your progress from unsolved to mastered.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link to="/problems">
                View Problems
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/progress">
                <TrendingUp className="h-5 w-5" />
                Progress Ladder
              </Link>
            </Button>
          </div>
        </div>

        {/* Due Today Section */}
        <div className="mt-12">
          {isLoading ? (
            <Card>
              <CardContent className="py-8">
                <div className="h-24 bg-muted animate-pulse rounded-lg" />
              </CardContent>
            </Card>
          ) : (
            <DueToday
              items={dueToday ?? []}
              onStartReview={handleStartReview}
              compact={false}
            />
          )}
        </div>

        {/* Features Section */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6">
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl mb-2">📝</div>
              <h3 className="font-semibold text-foreground mb-1">Track Problems</h3>
              <p className="text-sm text-muted-foreground">
                Add problems from LeetCode, HackerRank, or any source with notes and links.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl mb-2">🏷️</div>
              <h3 className="font-semibold text-foreground mb-1">Organize by Topic</h3>
              <p className="text-sm text-muted-foreground">
                Categorize problems by 15 algorithm topics following a learning progression.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl mb-2">📊</div>
              <h3 className="font-semibold text-foreground mb-1">Track Progress</h3>
              <p className="text-sm text-muted-foreground">
                Mark problems as unsolved, attempted, or solved to track your mastery.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export { Home };
