import { useState, useCallback, useMemo } from 'react';
import { useDndMonitor } from '@dnd-kit/core';
import type { TechStack } from '../../types/techStack';
import type { TechStackWidgetData } from '@/common/types/widgetData';
import { useWidgetIdAndType } from '@/common/components/widgetFrame/context/WidgetContext';
import { useWorkspaceWidgetStore } from '@/common/store/workspace';
import { useShallow } from 'zustand/react/shallow';
import {
  updateArrayContentAction,
  updateSelectorPickAction,
  upsertOptionAction,
} from '@/common/api/yjs/actions/widgetContent';
import { INITIAL_TECH_STACK_DATA } from '../../constant/initial';

export function useTechStack() {
  const { widgetId, type } = useWidgetIdAndType();
  const content = useWorkspaceWidgetStore(
    useShallow(
      (state) =>
        state.widgetList.find((widget) => widget.widgetId === widgetId)
          ?.content,
    ),
  );

  const techStackData = content as TechStackWidgetData;

  const subject = techStackData?.subject ?? INITIAL_TECH_STACK_DATA.subject;
  const techItems =
    techStackData?.techItems ?? INITIAL_TECH_STACK_DATA.techItems;

  const customOptions = useMemo(() => {
    if (!subject.options) return [];
    return Object.values(subject.options).map((item) => item.value);
  }, [subject.options]);

  const handleSubjectUpdate = useCallback(
    (newSubject: string) => {
      updateSelectorPickAction(widgetId, type, 'subject', newSubject);
    },
    [widgetId, type],
  );

  const handleCreateSubject = useCallback(
    (newSubject: string) => {
      upsertOptionAction(widgetId, type, 'subject', newSubject, newSubject);
      updateSelectorPickAction(widgetId, type, 'subject', newSubject);
    },
    [widgetId, type],
  );

  const handleTechItemsUpdate = useCallback(
    (newItems: TechStack[]) => {
      updateArrayContentAction(widgetId, type, 'techItems', newItems);
    },
    [widgetId, type],
  );

  const [isModalOpen, setIsModalOpen] = useState(false);

  const setSelectedTechStacks = (value: React.SetStateAction<TechStack[]>) => {
    let newItems: TechStack[];
    if (typeof value === 'function') {
      newItems = value(techItems);
    } else {
      newItems = value;
    }
    handleTechItemsUpdate(newItems);
  };

  useDndMonitor({
    onDragEnd(event) {
      const { active, over } = event;

      // 전달된 데이터가 없는 경우
      if (!active.data.current || !active.data.current?.content) {
        return;
      }
      // 'techStackWidget'을 지원하는 아이템인지 확인 (특정 ID가 아닌 타입으로 체크)
      if (!active.data.current.support.includes('techStackWidget')) return;

      // 내 위젯의 드롭존에 드롭되었는지 확인
      if (over && over.id === `tech-stack-dropzone-${widgetId}`) {
        const { id, name, category, slug, color } = active.data.current
          .content as TechStack;

        // 중복 체크
        if (!techItems.some((tech) => tech.id === id)) {
          const newSelectedTechStacks = [
            ...techItems,
            { id, name, category, slug, color },
          ];
          handleTechItemsUpdate(newSelectedTechStacks);
        }
      }
    },
  });

  return {
    subject,
    techItems,
    isModalOpen,
    customOptions,
    handleSubjectUpdate,
    handleCreateSubject,
    actions: {
      setSelectedTechStacks,
      openModal: () => setIsModalOpen(true),
      closeModal: () => setIsModalOpen(false),
    },
  };
}
