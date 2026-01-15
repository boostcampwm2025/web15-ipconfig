import type {
  WidgetContent,
  WidgetData,
  TechStackContentDto,
  MoveWidgetData,
} from '@/common/types/widgetData';
import WidgetShell from '@/common/components/widget/WidgetShell';
import { LuLayers } from 'react-icons/lu';
import { TechStackModal } from '@/features/widgets/techStack/components/modal';
import { DndContext, pointerWithin } from '@dnd-kit/core';
import { useTechStack } from '@/features/widgets/techStack/hooks/useTechStack';
import SelectedTechStackBox from './SelectedTechStackBox';
import SelectInput from '@/common/components/SelectInput';
import SubjectGuideline from './SubjectGuideline';
import { useSubject } from '@/features/widgets/techStack/hooks/techStackWidget/useSubject';

interface TechStackWidgetProps {
  widgetId: string;
  data: WidgetData;
  emitUpdateWidget: (widgetId: string, data: WidgetContent) => void;
  emitDeleteWidget: (widgetId: string) => void;
  emitMoveWidget: (widgetId: string, data: MoveWidgetData) => void;
}

function TechStackWidget({
  widgetId,
  data,
  emitUpdateWidget,
  emitDeleteWidget,
  emitMoveWidget,
}: TechStackWidgetProps) {
  const techStackContent = data.content as TechStackContentDto;

  const { selectedTechStacks, isModalOpen, actions } = useTechStack({
    data: techStackContent,
    onDataChange: (nextData) => {
      emitUpdateWidget(widgetId, nextData);
    },
  });
  const { selectedSubject, setSelectedSubject, parsedSubject } = useSubject();

  return (
    <DndContext
      collisionDetection={pointerWithin}
      onDragEnd={actions.handleDragEnd}
    >
      <WidgetShell
        widgetId={widgetId}
        data={data}
        title="기술 스택"
        icon={<LuLayers className="text-primary" size={18} />}
        emitDeleteWidget={emitDeleteWidget}
        emitMoveWidget={emitMoveWidget}
      >
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
      </WidgetShell>
    </DndContext>
  );
}

export default TechStackWidget;
