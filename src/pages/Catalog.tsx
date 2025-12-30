// pages/Catalog.tsx - Browse and add problems from the curated catalog

import { useState, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, BookOpen } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { CatalogCard } from '@/components/CatalogCard';
import { CatalogFilters } from '@/components/CatalogFilters';
import { PROBLEM_CATALOG } from '@/data/catalog';
import { useProblems } from '@/hooks/useProblems';
import { normalizeUrl } from '@/lib/utils';
import type { CatalogFilters as CatalogFiltersType, CatalogProblem } from '@/types';

const INITIAL_FILTERS: CatalogFiltersType = {
  topic: null,
  difficulty: null,
  source: null,
  search: '',
};

/**
 * Catalog page - allows users to browse the curated problem catalog
 */
export function Catalog() {
  const { problems, addProblem, isLoading } = useProblems();
  const [filters, setFilters] = useState<CatalogFiltersType>(INITIAL_FILTERS);

  // Build a Set of normalized URLs for O(1) lookup
  const existingUrls = useMemo(() => {
    if (!problems) return new Set<string>();
    return new Set(
      problems
        .filter((p) => p.url)
        .map((p) => normalizeUrl(p.url!))
    );
  }, [problems]);

  // Check if a URL is already added
  const isAdded = useCallback(
    (url: string) => existingUrls.has(normalizeUrl(url)),
    [existingUrls]
  );

  // Filter catalog based on current filters
  const filteredCatalog = useMemo(() => {
    let result = PROBLEM_CATALOG;

    if (filters.topic) {
      result = result.filter((p) => p.topic === filters.topic);
    }

    if (filters.difficulty) {
      result = result.filter((p) => p.difficulty === filters.difficulty);
    }

    if (filters.source) {
      result = result.filter((p) => p.source === filters.source);
    }

    if (filters.search.trim()) {
      const searchLower = filters.search.toLowerCase().trim();
      result = result.filter((p) =>
        p.title.toLowerCase().includes(searchLower)
      );
    }

    return result;
  }, [filters]);

  // Count how many filtered problems are already added
  const addedCount = useMemo(() => {
    return filteredCatalog.filter((p) => isAdded(p.url)).length;
  }, [filteredCatalog, isAdded]);

  // Check if any filter is active
  const hasActiveFilters =
    filters.topic !== null ||
    filters.difficulty !== null ||
    filters.source !== null ||
    filters.search.trim() !== '';

  // Handle adding a problem
  const handleAddProblem = async (problem: CatalogProblem) => {
    try {
      await addProblem({
        title: problem.title,
        url: problem.url,
        topic: problem.topic,
        difficulty: problem.difficulty,
        notes: '',
      });
      toast.success(`Added "${problem.title}" to your problems`);
    } catch {
      toast.error('Failed to add problem. Please try again.');
    }
  };

  // Clear all filters
  const handleClearFilters = () => {
    setFilters(INITIAL_FILTERS);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur">
        <div className="container mx-auto flex h-14 max-w-6xl items-center gap-4 px-4">
          <Link to="/">
            <Button variant="ghost" size="icon" aria-label="Go back home">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-lg font-semibold">Problem Catalog</h1>
        </div>
      </header>

      <main className="container mx-auto max-w-6xl px-4 py-6">
        {/* Filters */}
        <div className="mb-6">
          <CatalogFilters
            filters={filters}
            onTopicChange={(topic) => setFilters((f) => ({ ...f, topic }))}
            onDifficultyChange={(difficulty) =>
              setFilters((f) => ({ ...f, difficulty }))
            }
            onSourceChange={(source) => setFilters((f) => ({ ...f, source }))}
            onSearchChange={(search) => setFilters((f) => ({ ...f, search }))}
            onClearAll={handleClearFilters}
            hasActiveFilters={hasActiveFilters}
          />
        </div>

        {/* Stats bar */}
        <div className="mb-4 text-sm text-muted-foreground">
          Showing {filteredCatalog.length} of {PROBLEM_CATALOG.length} problems
          {addedCount > 0 && ` • ${addedCount} already added`}
        </div>

        {/* Loading state */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-40 rounded-xl border bg-muted/50 animate-pulse"
              />
            ))}
          </div>
        ) : filteredCatalog.length === 0 ? (
          /* Empty state */
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <BookOpen className="h-16 w-16 text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">No problems found</h2>
            <p className="text-muted-foreground max-w-md mb-4">
              Try adjusting your filters to find problems.
            </p>
            {hasActiveFilters && (
              <Button variant="outline" onClick={handleClearFilters}>
                Clear filters
              </Button>
            )}
          </div>
        ) : (
          /* Problem grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCatalog.map((problem) => (
              <CatalogCard
                key={problem.id}
                problem={problem}
                isAdded={isAdded(problem.url)}
                onAdd={() => handleAddProblem(problem)}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
