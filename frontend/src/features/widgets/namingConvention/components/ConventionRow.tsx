import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/common/components/shadcn/select';
import type { NamingCase } from '../types/namingConvention';
import { LuCircleHelp } from 'react-icons/lu';

interface ConventionRowProps {
  label: string;
  value: NamingCase;
  onChange: (value: NamingCase) => void;
  onHover: () => void;
}

const NAMING_LIST: NamingCase[] = [
  'camelCase',
  'PascalCase',
  'snake_case',
  'UPPER_SNAKE_CASE',
  'kebab-case',
  'none',
];

export function ConventionRow({
  label,
  value,
  onChange,
  onHover,
}: ConventionRowProps) {
  return (
    <div className="hover:bg-muted flex cursor-pointer items-center justify-between rounded-md px-3 py-2 transition-colors">
      <div className="flex items-center gap-2">
        <span className="text-foreground text-sm font-medium">{label}</span>
        <LuCircleHelp
          className="hover:text-primary transition-colors"
          onMouseEnter={onHover}
        />
      </div>
      <Select value={value} onValueChange={(v) => onChange(v as NamingCase)}>
        <SelectTrigger className="border-border bg-background h-8 w-[180px] text-xs">
          <SelectValue placeholder="Select case" />
        </SelectTrigger>
        <SelectContent>
          {NAMING_LIST.map((opt) => (
            <SelectItem key={opt} value={opt}>
              <span className="font-mono">
                {opt === 'none' ? '컨벤션 정의 안함' : opt}
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
