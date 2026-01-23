import { TechStackModal } from '@/features/widgets/techStack/components/modal';
import { DndContext, pointerWithin } from '@dnd-kit/core';
import { useTechStackYjs } from '@/features/widgets/techStack/hooks/techStackWidget/useTechStackYjs';
import SelectedTechStackBox from './SelectedTechStackBox';
import SelectInput from '@/common/components/SelectInput';
import SubjectGuideline from './SubjectGuideline';
import { useSubjectYjs } from '@/features/widgets/techStack/hooks/techStackWidget/useSubjectYjs';
import { useWidgetIdAndType } from '@/common/components/widgetFrame/context/WidgetContext';

function TechStackWidget() {
  const { widgetId } = useWidgetIdAndType();

  const { selectedSubject, setSelectedSubject, parsedSubject } =
    useSubjectYjs(widgetId);

  const { selectedTechStacks, isModalOpen, actions } = useTechStackYjs({
    widgetId,
  });

  return (
    <DndContext
      collisionDetection={pointerWithin}
      onDragEnd={actions.handleDragEnd}
    >
      <section className="flex h-full w-[500px] flex-col gap-4 p-1">
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
  );
}

export default TechStackWidget;
