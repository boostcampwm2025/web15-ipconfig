import { useCallback } from 'react';
import { useWidgetIdAndType } from '@/common/components/widgetFrame/context/WidgetContext';
import { useWorkspaceWidgetStore } from '@/common/store/workspace';
import { useShallow } from 'zustand/react/shallow';
import type { NamingConventionContent } from '@/common/types/yjsWidgetContent';
import { NAMING_CONVENTION_INITIAL_CONTENT } from '../constants/initial';
import { updatePrimitiveFieldAction } from '@/common/api/yjs/actions/widgetContent';

import type { Category } from '../types/category';
import type { NamingConventionData } from '../types/namingConvention';

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

  // Merge with initial content to ensure all fields exist
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

  const currentConvention =
    (mergedContent[
      activeCategory
    ] as unknown as NamingConventionData[typeof activeCategory]) || {};

  const handleUpdate = useCallback(
    (section: string, key: string, value: string) => {
      // fieldKey format: "frontend.variable"
      const fieldKey = `${section}.${key}`;
      updatePrimitiveFieldAction(widgetId, type, fieldKey, value);
    },
    [widgetId, type],
  );

  return {
    content: mergedContent,
    currentConvention,
    handleUpdate,
  };
}
