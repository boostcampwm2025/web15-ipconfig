import { useMemo } from 'react';
import { SUBJECT_GROUPS } from '@/features/widgets/techStack/mocks/techStacks';

interface GroupShape {
  category: string;
  options: string[];
}

export function useSelectOptions(
  searchText: string,
  customOptions: string[],
  defaultGroups: GroupShape[] = SUBJECT_GROUPS,
) {
  // 1. 기본 + 커스텀 옵션 병합
  const allGroupedOptions = useMemo(() => {
    // 깊은 복사로 안전하게 병합 시작
    const mergedGroups = defaultGroups.map((group) => ({
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
  }, [customOptions, defaultGroups]);

  // 2. 검색어 필터링
  const filteredOptions = useMemo(() => {
    if (!searchText) return allGroupedOptions;

    return allGroupedOptions
      .map((group) => ({
        ...group,
        options: group.options.filter((opt) =>
          opt.toLowerCase().includes(searchText.toLowerCase()),
        ),
      }))
      .filter((group) => group.options.length > 0);
  }, [searchText, allGroupedOptions]);

  // 3. 중복 여부 확인
  const isExisting = useMemo(() => {
    return allGroupedOptions.some((group) =>
      group.options.some(
        (option) =>
          `[${group.category}] ${option}`.toLowerCase() ===
          searchText.toLowerCase(),
      ),
    );
  }, [allGroupedOptions, searchText]);

  return { filteredOptions, isExisting };
}
