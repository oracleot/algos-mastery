// lib/validation.ts - Form validation utilities

import type { ProblemFormData, ValidationErrors } from '../types';
import { TOPIC_SLUGS, DIFFICULTIES } from '../types';

/**
 * Validate problem form data
 * @param data - Form data to validate
 * @returns Object containing validation errors (empty if valid)
 */
export function validateProblem(data: ProblemFormData): ValidationErrors {
  const errors: ValidationErrors = {};

  // Title validation
  if (!data.title.trim()) {
    errors.title = 'Title is required';
  } else if (data.title.length > 200) {
    errors.title = 'Title must be 200 characters or less';
  }

  // Topic validation
  if (!data.topic) {
    errors.topic = 'Topic is required';
  } else if (!TOPIC_SLUGS.includes(data.topic as (typeof TOPIC_SLUGS)[number])) {
    errors.topic = 'Invalid topic selected';
  }

  // Difficulty validation
  if (!data.difficulty) {
    errors.difficulty = 'Difficulty is required';
  } else if (!DIFFICULTIES.includes(data.difficulty as (typeof DIFFICULTIES)[number])) {
    errors.difficulty = 'Invalid difficulty selected';
  }

  // URL validation (optional)
  if (data.url && data.url.trim()) {
    try {
      new URL(data.url);
    } catch {
      errors.url = 'Please enter a valid URL';
    }
  }

  // Notes validation
  if (data.notes && data.notes.length > 5000) {
    errors.notes = 'Notes must be 5000 characters or less';
  }

  return errors;
}

/**
 * Check if validation result has no errors
 * @param errors - Validation errors object
 * @returns true if there are no errors
 */
export function isValid(errors: ValidationErrors): boolean {
  return Object.keys(errors).length === 0;
}
