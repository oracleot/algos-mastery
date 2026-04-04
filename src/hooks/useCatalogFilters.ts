// hooks/useCatalogFilters.ts - Filter state and derived data for the catalog page

import { useState, useMemo, useCallback, useEffect } from 'react';
import { PROBLEM_CATALOG } from '@/data/catalog';
import { TOPICS } from '@/data/topics';
import { normalizeUrl } from '@/lib/utils';
import type { CatalogFilters, CatalogProblem, TopicSlug, Difficulty, CatalogSource } from '@/types';

/** Debounce a value by delayMs */
function useDebounce<T>(value: T, delayMs: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(id);
  }, [value, delayMs]);
  return debounced;
}

export interface TopicSection {
  slug: TopicSlug;
  name: string;
  order: number;
  problems: CatalogProblem[];
  totalInTopic: number;
  addedCount: number;
  /** Next un-added problem — "Recommended Next" */
  recommended: CatalogProblem | null;
}

export interface CatalogStats {
  total: number;
  added: number;
  easy: number;
  medium: number;
  hard: number;
  blind75: number;
  neetcode150: number;
  grind75: number;
  curated: number;
  easyAdded: number;
  mediumAdded: number;
  hardAdded: number;
}

export interface UseCatalogFiltersReturn {
  filters: CatalogFilters;
  /** Raw search input value (not debounced) */
  searchInput: string;
  /** Debounced search term used for filtering */
  debouncedSearch: string;
  setSearchInput: (v: string) => void;
  setTopics: (topics: TopicSlug[]) => void;
  setDifficulties: (difficulties: Difficulty[]) => void;
  setSources: (sources: CatalogSource[]) => void;
  /** Multi-select topic slugs */
  selectedTopics: TopicSlug[];
  /** Multi-select difficulties */
  selectedDifficulties: Difficulty[];
  /** Multi-select sources */
  selectedSources: CatalogSource[];
  clearAll: () => void;
  hasActiveFilters: boolean;
  activeFilterCount: number;
  /** Topic sections for the main content area, filtered */
  topicSections: TopicSection[];
  /** Flat filtered list (for total count display) */
  filteredCount: number;
  stats: CatalogStats;
  isAdded: (url: string) => boolean;
}

export function useCatalogFilters(
  existingUrls: Set<string>
): UseCatalogFiltersReturn {
  const [searchInput, setSearchInput] = useState('');
  const [selectedTopics, setSelectedTopics] = useState<TopicSlug[]>([]);
  const [selectedDifficulties, setSelectedDifficulties] = useState<Difficulty[]>([]);
  const [selectedSources, setSelectedSources] = useState<CatalogSource[]>([]);

  const debouncedSearch = useDebounce(searchInput, 300);

  const isAdded = useCallback(
    (url: string) => existingUrls.has(normalizeUrl(url)),
    [existingUrls]
  );

  // Compute stats over entire catalog (not filtered)
  const stats = useMemo((): CatalogStats => {
    let easy = 0, medium = 0, hard = 0;
    let easyAdded = 0, mediumAdded = 0, hardAdded = 0;
    let blind75 = 0, neetcode150 = 0, grind75 = 0, curated = 0;
    let added = 0;

    for (const p of PROBLEM_CATALOG) {
      if (p.difficulty === 'easy') { easy++; if (isAdded(p.url)) easyAdded++; }
      else if (p.difficulty === 'medium') { medium++; if (isAdded(p.url)) mediumAdded++; }
      else { hard++; if (isAdded(p.url)) hardAdded++; }

      if (p.source === 'blind-75') blind75++;
      else if (p.source === 'neetcode-150') neetcode150++;
      else if (p.source === 'grind-75') grind75++;
      else if (p.source === 'curated') curated++;

      if (isAdded(p.url)) added++;
    }

    return {
      total: PROBLEM_CATALOG.length,
      added,
      easy, medium, hard,
      easyAdded, mediumAdded, hardAdded,
      blind75, neetcode150, grind75, curated,
    };
  }, [isAdded]);

  // Build topic sections applying filters
  const topicSections = useMemo((): TopicSection[] => {
    const searchLower = debouncedSearch.toLowerCase().trim();

    return TOPICS.map((topic) => {
      // All problems for this topic (for progress counting)
      const allInTopic = PROBLEM_CATALOG.filter((p) => p.topic === topic.slug);
      const addedCount = allInTopic.filter((p) => isAdded(p.url)).length;

      // Apply filters
      let filtered = allInTopic;

      if (selectedTopics.length > 0 && !selectedTopics.includes(topic.slug)) {
        filtered = [];
      }
      if (selectedDifficulties.length > 0) {
        filtered = filtered.filter((p) => selectedDifficulties.includes(p.difficulty));
      }
      if (selectedSources.length > 0) {
        filtered = filtered.filter((p) => selectedSources.includes(p.source));
      }
      if (searchLower) {
        filtered = filtered.filter((p) => p.title.toLowerCase().includes(searchLower));
      }

      // Recommended: first un-added problem (sorted by order)
      const recommended = allInTopic
        .slice()
        .sort((a, b) => a.order - b.order)
        .find((p) => !isAdded(p.url)) ?? null;

      return {
        slug: topic.slug,
        name: topic.name,
        order: topic.order,
        problems: filtered,
        totalInTopic: allInTopic.length,
        addedCount,
        recommended,
      };
    }).filter((section) => section.problems.length > 0);
  }, [debouncedSearch, selectedTopics, selectedDifficulties, selectedSources, isAdded]);

  const filteredCount = useMemo(
    () => topicSections.reduce((sum, s) => sum + s.problems.length, 0),
    [topicSections]
  );

  const hasActiveFilters =
    selectedTopics.length > 0 ||
    selectedDifficulties.length > 0 ||
    selectedSources.length > 0 ||
    debouncedSearch.trim() !== '';

  const activeFilterCount =
    selectedTopics.length + selectedDifficulties.length + selectedSources.length +
    (debouncedSearch.trim() ? 1 : 0);

  const clearAll = useCallback(() => {
    setSearchInput('');
    setSelectedTopics([]);
    setSelectedDifficulties([]);
    setSelectedSources([]);
  }, []);

  // Build legacy CatalogFilters for any consumers that still need it
  const filters: CatalogFilters = useMemo(() => ({
    topic: selectedTopics.length === 1 ? selectedTopics[0] : null,
    difficulty: selectedDifficulties.length === 1 ? selectedDifficulties[0] : null,
    source: selectedSources.length === 1 ? selectedSources[0] : null,
    search: debouncedSearch,
  }), [selectedTopics, selectedDifficulties, selectedSources, debouncedSearch]);

  return {
    filters,
    searchInput,
    debouncedSearch,
    setSearchInput,
    setTopics: setSelectedTopics,
    setDifficulties: setSelectedDifficulties,
    setSources: setSelectedSources,
    selectedTopics,
    selectedDifficulties,
    selectedSources,
    clearAll,
    hasActiveFilters,
    activeFilterCount,
    topicSections,
    filteredCount,
    stats,
    isAdded,
  };
}
