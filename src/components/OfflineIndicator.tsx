// components/OfflineIndicator.tsx - Online/offline status indicator

import { useState, useEffect } from 'react';
import { WifiOff, Wifi } from 'lucide-react';
import { cn } from '@/lib/utils';

interface OfflineIndicatorProps {
  /** Whether the device is online */
  isOnline: boolean;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Offline status indicator component
 * Shows when offline, briefly shows "back online" when connection restored
 */
export function OfflineIndicator({ isOnline, className }: OfflineIndicatorProps) {
  const [showReconnected, setShowReconnected] = useState(false);
  const [wasOffline, setWasOffline] = useState(false);

  // Track when we come back online
  useEffect(() => {
    if (!isOnline) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- Need to track offline state for reconnection detection
      setWasOffline(true);
      setShowReconnected(false);
    } else if (wasOffline) {
      // Just came back online
      setShowReconnected(true);
      const timer = setTimeout(() => {
        setShowReconnected(false);
        setWasOffline(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isOnline, wasOffline]);

  // Don't show anything when online (unless just reconnected)
  if (isOnline && !showReconnected) {
    return null;
  }

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium',
        'transition-all duration-300',
        isOnline
          ? 'bg-green-500/10 text-green-700 dark:text-green-400'
          : 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400',
        className
      )}
      role="status"
      aria-live="polite"
    >
      {isOnline ? (
        <>
          <Wifi className="h-3.5 w-3.5" />
          <span>Back online</span>
        </>
      ) : (
        <>
          <WifiOff className="h-3.5 w-3.5" />
          <span>Offline</span>
        </>
      )}
    </div>
  );
}

export type { OfflineIndicatorProps };
