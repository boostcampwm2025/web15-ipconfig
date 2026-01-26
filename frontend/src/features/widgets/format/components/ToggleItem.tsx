import { Button } from '@/common/components/shadcn/button';
import { cn } from '@/common/lib/utils';
import { LuCircleHelp } from 'react-icons/lu';

interface ToggleItemProps {
  label: string;
  checked: boolean;
  options?: { label: string; value: string | number | boolean }[];
  onChange: () => void;
  onHover: () => void;
}

function ToggleItem({
  label,
  checked,
  options,
  onChange,
  onHover,
}: ToggleItemProps) {
  const getLabel = () => {
    if (options) {
      const option = options.find((opt) => opt.value === checked);
      return option ? option.label : checked ? 'ON' : 'OFF';
    }
    return checked ? 'ON' : 'OFF';
  };

  return (
    <div className="flex w-full items-center gap-3">
      <span
        className="text-muted-foreground flex w-[100px] items-center gap-1 truncate text-sm"
        onMouseEnter={onHover}
      >
        {label.split(' (')[0]}
        <LuCircleHelp
          size={18}
          className="hover:text-primary shrink-0 opacity-70 transition-colors"
          onMouseEnter={onHover}
        />
      </span>
      <Button
        onClick={onChange}
        className={cn(
          'h-8.5 flex-1 rounded-md border !border-gray-700 text-sm font-medium transition-all',
          checked
            ? 'bg-primary/10 text-primary border-primary/20 hover:bg-primary/15'
            : 'bg-muted/30 text-muted-foreground hover:bg-muted/50 border-transparent',
        )}
      >
        {getLabel()}
      </Button>
    </div>
  );
}

export default ToggleItem;
