// components/EditorSkeleton.tsx - Loading skeleton for code editor

interface EditorSkeletonProps {
  /** Height of the skeleton */
  height?: string;
}

/**
 * Loading skeleton for the code editor
 * Shows animated placeholder while editor is loading
 */
export function EditorSkeleton({ height = '300px' }: EditorSkeletonProps) {
  return (
    <div
      className="rounded-md border overflow-hidden bg-muted animate-pulse"
      style={{ height }}
    >
      <div className="flex flex-col h-full p-4 space-y-3">
        {/* Line number column + code lines */}
        <div className="flex gap-4">
          <div className="w-8 h-4 bg-muted-foreground/20 rounded" />
          <div className="flex-1 h-4 bg-muted-foreground/20 rounded" />
        </div>
        <div className="flex gap-4">
          <div className="w-8 h-4 bg-muted-foreground/20 rounded" />
          <div className="w-3/4 h-4 bg-muted-foreground/20 rounded" />
        </div>
        <div className="flex gap-4">
          <div className="w-8 h-4 bg-muted-foreground/20 rounded" />
          <div className="w-1/2 h-4 bg-muted-foreground/20 rounded" />
        </div>
        <div className="flex gap-4">
          <div className="w-8 h-4 bg-muted-foreground/20 rounded" />
          <div className="w-2/3 h-4 bg-muted-foreground/20 rounded" />
        </div>
        <div className="flex gap-4">
          <div className="w-8 h-4 bg-muted-foreground/20 rounded" />
          <div className="w-1/4 h-4 bg-muted-foreground/20 rounded" />
        </div>
      </div>
    </div>
  );
}

export type { EditorSkeletonProps };
