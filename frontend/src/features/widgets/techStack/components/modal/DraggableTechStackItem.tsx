import { memo } from 'react';
import TechStackItem from '@/features/widgets/techStack/components/TechStackItem';
import { useDraggable } from '@dnd-kit/core';
import type { TechStack } from '@/features/widgets/techStack/types/techStack';

function DraggableTechStackItem({ id, name, category }: TechStack) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `tech-stack-${id}`,
    data: {
      support: ['techStackWidget'] as const,
      content: { id, name, category },
    },
  });

  const style = {
    // DragOverlay를 사용하므로 원본은 transform 없이 제자리에 유지
    opacity: isDragging ? 0.8 : 1,
    cursor: isDragging ? 'grabbing' : 'grab',
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <TechStackItem techName={name} />
    </div>
  );
}

export default memo(DraggableTechStackItem);
