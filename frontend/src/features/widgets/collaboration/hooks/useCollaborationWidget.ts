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

import { COLLABORATION_INITIAL_CONTENT } from '../constants/initial';

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

  const prRules =
    collaborationData?.prRules ?? COLLABORATION_INITIAL_CONTENT.prRules;

  const reviewPolicy =
    collaborationData?.reviewPolicy ??
    COLLABORATION_INITIAL_CONTENT.reviewPolicy;

  const workflow =
    collaborationData?.workflow ?? COLLABORATION_INITIAL_CONTENT.workflow;

  const handlePRRulesUpdate = useCallback(
    (key: keyof CollaborationData['prRules'], value: string | string[]) => {
      // Type Guard를 통한 안전한 업데이트 요청
      if (key === 'labelRules' && Array.isArray(value)) {
        updateMultiSelectorPickAction(widgetId, type, key, value);
      } else if (key !== 'labelRules' && typeof value === 'string') {
        updateSelectorPickAction(widgetId, type, key, value);
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
        updateSelectorPickAction(widgetId, type, key, String(value));
      } else {
        updatePrimitiveFieldAction(widgetId, type, key, value);
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
