import { useState, useMemo } from 'react';
import { Check, ChevronsUpDown, Plus } from 'lucide-react';
import { cn } from '@/common/lib/utils';
import { Button } from '@/common/components/shadcn/button';
import {
  Command,
  CommandEmpty,
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
// 훅 경로는 실제 프로젝트에 맞게 확인해주세요
import { useTeckStackSearch } from '@/common/hooks/useTeckStackSearch';

import { SUBJECT_GROUPS } from '@/features/widgets/techStack/mocks/techStacks';

interface SelectInputProps {
  selectedValue: string;
  setSelectedValue: (value: string) => void;
  customOptions?: string[];
  onCreateOption?: (value: string) => void;
}

function SelectInput({
  selectedValue,
  setSelectedValue,
  customOptions = [],
  onCreateOption,
}: SelectInputProps) {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  const { setValue, errors, handleSubmit } = useTeckStackSearch();

  const allGroupedOptions = useMemo(() => {
    const mergedGroups = SUBJECT_GROUPS.map((group) => ({
      ...group,
      options: [...group.options],
    }));

    customOptions.forEach((fullValue) => {
      const match = fullValue.match(/^\[(.*?)\] (.*)$/);
      if (match) {
        const [, category, optionName] = match;
        const groupIndex = mergedGroups.findIndex(
          (g) => g.category === category,
        );

        if (groupIndex > -1) {
          if (!mergedGroups[groupIndex].options.includes(optionName)) {
            mergedGroups[groupIndex].options.push(optionName);
          }
        } else {
          mergedGroups.push({ category, options: [optionName] });
        }
      }
    });

    return mergedGroups;
  }, [customOptions]);

  const filteredGroupedOptions = useMemo(
    () =>
      searchValue
        ? allGroupedOptions
            .map((group) => ({
              ...group,
              options: group.options.filter((opt) =>
                opt.toLowerCase().includes(searchValue.toLowerCase()),
              ),
            }))
            .filter((group) => group.options.length > 0)
        : allGroupedOptions,
    [searchValue, allGroupedOptions],
  );

  const isExisting = useMemo(() => {
    return allGroupedOptions.some((group) =>
      group.options.some(
        (option) =>
          `[${group.category}] ${option}`.toLowerCase() ===
          searchValue.toLowerCase(),
      ),
    );
  }, [allGroupedOptions, searchValue]);

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
    setValue('search', value, { shouldValidate: true });
  };

  const handleCreate = handleSubmit((data) => {
    const validSearchText = data.search;

    if (!validSearchText) return;

    const fullValue = `[커스텀 주제] ${validSearchText}`;

    if (onCreateOption) {
      onCreateOption(fullValue);
    } else {
      setSelectedValue(fullValue);
    }

    setSearchValue('');
    setValue('search', '', { shouldValidate: true });
    setOpen(false);
  });

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between px-3 font-normal"
        >
          {/* min-w-0으로 버튼 내부 텍스트가 줄어들 수 있게 허용하여 버튼 크기 유지 */}
          <span className="min-w-0 flex-1 truncate text-left">
            {selectedValue || '주제를 선택해주세요...'}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>

      {/* [핵심 수정] 
        className 대신 style 속성으로 CSS 변수를 직접 주입하여 
        Shadcn 기본 클래스(w-72 등)나 Tailwind 병합 충돌을 원천 차단합니다.
        이렇게 하면 드롭다운 너비가 트리거 버튼 너비와 정확히 일치하게 고정됩니다.
      */}
      <PopoverContent
        className="p-0"
        align="start"
        style={{ width: 'var(--radix-popover-trigger-width)' }}
      >
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="원하는 주제를 입력하세요..."
            value={searchValue}
            onValueChange={handleSearchChange}
          />

          {errors.search && (
            <div className="text-destructive px-2 py-1.5 text-xs font-medium">
              {errors.search.message}
            </div>
          )}

          <CommandList>
            <CommandEmpty>
              {!isExisting && searchValue && !errors.search ? (
                <button
                  onClick={handleCreate}
                  className="text-muted-foreground hover:bg-accent hover:text-accent-foreground flex w-full cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm"
                >
                  <Plus className="h-4 w-4 shrink-0" />
                  <span className="truncate">"{searchValue}" 추가하기</span>
                </button>
              ) : (
                <span className="text-muted-foreground py-6 text-center text-sm">
                  {errors.search ? '올바른 주제를 입력해주세요.' : '결과 없음'}
                </span>
              )}
            </CommandEmpty>

            {filteredGroupedOptions.map((group) => (
              <CommandGroup key={group.category} heading={group.category}>
                {group.options.map((option) => {
                  const fullValue = `[${group.category}] ${option}`;
                  return (
                    <CommandItem
                      key={fullValue}
                      value={fullValue}
                      onSelect={() => {
                        setSelectedValue(fullValue);
                        setSearchValue('');
                        setValue('search', '', { shouldValidate: true });
                        setOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                          'mr-2 h-4 w-4 shrink-0',
                          selectedValue === fullValue
                            ? 'opacity-100'
                            : 'opacity-0',
                        )}
                      />
                      <span className="truncate">{option}</span>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export default SelectInput;
