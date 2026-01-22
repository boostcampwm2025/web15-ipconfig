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
    <div className="flex cursor-pointer items-center justify-between rounded-md px-3 py-2 transition-colors hover:bg-gray-800/50">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-gray-300">{label}</span>
        <LuCircleHelp
          className="hover:text-primary transition-colors"
          onMouseEnter={onHover}
        />
      </div>
      <Select value={value} onValueChange={(v) => onChange(v as NamingCase)}>
        <SelectTrigger className="h-8 w-[180px] border-gray-700 bg-gray-900 text-xs">
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
