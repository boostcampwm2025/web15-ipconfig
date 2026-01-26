import { TechStackModal } from '@/features/widgets/techStack/components/modal';
import { DndContext, pointerWithin } from '@dnd-kit/core';
import { useTechStack } from '@/features/widgets/techStack/hooks/techStackWidget/useTechStack';
import SelectedTechStackBox from './SelectedTechStackBox';
import SelectInput from '@/common/components/SelectInput';
import SubjectGuideline from './SubjectGuideline';
import { useSubject } from '@/features/widgets/techStack/hooks/techStackWidget/useSubject';
import type { TechStackData } from '@/common/types/widgetData';
import { useWorkspaceWidgetStore } from '@/common/store/workspace';
import { useWidgetIdAndType } from '@/common/components/widgetFrame/context/WidgetContext';
import { emitUpdateWidget } from '@/common/api/socket';
import WidgetFrame from '@/common/components/widgetFrame/WidgetFrame';
import { LuLayers } from 'react-icons/lu';

function TechStackWidget() {
  const { widgetId } = useWidgetIdAndType();
  const content = useWorkspaceWidgetStore(
    (state) =>
      state.widgetList.find((widget) => widget.widgetId === widgetId)?.content,
  );

  const { selectedSubject, setSelectedSubject, parsedSubject } = useSubject();

  const techStackContent = content as TechStackData;
  const { selectedTechStacks, isModalOpen, actions } = useTechStack({
    data: techStackContent,
    onDataChange: (nextData) => {
      emitUpdateWidget(widgetId, nextData);
    },
  });

  return (
    <WidgetFrame
      title="기술 스택"
      icon={<LuLayers className="text-blue-500" />}
    >
      <DndContext
        collisionDetection={pointerWithin}
        onDragEnd={actions.handleDragEnd}
      >
        <section className="flex w-[450px] flex-col gap-4">
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
            setSelectedTechStacks={actions.setSelectedTechStacks}
            setIsTechStackModalOpen={actions.openModal}
          />
        </section>
        {isModalOpen && (
          <TechStackModal
            isOpen={isModalOpen}
            onModalClose={actions.closeModal}
          />
        )}
      </DndContext>
    </WidgetFrame>
  );
}

export default TechStackWidget;
