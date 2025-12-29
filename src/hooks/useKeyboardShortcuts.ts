// hooks/useKeyboardShortcuts.ts - Keyboard shortcut handler hook

import { useEffect, useCallback } from 'react';
import { isInputElement } from '@/lib/shortcuts';

export interface ShortcutHandler {
  /** The key to listen for */
  key: string;
  /** Callback when shortcut is triggered */
  handler: () => void;
  /** Whether Ctrl/Cmd is required */
  ctrlKey?: boolean;
  /** Whether Shift is required */
  shiftKey?: boolean;
  /** Whether Alt/Option is required */
  altKey?: boolean;
  /** Whether to allow in input elements */
  allowInInput?: boolean;
  /** Whether the shortcut is currently enabled */
  enabled?: boolean;
}

interface UseKeyboardShortcutsOptions {
  /** Whether shortcuts are globally enabled */
  enabled?: boolean;
}

/**
 * Hook to handle keyboard shortcuts
 * 
 * @example
 * ```tsx
 * useKeyboardShortcuts([
 *   { key: 'n', handler: () => openNewProblemDialog() },
 *   { key: '1', handler: () => rate('again') },
 *   { key: ' ', handler: () => toggleTimer() }, // Space
 * ]);
 * ```
 */
export function useKeyboardShortcuts(
  shortcuts: ShortcutHandler[],
  options: UseKeyboardShortcutsOptions = {}
): void {
  const { enabled = true } = options;

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    // Skip if shortcuts are disabled
    if (!enabled) return;

    // Skip if typing in an input
    const isInput = isInputElement(event.target);

    for (const shortcut of shortcuts) {
      // Skip disabled shortcuts
      if (shortcut.enabled === false) continue;

      // Skip if in input and not explicitly allowed
      if (isInput && !shortcut.allowInInput) continue;

      // Check key match
      if (event.key !== shortcut.key) continue;

      // Check modifier keys
      const ctrlRequired = shortcut.ctrlKey ?? false;
      const shiftRequired = shortcut.shiftKey ?? false;
      const altRequired = shortcut.altKey ?? false;

      const ctrlPressed = event.ctrlKey || event.metaKey;
      const shiftPressed = event.shiftKey;
      const altPressed = event.altKey;

      // For keys that naturally require shift (like ?), don't check shift mismatch
      const isShiftKey = shortcut.key === '?' || shortcut.key === '!' || 
                         shortcut.key === '@' || shortcut.key === '#' ||
                         shortcut.key === '$' || shortcut.key === '%' ||
                         shortcut.key === '^' || shortcut.key === '&' ||
                         shortcut.key === '*' || shortcut.key === '(' ||
                         shortcut.key === ')';

      if (ctrlRequired !== ctrlPressed) continue;
      if (!isShiftKey && shiftRequired !== shiftPressed) continue;
      if (altRequired !== altPressed) continue;

      // Match found - prevent default and call handler
      event.preventDefault();
      shortcut.handler();
      return; // Only handle first matching shortcut
    }
  }, [enabled, shortcuts]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}

/**
 * Hook for a single keyboard shortcut
 */
export function useKeyboardShortcut(
  key: string,
  handler: () => void,
  options: Omit<ShortcutHandler, 'key' | 'handler'> = {}
): void {
  useKeyboardShortcuts([{ key, handler, ...options }]);
}
