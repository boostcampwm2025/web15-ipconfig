import { TechStackModal } from '@/features/widgets/techStack/components/modal';

import { useTechStack } from '@/features/widgets/techStack/hooks/techStackWidget/useTechStack';

import SelectedTechStackBox from './SelectedTechStackBox';
import SelectInput from '@/common/components/SelectInput';
import SubjectGuideline from './SubjectGuideline';

import WidgetFrame from '@/common/components/widgetFrame/WidgetFrame';
import { LuLayers } from 'react-icons/lu';
function TechStackWidget() {
  const {
    subject,
    parsedSubject,
    techItems,
    isModalOpen,
    customOptions,
    handleSubjectUpdate,
    handleCreateSubject,
    actions,
  } = useTechStack();

  return (
    <WidgetFrame
      title="기술 스택"
      icon={<LuLayers className="text-blue-500" />}
    >
      <section className="flex w-[450px] flex-col gap-4">
        <div className="flex items-center gap-2 font-bold">
          <div className="w-10 shrink-0">주제 :</div>
          <div className="flex-1">
            <SelectInput
              selectedValue={subject.selectedId}
              setSelectedValue={handleSubjectUpdate}
              customOptions={customOptions}
              onCreateOption={handleCreateSubject}
            />
          </div>
        </div>

        {parsedSubject && (
          <SubjectGuideline
            key={`${parsedSubject.category}-${parsedSubject.option}`}
            category={parsedSubject.category}
            option={parsedSubject.option}
          />
        )}

        <SelectedTechStackBox
          selectedTechStacks={techItems}
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
    </WidgetFrame>
  );
}

export default TechStackWidget;
