// components/ResourceList.tsx - Display list of learning resources with type icons

import { ExternalLink, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { getResourceTypeIcon, getResourceTypeColor, getResourceTypeLabel } from '@/lib/resourceUtils';
import type { LearningResource } from '@/types';

interface ResourceListProps {
  /** Resources to display */
  resources: LearningResource[];
  /** Called when remove button is clicked. If not provided, remove buttons are hidden. */
  onRemove?: (resourceId: string) => void;
}

function ResourceList({ resources, onRemove }: ResourceListProps) {
  if (resources.length === 0) {
    return null;
  }

  return (
    <ul className="space-y-2">
      {resources.map((resource) => {
        const Icon = getResourceTypeIcon(resource.type);
        const colorClass = getResourceTypeColor(resource.type);
        const typeLabel = getResourceTypeLabel(resource.type);

        return (
          <li
            key={resource.id}
            className="flex items-center gap-3 p-2 rounded-md border bg-card hover:bg-accent/50 transition-colors"
          >
            {/* Type Icon */}
            <Tooltip>
              <TooltipTrigger asChild>
                <span className={`shrink-0 ${colorClass}`}>
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </span>
              </TooltipTrigger>
              <TooltipContent>{typeLabel}</TooltipContent>
            </Tooltip>

            {/* Resource Info */}
            <div className="flex-1 min-w-0">
              <a
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium hover:text-primary hover:underline inline-flex items-center gap-1 max-w-full"
              >
                <span className="truncate">{resource.title}</span>
                <ExternalLink className="h-3 w-3 shrink-0" />
              </a>
              {resource.source && (
                <p className="text-xs text-muted-foreground">{resource.source}</p>
              )}
            </div>

            {/* Remove Button (only shown when onRemove is provided) */}
            {onRemove && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => onRemove(resource.id)}
                    aria-label={`Remove ${resource.title}`}
                    className="shrink-0 text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Remove resource</TooltipContent>
              </Tooltip>
            )}
          </li>
        );
      })}
    </ul>
  );
}

export { ResourceList };
export type { ResourceListProps };
