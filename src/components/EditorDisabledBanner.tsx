// components/EditorDisabledBanner.tsx - Banner showing why editor is disabled

import { AlertCircle } from 'lucide-react';

interface EditorDisabledBannerProps {
  /** Message to display explaining why editor is disabled */
  message: string;
}

/**
 * Contextual banner displayed over the code editor when editing is disabled
 * Used to inform users they need to start/resume the timer to code
 */
export function EditorDisabledBanner({ message }: EditorDisabledBannerProps) {
  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/80 backdrop-blur-sm rounded-md">
      <div className="flex items-center gap-3 px-4 py-3 bg-muted rounded-lg shadow-sm border">
        <AlertCircle className="h-5 w-5 text-muted-foreground flex-shrink-0" />
        <p className="text-sm font-medium text-muted-foreground">{message}</p>
      </div>
    </div>
  );
}
