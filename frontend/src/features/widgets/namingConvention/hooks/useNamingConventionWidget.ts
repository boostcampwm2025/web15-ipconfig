import { useCallback, useEffect, useRef, useState } from 'react';
import { useWidgetIdAndType } from '@/common/components/widgetFrame/context/WidgetContext';
import { useWorkspaceWidgetStore } from '@/common/store/workspace';
import { useShallow } from 'zustand/react/shallow';
import type { NamingConventionContent } from '@/common/types/yjsWidgetContent';
import { NAMING_CONVENTION_INITIAL_CONTENT } from '../constants/initial';
import { updatePrimitiveFieldAction } from '@/common/api/yjs/actions/widgetContent';

import type { Category } from '../types/category';
import type { NamingConventionData } from '../types/namingConvention';
import { isNamingContentEqual } from '../utils/isNamingContentEqual';

export default function useNamingConventionWidget(activeCategory: Category) {
  const { widgetId, type } = useWidgetIdAndType();
  const content = useWorkspaceWidgetStore(
    useShallow(
      (state) =>
        state.widgetList.find((widget) => widget.widgetId === widgetId)
          ?.content,
    ),
  );

  const namingContent = (content as NamingConventionContent) ?? {};

  // 초기 콘텐츠와 병합
  const mergedContent: NamingConventionContent = {
    frontend: {
      ...NAMING_CONVENTION_INITIAL_CONTENT.frontend,
      ...namingContent.frontend,
    },
    backend: {
      ...NAMING_CONVENTION_INITIAL_CONTENT.backend,
      ...namingContent.backend,
    },
    database: {
      ...NAMING_CONVENTION_INITIAL_CONTENT.database,
      ...namingContent.database,
    },
    common: {
      ...NAMING_CONVENTION_INITIAL_CONTENT.common,
      ...namingContent.common,
    },
  };

  const [unreadTabs, setUnreadTabs] = useState<Set<Category>>(new Set());
  const prevContentRef = useRef<NamingConventionContent>(mergedContent);
  const isFirstRender = useRef(true);

  // 다른 탭의 변경 사항 감지
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      prevContentRef.current = mergedContent;
      return;
    }

    const categories: Category[] = [
      'frontend',
      'backend',
      'database',
      'common',
    ];

    categories.forEach((cat) => {
      // 활성화된 카테고리라면 건너뛰기 (사용자가 변경 사항을 즉시 확인 가능)
      if (cat === activeCategory) return;

      const currentCatContent = mergedContent[cat] || {};
      const prevCatContent = prevContentRef.current[cat] || {};

      if (!isNamingContentEqual(currentCatContent, prevCatContent)) {
        setUnreadTabs((prev) => {
          if (prev.has(cat)) return prev;
          const newSet = new Set(prev);
          newSet.add(cat);
          return newSet;
        });
      }
    });

    prevContentRef.current = mergedContent;
  }, [mergedContent, activeCategory]);

  const clearUnread = useCallback((category: Category) => {
    setUnreadTabs((prev) => {
      const newSet = new Set(prev);
      newSet.delete(category);
      return newSet;
    });
  }, []);

  const currentConvention =
    (mergedContent[
      activeCategory
    ] as unknown as NamingConventionData[typeof activeCategory]) || {};

  const handleUpdate = useCallback(
    (section: string, key: string, value: string) => {
      const fieldKey = `${section}.${key}`;
      updatePrimitiveFieldAction(widgetId, type, fieldKey, value);
    },
    [widgetId, type],
  );

  return {
    content: mergedContent,
    currentConvention,
    handleUpdate,
    unreadTabs,
    clearUnread,
  };
}
