// components/ShortcutHelp.tsx - Keyboard shortcuts help modal

import { Keyboard } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useShortcuts } from '@/context/ShortcutsContext';
import { getShortcutsGrouped, type ShortcutContext } from '@/lib/shortcuts';

const contextLabels: Record<ShortcutContext, string> = {
  global: 'Global',
  problems: 'Problems List',
  review: 'Review Session',
  practice: 'Timed Practice',
  dialog: 'Dialogs',
};

const contextOrder: ShortcutContext[] = ['global', 'problems', 'review', 'practice'];

/**
 * Modal displaying all keyboard shortcuts grouped by context
 */
export function ShortcutHelp() {
  const { isHelpOpen, closeHelp } = useShortcuts();
  const groupedShortcuts = getShortcutsGrouped();

  return (
    <Dialog open={isHelpOpen} onOpenChange={(open) => !open && closeHelp()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Keyboard className="h-5 w-5" />
            Keyboard Shortcuts
          </DialogTitle>
          <DialogDescription>
            Use these shortcuts to navigate faster
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2">
          {contextOrder.map((context) => {
            const shortcuts = groupedShortcuts[context];
            if (shortcuts.length === 0) return null;

            return (
              <div key={context}>
                <h3 className="text-sm font-semibold text-muted-foreground mb-3">
                  {contextLabels[context]}
                </h3>
                <div className="space-y-2">
                  {shortcuts.map((shortcut) => (
                    <div
                      key={shortcut.id}
                      className="flex items-center justify-between py-1.5"
                    >
                      <span className="text-sm">{shortcut.description}</span>
                      <kbd className="px-2 py-1 text-xs font-mono bg-muted rounded border border-border">
                        {shortcut.keys}
                      </kbd>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div className="pt-4 border-t text-center">
          <p className="text-xs text-muted-foreground">
            Press <kbd className="px-1.5 py-0.5 text-xs font-mono bg-muted rounded border">?</kbd> anytime to show this help
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
