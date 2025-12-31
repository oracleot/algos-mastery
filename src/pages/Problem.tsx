// pages/Problem.tsx - Problem detail page with solution editor

import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Plus, ExternalLink, CalendarPlus, BookOpen } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { SolutionForm } from '@/components/SolutionForm';
import { SolutionList } from '@/components/SolutionList';
import { ResourceList } from '@/components/ResourceList';
import { TopicBadge } from '@/components/TopicBadge';
import { DifficultyBadge } from '@/components/DifficultyBadge';
import { AddToReviewButton } from '@/components/AddToReviewButton';
import { NextReviewDate } from '@/components/NextReviewDate';
import { PageHeader } from '@/components/PageHeader';
import { useProblems } from '@/hooks/useProblems';
import { useSolutions } from '@/hooks/useSolutions';
import { useReviewQueue } from '@/hooks/useReviewQueue';
import { getTopicName } from '@/data/topics';
import type { Problem as ProblemType, SolutionFormData, SupportedLanguage } from '@/types';

function Problem() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getProblem } = useProblems();
  const {
    solutions,
    isLoading: solutionsLoading,
    addSolution,
    updateSolution,
    deleteSolution,
  } = useSolutions(id ?? '');
  const { addToReview, addToTodayQueue, isInReview, getReview } = useReviewQueue();

  const [problem, setProblem] = useState<ProblemType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAddingToQueue, setIsAddingToQueue] = useState(false);

  // Check if problem is in review system
  const problemInReview = id ? isInReview(id) : false;
  const reviewData = id ? getReview(id) : undefined;

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

  const handleUpdateSolution = async (
    solutionId: string,
    data: { code: string; language: SupportedLanguage }
  ) => {
    await updateSolution(solutionId, data);
  };

  const handleDeleteSolution = async (solutionId: string) => {
    await deleteSolution(solutionId);
  };

  const handleAddToReview = async () => {
    if (!id) return;
    await addToReview(id);
  };

  const handleAddToTodayQueue = async () => {
    if (!id || isAddingToQueue) return;
    setIsAddingToQueue(true);
    try {
      await addToTodayQueue(id);
      toast.success('Added to today\'s queue');
    } catch {
      toast.error('Failed to add to queue');
    } finally {
      setIsAddingToQueue(false);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <PageHeader title="Loading..." />
        <main className="max-w-7xl mx-auto px-4 lg:px-6 py-8">
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
      {/* Page header with problem title and add solution button */}
      <PageHeader 
        title={problem.title}
        subtitle={
          <div className="flex items-center gap-2 mt-1">
            <TopicBadge topic={problem.topic} />
            <DifficultyBadge difficulty={problem.difficulty} />
          </div>
        }
        useHistoryBack
        actions={
          <>
            {/* Desktop: full button with text */}
            <Button onClick={handleOpenAddForm} size="sm" className="hidden sm:flex">
              <Plus className="h-4 w-4" />
              Add Solution
            </Button>
            {/* Mobile: icon only */}
            <Button onClick={handleOpenAddForm} size="icon" className="h-9 w-9 sm:hidden">
              <Plus className="h-5 w-5" />
            </Button>
          </>
        }
      />

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 lg:px-6 py-8 space-y-6">
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

            {/* Spaced Repetition Section */}
            {problem.status === 'solved' && (
              <div className="pt-4 border-t border-border">
                <h4 className="text-sm font-medium text-muted-foreground mb-3">Spaced Repetition</h4>
                <div className="flex flex-wrap items-center gap-3">
                  <AddToReviewButton
                    onAdd={handleAddToReview}
                    isInReview={problemInReview}
                    size="sm"
                  />
                  {problemInReview && reviewData && (
                    <>
                      <NextReviewDate date={reviewData.nextReview} />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleAddToTodayQueue}
                        disabled={isAddingToQueue}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <CalendarPlus className="h-4 w-4" />
                        Add to Today
                      </Button>
                    </>
                  )}
                </div>
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

          <SolutionList
            solutions={solutionsList}
            isLoading={solutionsLoading}
            onUpdate={handleUpdateSolution}
            onDelete={handleDeleteSolution}
            onAdd={handleOpenAddForm}
          />
        </div>

        {/* Learning Resources Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Learning Resources
                {problem.resources && problem.resources.length > 0 && (
                  <span className="text-sm font-normal text-muted-foreground">
                    ({problem.resources.length})
                  </span>
                )}
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            {problem.resources && problem.resources.length > 0 ? (
              <ResourceList resources={problem.resources} />
            ) : (
              <div className="text-center py-6">
                <BookOpen className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground mb-2">
                  No learning resources yet
                </p>
                <p className="text-xs text-muted-foreground">
                  Add resources when{' '}
                  <Link
                    to={`/problems`}
                    className="text-primary hover:underline"
                  >
                    editing this problem
                  </Link>
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      {/* Add Solution Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-5xl">
          <DialogHeader>
            <DialogTitle>Add Solution</DialogTitle>
            <DialogDescription className="sr-only">
              Write your code solution for this problem
            </DialogDescription>
          </DialogHeader>
          <SolutionForm
            currentTopic={problem.topic}
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
