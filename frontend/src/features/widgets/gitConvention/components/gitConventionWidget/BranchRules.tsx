import { Input } from '@/common/components/shadcn/input';
import { Badge } from '@/common/components/shadcn/badge';
import { Button } from '@/common/components/shadcn/button';
import { LuPlus, LuX } from 'react-icons/lu';
import type { BranchRuleState } from '../../types/gitConvention';
import { useBranchPrefix } from '@/common/hooks/useBranchPrefix';

interface BranchRulesProps {
  strategy: string;
  rules: BranchRuleState;
  onChange: (rules: Partial<BranchRuleState>) => void;
}

export function BranchRules({ strategy, rules, onChange }: BranchRulesProps) {
  const { register, handleSubmit, setValue, errors } = useBranchPrefix();

  const handleAddPrefix = handleSubmit((data) => {
    const value = data.prefix.trim();
    if (!value) return;
    if (rules.prefixes.selectedIds.includes(value)) return;

    onChange({
      prefixes: {
        ...rules.prefixes,
        selectedIds: [...rules.prefixes.selectedIds, value],
      },
    });
    setValue('prefix', '');
  });

  const handleRemovePrefix = (prefixToRemove: string) => {
    onChange({
      prefixes: {
        ...rules.prefixes,
        selectedIds: rules.prefixes.selectedIds.filter(
          (p) => p !== prefixToRemove,
        ),
      },
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddPrefix();
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Main Branch */}
      <div className="flex flex-col gap-1.5">
        <label className="text-muted-foreground ml-1 text-xs font-medium">
          Main Branch
        </label>
        <Input
          value={rules.mainBranch}
          onChange={(e) => onChange({ mainBranch: e.target.value })}
          className="h-9"
          placeholder="e.g. main"
        />
      </div>

      {strategy === 'GIT_FLOW' && (
        <div className="flex flex-col gap-1.5">
          <label className="text-muted-foreground ml-1 text-xs font-medium">
            Develop Branch
          </label>
          <Input
            value={rules.developBranch || ''}
            onChange={(e) => onChange({ developBranch: e.target.value })}
            className="h-9"
            placeholder="e.g. develop"
          />
        </div>
      )}

      {/* Prefixes */}
      <div className="flex flex-col gap-1.5">
        <label className="text-muted-foreground ml-1 text-xs font-medium">
          Prefixes
        </label>
        <div className="flex gap-2">
          <Input
            {...register('prefix')}
            onKeyDown={handleKeyDown}
            placeholder="Add prefix..."
            className={`h-9 ${errors.prefix ? 'border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500/50' : ''}`}
          />
          <Button
            variant="outline"
            size="icon"
            className="h-9 w-9 shrink-0"
            onClick={handleAddPrefix}
          >
            <LuPlus size={14} />
          </Button>
        </div>
        {errors.prefix && (
          <span className="text-destructive mt-1 ml-1 text-xs">
            {errors.prefix.message}
          </span>
        )}
        <div className="mt-1 flex flex-wrap gap-1.5">
          {rules.prefixes.selectedIds.map((prefix) => (
            <Badge
              key={prefix}
              variant="secondary"
              className="border-border bg-background hover:bg-accent hover:text-accent-foreground flex cursor-default items-center gap-1.5 border px-2.5 py-1 pr-1.5 text-sm font-medium shadow-sm transition-colors"
            >
              {prefix}
              <button
                onClick={() => handleRemovePrefix(prefix)}
                className="hover:text-destructive hover:bg-muted-foreground/20 rounded-full p-0.5 transition-colors focus:outline-none"
                aria-label={`Remove ${prefix}`}
              >
                <LuX size={14} />
              </button>
            </Badge>
          ))}
          {rules.prefixes.selectedIds.length === 0 && (
            <span className="text-muted-foreground ml-1 text-xs italic">
              No prefixes configured.
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
