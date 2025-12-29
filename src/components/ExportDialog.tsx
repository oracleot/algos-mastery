// components/ExportDialog.tsx - Export data preview and download dialog

import { useEffect } from 'react';
import { Download, FileJson, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useExport } from '@/hooks/useExport';

interface ExportDialogProps {
  /** Whether dialog is open */
  isOpen: boolean;
  /** Called when dialog should close */
  onClose: () => void;
  /** Called after successful export */
  onExportComplete?: () => void;
}

function ExportDialog({ isOpen, onClose, onExportComplete }: ExportDialogProps) {
  const {
    isExporting,
    isLoadingPreview,
    error,
    preview,
    exportData,
    fetchPreview,
    clearError,
  } = useExport();

  // Fetch preview when dialog opens
  useEffect(() => {
    if (isOpen) {
      fetchPreview();
      clearError();
    }
  }, [isOpen, fetchPreview, clearError]);

  const handleExport = async () => {
    try {
      await exportData();
      onExportComplete?.();
      onClose();
    } catch {
      // Error is already set in the hook
    }
  };

  const totalItems =
    (preview?.problems ?? 0) +
    (preview?.solutions ?? 0) +
    (preview?.reviews ?? 0) +
    (preview?.reviewHistory ?? 0) +
    (preview?.timeLogs ?? 0);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileJson className="size-5" />
            Export Data
          </DialogTitle>
          <DialogDescription>
            Download all your data as a JSON backup file.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          {isLoadingPreview ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="size-6 animate-spin text-muted-foreground" />
            </div>
          ) : preview ? (
            <div className="space-y-4">
              {/* Data summary */}
              <div className="rounded-lg border p-4">
                <h4 className="mb-3 font-medium">Export Summary</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Problems</span>
                    <span className="font-medium">{preview.problems}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Solutions</span>
                    <span className="font-medium">{preview.solutions}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Reviews</span>
                    <span className="font-medium">{preview.reviews}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Review History</span>
                    <span className="font-medium">{preview.reviewHistory}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Time Logs</span>
                    <span className="font-medium">{preview.timeLogs}</span>
                  </div>
                </div>
              </div>

              {/* File info */}
              <div className="flex items-center justify-between rounded-lg bg-muted/50 px-4 py-3 text-sm">
                <span className="text-muted-foreground">Estimated file size</span>
                <span className="font-medium">{preview.estimatedSize}</span>
              </div>

              {totalItems === 0 && (
                <p className="text-center text-sm text-muted-foreground">
                  No data to export. Add some problems to get started!
                </p>
              )}
            </div>
          ) : null}

          {error && (
            <div className="mt-4 rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {error}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isExporting}>
            Cancel
          </Button>
          <Button
            onClick={handleExport}
            disabled={isExporting || isLoadingPreview || totalItems === 0}
          >
            {isExporting ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                Exporting...
              </>
            ) : (
              <>
                <Download className="mr-2 size-4" />
                Export
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export { ExportDialog };
export type { ExportDialogProps };
