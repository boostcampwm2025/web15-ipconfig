import { useCallback } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { useWidgetIdAndType } from '@/common/components/widgetFrame/context/WidgetContext';
import { useWorkspaceWidgetStore } from '@/common/store/workspace';
import { updatePrimitiveFieldAction } from '@/common/api/yjs/actions/widgetContent';
import type { FormatContent } from '@/common/types/yjsWidgetContent';
import { INITIAL_FORMAT_DATA } from '../constants/initial';
import type { PrettierConfig } from '../types/format';
import { doc } from '@/common/api/yjs/instance';

export function useFormatWidget() {
  const { widgetId, type } = useWidgetIdAndType();
  const content = useWorkspaceWidgetStore(
    useShallow(
      (state) =>
        state.widgetList.find((widget) => widget.widgetId === widgetId)
          ?.content,
    ),
  );

  const config = (content as unknown as FormatContent) || INITIAL_FORMAT_DATA;

  const updateConfig = useCallback(
    (key: keyof PrettierConfig, value: string | number | boolean) => {
      updatePrimitiveFieldAction(widgetId, type, key, value);
    },
    [widgetId, type],
  );

  const resetConfig = useCallback(
    (newConfig: PrettierConfig) => {
      doc.transact(() => {
        Object.entries(newConfig).forEach(([key, value]) => {
          updatePrimitiveFieldAction(
            widgetId,
            type,
            key as keyof PrettierConfig,
            value as string | number | boolean,
          );
        });
      });
    },
    [widgetId, type],
  );

  return {
    widgetId,
    config,
    updateConfig,
    resetConfig,
  };
}
