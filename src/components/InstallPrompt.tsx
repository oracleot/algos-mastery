// components/InstallPrompt.tsx - PWA installation banner

import { Download, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface InstallPromptProps {
  /** Called when install button is clicked */
  onInstall: () => void;
  /** Called when dismiss button is clicked */
  onDismiss: () => void;
  /** Additional CSS classes */
  className?: string;
}

/**
 * PWA installation banner component
 * Shows when the app is installable and hasn't been dismissed
 */
export function InstallPrompt({ onInstall, onDismiss, className }: InstallPromptProps) {
  return (
    <div
      className={cn(
        'fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-96',
        'bg-card border rounded-lg shadow-lg p-4',
        'animate-in slide-in-from-bottom-4 duration-300',
        'z-50',
        className
      )}
    >
      <div className="flex items-start gap-3">
        <div className="p-2 bg-primary/10 rounded-lg shrink-0">
          <Download className="h-5 w-5 text-primary" />
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm text-foreground">
            Install App
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Install for offline access and a native app experience
          </p>
          
          <div className="flex gap-2 mt-3">
            <Button
              size="sm"
              onClick={onInstall}
              className="gap-1.5"
            >
              <Download className="h-3.5 w-3.5" />
              Install
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={onDismiss}
            >
              Not now
            </Button>
          </div>
        </div>
        
        <Button
          size="icon-sm"
          variant="ghost"
          onClick={onDismiss}
          className="shrink-0 -mt-1 -mr-1"
          aria-label="Dismiss"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

export type { InstallPromptProps };
