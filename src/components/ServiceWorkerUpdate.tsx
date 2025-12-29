// components/ServiceWorkerUpdate.tsx - Service worker update notification

import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ServiceWorkerUpdateProps {
  /** Whether an update is available */
  isUpdateAvailable: boolean;
  /** Called when update button is clicked */
  onUpdate: () => void;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Service worker update notification banner
 * Shows when a new version of the app is available
 */
export function ServiceWorkerUpdate({
  isUpdateAvailable,
  onUpdate,
  className,
}: ServiceWorkerUpdateProps) {
  if (!isUpdateAvailable) {
    return null;
  }

  return (
    <div
      className={cn(
        'fixed top-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-96',
        'bg-primary text-primary-foreground rounded-lg shadow-lg p-4',
        'animate-in slide-in-from-top-4 duration-300',
        'z-50',
        className
      )}
    >
      <div className="flex items-center gap-3">
        <div className="p-2 bg-primary-foreground/10 rounded-lg shrink-0">
          <RefreshCw className="h-5 w-5" />
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm">
            Update Available
          </h3>
          <p className="text-xs opacity-90 mt-0.5">
            A new version is ready. Reload to update.
          </p>
        </div>
        
        <Button
          size="sm"
          variant="secondary"
          onClick={onUpdate}
          className="shrink-0 gap-1.5"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Reload
        </Button>
      </div>
    </div>
  );
}

export type { ServiceWorkerUpdateProps };
