import { useState, useMemo, type KeyboardEvent } from 'react';
import { Plus, Search } from 'lucide-react';
import { cn } from '@/common/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/common/components/shadcn/select';
import { Input } from '@/common/components/shadcn/input';
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
  const [searchText, setSearchText] = useState('');

  const { setValue, errors, handleSubmit } = useTeckStackSearch();

  const allGroupedOptions = useMemo(() => {
    const mergedGroups = SUBJECT_GROUPS.map((group) => ({
      ...group,
      options: [...group.options],
    }));

    customOptions.forEach((fullValue) => {
      // [커스텀 주제] 주제 이름 분리하는 정규식
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
      searchText
        ? allGroupedOptions
            .map((group) => ({
              ...group,
              options: group.options.filter((opt) =>
                opt.toLowerCase().includes(searchText.toLowerCase()),
              ),
            }))
            .filter((group) => group.options.length > 0)
        : allGroupedOptions,
    [searchText, allGroupedOptions],
  );

  const isExisting = useMemo(() => {
    return allGroupedOptions.some((group) =>
      group.options.some(
        (option) =>
          `[${group.category}] ${option}`.toLowerCase() ===
          searchText.toLowerCase(),
      ),
    );
  }, [allGroupedOptions, searchText]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchText(value);
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

    setSearchText('');
    setValue('search', '', { shouldValidate: true });
  });

  const handleInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    e.stopPropagation();
    if (e.key === 'Enter' && !isExisting && !errors.search && searchText) {
      e.preventDefault();
      handleCreate();
    }
  };

  return (
    <Select value={selectedValue} onValueChange={setSelectedValue}>
      <SelectTrigger className="w-full justify-between px-3 font-normal">
        <span className="min-w-0 flex-1 truncate text-left">
          <SelectValue placeholder="주제를 선택해주세요..." />
        </span>
      </SelectTrigger>

      <SelectContent className="p-0" position="popper">
        <div className="border-b p-2">
          <div className="relative">
            <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-2 h-4 w-4 -translate-y-1/2" />
            <Input
              placeholder="원하는 주제를 입력하세요..."
              value={searchText}
              onChange={handleSearchChange}
              onKeyDown={handleInputKeyDown}
              className="h-8 pl-8"
              autoFocus
            />
          </div>
          {errors.search && (
            <div className="text-destructive mt-1.5 px-1 text-xs font-medium">
              {errors.search.message}
            </div>
          )}
        </div>

        <div className="max-h-[300px] overflow-y-auto">
          {filteredGroupedOptions.length > 0
            ? filteredGroupedOptions.map((group) => (
                <div key={group.category}>
                  <div className="text-muted-foreground px-2 py-1.5 text-[10px] font-semibold">
                    {group.category}
                  </div>
                  {group.options.map((option) => {
                    const fullValue = `[${group.category}] ${option}`;
                    return (
                      <SelectItem
                        key={fullValue}
                        value={fullValue}
                        className="cursor-pointer pl-8 text-sm"
                      >
                        <span className="block truncate">{option}</span>
                      </SelectItem>
                    );
                  })}
                </div>
              ))
            : !searchText && (
                <div className="text-muted-foreground py-6 text-center text-sm">
                  목록 없음
                </div>
              )}

          {searchText && !isExisting && !errors.search && (
            <div className="p-1">
              <div className="text-muted-foreground px-2 py-1 text-[10px] font-semibold">
                새로운 주제 추가
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  handleCreate();
                }}
                className={cn(
                  'relative flex w-full cursor-pointer items-center gap-2 rounded-sm py-1.5 pr-2 pl-2 text-sm outline-none select-none',
                  'hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
                )}
              >
                <Plus className="h-4 w-4 shrink-0" />
                <span className="truncate">"{searchText}" 추가하기</span>
              </button>
            </div>
          )}

          {searchText && !isExisting && errors.search && (
            <div className="text-muted-foreground py-4 text-center text-sm">
              올바른 주제를 입력해주세요.
            </div>
          )}
        </div>
      </SelectContent>
    </Select>
  );
}

export default SelectInput;
