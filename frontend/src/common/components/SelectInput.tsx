import {
  useState,
  useRef,
  useCallback,
  type KeyboardEvent,
  type ChangeEvent,
} from 'react';
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
import { useSelectOptions } from '@/common/hooks/useSelectOptions';
import { Button } from './shadcn/button';

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
  const { filteredOptions, isExisting } = useSelectOptions(
    searchText,
    customOptions,
  );
  // 입력으로 인한 focus 잃어버리는 거 해결
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSearchChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setSearchText(value);
      setValue('search', value, { shouldValidate: true });

      // requestAnimationFrame을 써서 다음 프레임에 포커스를 확실하게 복구
      requestAnimationFrame(() => {
        inputRef.current?.focus();
      });
    },
    [setValue],
  );

  const handleCreate = handleSubmit((data) => {
    const validSearchText = data.search;
    if (!validSearchText) return;

    const fullValue = `[커스텀 주제] ${validSearchText}`;

    if (onCreateOption) onCreateOption(fullValue);
    else setSelectedValue(fullValue);

    // 초기화
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

      <SelectContent
        className="p-0"
        position="popper"
        style={{
          width: `${Math.max(100, Number('var(--radix-select-trigger-width)'))}px`,
        }}
      >
        <div className="border-b p-2" onClick={(e) => e.stopPropagation()}>
          <div className="relative">
            <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-2 h-4 w-4 -translate-y-1/2" />
            <Input
              ref={inputRef}
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
          {filteredOptions.length > 0
            ? filteredOptions.map((group) => (
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
              <Button
                variant="ghost"
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  handleCreate();
                }}
                className={cn(
                  'relative flex w-full items-center justify-start gap-2 py-1.5 pr-2 pl-2 text-sm outline-none select-none',
                  'hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
                )}
              >
                <Plus className="h-4 w-4 shrink-0" />
                <span className="truncate">"{searchText}" 추가하기</span>
              </Button>
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
