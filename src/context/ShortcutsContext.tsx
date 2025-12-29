// context/ShortcutsContext.tsx - Global shortcuts context for help modal
/* eslint-disable react-refresh/only-export-components */

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { ShortcutContext } from '@/lib/shortcuts';

interface ShortcutsContextValue {
  /** Whether the shortcuts help modal is open */
  isHelpOpen: boolean;
  /** Open the shortcuts help modal */
  openHelp: () => void;
  /** Close the shortcuts help modal */
  closeHelp: () => void;
  /** Toggle the shortcuts help modal */
  toggleHelp: () => void;
  /** Current active context for shortcuts */
  activeContext: ShortcutContext;
  /** Set the active shortcut context */
  setActiveContext: (context: ShortcutContext) => void;
}

const ShortcutsContext = createContext<ShortcutsContextValue | null>(null);

interface ShortcutsProviderProps {
  children: ReactNode;
}

/**
 * Provider for global keyboard shortcuts state
 */
export function ShortcutsProvider({ children }: ShortcutsProviderProps) {
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [activeContext, setActiveContext] = useState<ShortcutContext>('global');

  const openHelp = useCallback(() => setIsHelpOpen(true), []);
  const closeHelp = useCallback(() => setIsHelpOpen(false), []);
  const toggleHelp = useCallback(() => setIsHelpOpen((prev) => !prev), []);

  const value: ShortcutsContextValue = {
    isHelpOpen,
    openHelp,
    closeHelp,
    toggleHelp,
    activeContext,
    setActiveContext,
  };

  return (
    <ShortcutsContext.Provider value={value}>
      {children}
    </ShortcutsContext.Provider>
  );
}

/**
 * Hook to access shortcuts context
 */
export function useShortcuts(): ShortcutsContextValue {
  const context = useContext(ShortcutsContext);
  if (!context) {
    throw new Error('useShortcuts must be used within a ShortcutsProvider');
  }
  return context;
}

export { ShortcutsContext };
