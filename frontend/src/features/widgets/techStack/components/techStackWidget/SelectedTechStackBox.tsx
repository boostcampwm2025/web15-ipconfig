import { LuPlus } from 'react-icons/lu';
import SelectedTechItem from './SelectedTechItem';
import type { Dispatch, SetStateAction } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { cn } from '@/common/lib/utils';
import type { TechStack } from '@/features/widgets/techStack/types/techStack';
import { useWidgetIdAndType } from '@/common/components/widgetFrame/context/WidgetContext';
import { Button } from '@/common/components/shadcn/button';

interface SelectedTechStackBoxProps {
  selectedTechStacks: TechStack[];
  setSelectedTechStacks: Dispatch<SetStateAction<TechStack[]>>;
  setIsTechStackModalOpen: (isOpen: boolean) => void;
}

function SelectedTechStackBox({
  selectedTechStacks,
  setSelectedTechStacks,
  setIsTechStackModalOpen,
}: SelectedTechStackBoxProps) {
  const { widgetId } = useWidgetIdAndType();
  const { setNodeRef, isOver } = useDroppable({
    id: `tech-stack-dropzone-${widgetId}`,
  });

  const handleRemoveTech = (techId: string) => {
    setSelectedTechStacks((prev) => prev.filter((t) => t.id !== techId));
  };

  return (
    <main
      ref={setNodeRef}
      className={cn(
        'grid min-h-30 grid-cols-4 gap-3 rounded-lg border-2 border-dashed p-2 transition-colors',
        isOver ? 'border-primary bg-primary/10' : 'bg-transparent',
      )}
    >
      {selectedTechStacks.map((tech) => (
        <SelectedTechItem
          key={tech.id}
          name={tech.name}
          onRemove={() => handleRemoveTech(tech.id)}
        />
      ))}
      <Button
        variant={'ghost'}
        className="hover:border-primary hover:bg-muted/80 border-border bg-muted text-muted-foreground flex h-25 w-25 cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed text-sm font-semibold transition-colors"
        onClick={() => setIsTechStackModalOpen(true)}
      >
        <LuPlus size={20} />
        <span>추가하기</span>
      </Button>
    </main>
  );
}

export default SelectedTechStackBox;
