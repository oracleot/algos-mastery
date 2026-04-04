// pages/Catalog.tsx - Problem Catalog with sidebar layout, topic sections, and progress

import { useMemo } from 'react';
import { BookOpen, Search } from 'lucide-react';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { CatalogTopicSection } from '@/components/CatalogTopicSection';
import { CatalogSidebar } from '@/components/CatalogSidebar';
import { CatalogStats } from '@/components/CatalogStats';
import { PageHeader } from '@/components/PageHeader';
import { useProblems } from '@/hooks/useProblems';
import { useCatalogFilters } from '@/hooks/useCatalogFilters';
import { normalizeUrl } from '@/lib/utils';
import type { CatalogProblem } from '@/types';

export function Catalog() {
  const { problems, addProblem, isLoading } = useProblems();

  // Build normalized URL set for O(1) "is added" checks
  const existingUrls = useMemo(() => {
    if (!problems) return new Set<string>();
    return new Set(
      problems.filter((p) => p.url).map((p) => normalizeUrl(p.url!))
    );
  }, [problems]);

  const {
    searchInput,
    debouncedSearch,
    setSearchInput,
    selectedTopics,
    selectedDifficulties,
    selectedSources,
    setTopics,
    setDifficulties,
    setSources,
    clearAll,
    hasActiveFilters,
    activeFilterCount,
    topicSections,
    filteredCount,
    stats,
    isAdded,
  } = useCatalogFilters(existingUrls);

  const handleAddProblem = async (problem: CatalogProblem) => {
    try {
      await addProblem({
        title: problem.title,
        url: problem.url,
        topic: problem.topic,
        difficulty: problem.difficulty,
        notes: '',
        resources: [],
      });
      toast.success(`Added "${problem.title}" to your problems`);
    } catch {
      toast.error('Failed to add problem. Please try again.');
    }
  };

  // When user is searching, force all sections open so matches are visible
  const forceOpen = debouncedSearch.trim().length > 0;

  return (
    <div className="min-h-screen bg-background">
      <PageHeader
        title="Problem Catalog"
        icon={<BookOpen className="h-5 w-5 text-primary" />}
        actions={
          /* Search bar in header — visible on all screens */
          <div className="relative w-48 sm:w-64">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              type="search"
              placeholder="Search problems…"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="pl-8 h-8 text-sm"
            />
          </div>
        }
      />

      <main className="container mx-auto max-w-7xl px-4 lg:px-6 py-6">
        {/* Mobile filter button row */}
        <div className="flex items-center gap-3 mb-4 lg:hidden">
          <CatalogSidebar
            selectedTopics={selectedTopics}
            selectedDifficulties={selectedDifficulties}
            selectedSources={selectedSources}
            onTopicsChange={setTopics}
            onDifficultiesChange={setDifficulties}
            onSourcesChange={setSources}
            onClearAll={clearAll}
            activeFilterCount={activeFilterCount}
          />
          <span className="text-sm text-muted-foreground">
            {filteredCount} problem{filteredCount !== 1 ? 's' : ''}
            {hasActiveFilters && (
              <>
                {' '}
                &middot;{' '}
                <button
                  onClick={clearAll}
                  className="underline underline-offset-2 hover:text-foreground transition-colors"
                >
                  Clear filters
                </button>
              </>
            )}
          </span>
        </div>

        {/* Main two-column layout */}
        <div className="flex gap-6">
          {/* Desktop sidebar */}
          <CatalogSidebar
            selectedTopics={selectedTopics}
            selectedDifficulties={selectedDifficulties}
            selectedSources={selectedSources}
            onTopicsChange={setTopics}
            onDifficultiesChange={setDifficulties}
            onSourcesChange={setSources}
            onClearAll={clearAll}
            activeFilterCount={activeFilterCount}
          />

          {/* Right content area */}
          <div className="flex-1 min-w-0 flex flex-col gap-4">
            {/* Stats bar */}
            <CatalogStats stats={stats} />

            {/* Result count (desktop) */}
            <div className="hidden lg:flex items-center justify-between text-sm text-muted-foreground">
              <span>
                Showing {filteredCount} of {stats.total} problems
              </span>
              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearAll}
                  className="h-7 text-xs px-2"
                >
                  Clear filters
                </Button>
              )}
            </div>

            {/* Loading skeletons */}
            {isLoading ? (
              <div className="flex flex-col gap-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-14 rounded-xl border bg-muted/50 animate-pulse"
                  />
                ))}
              </div>
            ) : topicSections.length === 0 ? (
              /* Empty state */
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <BookOpen className="h-16 w-16 text-muted-foreground mb-4" />
                <h2 className="text-xl font-semibold mb-2">No problems found</h2>
                <p className="text-muted-foreground max-w-md mb-4">
                  Try adjusting your filters or search term.
                </p>
                {hasActiveFilters && (
                  <Button variant="outline" onClick={clearAll}>
                    Clear filters
                  </Button>
                )}
              </div>
            ) : (
              /* Topic sections */
              <div className="flex flex-col gap-3">
                {topicSections.map((section) => (
                  <CatalogTopicSection
                    key={section.slug}
                    section={section}
                    isAdded={isAdded}
                    onAdd={handleAddProblem}
                    forceOpen={forceOpen}
                    searchTerm={debouncedSearch}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
