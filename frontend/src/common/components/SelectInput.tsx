import * as React from 'react';
import { Check, Plus } from 'lucide-react';

import { cn } from '@/common/lib/utils';
import { Button } from '@/common/components/shadcn/button';
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/common/components/shadcn/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/common/components/shadcn/popover';
import type { SelectInputOption } from '@/common/types/selectInput';

interface CustomSearchSelectProps {
  initialOptions: SelectInputOption[];
}

function SelectInput({ initialOptions }: CustomSearchSelectProps) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState('');
  const [groupedOptions, setGroupedOptions] = React.useState(initialOptions);
  const [inputValue, setInputValue] = React.useState('');

  // 입력값으로 필터링된 옵션들
  const filteredGroupedOptions = inputValue
    ? groupedOptions.filter((group) =>
        group.options.some((option) =>
          option.toLowerCase().includes(inputValue.toLowerCase()),
        ),
      )
    : groupedOptions;

  // 현재 입력값이 기존 옵션에 정확히 존재하는지 확인
  const isExisting = groupedOptions.some((group) =>
    group.options.some(
      (option) => option.toLowerCase() === inputValue.toLowerCase(),
    ),
  );

  const handleSelect = (currentValue: string) => {
    setValue(currentValue === value ? '' : currentValue);
    setOpen(false);
  };

  const handleCreateOption = () => {
    if (!inputValue) return;

    const newOption = inputValue;

    setGroupedOptions((prev) => [
      ...prev,
      { category: '커스텀 주제', options: [newOption] },
    ]);
    setValue(newOption);
    setOpen(false);
    setInputValue('');
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            'flex-1 justify-between',
            open && 'border-primary! ring-primary/50! ring-1',
          )}
        >
          {value || '주제를 선택해주세요...'}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="p-0"
        style={{ width: 'var(--radix-popover-trigger-width)' }}
      >
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="원하는 주제를 입력하세요..."
            value={inputValue}
            onValueChange={setInputValue}
          />
          <CommandList>
            {filteredGroupedOptions.map((groupedOption) => (
              <CommandGroup
                heading={groupedOption.category}
                key={groupedOption.category}
              >
                {groupedOption.options.map((option) => (
                  <CommandItem
                    key={option}
                    value={option}
                    onSelect={handleSelect}
                    className="flex items-center justify-between pl-4"
                  >
                    {option}
                    <Check
                      className={cn(
                        'mr-2 h-4 w-4',
                        value === option ? 'opacity-100' : 'opacity-0',
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            ))}

            {/* 입력값이 있고 기존 목록에 없을 때만 '추가' 버튼 노출 */}
            {inputValue && !isExisting && (
              <CommandGroup heading="새로운 주제 추가">
                <CommandItem onSelect={handleCreateOption}>
                  <Plus className="mr-2 h-4 w-4" />"{inputValue}" 추가하기
                </CommandItem>
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export default SelectInput;
