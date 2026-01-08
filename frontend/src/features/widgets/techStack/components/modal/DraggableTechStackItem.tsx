import { memo } from 'react';
import TechStackItem from '@/features/widgets/techStack/components/TechStackItem';
import { useDraggable } from '@dnd-kit/core';

interface DraggableTechStackItemProps {
  techName: string;
}

function DraggableTechStackItem({ techName }: DraggableTechStackItemProps) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: techName,
    data: { techName },
  });

  const style = {
    // DragOverlay를 사용하므로 원본은 transform 없이 제자리에 유지
    opacity: isDragging ? 0.5 : 1,
    cursor: isDragging ? 'grabbing' : 'grab',
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <TechStackItem techName={techName} />
    </div>
  );
}

export default memo(DraggableTechStackItem);
