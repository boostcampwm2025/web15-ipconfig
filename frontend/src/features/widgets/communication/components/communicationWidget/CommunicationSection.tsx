import { useMemo } from 'react';
import type { CommunicationData } from '@/features/widgets/communication/types/communication';

import { cn } from '@/common/lib/utils';
import { COMMUNICATION_ITEMS } from '@/features/widgets/communication/constants/communicationItems';
import SelectInput from '@/common/components/SelectInput';

interface CommunicationSectionProps {
  data: CommunicationData['communication'];
  onChange: (key: string, value: string) => void;
}

export function CommunicationSection({
  data,
  onChange,
}: CommunicationSectionProps) {
  const allCustomOptions = useMemo(() => {
    const optionsMap: Record<string, string[]> = {};
    COMMUNICATION_ITEMS.forEach((item) => {
      const itemOptions = Object.values(data[item.key].options).map(
        (o) => o.value,
      );
      const selectedId = data[item.key].selectedId;
      optionsMap[item.key] = [
        ...itemOptions.map((opt) => `[${item.label}] ${opt}`),
        ...(selectedId && !itemOptions.includes(selectedId)
          ? [`[${item.label}] ${selectedId}`]
          : []),
      ];
    });
    return optionsMap;
  }, [data]);

  const defaultGroups = useMemo(() => [], []);

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
            <SelectInput
              selectedValue={
                data[item.key].selectedId
                  ? `[${item.label}] ${data[item.key].selectedId}`
                  : ''
              }
              setSelectedValue={(value) => {
                const match = value.match(/^\[(.*?)\] (.*)$/);
                if (match) {
                  onChange(item.key, match[2]);
                } else {
                  onChange(item.key, value);
                }
              }}
              customOptions={allCustomOptions[item.key]}
              defaultGroups={defaultGroups}
              customCategoryName={item.label}
              placeholder={'플랫폼을 선택해주세요...'}
              searchPlaceholder={'플랫폼을 입력하세요...'}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
