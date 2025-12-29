// pages/Problem.tsx - Problem detail page with solution editor

import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Plus, ExternalLink, Code } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { EmptyState } from '@/components/EmptyState';
import { SolutionForm } from '@/components/SolutionForm';
import { TopicBadge } from '@/components/TopicBadge';
import { DifficultyBadge } from '@/components/DifficultyBadge';
import { useProblems } from '@/hooks/useProblems';
import { useSolutions } from '@/hooks/useSolutions';
import { getTopicName } from '@/data/topics';
import { LANGUAGE_DISPLAY_NAMES } from '@/lib/editor';
import type { Problem as ProblemType, SolutionFormData } from '@/types';

function Problem() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getProblem } = useProblems();
  const { solutions, isLoading: solutionsLoading, addSolution } = useSolutions(id ?? '');

  const [problem, setProblem] = useState<ProblemType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load problem on mount
  useEffect(() => {
    async function loadProblem() {
      if (!id) {
        navigate('/problems');
        return;
      }

      try {
        const loadedProblem = await getProblem(id);
        if (!loadedProblem) {
          toast.error('Problem not found');
          navigate('/problems');
          return;
        }
        setProblem(loadedProblem);
      } catch {
        toast.error('Failed to load problem');
        navigate('/problems');
      } finally {
        setIsLoading(false);
      }
    }

    loadProblem();
  }, [id, getProblem, navigate]);

  const handleOpenAddForm = () => {
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
  };

  const handleSubmitSolution = async (data: SolutionFormData) => {
    setIsSubmitting(true);
    try {
      await addSolution(data);
      toast.success('Solution saved successfully');
      handleCloseForm();
    } catch {
      toast.error('Failed to save solution');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <header className="bg-card border-b border-border">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" asChild>
                <Link to="/problems">
                  <ArrowLeft className="h-5 w-5" />
                </Link>
              </Button>
              <div className="h-6 w-48 bg-muted animate-pulse rounded" />
            </div>
          </div>
        </header>
        <main className="max-w-4xl mx-auto px-4 py-8">
          <div className="space-y-4">
            <div className="h-32 bg-muted animate-pulse rounded-lg" />
            <div className="h-64 bg-muted animate-pulse rounded-lg" />
          </div>
        </main>
      </div>
    );
  }

  // Problem not found (shouldn't happen due to redirect, but safety first)
  if (!problem) {
    return null;
  }

  const solutionsList = solutions ?? [];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" asChild>
                <Link to="/problems">
                  <ArrowLeft className="h-5 w-5" />
                </Link>
              </Button>
              <div>
                <h1 className="text-xl font-semibold text-foreground">
                  {problem.title}
                </h1>
                <div className="flex items-center gap-2 mt-1">
                  <TopicBadge topic={problem.topic} />
                  <DifficultyBadge difficulty={problem.difficulty} />
                </div>
              </div>
            </div>
            <Button onClick={handleOpenAddForm}>
              <Plus className="h-4 w-4" />
              Add Solution
            </Button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* Problem Info Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Problem Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Topic:</span>{' '}
                <span className="font-medium">{getTopicName(problem.topic)}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Status:</span>{' '}
                <span className="font-medium capitalize">{problem.status}</span>
              </div>
            </div>
            
            {problem.url && (
              <div>
                <a
                  href={problem.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                >
                  View Problem <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            )}

            {problem.notes && (
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Notes</h4>
                <p className="text-sm whitespace-pre-wrap">{problem.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Solutions Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">
              Solutions ({solutionsList.length})
            </h2>
          </div>

          {solutionsLoading ? (
            <Card>
              <CardContent className="py-8">
                <div className="h-32 bg-muted animate-pulse rounded" />
              </CardContent>
            </Card>
          ) : solutionsList.length === 0 ? (
            <EmptyState
              icon={<Code className="h-12 w-12" />}
              title="No solutions yet"
              description="Add your first solution to track your progress on this problem."
              action={{
                label: 'Add Solution',
                onClick: handleOpenAddForm,
              }}
            />
          ) : (
            <div className="space-y-4">
              {solutionsList.map((solution) => (
                <Card key={solution.id}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">
                        {LANGUAGE_DISPLAY_NAMES[solution.language]}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {solution.createdAt.toLocaleDateString()}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <pre className="text-sm bg-muted p-4 rounded-md overflow-x-auto whitespace-pre-wrap break-words">
                      <code>{solution.code}</code>
                    </pre>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Add Solution Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Add Solution</DialogTitle>
          </DialogHeader>
          <SolutionForm
            onSubmit={handleSubmitSolution}
            onCancel={handleCloseForm}
            isLoading={isSubmitting}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

export { Problem };
