// components/PageHeader.tsx - Consistent page header with back button, title, and actions

import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';
import { OfflineIndicator } from '@/components/OfflineIndicator';
import { usePWA } from '@/hooks/usePWA';

interface PageHeaderProps {
  /** Page title */
  title: string;
  /** Optional subtitle/description (can be string or React node) */
  subtitle?: React.ReactNode;
  /** Optional icon to show before title */
  icon?: React.ReactNode;
  /** URL to navigate back to (defaults to "/") */
  backTo?: string;
  /** Use browser history back instead of backTo link */
  useHistoryBack?: boolean;
  /** Actions to show on the right side (before settings/theme) */
  actions?: React.ReactNode;
  /** Whether to hide the back button */
  hideBackButton?: boolean;
  /** Whether to show settings button (defaults to true) */
  showSettings?: boolean;
}

/**
 * Consistent page header component used across all pages
 * Includes back button, title, optional actions, settings and theme toggle
 */
export function PageHeader({
  title,
  subtitle,
  icon,
  backTo = '/',
  useHistoryBack = false,
  actions,
  hideBackButton = false,
  showSettings = true,
}: PageHeaderProps) {
  const { isOnline } = usePWA();
  const navigate = useNavigate();

  const handleBack = () => {
    if (useHistoryBack) {
      navigate(-1);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-card border-b border-border">
      <div className="max-w-6xl mx-auto px-4 py-3 sm:py-4">
        <div className="flex items-center justify-between gap-2">
          {/* Left side: Back button, title, and settings/theme on mobile */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
            {!hideBackButton && (
              useHistoryBack ? (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleBack}
                  className="h-9 w-9 shrink-0 touch-manipulation"
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              ) : (
                <Button
                  variant="ghost"
                  size="icon"
                  asChild
                  className="h-9 w-9 shrink-0 touch-manipulation"
                >
                  <Link to={backTo}>
                    <ArrowLeft className="h-5 w-5" />
                  </Link>
                </Button>
              )
            )}
            <div className="min-w-0 flex-1">
              <h1 className="text-lg sm:text-xl font-semibold text-foreground flex items-center gap-2 truncate">
                {icon}
                {title}
              </h1>
              {subtitle && (
                <p className="text-xs sm:text-sm text-muted-foreground truncate hidden sm:block">
                  {subtitle}
                </p>
              )}
            </div>
          </div>

          {/* Right side: Settings/theme first (on mobile), then actions */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            <OfflineIndicator isOnline={isOnline} />
            {showSettings && (
              <Button
                variant="ghost"
                size="icon"
                asChild
                className="h-9 w-9 touch-manipulation"
              >
                <Link to="/settings" aria-label="Settings">
                  <Settings className="h-4 w-4" />
                </Link>
              </Button>
            )}
            <ThemeToggle />
            {actions}
          </div>
        </div>
      </div>
    </header>
  );
}
