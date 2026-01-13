import type {
  WidgetContent,
  WidgetData,
  TechStackItem,
  TechStackContentDto,
} from '@/common/types/widgetData';
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
import { DndContext, pointerWithin } from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';

import SelectedTechStackBox from './SelectedTechStackBox';

interface TechStackWidgetProps {
  widgetId: string;
  data: WidgetData;
  emitUpdateWidget: (widgetId: string, data: WidgetContent) => void;
  emitDeleteWidget: (widgetId: string) => void;
}

function TechStackWidget({
  widgetId,
  data,
  emitUpdateWidget,
  emitDeleteWidget,
}: TechStackWidgetProps) {
  const [isTechStackModalOpen, setIsTechStackModalOpen] = useState(false);

  const selectedTechStacks = data.content
    ? (data.content as TechStackContentDto).selectedItems || []
    : [];

  const handleSetSelectedTechStacks = (
    value: React.SetStateAction<TechStackItem[]>,
  ) => {
    let newItems: TechStackItem[];
    if (typeof value === 'function') {
      newItems = value(selectedTechStacks);
    } else {
      newItems = value;
    }

    emitUpdateWidget(widgetId, {
      widgetType: 'TECH_STACK',
      selectedItems: newItems,
    } as TechStackContentDto);
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
      const { id, name, category } = active.data.current
        .content as TechStackItem;
      if (!selectedTechStacks.some((tech) => tech.id === id)) {
        const newSelectedTechStacks = [
          ...selectedTechStacks,
          { id, name, category },
        ];
        emitUpdateWidget(widgetId, {
          widgetType: 'TECH_STACK',
          selectedItems: newSelectedTechStacks,
        } as TechStackContentDto);
      }
    }
  };

  return (
    <DndContext collisionDetection={pointerWithin} onDragEnd={handleDragEnd}>
      <WidgetContainer
        id={widgetId}
        x={data.x}
        y={data.y}
        width={data.width}
        height={data.height}
        zIndex={data.zIndex}
        content={data.content as WidgetContent}
      >
        <WidgetHeader
          title="기술 스택"
          icon={<LuLayers className="text-primary" size={18} />}
          onClickDelete={() => emitDeleteWidget(widgetId)}
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
            setSelectedTechStacks={handleSetSelectedTechStacks}
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
    </DndContext>
  );
}

export default TechStackWidget;
