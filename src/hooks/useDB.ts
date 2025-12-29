// hooks/useDB.ts - Database lifecycle and utility hook

import { useState, useEffect } from 'react';
import { db } from '@/lib/db';
import type { Problem } from '@/types';

interface UseDBReturn {
  /** Whether the database is ready */
  isReady: boolean;
  /** Error if database initialization failed */
  error: Error | null;
  /** Delete all data (for reset/testing) */
  clearAllData: () => Promise<void>;
  /** Export all problems as JSON */
  exportData: () => Promise<string>;
  /** Import problems from JSON */
  importData: (json: string) => Promise<number>;
}

/**
 * Hook for database lifecycle and utilities
 */
export function useDB(): UseDBReturn {
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Check if database is accessible
    const checkDB = async () => {
      try {
        // Open database to verify it's ready
        await db.open();
        setIsReady(true);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Database initialization failed'));
      }
    };

    checkDB();
  }, []);

  /**
   * Clear all data from the database
   */
  const clearAllData = async (): Promise<void> => {
    try {
      await db.problems.clear();
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to clear data');
    }
  };

  /**
   * Export all problems as JSON string
   */
  const exportData = async (): Promise<string> => {
    try {
      const problems = await db.problems.toArray();
      return JSON.stringify(problems, null, 2);
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to export data');
    }
  };

  /**
   * Import problems from JSON string
   * @returns Number of problems imported
   */
  const importData = async (json: string): Promise<number> => {
    try {
      const data = JSON.parse(json) as Problem[];
      
      if (!Array.isArray(data)) {
        throw new Error('Invalid import format: expected an array');
      }

      // Validate and transform dates
      const problems = data.map((item) => ({
        ...item,
        createdAt: new Date(item.createdAt),
        updatedAt: new Date(item.updatedAt),
      }));

      // Bulk add problems
      await db.problems.bulkPut(problems);
      
      return problems.length;
    } catch (err) {
      if (err instanceof SyntaxError) {
        throw new Error('Invalid JSON format');
      }
      throw err instanceof Error ? err : new Error('Failed to import data');
    }
  };

  return {
    isReady,
    error,
    clearAllData,
    exportData,
    importData,
  };
}
