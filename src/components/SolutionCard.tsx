// components/SolutionCard.tsx - Individual solution display with expand/collapse

import { useState, lazy, Suspense } from 'react';
import {
  ChevronDown,
  ChevronUp,
  Copy,
  Pencil,
  Trash2,
  Check,
  X,
} from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { LanguageSelector } from '@/components/LanguageSelector';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { EditorSkeleton } from '@/components/EditorSkeleton';
import { copyToClipboard } from '@/lib/clipboard';
import { LANGUAGE_DISPLAY_NAMES } from '@/lib/editor';
import type { Solution, SupportedLanguage } from '@/types';

// Lazy load the CodeMirror editor to reduce initial bundle size
const SolutionEditor = lazy(() =>
  import('@/components/SolutionEditor').then((mod) => ({ default: mod.SolutionEditor }))
);

interface SolutionCardProps {
  /** Solution to display */
  solution: Solution;
  /** Whether to show full code or collapsed */
  expanded?: boolean;
  /** Called when solution is updated */
  onUpdate: (id: string, data: { code: string; language: SupportedLanguage }) => Promise<void>;
  /** Called when solution is deleted */
  onDelete: (id: string) => Promise<void>;
  /** Called when expand/collapse toggled */
  onToggleExpand?: () => void;
}

/**
 * Displays a single solution with expand/collapse, copy, edit, and delete functionality
 */
export function SolutionCard({
  solution,
  expanded = false,
  onUpdate,
  onDelete,
  onToggleExpand,
}: SolutionCardProps) {
  const [isExpanded, setIsExpanded] = useState(expanded);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Edit state
  const [editCode, setEditCode] = useState(solution.code);
  const [editLanguage, setEditLanguage] = useState(solution.language);

  const handleToggleExpand = () => {
    const newExpanded = !isExpanded;
    setIsExpanded(newExpanded);
    onToggleExpand?.();
  };

  const handleCopy = async () => {
    try {
      await copyToClipboard(solution.code);
      toast.success('Code copied to clipboard');
    } catch {
      toast.error('Failed to copy code');
    }
  };

  const handleStartEdit = () => {
    setEditCode(solution.code);
    setEditLanguage(solution.language);
    setIsEditing(true);
    if (!isExpanded) {
      setIsExpanded(true);
    }
  };

  const handleCancelEdit = () => {
    setEditCode(solution.code);
    setEditLanguage(solution.language);
    setIsEditing(false);
  };

  const handleSaveEdit = async () => {
    if (!editCode.trim()) {
      toast.error('Code cannot be empty');
      return;
    }

    setIsSaving(true);
    try {
      await onUpdate(solution.id, { code: editCode, language: editLanguage });
      toast.success('Solution updated');
      setIsEditing(false);
    } catch {
      toast.error('Failed to update solution');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteClick = () => {
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete(solution.id);
      toast.success('Solution deleted');
      setIsDeleteDialogOpen(false);
    } catch {
      toast.error('Failed to delete solution');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    setIsDeleteDialogOpen(false);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <>
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={handleToggleExpand}
                className="flex items-center gap-1 text-sm font-medium hover:text-primary transition-colors"
                aria-expanded={isExpanded}
                aria-label={isExpanded ? 'Collapse solution' : 'Expand solution'}
              >
                {isExpanded ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
                <span>{LANGUAGE_DISPLAY_NAMES[solution.language]}</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">
                {formatDate(solution.updatedAt)}
              </span>
              
              {isEditing ? (
                <>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={handleCancelEdit}
                        disabled={isSaving}
                        aria-label="Cancel editing"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Cancel editing</TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={handleSaveEdit}
                        disabled={isSaving}
                        aria-label="Save changes"
                      >
                        <Check className="h-4 w-4 text-green-600" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Save changes</TooltipContent>
                  </Tooltip>
                </>
              ) : (
                <>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={handleCopy}
                        aria-label="Copy code to clipboard"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Copy code</TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={handleStartEdit}
                        aria-label="Edit solution"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Edit solution</TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={handleDeleteClick}
                        aria-label="Delete solution"
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Delete solution</TooltipContent>
                  </Tooltip>
                </>
              )}
            </div>
          </div>
        </CardHeader>

        {isExpanded && (
          <CardContent>
            {isEditing ? (
              <div className="space-y-3">
                <div className="flex justify-end">
                  <LanguageSelector
                    value={editLanguage}
                    onChange={setEditLanguage}
                  />
                </div>
                <Suspense fallback={<EditorSkeleton height="300px" />}>
                  <SolutionEditor
                    value={editCode}
                    language={editLanguage}
                    onChange={setEditCode}
                    height="300px"
                  />
                </Suspense>
              </div>
            ) : (
              <pre className="text-sm bg-muted p-4 rounded-md overflow-x-auto whitespace-pre-wrap break-words">
                <code>{solution.code}</code>
              </pre>
            )}
          </CardContent>
        )}
      </Card>

      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        title="Delete Solution"
        message="Are you sure you want to delete this solution? This action cannot be undone."
        confirmLabel={isDeleting ? 'Deleting...' : 'Delete'}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        isDestructive
      />
    </>
  );
}

export type { SolutionCardProps };
