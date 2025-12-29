// hooks/usePWA.ts - PWA installation and online status management

import { useState, useEffect, useCallback } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';

/**
 * BeforeInstallPromptEvent - Custom event fired when PWA install prompt is available
 */
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

// Extend window to include the install event
declare global {
  interface WindowEventMap {
    beforeinstallprompt: BeforeInstallPromptEvent;
  }
}

const INSTALL_PROMPT_DISMISSED_KEY = 'pwa-install-dismissed';

interface UsePWAReturn {
  /** Whether the PWA can be installed */
  isInstallable: boolean;
  /** Whether the PWA is already installed */
  isInstalled: boolean;
  /** Whether the device is online */
  isOnline: boolean;
  /** Whether a service worker update is available */
  isUpdateAvailable: boolean;
  /** Whether the install prompt was dismissed by user */
  isDismissed: boolean;
  /** Trigger the PWA install prompt */
  install: () => Promise<boolean>;
  /** Dismiss the install prompt (hides it for this session) */
  dismissInstall: () => void;
  /** Apply the service worker update (reloads page) */
  update: () => void;
}

/**
 * Hook for managing PWA installation state and updates
 */
export function usePWA(): UsePWAReturn {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isInstalled, setIsInstalled] = useState(false);
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isDismissed, setIsDismissed] = useState(() => {
    try {
      return sessionStorage.getItem(INSTALL_PROMPT_DISMISSED_KEY) === 'true';
    } catch {
      return false;
    }
  });

  // Register service worker with update handling
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(_swUrl: string, registration: ServiceWorkerRegistration | undefined) {
      // Check for updates periodically (every hour)
      if (registration) {
        setInterval(() => {
          registration.update();
        }, 60 * 60 * 1000);
      }
    },
    onRegisterError(error: Error) {
      console.error('Service worker registration error:', error);
    },
  });

  // Check if PWA is installed
  useEffect(() => {
    // Check display-mode
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    const isInWebAppiOS = ('standalone' in window.navigator) && (window.navigator as unknown as { standalone: boolean }).standalone;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- Initial check for PWA installation status
    setIsInstalled(isStandalone || isInWebAppiOS);

    // Listen for display mode changes
    const mediaQuery = window.matchMedia('(display-mode: standalone)');
    const handleChange = (e: MediaQueryListEvent) => {
      setIsInstalled(e.matches);
    };
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Handle online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Capture install prompt event
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
      // Prevent the default prompt
      e.preventDefault();
      // Store the event for later use
      setInstallPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Handle app installed event
    const handleAppInstalled = () => {
      setInstallPrompt(null);
      setIsInstalled(true);
    };

    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  // Install the PWA
  const install = useCallback(async (): Promise<boolean> => {
    if (!installPrompt) {
      return false;
    }

    // Show the install prompt
    await installPrompt.prompt();

    // Wait for the user's response
    const { outcome } = await installPrompt.userChoice;

    // Clear the prompt
    setInstallPrompt(null);

    return outcome === 'accepted';
  }, [installPrompt]);

  // Dismiss the install prompt
  const dismissInstall = useCallback(() => {
    setIsDismissed(true);
    try {
      sessionStorage.setItem(INSTALL_PROMPT_DISMISSED_KEY, 'true');
    } catch {
      // Ignore storage errors
    }
  }, []);

  // Apply service worker update
  const update = useCallback(() => {
    updateServiceWorker(true);
    setNeedRefresh(false);
  }, [updateServiceWorker, setNeedRefresh]);

  return {
    isInstallable: installPrompt !== null && !isInstalled,
    isInstalled,
    isOnline,
    isUpdateAvailable: needRefresh,
    isDismissed,
    install,
    dismissInstall,
    update,
  };
}

export type { UsePWAReturn };
