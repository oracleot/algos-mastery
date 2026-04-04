// components/CatalogSidebar.tsx - Filter sidebar with checkboxes (desktop) or Sheet drawer (mobile)

import { SlidersHorizontal, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { TOPICS } from '@/data/topics';
import { DIFFICULTIES, CATALOG_SOURCES } from '@/types';
import { cn } from '@/lib/utils';
import type { TopicSlug, Difficulty, CatalogSource } from '@/types';

interface CatalogSidebarProps {
  selectedTopics: TopicSlug[];
  selectedDifficulties: Difficulty[];
  selectedSources: CatalogSource[];
  onTopicsChange: (topics: TopicSlug[]) => void;
  onDifficultiesChange: (diffs: Difficulty[]) => void;
  onSourcesChange: (sources: CatalogSource[]) => void;
  onClearAll: () => void;
  activeFilterCount: number;
}

const difficultyLabels: Record<Difficulty, string> = {
  easy: 'Easy',
  medium: 'Medium',
  hard: 'Hard',
};

const difficultyColors: Record<Difficulty, string> = {
  easy: 'text-green-600 dark:text-green-400',
  medium: 'text-yellow-600 dark:text-yellow-400',
  hard: 'text-red-600 dark:text-red-400',
};

const sourceLabels: Record<CatalogSource, string> = {
  'blind-75': 'Blind 75',
  'neetcode-150': 'NeetCode 150',
  'grind-75': 'Grind 75',
  curated: 'Curated',
};

function toggle<T>(arr: T[], value: T): T[] {
  return arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];
}

interface FilterSectionProps {
  title: string;
  children: React.ReactNode;
}

function FilterSection({ title, children }: FilterSectionProps) {
  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground px-1">
        {title}
      </h3>
      <div className="flex flex-col gap-1.5">{children}</div>
    </div>
  );
}

interface FilterCheckboxProps {
  id: string;
  checked: boolean;
  onChange: () => void;
  label: React.ReactNode;
}

function FilterCheckbox({ id, checked, onChange, label }: FilterCheckboxProps) {
  return (
    <label
      htmlFor={id}
      className={cn(
        'flex items-center gap-2.5 px-2 py-1.5 rounded-md cursor-pointer text-sm transition-colors select-none',
        'hover:bg-accent/60',
        checked && 'bg-accent/40'
      )}
    >
      <Checkbox
        id={id}
        checked={checked}
        onCheckedChange={onChange}
        className="flex-shrink-0"
      />
      {label}
    </label>
  );
}

/** The inner filter panel content — shared between desktop sidebar and mobile Sheet */
function FilterPanelContent({
  selectedTopics,
  selectedDifficulties,
  selectedSources,
  onTopicsChange,
  onDifficultiesChange,
  onSourcesChange,
  onClearAll,
  activeFilterCount,
}: CatalogSidebarProps) {
  return (
    <div className="flex flex-col gap-5">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-sm text-foreground">Filters</h2>
        {activeFilterCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearAll}
            className="h-7 px-2 text-xs gap-1 text-muted-foreground hover:text-foreground"
          >
            <X className="h-3.5 w-3.5" />
            Clear all
          </Button>
        )}
      </div>

      {/* Topics */}
      <FilterSection title="Topic">
        {TOPICS.map((topic) => (
          <FilterCheckbox
            key={topic.slug}
            id={`topic-${topic.slug}`}
            checked={selectedTopics.includes(topic.slug)}
            onChange={() => onTopicsChange(toggle(selectedTopics, topic.slug))}
            label={<span className="truncate text-sm">{topic.name}</span>}
          />
        ))}
      </FilterSection>

      {/* Difficulty */}
      <FilterSection title="Difficulty">
        {DIFFICULTIES.map((diff) => (
          <FilterCheckbox
            key={diff}
            id={`diff-${diff}`}
            checked={selectedDifficulties.includes(diff)}
            onChange={() =>
              onDifficultiesChange(toggle(selectedDifficulties, diff))
            }
            label={
              <span className={cn('text-sm font-medium', difficultyColors[diff])}>
                {difficultyLabels[diff]}
              </span>
            }
          />
        ))}
      </FilterSection>

      {/* Source */}
      <FilterSection title="Source">
        {CATALOG_SOURCES.map((source) => (
          <FilterCheckbox
            key={source}
            id={`source-${source}`}
            checked={selectedSources.includes(source)}
            onChange={() => onSourcesChange(toggle(selectedSources, source))}
            label={<span className="text-sm">{sourceLabels[source]}</span>}
          />
        ))}
      </FilterSection>
    </div>
  );
}

/** Desktop sticky sidebar — hidden below lg */
function CatalogSidebarDesktop(props: CatalogSidebarProps) {
  return (
    <aside className="hidden lg:block w-52 flex-shrink-0 sticky top-20 self-start max-h-[calc(100vh-6rem)] overflow-y-auto pr-2">
      <FilterPanelContent {...props} />
    </aside>
  );
}

/** Mobile filter button + Sheet drawer — visible below lg */
function CatalogSidebarMobile(props: CatalogSidebarProps) {
  const { activeFilterCount } = props;
  return (
    <div className="lg:hidden">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <SlidersHorizontal className="h-4 w-4" />
            Filters
            {activeFilterCount > 0 && (
              <Badge variant="default" className="h-5 w-5 p-0 text-[10px] flex items-center justify-center rounded-full">
                {activeFilterCount}
              </Badge>
            )}
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-72 overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Filters</SheetTitle>
          </SheetHeader>
          <div className="px-4 pb-6">
            <FilterPanelContent {...props} />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

/** Combined component — renders both desktop sidebar and mobile drawer trigger */
function CatalogSidebar(props: CatalogSidebarProps) {
  return (
    <>
      <CatalogSidebarDesktop {...props} />
      <CatalogSidebarMobile {...props} />
    </>
  );
}

export { CatalogSidebar };
export type { CatalogSidebarProps };
