// hooks/useImport.ts - React hook for data import functionality

import { useState, useCallback } from 'react';
import {
  validateExport,
  importData as doImport,
  readJsonFile,
  type ValidationResult,
} from '@/lib/import';
import type { ImportResult } from '@/types';

/**
 * Hook return type for useImport
 */
export interface UseImportReturn {
  /** Whether an import operation is in progress */
  isImporting: boolean;
  /** Whether file validation is in progress */
  isValidating: boolean;
  /** Error message if import/validation failed */
  error: string | null;
  /** Validation result for selected file */
  validation: ValidationResult | null;
  /** Import result after successful import */
  result: ImportResult | null;
  /** Validate a file before importing */
  validateFile: (file: File) => Promise<ValidationResult>;
  /** Import data from a file */
  importData: (file: File) => Promise<ImportResult>;
  /** Import from already parsed data */
  importParsedData: (data: unknown) => Promise<ImportResult>;
  /** Clear validation and error state */
  reset: () => void;
}

/**
 * Hook for importing app data with validation and checksum verification
 *
 * @example
 * ```tsx
 * const { validateFile, importData, isImporting, validation } = useImport();
 *
 * const handleFileSelect = async (file: File) => {
 *   const result = await validateFile(file);
 *   if (result.isValid) {
 *     await importData(file);
 *   }
 * };
 * ```
 */
export function useImport(): UseImportReturn {
  const [isImporting, setIsImporting] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validation, setValidation] = useState<ValidationResult | null>(null);
  const [result, setResult] = useState<ImportResult | null>(null);

  const validateFile = useCallback(async (file: File): Promise<ValidationResult> => {
    setIsValidating(true);
    setError(null);
    setValidation(null);

    try {
      const data = await readJsonFile(file);
      const validationResult = await validateExport(data);
      setValidation(validationResult);
      return validationResult;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Validation failed';
      setError(message);
      const failedResult: ValidationResult = {
        isValid: false,
        version: 'unknown',
        stats: {
          problems: 0,
          solutions: 0,
          reviews: 0,
          reviewHistory: 0,
          timeLogs: 0,
          estimatedSize: '0 B',
        },
        warnings: [],
        errors: [message],
      };
      setValidation(failedResult);
      return failedResult;
    } finally {
      setIsValidating(false);
    }
  }, []);

  const importParsedData = useCallback(async (data: unknown): Promise<ImportResult> => {
    setIsImporting(true);
    setError(null);
    setResult(null);

    try {
      const importResult = await doImport(data);

      if (!importResult.success) {
        setError(importResult.error || 'Import failed');
      }

      setResult(importResult);
      return importResult;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Import failed';
      setError(message);
      const failedResult: ImportResult = {
        success: false,
        error: message,
      };
      setResult(failedResult);
      return failedResult;
    } finally {
      setIsImporting(false);
    }
  }, []);

  const importData = useCallback(async (file: File): Promise<ImportResult> => {
    setIsImporting(true);
    setError(null);
    setResult(null);

    try {
      const data = await readJsonFile(file);
      return await importParsedData(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Import failed';
      setError(message);
      const failedResult: ImportResult = {
        success: false,
        error: message,
      };
      setResult(failedResult);
      return failedResult;
    } finally {
      setIsImporting(false);
    }
  }, [importParsedData]);

  const reset = useCallback(() => {
    setError(null);
    setValidation(null);
    setResult(null);
  }, []);

  return {
    isImporting,
    isValidating,
    error,
    validation,
    result,
    validateFile,
    importData,
    importParsedData,
    reset,
  };
}
