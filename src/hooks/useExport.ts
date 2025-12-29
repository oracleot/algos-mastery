// hooks/useExport.ts - React hook for data export functionality

import { useState, useCallback } from 'react';
import {
  exportAllData,
  getExportPreview,
  downloadJson,
  getExportFilename,
  type ExportStats,
} from '@/lib/export';

/**
 * Hook return type for useExport
 */
export interface UseExportReturn {
  /** Whether an export operation is in progress */
  isExporting: boolean;
  /** Error message if export failed */
  error: string | null;
  /** Export preview stats (problems, solutions, etc. counts) */
  preview: ExportStats | null;
  /** Whether preview is loading */
  isLoadingPreview: boolean;
  /** Trigger data export and download */
  exportData: () => Promise<void>;
  /** Fetch export preview stats */
  fetchPreview: () => Promise<void>;
  /** Clear any error state */
  clearError: () => void;
}

/**
 * Hook for exporting app data with checksum generation and download
 *
 * @example
 * ```tsx
 * const { exportData, isExporting, preview, fetchPreview } = useExport();
 *
 * useEffect(() => {
 *   fetchPreview();
 * }, [fetchPreview]);
 *
 * return (
 *   <Button onClick={exportData} disabled={isExporting}>
 *     {isExporting ? 'Exporting...' : 'Export Data'}
 *   </Button>
 * );
 * ```
 */
export function useExport(): UseExportReturn {
  const [isExporting, setIsExporting] = useState(false);
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<ExportStats | null>(null);

  const fetchPreview = useCallback(async () => {
    setIsLoadingPreview(true);
    try {
      const stats = await getExportPreview();
      setPreview(stats);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load preview');
    } finally {
      setIsLoadingPreview(false);
    }
  }, []);

  const exportData = useCallback(async () => {
    setIsExporting(true);
    setError(null);

    try {
      const data = await exportAllData();
      const filename = getExportFilename();
      downloadJson(data, filename);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Export failed';
      setError(message);
      throw err;
    } finally {
      setIsExporting(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    isExporting,
    isLoadingPreview,
    error,
    preview,
    exportData,
    fetchPreview,
    clearError,
  };
}
