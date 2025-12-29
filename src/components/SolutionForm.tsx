// components/SolutionForm.tsx - Form for adding/editing solutions

import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { SolutionEditor } from '@/components/SolutionEditor';
import { LanguageSelector } from '@/components/LanguageSelector';
import { validateSolution, isSolutionValid } from '@/lib/validation';
import type { SupportedLanguage, SolutionFormData, SolutionValidationErrors, Solution } from '@/types';

interface SolutionFormProps {
  /** Initial values for edit mode */
  initialData?: Solution;
  /** Called when form is submitted successfully */
  onSubmit: (data: SolutionFormData) => Promise<void>;
  /** Called when form is cancelled */
  onCancel: () => void;
  /** Whether form is in loading state */
  isLoading?: boolean;
}

/**
 * Form for adding or editing solutions
 * Includes CodeMirror editor and language selector
 */
export function SolutionForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
}: SolutionFormProps) {
  const [code, setCode] = useState(initialData?.code ?? '');
  const [language, setLanguage] = useState<SupportedLanguage>(
    initialData?.language ?? 'python'
  );
  const [errors, setErrors] = useState<SolutionValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEdit = !!initialData;

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      const formData: SolutionFormData = { code, language };
      const validationErrors = validateSolution(formData);

      if (!isSolutionValid(validationErrors)) {
        setErrors(validationErrors);
        return;
      }

      setIsSubmitting(true);
      setErrors({});

      try {
        await onSubmit(formData);
      } catch (error) {
        console.error('Failed to save solution:', error);
      } finally {
        setIsSubmitting(false);
      }
    },
    [code, language, onSubmit]
  );

  const handleCodeChange = useCallback((value: string) => {
    setCode(value);
    // Clear code error when user starts typing
    setErrors((prev) => ({ ...prev, code: undefined }));
  }, []);

  const handleLanguageChange = useCallback((lang: SupportedLanguage) => {
    setLanguage(lang);
    // Clear language error when user selects
    setErrors((prev) => ({ ...prev, language: undefined }));
  }, []);

  const disabled = isLoading || isSubmitting;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-1">
          <Label htmlFor="language">Language</Label>
          <LanguageSelector
            value={language}
            onChange={handleLanguageChange}
            disabled={disabled}
          />
          {errors.language && (
            <p className="text-sm text-destructive">{errors.language}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="code">Solution Code</Label>
        <SolutionEditor
          value={code}
          language={language}
          onChange={handleCodeChange}
          readOnly={disabled}
          placeholder="Write your solution here..."
        />
        {errors.code && (
          <p className="text-sm text-destructive">{errors.code}</p>
        )}
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={disabled}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={disabled}>
          {isSubmitting ? 'Saving...' : isEdit ? 'Update Solution' : 'Save Solution'}
        </Button>
      </div>
    </form>
  );
}
