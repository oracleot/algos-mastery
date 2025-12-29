// pages/Settings.tsx - Settings page with data export/import and theme

import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  Download,
  Upload,
  HardDrive,
  Settings as SettingsIcon,
  Palette,
  Sun,
  Moon,
  Monitor,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ExportDialog } from '@/components/ExportDialog';
import { ImportDialog } from '@/components/ImportDialog';
import { ThemeToggle } from '@/components/ThemeToggle';
import { OfflineIndicator } from '@/components/OfflineIndicator';
import { useTheme } from '@/hooks/useTheme';
import { usePWA } from '@/hooks/usePWA';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import type { Theme } from '@/types';

const themeOptions: { value: Theme; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { value: 'light', label: 'Light', icon: Sun },
  { value: 'dark', label: 'Dark', icon: Moon },
  { value: 'system', label: 'System', icon: Monitor },
];

function Settings() {
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const { theme, setTheme } = useTheme();
  const { isOnline, isInstalled } = usePWA();

  const handleExportComplete = () => {
    toast.success('Data exported successfully!');
  };

  const handleImportComplete = () => {
    toast.success('Data imported successfully!', {
      description: 'Refresh the page to see your imported data.',
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar with theme toggle and offline indicator */}
      <div className="fixed top-4 right-4 flex items-center gap-2 z-10">
        <OfflineIndicator isOnline={isOnline} />
        <ThemeToggle />
      </div>
      
      <div className="max-w-2xl mx-auto px-4 py-6 sm:py-8 pt-16 sm:pt-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <Button variant="ghost" size="sm" asChild className="mb-4 touch-manipulation">
            <Link to="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
          </Button>

          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg shrink-0">
              <SettingsIcon className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-foreground">Settings</h1>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Manage your data and preferences
              </p>
            </div>
          </div>
        </div>

        {/* Appearance Section */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Appearance
            </CardTitle>
            <CardDescription>
              Customize how the app looks on your device.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-3">
              {themeOptions.map((option) => {
                const Icon = option.icon;
                const isSelected = theme === option.value;
                return (
                  <button
                    key={option.value}
                    onClick={() => setTheme(option.value)}
                    className={cn(
                      'flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all',
                      isSelected
                        ? 'border-primary bg-primary/5'
                        : 'border-transparent bg-muted/50 hover:bg-muted'
                    )}
                  >
                    <Icon className={cn(
                      'h-6 w-6',
                      isSelected ? 'text-primary' : 'text-muted-foreground'
                    )} />
                    <span className={cn(
                      'text-sm font-medium',
                      isSelected ? 'text-primary' : 'text-muted-foreground'
                    )}>
                      {option.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Data Management Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HardDrive className="h-5 w-5" />
              Data Management
            </CardTitle>
            <CardDescription>
              Export your data for backup or import from a previous backup.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Export */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-lg border">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/10 rounded-lg shrink-0">
                  <Download className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <h3 className="font-medium text-sm sm:text-base">Export Data</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Download all your data as a JSON backup file.
                  </p>
                </div>
              </div>
              <Button variant="outline" onClick={() => setShowExportDialog(true)} className="w-full sm:w-auto touch-manipulation shrink-0">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>

            {/* Import */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-lg border">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-500/10 rounded-lg shrink-0">
                  <Upload className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <h3 className="font-medium text-sm sm:text-base">Import Data</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Restore your data from a backup file.
                  </p>
                </div>
              </div>
              <Button variant="outline" onClick={() => setShowImportDialog(true)} className="w-full sm:w-auto touch-manipulation shrink-0">
                <Upload className="h-4 w-4 mr-2" />
                Import
              </Button>
            </div>

            {/* Info text */}
            <p className="text-xs text-muted-foreground pt-2">
              Your data is stored locally in your browser using IndexedDB. 
              Regular backups are recommended to prevent data loss.
            </p>
          </CardContent>
        </Card>

        {/* About Section */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>About</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Version</span>
                <span className="font-medium">0.0.0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Storage</span>
                <span className="font-medium">IndexedDB (Local)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">PWA Status</span>
                <span className="font-medium">
                  {isInstalled ? 'Installed' : 'Not installed'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Network</span>
                <span className="font-medium">
                  {isOnline ? 'Online' : 'Offline'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Dialogs */}
      <ExportDialog
        isOpen={showExportDialog}
        onClose={() => setShowExportDialog(false)}
        onExportComplete={handleExportComplete}
      />
      <ImportDialog
        isOpen={showImportDialog}
        onClose={() => setShowImportDialog(false)}
        onImportComplete={handleImportComplete}
      />
    </div>
  );
}

export { Settings };
