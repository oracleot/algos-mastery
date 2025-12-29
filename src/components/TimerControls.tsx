// components/TimerControls.tsx - Play/pause/reset controls for timer

import { Play, Pause, RotateCcw, Square } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import type { TimerState } from '@/lib/timer';

interface TimerControlsProps {
  /** Current timer state */
  state: TimerState;
  /** Start the timer */
  onStart: () => void;
  /** Pause the timer */
  onPause: () => void;
  /** Resume the timer */
  onResume: () => void;
  /** Reset the timer */
  onReset: () => void;
  /** Stop the timer (optional) */
  onStop?: () => void;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Show stop button */
  showStop?: boolean;
  /** Additional CSS classes */
  className?: string;
}

const SIZE_MAP = {
  sm: 'h-8 w-8',
  md: 'h-10 w-10',
  lg: 'h-12 w-12',
};

const ICON_SIZE_MAP = {
  sm: 'h-4 w-4',
  md: 'h-5 w-5',
  lg: 'h-6 w-6',
};

/**
 * Timer control buttons with play/pause/reset functionality
 */
export function TimerControls({
  state,
  onStart,
  onPause,
  onResume,
  onReset,
  onStop,
  size = 'md',
  showStop = false,
  className,
}: TimerControlsProps) {
  const buttonSize = SIZE_MAP[size];
  const iconSize = ICON_SIZE_MAP[size];

  const handlePlayPause = () => {
    if (state.isComplete) return;
    if (state.isRunning) {
      onPause();
    } else if (state.isPaused) {
      onResume();
    } else {
      onStart();
    }
  };

  const isPlayPauseDisabled = state.isComplete;
  const isResetDisabled = state.elapsed === 0 && !state.isRunning && !state.isPaused;

  return (
    <TooltipProvider>
      <div className={cn('flex items-center gap-2', className)}>
        {/* Play/Pause button */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={state.isRunning ? 'secondary' : 'default'}
              size="icon"
              className={cn(buttonSize, 'rounded-full')}
              onClick={handlePlayPause}
              disabled={isPlayPauseDisabled}
            >
              {state.isRunning ? (
                <Pause className={iconSize} />
              ) : (
                <Play className={cn(iconSize, 'ml-0.5')} />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>
              {state.isRunning ? 'Pause' : state.isPaused ? 'Resume' : 'Start'}
              <span className="ml-2 text-muted-foreground text-xs">Space</span>
            </p>
          </TooltipContent>
        </Tooltip>

        {/* Reset button */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className={cn(buttonSize, 'rounded-full')}
              onClick={onReset}
              disabled={isResetDisabled}
            >
              <RotateCcw className={iconSize} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Reset Timer</p>
          </TooltipContent>
        </Tooltip>

        {/* Stop button (optional) */}
        {showStop && onStop && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="destructive"
                size="icon"
                className={cn(buttonSize, 'rounded-full')}
                onClick={onStop}
                disabled={!state.isRunning && !state.isPaused}
              >
                <Square className={iconSize} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>End Session</p>
            </TooltipContent>
          </Tooltip>
        )}
      </div>
    </TooltipProvider>
  );
}

export type { TimerControlsProps };
