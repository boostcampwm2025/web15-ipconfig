import type { CommunicationData } from '@/features/widgets/communication/types/communication';
import { CORE_TIME_OPTIONS } from '@/features/widgets/communication/constants/communication';

interface TimeSectionProps {
  data: CommunicationData['timeManagement'];
  onChange: (
    key: keyof CommunicationData['timeManagement'],
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

export function TimeSection({ data, onChange }: TimeSectionProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-secondary-foreground text-sm font-semibold">
        코어 타임
      </h3>
      <div className="flex items-center gap-3 rounded-lg border p-3">
        <Select
          value={data.coreTimeStart}
          onValueChange={(value) => onChange('coreTimeStart', value)}
        >
          <SelectTrigger className="h-8 flex-1 text-xs font-medium">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {CORE_TIME_OPTIONS.map((time) => (
              <SelectItem
                key={`start-${time}`}
                value={time}
                className="text-xs"
              >
                {time}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <span className="text-muted-foreground text-xs font-medium">~</span>

        <Select
          value={data.coreTimeEnd}
          onValueChange={(value) => onChange('coreTimeEnd', value)}
        >
          <SelectTrigger className="h-8 flex-1 text-xs font-medium">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {CORE_TIME_OPTIONS.map((time) => (
              <SelectItem key={`end-${time}`} value={time} className="text-xs">
                {time}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
