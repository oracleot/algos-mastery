// components/TimerPresets.tsx - Timer duration preset buttons

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface TimerPresetsProps {
  /** Currently selected duration in minutes */
  selectedMinutes: number;
  /** Called when a preset is selected */
  onSelect: (minutes: number) => void;
  /** Whether presets can be changed (disabled when timer is running) */
  disabled?: boolean;
  /** Additional CSS classes */
  className?: string;
}

const PRESETS = [
  { minutes: 25, label: '25m', description: 'Short' },
  { minutes: 45, label: '45m', description: 'Medium' },
  { minutes: 60, label: '60m', description: 'Long' },
];

/**
 * Timer duration preset buttons (25/45/60 minutes)
 */
export function TimerPresets({
  selectedMinutes,
  onSelect,
  disabled = false,
  className,
}: TimerPresetsProps) {
  return (
    <div className={cn('flex items-center gap-2 sm:gap-2', className)}>
      {PRESETS.map((preset) => {
        const isSelected = selectedMinutes === preset.minutes;
        return (
          <Button
            key={preset.minutes}
            variant={isSelected ? 'default' : 'outline'}
            size="sm"
            onClick={() => onSelect(preset.minutes)}
            disabled={disabled}
            className={cn(
              'min-w-[60px] h-10 sm:h-9 text-sm sm:text-xs touch-manipulation',
              isSelected && 'ring-2 ring-primary ring-offset-2'
            )}
          >
            {preset.label}
          </Button>
        );
      })}
    </div>
  );
}

/**
 * Timer duration selector with custom input option
 */
export function TimerDurationSelector({
  selectedMinutes,
  onSelect,
  disabled = false,
  className,
}: TimerPresetsProps) {
  const isCustom = !PRESETS.some((p) => p.minutes === selectedMinutes);

  return (
    <div className={cn('space-y-3', className)}>
      {/* Preset buttons */}
      <div className="flex flex-wrap gap-2">
        {PRESETS.map((preset) => {
          const isSelected = selectedMinutes === preset.minutes;
          return (
            <Button
              key={preset.minutes}
              variant={isSelected ? 'default' : 'outline'}
              size="sm"
              onClick={() => onSelect(preset.minutes)}
              disabled={disabled}
              className="flex flex-col h-auto py-2 px-4"
            >
              <span className="font-semibold">{preset.label}</span>
              <span className="text-xs opacity-70">{preset.description}</span>
            </Button>
          );
        })}
      </div>

      {/* Custom duration indicator */}
      {isCustom && (
        <div className="text-sm text-muted-foreground">
          Custom: {selectedMinutes} minutes
        </div>
      )}
    </div>
  );
}

export type { TimerPresetsProps };
