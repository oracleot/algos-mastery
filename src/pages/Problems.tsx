// pages/Problems.tsx - Problems list page (placeholder for Phase 3)

import { Link } from 'react-router-dom';
import { ArrowLeft, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/EmptyState';

function Problems() {
  // TODO: Implement in Phase 3 with useProblems hook
  const problems: unknown[] = [];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" asChild>
                <Link to="/">
                  <ArrowLeft className="h-5 w-5" />
                </Link>
              </Button>
              <h1 className="text-xl font-semibold text-foreground">Problems</h1>
            </div>
            <Button>
              <Plus className="h-4 w-4" />
              Add Problem
            </Button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {problems.length === 0 ? (
          <EmptyState
            icon={<Plus className="h-12 w-12" />}
            title="No problems yet"
            description="Start by adding your first algorithm problem to track your progress."
            action={{
              label: 'Add Your First Problem',
              onClick: () => {
                // TODO: Open add problem modal in Phase 3
              },
            }}
          />
        ) : (
          <div>
            {/* TODO: Add FilterBar and ProblemList in Phase 3/4 */}
          </div>
        )}
      </main>
    </div>
  );
}

export { Problems };
