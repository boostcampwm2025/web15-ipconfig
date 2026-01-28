import type { CommunicationData } from '@/features/widgets/communication/types/communication';

import { cn } from '@/common/lib/utils';
import { COMMUNICATION_ITEMS } from '@/features/widgets/communication/constants/communicationItems';

interface CommunicationSectionProps {
  data: CommunicationData['communication'];
  onChange: (key: string, value: string) => void;
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
  return (
    <div className="space-y-3">
      <h3 className="text-secondary-foreground flex items-center gap-2 text-sm font-semibold">
        소통 방식
      </h3>
      <div className="grid grid-cols-2 gap-3">
        {COMMUNICATION_ITEMS.map((item) => (
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
              value={data[item.key].selectedId}
              onValueChange={(value) => onChange(item.key, value)}
            >
              <SelectTrigger className="h-8 w-full text-xs font-medium">
                <SelectValue placeholder="선택해주세요" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(data[item.key].options).map((opt) => (
                  <SelectItem
                    key={opt.value}
                    value={opt.value}
                    className="text-xs"
                  >
                    {opt.value}
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
