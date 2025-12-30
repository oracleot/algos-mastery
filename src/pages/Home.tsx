// pages/Home.tsx - Home page with dashboard and navigation

import { Link } from 'react-router-dom';
import { BookOpen, ArrowRight, TrendingUp, Clock, Settings, Library } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dashboard } from '@/components/Dashboard';
import { ThemeToggle } from '@/components/ThemeToggle';
import { OfflineIndicator } from '@/components/OfflineIndicator';
import { OnboardingTour } from '@/components/OnboardingTour';
import { usePWA } from '@/hooks/usePWA';

function Home() {
  const { isOnline } = usePWA();

  return (
    <div className="min-h-screen bg-background">
      {/* Onboarding Tour */}
      <OnboardingTour />
      
      {/* Top bar with theme toggle and offline indicator */}
      <div className="fixed top-4 right-4 flex items-center gap-2 z-10">
        <OfflineIndicator isOnline={isOnline} />
        <ThemeToggle />
      </div>
      
      <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12 pt-16 sm:pt-12">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-primary/10 rounded-xl">
              <BookOpen className="h-8 w-8 text-primary" />
            </div>
          </div>
          
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-2">
            Algorithms Mastery Tracker
          </h1>
          
          <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto mb-6">
            Track your algorithm problem-solving journey with spaced repetition.
          </p>

          <div className="flex flex-col gap-3 justify-center max-w-sm mx-auto sm:max-w-none sm:flex-row sm:flex-wrap">
            <Button size="lg" asChild className="w-full sm:w-auto touch-manipulation" data-tour="view-problems">
              <Link to="/problems">
                View Problems
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="w-full sm:w-auto touch-manipulation" data-tour="browse-catalog">
              <Link to="/catalog">
                <Library className="h-5 w-5" />
                Browse Catalog
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="w-full sm:w-auto touch-manipulation" data-tour="timed-practice">
              <Link to="/practice">
                <Clock className="h-5 w-5" />
                Timed Practice
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="w-full sm:w-auto touch-manipulation" data-tour="progress-ladder">
              <Link to="/progress">
                <TrendingUp className="h-5 w-5" />
                Progress Ladder
              </Link>
            </Button>
          </div>

          {/* Settings link */}
          <div className="mt-4">
            <Button variant="ghost" size="sm" asChild className="touch-manipulation">
              <Link to="/settings">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Link>
            </Button>
          </div>
        </div>

        {/* Dashboard Section */}
        <Dashboard />

        {/* Features Section */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6">
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
