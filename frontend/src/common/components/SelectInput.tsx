import { useState, useMemo } from 'react';
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

import { SUBJECT_GROUPS } from '@/features/widgets/techStack/mocks/techStacks';

interface SelectInputProps {
  selectedValue: string;
  setSelectedValue: (value: string) => void;
}

function SelectInput({ selectedValue, setSelectedValue }: SelectInputProps) {
  const [searchText, setSearchText] = useState('');
  const [groupedOptions, setGroupedOptions] = useState(SUBJECT_GROUPS);

  // 입력값으로 필터링된 옵션들
  const filteredGroupedOptions = useMemo(
    () =>
      searchText
        ? groupedOptions.filter((group) =>
            group.options.some((option) =>
              option.toLowerCase().includes(searchText.toLowerCase()),
            ),
          )
        : groupedOptions,
    [searchText, groupedOptions],
  );

  // 현재 입력값이 기존 옵션에 정확히 존재하는지 확인
  const isExisting = useMemo(
    () =>
      groupedOptions.some((group) =>
        group.options.some(
          (option) =>
            `[${group.category}] ${option}`.toLowerCase() ===
            searchText.toLowerCase(),
        ),
      ),
    [searchText, groupedOptions],
  );

  const handleValueChange = (value: string) => {
    setSelectedValue(value);
    setSearchText(''); // 선택 시 검색어 초기화
  };

  const handleCreateOption = () => {
    if (!searchText) return;

    const newOption = searchText;

    setGroupedOptions((prev) => [
      ...prev,
      { category: '커스텀 주제', options: [newOption] },
    ]);
    setSelectedValue(`[커스텀 주제] ${newOption}`);
    setSearchText('');
  };

  return (
    <Select value={selectedValue} onValueChange={handleValueChange}>
      <SelectTrigger className="w-full flex-1 justify-between">
        <SelectValue placeholder="주제를 선택해주세요..." />
      </SelectTrigger>
      <SelectContent className="p-0">
        {/* 검색 입력 필드 */}
        <div className="border-b p-2">
          <div className="relative">
            <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-2 h-4 w-4 -translate-y-1/2" />
            <Input
              placeholder="원하는 주제를 입력하세요..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="h-8 pl-8"
              onClick={(e) => e.stopPropagation()}
              onKeyDown={(e) => {
                e.stopPropagation();
                if (e.key === 'Enter' && searchText && !isExisting) {
                  handleCreateOption();
                }
              }}
            />
          </div>
        </div>

        {/* 필터링된 옵션 목록 */}
        <div className="max-h-[300px] overflow-y-auto">
          {filteredGroupedOptions.map((groupedOption) => (
            <div key={groupedOption.category}>
              <div className="text-muted-foreground px-2 py-1.5 text-[10px] font-semibold">
                {groupedOption.category}
              </div>
              {groupedOption.options.map((option) => {
                const value = `[${groupedOption.category}] ${option}`;
                return (
                  <SelectItem
                    key={value}
                    value={value}
                    className="pl-6 text-sm"
                  >
                    {option}
                  </SelectItem>
                );
              })}
            </div>
          ))}

          {/* 입력값이 있고 기존 목록에 없을 때만 '추가' 버튼 노출 */}
          {searchText && !isExisting && (
            <div>
              <div className="text-muted-foreground px-2 py-1.5 text-[10px] font-semibold">
                새로운 주제 추가
              </div>
              <button
                type="button"
                onClick={handleCreateOption}
                className={cn(
                  'relative flex w-full cursor-default items-center gap-2 rounded-sm py-1.5 pr-8 pl-6 text-sm outline-none select-none',
                  'hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
                )}
              >
                <Plus className="h-4 w-4" />"{searchText}" 추가하기
              </button>
            </div>
          )}
        </div>
      </SelectContent>
    </Select>
  );
}

export default SelectInput;
