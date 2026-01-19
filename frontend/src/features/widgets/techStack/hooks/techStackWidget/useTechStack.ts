import { useState } from 'react';
import type { DragEndEvent } from '@dnd-kit/core';
import type { TechStack } from '../../types/techStack';
import type { TechStackData } from '@/common/types/widgetData';

interface UseTechStackProps {
  data: TechStackData;
  onDataChange: (data: TechStackData) => void;
}

export function useTechStack({ data, onDataChange }: UseTechStackProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const selectedTechStacks = data.selectedItems || [];

  const setSelectedTechStacks = (value: React.SetStateAction<TechStack[]>) => {
    let newItems: TechStack[];
    if (typeof value === 'function') {
      newItems = value(selectedTechStacks);
    } else {
      newItems = value;
    }

    onDataChange({
      selectedItems: newItems,
    });
  };

  const handleDragEnd = (event: DragEndEvent) => {
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
        onDataChange({
          selectedItems: newSelectedTechStacks,
        });
      }
    }
  };

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
