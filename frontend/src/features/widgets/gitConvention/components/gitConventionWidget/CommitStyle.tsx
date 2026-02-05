import type { CommitConventionState } from '@/features/widgets/gitConvention/types/gitConvention';
import { DEFAULT_COMMIT_TYPES } from '@/features/widgets/gitConvention/constants/commitTypes';
import { cn } from '@/common/lib/utils';
import { LuCheck } from 'react-icons/lu';
import { Button } from '@/common/components/shadcn/button';
import LabelButton from '@/common/components/LabelButton';

interface CommitStyleProps {
  convention: CommitConventionState;
  onChange: (convention: Partial<CommitConventionState>) => void;
}

export function CommitStyle({ convention, onChange }: CommitStyleProps) {
  const toggleType = (type: string) => {
    const currentTypes = convention.commitTypes?.selectedIds || [];
    const newTypes = currentTypes.includes(type)
      ? currentTypes.filter((t) => t !== type)
      : [...currentTypes, type];

    onChange({
      commitTypes: {
        ...convention.commitTypes,
        selectedIds: newTypes,
      },
    });
  };

  return (
    <div className="flex flex-col gap-3">
      <label
        htmlFor="commit-types"
        className="text-muted-foreground ml-1 text-xs font-medium"
      >
        Commit Types
      </label>

      <div className="grid grid-cols-2 gap-2">
        {DEFAULT_COMMIT_TYPES.map((type) => {
          const isChecked = convention.commitTypes?.selectedIds.includes(type);
          return (
            <LabelButton
              key={type}
              label={type}
              isSelected={isChecked}
              onClick={() => toggleType(type)}
            />
          );
        })}
      </div>
    </div>
  );
}
