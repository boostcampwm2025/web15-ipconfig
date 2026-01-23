import { LuCircleHelp } from 'react-icons/lu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/common/components/shadcn/select';

interface ConfigSelectItemProps {
  label: string;
  value: string;
  options: { label: string; value: string | number | boolean }[];
  onChange: (value: string | number | boolean) => void;
  onHover: () => void;
}

function ConfigSelectItem({
  label,
  value,
  options,
  onChange,
  onHover,
}: ConfigSelectItemProps) {
  return (
    <div className="flex w-full items-center gap-3">
      <span className="text-muted-foreground flex w-[100px] items-center gap-2 truncate text-sm">
        {label.split(' (')[0]}
        <LuCircleHelp
          size={18}
          className="hover:text-primary shrink-0 opacity-70 transition-colors"
          onMouseEnter={onHover}
        />
      </span>
      <Select
        value={value}
        onValueChange={(v) => {
          if (v === 'true') {
            onChange(true);
          } else if (v === 'false') {
            onChange(false);
          } else {
            const numValue = Number(v);
            onChange(isNaN(numValue) ? v : numValue);
          }
        }}
      >
        <SelectTrigger className="h-7 min-w-0 flex-1 text-sm">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((opt) => (
            <SelectItem
              key={String(opt.value)}
              value={String(opt.value)}
              className="text-xs"
            >
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export default ConfigSelectItem;
