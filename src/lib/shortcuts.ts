// lib/shortcuts.ts - Keyboard shortcut definitions and utilities

/**
 * Shortcut context - where the shortcut is active
 */
export type ShortcutContext = 
  | 'global'      // Available everywhere
  | 'problems'    // Problems list page
  | 'review'      // Review session
  | 'practice'    // Timed practice session
  | 'dialog';     // When a dialog is open

/**
 * Individual shortcut definition
 */
export interface ShortcutDefinition {
  /** Unique identifier for the shortcut */
  id: string;
  /** Display key(s) - what to show in the UI */
  keys: string;
  /** Human-readable description */
  description: string;
  /** Context(s) where this shortcut is active */
  context: ShortcutContext | ShortcutContext[];
  /** The actual key to listen for (e.g., 'Escape', '1', 'Space') */
  key: string;
  /** Whether Ctrl/Cmd is required */
  ctrlKey?: boolean;
  /** Whether Shift is required */
  shiftKey?: boolean;
  /** Whether Alt/Option is required */
  altKey?: boolean;
}

/**
 * All keyboard shortcuts in the application
 */
export const SHORTCUTS: ShortcutDefinition[] = [
  // Global shortcuts
  {
    id: 'show-help',
    keys: '?',
    key: '?',
    description: 'Show keyboard shortcuts',
    context: 'global',
    shiftKey: true, // ? requires shift
  },
  {
    id: 'close-dialog',
    keys: 'Esc',
    key: 'Escape',
    description: 'Close dialog or cancel action',
    context: ['global', 'dialog'],
  },
  {
    id: 'focus-search',
    keys: '/',
    key: '/',
    description: 'Focus search input',
    context: 'problems',
  },
  
  // Problems page shortcuts
  {
    id: 'new-problem',
    keys: 'n',
    key: 'n',
    description: 'Create new problem',
    context: 'problems',
  },
  
  // Review session shortcuts
  {
    id: 'rate-again',
    keys: '1',
    key: '1',
    description: 'Rate: Again (forgot)',
    context: 'review',
  },
  {
    id: 'rate-hard',
    keys: '2',
    key: '2',
    description: 'Rate: Hard',
    context: 'review',
  },
  {
    id: 'rate-good',
    keys: '3',
    key: '3',
    description: 'Rate: Good',
    context: 'review',
  },
  {
    id: 'rate-easy',
    keys: '4',
    key: '4',
    description: 'Rate: Easy',
    context: 'review',
  },
  {
    id: 'reveal-solution',
    keys: 'r',
    key: 'r',
    description: 'Reveal solution',
    context: 'review',
  },
  
  // Practice session shortcuts
  {
    id: 'toggle-timer',
    keys: 'Space',
    key: ' ',
    description: 'Pause/resume timer',
    context: 'practice',
  },
];

/**
 * Get shortcuts filtered by context
 */
export function getShortcutsByContext(context: ShortcutContext): ShortcutDefinition[] {
  return SHORTCUTS.filter((shortcut) => {
    if (Array.isArray(shortcut.context)) {
      return shortcut.context.includes(context);
    }
    return shortcut.context === context;
  });
}

/**
 * Get all shortcuts grouped by context for display
 */
export function getShortcutsGrouped(): Record<ShortcutContext, ShortcutDefinition[]> {
  const groups: Record<ShortcutContext, ShortcutDefinition[]> = {
    global: [],
    problems: [],
    review: [],
    practice: [],
    dialog: [],
  };

  for (const shortcut of SHORTCUTS) {
    const contexts = Array.isArray(shortcut.context) 
      ? shortcut.context 
      : [shortcut.context];
    
    // Add to primary context only (first one)
    const primaryContext = contexts[0];
    groups[primaryContext].push(shortcut);
  }

  return groups;
}

/**
 * Check if a keyboard event matches a shortcut definition
 */
export function matchesShortcut(
  event: KeyboardEvent,
  shortcut: ShortcutDefinition
): boolean {
  // Check key match
  if (event.key !== shortcut.key) {
    return false;
  }

  // Check modifier keys
  if (shortcut.ctrlKey && !(event.ctrlKey || event.metaKey)) {
    return false;
  }
  if (shortcut.shiftKey && !event.shiftKey) {
    return false;
  }
  if (shortcut.altKey && !event.altKey) {
    return false;
  }

  // If no modifiers specified, make sure none are pressed (except for special keys)
  if (!shortcut.ctrlKey && !shortcut.shiftKey && !shortcut.altKey) {
    // Allow shift for characters that require it (like ?)
    if (event.ctrlKey || event.metaKey || event.altKey) {
      return false;
    }
  }

  return true;
}

/**
 * Check if the event target is an input element where shortcuts should be disabled
 */
export function isInputElement(target: EventTarget | null): boolean {
  if (!target || !(target instanceof HTMLElement)) {
    return false;
  }

  const tagName = target.tagName.toLowerCase();
  
  // Standard input elements
  if (tagName === 'input' || tagName === 'textarea' || tagName === 'select') {
    return true;
  }

  // Check for contenteditable
  if (target.isContentEditable) {
    return true;
  }

  // Check for CodeMirror editor
  if (target.closest('.cm-editor')) {
    return true;
  }

  return false;
}
