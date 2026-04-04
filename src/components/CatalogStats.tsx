// components/CatalogStats.tsx - Stats bar showing overall catalog progress

import { BookOpen, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { CatalogStats as CatalogStatsType } from '@/hooks/useCatalogFilters';

interface CatalogStatsProps {
  stats: CatalogStatsType;
  className?: string;
}

function StatChip({
  label,
  count,
  total,
  color,
}: {
  label: string;
  count: number;
  total: number;
  color: string;
}) {
  return (
    <div className="flex items-center gap-1.5 text-sm">
      <span className={cn('inline-block w-2.5 h-2.5 rounded-full flex-shrink-0', color)} />
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-foreground tabular-nums">
        {count}
        <span className="text-muted-foreground font-normal">/{total}</span>
      </span>
    </div>
  );
}

export function CatalogStats({ stats, className }: CatalogStatsProps) {
  const pct = stats.total > 0 ? Math.round((stats.added / stats.total) * 100) : 0;

  return (
    <div
      className={cn(
        'rounded-xl border bg-card px-4 py-3 flex flex-col gap-3',
        className
      )}
    >
      {/* Top row: total + overall progress */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-primary flex-shrink-0" />
          <span className="text-sm font-medium">
            {stats.total} problems
          </span>
          <span className="text-muted-foreground text-sm">
            &middot; {stats.added} added ({pct}%)
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <CheckCircle2 className="h-4 w-4 text-green-500" />
          <span>{stats.added} in your list</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 rounded-full bg-muted overflow-hidden">
        <div
          className="h-full rounded-full bg-primary transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>

      {/* Breakdown row */}
      <div className="flex flex-wrap gap-x-5 gap-y-2">
        <StatChip label="Easy" count={stats.easyAdded} total={stats.easy} color="bg-green-500" />
        <StatChip label="Medium" count={stats.mediumAdded} total={stats.medium} color="bg-yellow-500" />
        <StatChip label="Hard" count={stats.hardAdded} total={stats.hard} color="bg-red-500" />

        <span className="text-border select-none hidden sm:inline">|</span>

        <div className="flex items-center gap-1.5 text-sm">
          <span className="text-muted-foreground">Blind 75</span>
          <span className="font-medium tabular-nums">{stats.blind75}</span>
        </div>
        <div className="flex items-center gap-1.5 text-sm">
          <span className="text-muted-foreground">NeetCode 150</span>
          <span className="font-medium tabular-nums">{stats.neetcode150}</span>
        </div>
        <div className="flex items-center gap-1.5 text-sm">
          <span className="text-muted-foreground">Grind 75</span>
          <span className="font-medium tabular-nums">{stats.grind75}</span>
        </div>
      </div>
    </div>
  );
}
