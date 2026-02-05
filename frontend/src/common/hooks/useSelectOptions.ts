import { useMemo } from 'react';
import { SUBJECT_GROUPS } from '@/features/widgets/techStack/mocks/techStacks';
import type { SelectInputOption } from '../types/selectInput';

export function useSelectOptions(
  searchText: string,
  customOptions: string[],
  defaultGroups: SelectInputOption[] = SUBJECT_GROUPS,
) {
  const allGroupedOptions = useMemo(() => {
    const mergedGroups = defaultGroups.map((group) => ({
      ...group,
    }));

    customOptions.forEach((fullValue) => {
      const match = fullValue.match(/^\[(.*?)\] (.*)$/);
      if (match) {
        const [, category] = match;
        const groupIndex = mergedGroups.findIndex(
          (g) => g.category === category,
        );

        if (groupIndex > -1) {
          mergedGroups[groupIndex].category = fullValue;
        } else {
          mergedGroups.push({ category: fullValue });
        }
      }
    });
    return mergedGroups;
  }, [customOptions, defaultGroups]);

  // 2. 검색어 필터링
  const filteredOptions = useMemo(() => {
    if (!searchText) return allGroupedOptions;

    return allGroupedOptions.filter((group) =>
      group.category.toLowerCase().includes(searchText.toLowerCase()),
    );
  }, [searchText, allGroupedOptions]);

  // 3. 중복 여부 확인
  const isExisting = useMemo(() => {
    return allGroupedOptions.some((group) =>
      group.category.toLowerCase().includes(searchText.toLowerCase()),
    );
  }, [allGroupedOptions, searchText]);

  return { filteredOptions, isExisting };
}
