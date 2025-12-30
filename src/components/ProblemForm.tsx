// components/ProblemForm.tsx - Form for creating/editing problems

import { useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ResourceForm } from '@/components/ResourceForm';
import { ResourceList } from '@/components/ResourceList';
import { getTopicOptions } from '@/data/topics';
import { validateProblem, isValid } from '@/lib/validation';
import type { Problem, ProblemFormData, ValidationErrors, Difficulty, LearningResource } from '@/types';
import { DIFFICULTIES } from '@/types';

interface ProblemFormProps {
  /** Initial values for editing, undefined for create mode */
  initialData?: Problem;
  /** Called when form is submitted with valid data */
  onSubmit: (data: ProblemFormData) => Promise<void>;
  /** Called when user cancels */
  onCancel: () => void;
  /** Whether the form is in a submitting state */
  isSubmitting?: boolean;
}

const difficultyLabels: Record<Difficulty, string> = {
  easy: 'Easy',
  medium: 'Medium',
  hard: 'Hard',
};

function ProblemForm({ initialData, onSubmit, onCancel, isSubmitting }: ProblemFormProps) {
  const [formData, setFormData] = useState<ProblemFormData>({
    title: initialData?.title ?? '',
    url: initialData?.url ?? '',
    topic: initialData?.topic ?? '',
    difficulty: initialData?.difficulty ?? '',
    notes: initialData?.notes ?? '',
    resources: initialData?.resources ?? [],
  });

  const [errors, setErrors] = useState<ValidationErrors>({});

  const topicOptions = getTopicOptions();
  const isEditMode = !!initialData;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const validationErrors = validateProblem(formData);
    setErrors(validationErrors);

    if (!isValid(validationErrors)) {
      return;
    }

    await onSubmit(formData);
  };

  const updateField = <K extends keyof ProblemFormData>(
    field: K,
    value: ProblemFormData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field as keyof ValidationErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleAddResource = (resource: LearningResource) => {
    setFormData((prev) => ({
      ...prev,
      resources: [...prev.resources, resource],
    }));
  };

  const handleRemoveResource = (resourceId: string) => {
    setFormData((prev) => ({
      ...prev,
      resources: prev.resources.filter((r) => r.id !== resourceId),
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Title Field */}
      <div className="space-y-2">
        <Label htmlFor="title">
          Title <span className="text-destructive">*</span>
        </Label>
        <Input
          id="title"
          type="text"
          placeholder="e.g., Two Sum"
          value={formData.title}
          onChange={(e) => updateField('title', e.target.value)}
          aria-invalid={!!errors.title}
          aria-describedby={errors.title ? 'title-error' : undefined}
        />
        {errors.title && (
          <p id="title-error" className="text-sm text-destructive">
            {errors.title}
          </p>
        )}
      </div>

      {/* Topic Field */}
      <div className="space-y-2">
        <Label htmlFor="topic">
          Topic <span className="text-destructive">*</span>
        </Label>
        <Select
          value={formData.topic}
          onValueChange={(value) => updateField('topic', value as ProblemFormData['topic'])}
        >
          <SelectTrigger
            id="topic"
            className="w-full"
            aria-invalid={!!errors.topic}
            aria-describedby={errors.topic ? 'topic-error' : undefined}
          >
            <SelectValue placeholder="Select a topic" />
          </SelectTrigger>
          <SelectContent>
            {topicOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.topic && (
          <p id="topic-error" className="text-sm text-destructive">
            {errors.topic}
          </p>
        )}
      </div>

      {/* Difficulty Field */}
      <div className="space-y-2">
        <Label htmlFor="difficulty">
          Difficulty <span className="text-destructive">*</span>
        </Label>
        <Select
          value={formData.difficulty}
          onValueChange={(value) =>
            updateField('difficulty', value as ProblemFormData['difficulty'])
          }
        >
          <SelectTrigger
            id="difficulty"
            className="w-full"
            aria-invalid={!!errors.difficulty}
            aria-describedby={errors.difficulty ? 'difficulty-error' : undefined}
          >
            <SelectValue placeholder="Select difficulty" />
          </SelectTrigger>
          <SelectContent>
            {DIFFICULTIES.map((diff) => (
              <SelectItem key={diff} value={diff}>
                {difficultyLabels[diff]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.difficulty && (
          <p id="difficulty-error" className="text-sm text-destructive">
            {errors.difficulty}
          </p>
        )}
      </div>

      {/* URL Field (Optional) */}
      <div className="space-y-2">
        <Label htmlFor="url">URL (optional)</Label>
        <Input
          id="url"
          type="url"
          placeholder="https://leetcode.com/problems/..."
          value={formData.url}
          onChange={(e) => updateField('url', e.target.value)}
          aria-invalid={!!errors.url}
          aria-describedby={errors.url ? 'url-error' : undefined}
        />
        {errors.url && (
          <p id="url-error" className="text-sm text-destructive">
            {errors.url}
          </p>
        )}
      </div>

      {/* Notes Field (Optional) */}
      <div className="space-y-2">
        <Label htmlFor="notes">Notes (optional)</Label>
        <Textarea
          id="notes"
          placeholder="Add your notes, approach, or solution hints..."
          value={formData.notes}
          onChange={(e) => updateField('notes', e.target.value)}
          rows={4}
          aria-invalid={!!errors.notes}
          aria-describedby={errors.notes ? 'notes-error' : undefined}
        />
        {errors.notes && (
          <p id="notes-error" className="text-sm text-destructive">
            {errors.notes}
          </p>
        )}
      </div>

      {/* Learning Resources Section */}
      <div className="space-y-3 pt-2">
        <Label>Learning Resources (optional)</Label>
        {formData.resources.length > 0 && (
          <ResourceList
            resources={formData.resources}
            onRemove={handleRemoveResource}
          />
        )}
        <ResourceForm onAdd={handleAddResource} />
      </div>

      {/* Form Actions */}
      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : isEditMode ? 'Save Changes' : 'Add Problem'}
        </Button>
      </div>
    </form>
  );
}

export { ProblemForm };
export type { ProblemFormProps };
