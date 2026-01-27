import { useCallback } from 'react';
import { useWidgetIdAndType } from '@/common/components/widgetFrame/context/WidgetContext';
import { useWorkspaceWidgetStore } from '@/common/store/workspace';
import { useShallow } from 'zustand/react/shallow';
import type { CollaborationData } from '../types/CollaborationData';
import {
  updateMultiSelectorPickAction,
  updatePrimitiveFieldAction,
  updateSelectorPickAction,
} from '@/common/api/yjs/actions/widgetContent';

export default function useCollaborationWidget() {
  const { widgetId, type } = useWidgetIdAndType();
  const content = useWorkspaceWidgetStore(
    useShallow(
      (state) =>
        state.widgetList.find((widget) => widget.widgetId === widgetId)
          ?.content,
    ),
  );

  const collaborationData = content as CollaborationData;

  const prRules = collaborationData?.prRules ?? {
    activeVersion: { selectedId: 'semantic', options: {} },
    labelRules: {
      selectedIds: ['feature', 'fix', 'refactor'],
      options: {},
    },
    activeStrategy: { selectedId: 'squash', options: {} },
  };

  const reviewPolicy = collaborationData?.reviewPolicy ?? {
    approves: 2,
    maxReviewHours: 24,
    blockMerge: true,
  };

  const workflow = collaborationData?.workflow ?? {
    platform: { selectedId: '', options: {} },
    cycleValue: 2,
    cycleUnit: 'week',
  };

  const handlePRRulesUpdate = useCallback(
    (key: keyof CollaborationData['prRules'], value: string | string[]) => {
      if (key === 'labelRules') {
        updateMultiSelectorPickAction(widgetId, type, key, value as string[]);
      } else {
        updateSelectorPickAction(widgetId, type, key, value as string);
      }
    },
    [widgetId, type],
  );

  const handleReviewPolicyUpdate = useCallback(
    (key: keyof CollaborationData['reviewPolicy'], value: number | boolean) => {
      updatePrimitiveFieldAction(widgetId, type, key, value);
    },
    [widgetId, type],
  );

  const handleWorkflowUpdate = useCallback(
    (key: keyof CollaborationData['workflow'], value: string | number) => {
      if (key === 'platform') {
        updateSelectorPickAction(widgetId, type, key, value as string);
      } else {
        updatePrimitiveFieldAction(
          widgetId,
          type,
          key,
          value as string | number,
        );
      }
    },
    [widgetId, type],
  );

  return {
    prRules,
    reviewPolicy,
    workflow,
    handlePRRulesUpdate,
    handleReviewPolicyUpdate,
    handleWorkflowUpdate,
  };
}
