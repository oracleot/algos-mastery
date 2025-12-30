// pages/Catalog.tsx - Browse and add problems from the curated catalog

import { Link } from 'react-router-dom';
import { ArrowLeft, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';

/**
 * Catalog page - allows users to browse the curated problem catalog
 * Full implementation in Phase 3 (User Story 1)
 */
export function Catalog() {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur">
        <div className="container mx-auto flex h-14 max-w-6xl items-center gap-4 px-4">
          <Link to="/">
            <Button variant="ghost" size="icon" aria-label="Go back home">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-lg font-semibold">Problem Catalog</h1>
        </div>
      </header>

      <main className="container mx-auto max-w-6xl px-4 py-6">
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <BookOpen className="h-16 w-16 text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold mb-2">
            Browse 150 Curated Problems
          </h2>
          <p className="text-muted-foreground max-w-md">
            Explore problems from Blind 75, NeetCode 150, and Grind 75.
            Full catalog browsing coming in Phase 3.
          </p>
        </div>
      </main>
    </div>
  );
}
