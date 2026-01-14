import type { CommunicationData } from '@/features/widgets/communication/types/communication';
import { COMMUNICATION_OPTIONS } from '@/features/widgets/communication/constants/communication';
import { cn } from '@/common/lib/utils';
import {
  LuSiren,
  LuMessageCircle,
  LuFileText,
  LuMegaphone,
} from 'react-icons/lu';

interface CommunicationSectionProps {
  data: CommunicationData['communication'];
  onChange: (
    key: keyof CommunicationData['communication'],
    value: string,
  ) => void;
}

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/common/components/shadcn/select';

export function CommunicationSection({
  data,
  onChange,
}: CommunicationSectionProps) {
  const items = [
    {
      key: 'urgent',
      label: '긴급',
      icon: LuSiren,
      options: COMMUNICATION_OPTIONS.urgent,
      color: 'text-red-500',
    },
    {
      key: 'sync',
      label: '동기',
      icon: LuMessageCircle,
      options: COMMUNICATION_OPTIONS.sync,
      color: 'text-green-500',
    },
    {
      key: 'async',
      label: '비동기',
      icon: LuFileText,
      options: COMMUNICATION_OPTIONS.async,
      color: 'text-blue-500',
    },
    {
      key: 'official',
      label: '공식',
      icon: LuMegaphone,
      options: COMMUNICATION_OPTIONS.official,
      color: 'text-yellow-500',
    },
  ] as const;

  return (
    <div className="space-y-3">
      <h3 className="text-secondary-foreground flex items-center gap-2 text-sm font-semibold">
        소통 방식
      </h3>
      <div className="grid grid-cols-2 gap-3">
        {items.map((item) => (
          <div
            key={item.key}
            className="flex flex-col gap-2 rounded-lg border p-3"
          >
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  'bg-muted/50 rounded-md p-1',
                  item.color.replace('text-', 'text-'),
                )}
              >
                <item.icon className={cn('h-4 w-4', item.color)} />
              </div>
              <span className="text-muted-foreground text-xs font-bold tracking-wider uppercase">
                {item.label}
              </span>
            </div>
            <Select
              value={data[item.key]}
              onValueChange={(value) => onChange(item.key, value)}
            >
              <SelectTrigger
                onPointerDown={(e) => e.stopPropagation()}
                className="h-8 w-full text-xs font-medium"
              >
                <SelectValue placeholder="선택해주세요" />
              </SelectTrigger>
              <SelectContent>
                {item.options.map((opt) => (
                  <SelectItem key={opt} value={opt} className="text-xs">
                    {opt}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ))}
      </div>
    </div>
  );
}
