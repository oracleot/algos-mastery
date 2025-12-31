// components/StickyHeader.tsx - Shared sticky header with Settings and Theme toggle

import { Link } from 'react-router-dom';
import { Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';
import { OfflineIndicator } from '@/components/OfflineIndicator';
import { usePWA } from '@/hooks/usePWA';

interface StickyHeaderProps {
  /** Additional className for the container */
  className?: string;
}

/**
 * Sticky header component with settings icon and theme toggle
 * Used across all pages for consistent navigation
 */
export function StickyHeader({ className = '' }: StickyHeaderProps) {
  const { isOnline } = usePWA();

  return (
    <div className={`fixed top-4 right-4 flex items-center gap-2 z-50 ${className}`}>
      <OfflineIndicator isOnline={isOnline} />
      <Button variant="ghost" size="icon" asChild className="h-9 w-9">
        <Link to="/settings" aria-label="Settings">
          <Settings className="h-4 w-4" />
        </Link>
      </Button>
      <ThemeToggle />
    </div>
  );
}
