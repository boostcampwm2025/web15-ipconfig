import { useState, useCallback, useMemo } from 'react';
import type { DragEndEvent } from '@dnd-kit/core';
import type { TechStack } from '../../types/techStack';
import type { TechStackWidgetData } from '@/common/types/widgetData';
import { useWidgetIdAndType } from '@/common/components/widgetFrame/context/WidgetContext';
import { useWorkspaceWidgetStore } from '@/common/store/workspace';
import { useShallow } from 'zustand/react/shallow';
import {
  updateArrayContentAction,
  updateSelectorPickAction,
} from '@/common/api/yjs/actions/widgetContent';
import { parseSubject } from '../../utils/parsing';
import { INITIAL_TECH_STACK_DATA } from '../../constant/initial';

export function useTechStack() {
  // 스토어 연결
  const { widgetId, type } = useWidgetIdAndType();
  const content = useWorkspaceWidgetStore(
    useShallow(
      (state) =>
        state.widgetList.find((widget) => widget.widgetId === widgetId)
          ?.content,
    ),
  );

  const techStackData = content as TechStackWidgetData;

  // 기본값 설정
  const subject = techStackData?.subject ?? INITIAL_TECH_STACK_DATA.subject;
  const techItems =
    techStackData?.techItems ?? INITIAL_TECH_STACK_DATA.techItems;

  // 업데이트 핸들러
  const handleSubjectUpdate = useCallback(
    (newSubject: string) => {
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
      const { id, name, category } = active.data.current.content as TechStack;
      if (!techItems.some((tech) => tech.id === id)) {
        const newSelectedTechStacks = [...techItems, { id, name, category }];
        handleTechItemsUpdate(newSelectedTechStacks);
      }
    }
  };

  const parsedSubject = useMemo(
    () => parseSubject(subject.selectedId),
    [subject.selectedId],
  );

  return {
    subject,
    parsedSubject,
    techItems,
    isModalOpen,
    handleSubjectUpdate,
    actions: {
      setSelectedTechStacks,
      handleDragEnd,
      openModal: () => setIsModalOpen(true),
      closeModal: () => setIsModalOpen(false),
    },
  };
}
