// components/ImportDialog.tsx - Import data with file picker and validation

import { useState, useCallback, useRef } from 'react';
import {
  Upload,
  FileJson,
  Loader2,
  AlertTriangle,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useImport } from '@/hooks/useImport';
import { ConfirmDialog } from '@/components/ConfirmDialog';

interface ImportDialogProps {
  /** Whether dialog is open */
  isOpen: boolean;
  /** Called when dialog should close */
  onClose: () => void;
  /** Called after successful import */
  onImportComplete?: () => void;
}

function ImportDialog({ isOpen, onClose, onImportComplete }: ImportDialogProps) {
  const {
    isImporting,
    isValidating,
    error,
    validation,
    result,
    validateFile,
    importData,
    reset,
  } = useImport();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Reset state when dialog opens/closes
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setSelectedFile(null);
      reset();
      onClose();
    }
  };

  const handleFileSelect = useCallback(
    async (file: File) => {
      setSelectedFile(file);
      await validateFile(file);
    },
    [validateFile]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type === 'application/json') {
      handleFileSelect(file);
    }
  };

  const handleImportClick = () => {
    // Show confirmation before importing (destructive action)
    setShowConfirm(true);
  };

  const handleConfirmImport = async () => {
    setShowConfirm(false);
    if (!selectedFile) return;

    const result = await importData(selectedFile);
    if (result.success) {
      onImportComplete?.();
      handleOpenChange(false);
    }
  };

  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  const isValid = validation?.isValid ?? false;
  const hasWarnings = (validation?.warnings?.length ?? 0) > 0;
  const hasErrors = (validation?.errors?.length ?? 0) > 0;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Upload className="size-5" />
              Import Data
            </DialogTitle>
            <DialogDescription>
              Restore your data from a backup file. This will replace all existing data.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept=".json,application/json"
              onChange={handleInputChange}
              className="hidden"
            />

            {/* Drop zone */}
            {!selectedFile && (
              <div
                onClick={openFilePicker}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`cursor-pointer rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
                  isDragging
                    ? 'border-primary bg-primary/5'
                    : 'border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50'
                }`}
              >
                <FileJson className="mx-auto size-12 text-muted-foreground" />
                <p className="mt-4 font-medium">
                  Drop your backup file here
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  or click to browse
                </p>
              </div>
            )}

            {/* Selected file info */}
            {selectedFile && (
              <div className="space-y-4">
                <div className="flex items-center gap-3 rounded-lg border p-4">
                  <FileJson className="size-8 text-primary" />
                  <div className="flex-1 overflow-hidden">
                    <p className="truncate font-medium">{selectedFile.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {(selectedFile.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedFile(null);
                      reset();
                    }}
                  >
                    Change
                  </Button>
                </div>

                {/* Validation status */}
                {isValidating ? (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="size-4 animate-spin" />
                    Validating file...
                  </div>
                ) : validation ? (
                  <div className="space-y-3">
                    {/* Status indicator */}
                    <div className="flex items-center gap-2">
                      {isValid ? (
                        <>
                          <CheckCircle className="size-5 text-green-500" />
                          <span className="font-medium text-green-500">
                            Valid backup file
                          </span>
                        </>
                      ) : (
                        <>
                          <XCircle className="size-5 text-destructive" />
                          <span className="font-medium text-destructive">
                            Invalid backup file
                          </span>
                        </>
                      )}
                    </div>

                    {/* Data preview */}
                    {isValid && (
                      <div className="rounded-lg border p-4">
                        <h4 className="mb-3 font-medium">Import Preview</h4>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Problems</span>
                            <span className="font-medium">{validation.stats.problems}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Solutions</span>
                            <span className="font-medium">{validation.stats.solutions}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Reviews</span>
                            <span className="font-medium">{validation.stats.reviews}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Review History</span>
                            <span className="font-medium">{validation.stats.reviewHistory}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Time Logs</span>
                            <span className="font-medium">{validation.stats.timeLogs}</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Warnings */}
                    {hasWarnings && (
                      <div className="rounded-lg border border-yellow-500/50 bg-yellow-500/10 px-4 py-3">
                        <div className="flex items-center gap-2 text-sm font-medium text-yellow-600 dark:text-yellow-500">
                          <AlertTriangle className="size-4" />
                          Warnings
                        </div>
                        <ul className="mt-2 list-inside list-disc text-sm text-yellow-600 dark:text-yellow-500">
                          {validation.warnings.map((warning, i) => (
                            <li key={i}>{warning}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Errors */}
                    {hasErrors && (
                      <div className="rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3">
                        <div className="flex items-center gap-2 text-sm font-medium text-destructive">
                          <XCircle className="size-4" />
                          Errors
                        </div>
                        <ul className="mt-2 list-inside list-disc text-sm text-destructive">
                          {validation.errors.map((err, i) => (
                            <li key={i}>{err}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ) : null}
              </div>
            )}

            {/* Import error */}
            {error && !hasErrors && (
              <div className="mt-4 rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                {error}
              </div>
            )}

            {/* Import success */}
            {result?.success && (
              <div className="mt-4 rounded-lg border border-green-500/50 bg-green-500/10 px-4 py-3 text-sm text-green-600 dark:text-green-500">
                Import completed successfully!
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => handleOpenChange(false)} disabled={isImporting}>
              Cancel
            </Button>
            <Button
              onClick={handleImportClick}
              disabled={!isValid || isImporting || isValidating}
            >
              {isImporting ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Importing...
                </>
              ) : (
                <>
                  <Upload className="mr-2 size-4" />
                  Import
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirmation dialog */}
      <ConfirmDialog
        isOpen={showConfirm}
        title="Replace All Data?"
        message="This will permanently delete all existing data and replace it with the imported data. This action cannot be undone."
        confirmLabel="Import"
        cancelLabel="Cancel"
        isDestructive
        onConfirm={handleConfirmImport}
        onCancel={() => setShowConfirm(false)}
      />
    </>
  );
}

export { ImportDialog };
export type { ImportDialogProps };
