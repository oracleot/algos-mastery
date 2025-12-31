// pages/Problems.tsx - Problems list page with full CRUD functionality

import { useState, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Plus, SearchX, TrendingUp, Library, Menu } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { EmptyState } from '@/components/EmptyState';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { ProblemForm } from '@/components/ProblemForm';
import { ProblemList } from '@/components/ProblemList';
import { FilterBar } from '@/components/FilterBar';
import { PageHeader } from '@/components/PageHeader';
import { useProblems } from '@/hooks/useProblems';
import { useFilters } from '@/hooks/useFilters';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import type { Problem, ProblemFormData, Status } from '@/types';

function Problems() {
  const {
    filters,
    setTopic,
    setDifficulty,
    setStatus,
    setSearch,
    clearFilters,
    hasActiveFilters,
  } = useFilters();

  const { problems, isLoading, addProblem, updateProblem, deleteProblem, updateStatus } =
    useProblems(filters);

  // Modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProblem, setEditingProblem] = useState<Problem | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Delete confirmation state
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleOpenAddForm = () => {
    setEditingProblem(undefined);
    setIsFormOpen(true);
  };

  const handleOpenEditForm = (problem: Problem) => {
    setEditingProblem(problem);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingProblem(undefined);
  };

  const handleSubmit = async (data: ProblemFormData) => {
    setIsSubmitting(true);
    try {
      if (editingProblem) {
        await updateProblem(editingProblem.id, data);
        toast.success('Problem updated successfully');
      } else {
        await addProblem(data);
        toast.success('Problem added successfully');
      }
      handleCloseForm();
    } catch {
      toast.error(editingProblem ? 'Failed to update problem' : 'Failed to add problem');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteClick = (id: string) => {
    setDeleteId(id);
  };

  const handleConfirmDelete = async () => {
    if (!deleteId) return;

    setIsDeleting(true);
    try {
      await deleteProblem(deleteId);
      toast.success('Problem deleted successfully');
      setDeleteId(null);
    } catch {
      toast.error('Failed to delete problem');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    setDeleteId(null);
  };

  const handleStatusChange = async (id: string, status: Status) => {
    try {
      await updateStatus(id, status);
      toast.success(`Status updated to ${status}`);
    } catch {
      toast.error('Failed to update status');
    }
  };

  // Keyboard shortcuts
  // Reference to search input for focus shortcut
  const searchInputRef = useRef<HTMLInputElement>(null);
  
  const focusSearch = useCallback(() => {
    searchInputRef.current?.focus();
  }, []);

  useKeyboardShortcuts([
    { key: 'n', handler: handleOpenAddForm, enabled: !isFormOpen },
    { key: '/', handler: focusSearch, enabled: !isFormOpen },
  ]);

  const problemsList = problems ?? [];

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Page Header */}
      <PageHeader
        title="Problems"
        actions={
          <>
            {/* Desktop nav buttons */}
            <div className="hidden sm:flex items-center gap-2">
              <Button variant="outline" size="sm" asChild>
                <Link to="/catalog">
                  <Library className="h-4 w-4" />
                  Catalog
                </Link>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link to="/progress">
                  <TrendingUp className="h-4 w-4" />
                  Progress
                </Link>
              </Button>
              <Button onClick={handleOpenAddForm} size="sm">
                <Plus className="h-4 w-4" />
                Add Problem
              </Button>
            </div>
            {/* Mobile hamburger menu */}
            <div className="flex sm:hidden items-center gap-1">
              <Button onClick={handleOpenAddForm} size="icon" className="h-9 w-9">
                <Plus className="h-5 w-5" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="h-9 w-9">
                    <Menu className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link to="/catalog" className="flex items-center gap-2">
                      <Library className="h-4 w-4" />
                      Browse Catalog
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/progress" className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4" />
                      Progress
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </>
        }
      />

      {/* Content */}
      <main className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        {/* Filter Bar */}
        <FilterBar
          ref={searchInputRef}
          filters={filters}
          onTopicChange={setTopic}
          onDifficultyChange={setDifficulty}
          onStatusChange={(status) => setStatus(status)}
          onSearchChange={setSearch}
          onClearAll={clearFilters}
          hasActiveFilters={hasActiveFilters}
        />

        {/* Problems List or Empty State */}
        {isLoading ? (
          <ProblemList
            problems={[]}
            onEdit={() => {}}
            onDelete={() => {}}
            onStatusChange={() => {}}
            isLoading={true}
          />
        ) : problemsList.length === 0 && hasActiveFilters ? (
          <EmptyState
            icon={<SearchX className="h-12 w-12" />}
            title="No matching problems"
            description="Try adjusting your filters or search query to find what you're looking for."
            action={{
              label: 'Clear All Filters',
              onClick: clearFilters,
            }}
          />
        ) : problemsList.length === 0 ? (
          <EmptyState
            icon={<Plus className="h-12 w-12" />}
            title="No problems yet"
            description="Start by adding your first algorithm problem to track your progress."
            action={{
              label: 'Add Your First Problem',
              onClick: handleOpenAddForm,
            }}
          />
        ) : (
          <ProblemList
            problems={problemsList}
            onEdit={handleOpenEditForm}
            onDelete={handleDeleteClick}
            onStatusChange={handleStatusChange}
          />
        )}
      </main>

      {/* Add/Edit Problem Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingProblem ? 'Edit Problem' : 'Add New Problem'}
            </DialogTitle>
            <DialogDescription className="sr-only">
              {editingProblem ? 'Edit the details of your problem' : 'Add a new algorithm problem to track'}
            </DialogDescription>
          </DialogHeader>
          <ProblemForm
            initialData={editingProblem}
            onSubmit={handleSubmit}
            onCancel={handleCloseForm}
            isSubmitting={isSubmitting}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!deleteId}
        title="Delete Problem"
        message="Are you sure you want to delete this problem? This action cannot be undone."
        confirmLabel={isDeleting ? 'Deleting...' : 'Delete'}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        isDestructive
      />
    </div>
  );
}

export { Problems };
