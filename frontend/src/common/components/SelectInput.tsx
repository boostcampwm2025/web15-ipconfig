import { useState } from 'react';
import { Check, ChevronDownIcon, Plus } from 'lucide-react';

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

import { SUBJECT_GROUPS } from '@/features/widgets/techStack/mocks/techStacks';

interface SelectInputProps {
  selectedValue: string;
  setSelectedValue: (value: string) => void;
}

function SelectInput({ selectedValue, setSelectedValue }: SelectInputProps) {
  const [open, setOpen] = useState(false);
  const [searchText, setSearchText] = useState('');

  const [groupedOptions, setGroupedOptions] = useState(SUBJECT_GROUPS);

  // 입력값으로 필터링된 옵션들
  const filteredGroupedOptions = searchText
    ? groupedOptions.filter((group) =>
        group.options.some((option) =>
          option.toLowerCase().includes(searchText.toLowerCase()),
        ),
      )
    : groupedOptions;

  // 현재 입력값이 기존 옵션에 정확히 존재하는지 확인
  const isExisting = groupedOptions.some((group) =>
    group.options.some(
      (option) =>
        `[${group.category}] ${option}`.toLowerCase() ===
        searchText.toLowerCase(),
    ),
  );

  const handleSelect = (currentValue: string) => {
    setSelectedValue(currentValue === selectedValue ? '' : currentValue);
    setOpen(false);
  };

  const handleCreateOption = () => {
    if (!searchText) return;

    const newOption = searchText;

    setGroupedOptions((prev) => [
      ...prev,
      { category: '커스텀 주제', options: [newOption] },
    ]);
    setSelectedValue(`[커스텀 주제] ${newOption}`);
    setOpen(false);
    setSearchText('');
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            'w-full flex-1 justify-between',
            open && 'border-primary! ring-primary/50! ring-1',
          )}
        >
          {selectedValue || '주제를 선택해주세요...'}
          <ChevronDownIcon className="size-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="p-1"
        style={{ width: 'var(--radix-popover-trigger-width)' }}
      >
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="원하는 주제를 입력하세요..."
            value={searchText}
            onValueChange={setSearchText}
          />
          <CommandList className="py-1">
            {filteredGroupedOptions.map((groupedOption) => (
              <CommandGroup
                heading={groupedOption.category}
                key={groupedOption.category}
              >
                {groupedOption.options.map((option) => (
                  <CommandItem
                    key={`[${groupedOption.category}] ${option}`}
                    value={`[${groupedOption.category}] ${option}`}
                    onSelect={handleSelect}
                    className="flex items-center justify-between pl-4"
                  >
                    {option}
                    <Check
                      className={cn(
                        'mr-2 h-4 w-4',
                        selectedValue ===
                          `[${groupedOption.category}] ${option}`
                          ? 'opacity-100'
                          : 'opacity-0',
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            ))}

            {/* 입력값이 있고 기존 목록에 없을 때만 '추가' 버튼 노출 */}
            {searchText && !isExisting && (
              <CommandGroup heading="새로운 주제 추가">
                <CommandItem onSelect={handleCreateOption}>
                  <Plus className="mr-2 h-4 w-4" />"{searchText}" 추가하기
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
