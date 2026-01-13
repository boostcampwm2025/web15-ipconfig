import type { DragEndEvent } from '@dnd-kit/core';
import type { TechStack } from '../../types/techStack';
import { useState } from 'react';

export function useSelectedTechStacks() {
  const [selectedTechStacks, setSelectedTechStacks] = useState<TechStack[]>([]);

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
        setSelectedTechStacks((prev) => [...prev, { id, name, category }]);
      }
    }
  };

  return { selectedTechStacks, setSelectedTechStacks, handleDragEnd };
}
