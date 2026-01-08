import type { WidgetData } from '@/common/types/widgetData';
import WidgetContainer from '@/common/components/widget/WidgetContainer';
import WidgetHeader from '@/common/components/widget/WidgetHeader';
import { LuLayers } from 'react-icons/lu';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/common/components/shadcn/select';
import { useState } from 'react';
import { Button } from '@/common/components/shadcn/button';
import { SUBJECT_GROUPS } from '@/common/mocks/techStacks';
import { TechStackModal } from '@/features/widgets/techStack/components/modal';
import { DndContext, DragOverlay, pointerWithin } from '@dnd-kit/core';
import type {
  DragEndEvent,
  DragStartEvent,
  UniqueIdentifier,
} from '@dnd-kit/core';

import TechStackItem from '@/features/widgets/techStack/components/TechStackItem';
import SelectedTechStackBox from './SelectedTechStackBox';

function TechStackWidget({ id, position, width, height }: WidgetData) {
  const [isTechStackModalOpen, setIsTechStackModalOpen] = useState(false);
  const [selectedTechStacks, setSelectedTechStacks] = useState<string[]>([]);
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    // 드롭 영역 위에 드롭되었는지 확인
    if (over && over.id === 'techStackWidget') {
      const techName = active.data.current?.techName as string;
      if (techName && !selectedTechStacks.includes(techName)) {
        setSelectedTechStacks((prev) => [...prev, techName]);
      }
    }

    setActiveId(null);
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id);
  };

  return (
    <DndContext
      collisionDetection={pointerWithin}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <WidgetContainer
        id={id}
        position={position}
        type="tech"
        content="Tech Stack"
        width={width}
        height={height}
      >
        <WidgetHeader
          title="기술 스택"
          icon={<LuLayers className="text-primary" size={18} />}
        />
        <section className="flex flex-col gap-4">
          <Select>
            <div className="flex items-center gap-2 font-bold">
              <div className="shrink-0">주제 :</div>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="논의할 주제를 선택해주세요." />
              </SelectTrigger>
            </div>

            <SelectContent>
              {SUBJECT_GROUPS.map((group) => (
                <SelectGroup key={group.category}>
                  <SelectLabel>{group.category}</SelectLabel>
                  {group.subjects.map((subject) => (
                    <SelectItem key={subject.value} value={subject.value}>
                      {subject.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              ))}
            </SelectContent>
          </Select>

          <SelectedTechStackBox
            selectedTechStacks={selectedTechStacks}
            setSelectedTechStacks={setSelectedTechStacks}
            setIsTechStackModalOpen={setIsTechStackModalOpen}
          />

          <footer className="flex items-center justify-end gap-2 font-bold">
            <Button variant="secondary">투표</Button>
            <Button>확정</Button>
          </footer>
        </section>
        {isTechStackModalOpen && (
          <TechStackModal
            isOpen={isTechStackModalOpen}
            onModalClose={() => setIsTechStackModalOpen(false)}
          />
        )}
      </WidgetContainer>
      <DragOverlay>
        {activeId ? <TechStackItem techName={String(activeId)} /> : null}
      </DragOverlay>
    </DndContext>
  );
}

export default TechStackWidget;
