import type { WidgetData } from '@/common/types/widgetData';
import WidgetContainer from '@/common/components/widget/WidgetContainer';
import WidgetHeader from '@/common/components/widget/WidgetHeader';
import { LuLayers } from 'react-icons/lu';

import { useState } from 'react';
import { TechStackModal } from '@/features/widgets/techStack/components/modal';
import { DndContext, pointerWithin } from '@dnd-kit/core';

import SelectedTechStackBox from './SelectedTechStackBox';
import SelectInput from '@/common/components/SelectInput';

import SubjectGuideline from './SubjectGuideline';
import { useSelectedTechStacks } from '@/features/widgets/techStack/hooks/techStackWidget/useSelectedTechStacks';
import { useSubject } from '@/features/widgets/techStack/hooks/techStackWidget/useSubject';

function TechStackWidget({ id, position, width, height }: WidgetData) {
  const [isTechStackModalOpen, setIsTechStackModalOpen] = useState(false);
  const { selectedTechStacks, setSelectedTechStacks, handleDragEnd } =
    useSelectedTechStacks();
  const { selectedSubject, setSelectedSubject, parsedSubject } = useSubject();

  return (
    <DndContext collisionDetection={pointerWithin} onDragEnd={handleDragEnd}>
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
          <div className="flex items-center gap-2 font-bold">
            <div className="shrink-0">주제 :</div>
            <SelectInput
              selectedValue={selectedSubject}
              setSelectedValue={setSelectedSubject}
            />
          </div>

          {parsedSubject && (
            <SubjectGuideline
              key={`${parsedSubject.category}-${parsedSubject.option}`}
              category={parsedSubject.category}
              option={parsedSubject.option}
            />
          )}

          <SelectedTechStackBox
            selectedTechStacks={selectedTechStacks}
            setSelectedTechStacks={setSelectedTechStacks}
            setIsTechStackModalOpen={setIsTechStackModalOpen}
          />
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
