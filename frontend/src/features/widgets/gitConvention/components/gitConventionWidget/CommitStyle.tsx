import type { CommitConventionState } from '@/features/widgets/gitConvention/types/gitConvention';
import { DEFAULT_COMMIT_TYPES } from '@/features/widgets/gitConvention/constants/commitTypes';
import { cn } from '@/common/lib/utils';
import { LuCheck } from 'react-icons/lu';

interface CommitStyleProps {
  convention: CommitConventionState;
  onChange: (convention: Partial<CommitConventionState>) => void;
}

export function CommitStyle({ convention, onChange }: CommitStyleProps) {
  const toggleType = (type: string) => {
    const currentTypes = convention.commitTypes || [];
    const newTypes = currentTypes.includes(type)
      ? currentTypes.filter((t) => t !== type)
      : [...currentTypes, type];

    onChange({ commitTypes: newTypes });
  };

  return (
    <div className="flex flex-col gap-3">
      <label className="text-muted-foreground ml-1 text-xs font-medium">
        Commit Types
      </label>

      <div className="grid grid-cols-2 gap-2">
        {DEFAULT_COMMIT_TYPES.map((type) => {
          const isChecked = convention.commitTypes?.includes(type);
          return (
            <button
              key={type}
              onClick={() => toggleType(type)}
              className={cn(
                'flex items-center gap-2 rounded-md border p-2 text-left text-sm transition-all',
                'hover:bg-accent hover:text-accent-foreground',
                isChecked
                  ? 'border-primary bg-primary/5 text-primary ring-primary/20 ring-1'
                  : 'border-muted bg-card text-muted-foreground',
              )}
            >
              <div
                className={cn(
                  'flex h-4 w-4 items-center justify-center rounded border transition-colors',
                  isChecked
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-muted-foreground/30',
                )}
              >
                {isChecked && <LuCheck size={10} />}
              </div>
              <span>{type}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
