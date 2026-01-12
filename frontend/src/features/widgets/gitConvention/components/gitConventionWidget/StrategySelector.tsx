import { STRATEGY_OPTIONS } from '../../constants/presets';
import type { GitStrategy } from '../../types/gitConvention';
import { cn } from '@/common/lib/utils';
import { LuCheck, LuCircle, LuCircleDot } from 'react-icons/lu';

interface StrategySelectorProps {
  value: GitStrategy;
  onChange: (value: GitStrategy) => void;
}

export function StrategySelector({ value, onChange }: StrategySelectorProps) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-muted-foreground ml-1 text-xs font-semibold">
        Git Strategy
      </label>
      <div className="flex flex-col gap-1.5">
        {STRATEGY_OPTIONS.map((option) => {
          const isSelected = value === option.value;
          return (
            <button
              key={option.value}
              onClick={() => onChange(option.value as GitStrategy)}
              className={cn(
                'flex w-full items-center gap-3 rounded-lg border p-2.5 text-sm transition-all',
                'hover:bg-accent hover:text-accent-foreground',
                isSelected
                  ? 'border-primary bg-primary/5 text-primary font-medium shadow-sm'
                  : 'border-muted bg-card text-muted-foreground',
              )}
            >
              {isSelected ? (
                <LuCircleDot size={16} className="text-primary shrink-0" />
              ) : (
                <LuCircle
                  size={16}
                  className="text-muted-foreground/50 shrink-0"
                />
              )}
              <span className="truncate">{option.label}</span>
              {isSelected && (
                <LuCheck size={14} className="ml-auto opacity-50" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
