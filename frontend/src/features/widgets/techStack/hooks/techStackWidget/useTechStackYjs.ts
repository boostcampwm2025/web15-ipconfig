import { useState, useCallback, useMemo } from 'react';
import type { DragEndEvent } from '@dnd-kit/core';
import type { TechStack } from '../../types/techStack';
import { useYjsWidgetContent } from '@/common/api/yjs/hooks/useYjsWidgetContent';
import { updateArrayFieldAction } from '@/common/api/yjs/actions/widgetContent';
import type { TechStackContent } from '@/common/types/yjsWidgetContent';

interface UseTechStackYjsProps {
  widgetId: string;
}

export function useTechStackYjs({ widgetId }: UseTechStackYjsProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const content = useYjsWidgetContent<TechStackContent>(widgetId);
  const selectedTechStacks = useMemo<TechStack[]>(
    () => content?.techItems ?? [],
    [content?.techItems],
  );

  const setSelectedTechStacks = useCallback(
    (value: React.SetStateAction<TechStack[]>) => {
      let newItems: TechStack[];
      if (typeof value === 'function') {
        newItems = value(selectedTechStacks);
      } else {
        newItems = value;
      }

      updateArrayFieldAction(widgetId, 'TECH_STACK', 'techItems', newItems);
    },
    [widgetId, selectedTechStacks],
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;

      // 전달된 데이터가 없는 경우
      if (!active.data.current || !active.data.current?.content) {
        return;
      }

      // 잘못된 영역에 드롭한 경우
      if (!active.data.current.support.includes(String(over?.id))) {
        return;
      }

      // 드롭 영역 위에 드롭되었는지 확인
      if (over && over.id === 'techStackWidget') {
        const { id, name, category } = active.data.current.content as TechStack;
        if (!selectedTechStacks.some((tech) => tech.id === id)) {
          const newSelectedTechStacks = [
            ...selectedTechStacks,
            { id, name, category },
          ];
          updateArrayFieldAction(
            widgetId,
            'TECH_STACK',
            'techItems',
            newSelectedTechStacks,
          );
        }
      }
    },
    [widgetId, selectedTechStacks],
  );

  return {
    selectedTechStacks,
    isModalOpen,
    actions: {
      setSelectedTechStacks,
      handleDragEnd,
      openModal: () => setIsModalOpen(true),
      closeModal: () => setIsModalOpen(false),
    },
  };
}
