import { useMemo, useCallback } from 'react';
import { useYjsWidgetContent } from '@/common/api/yjs/hooks/useYjsWidgetContent';
import {
  updatePrimitiveFieldAction,
  updateSelectorPickAction,
  updateMultiSelectorPickAction,
} from '@/common/api/yjs/actions/widgetContent';
import type { CollaborationData } from '../components/CollaborationWidget';
import type { CollaborationContent } from '@/common/types/yjsWidgetContent';

interface UseCollaborationYjsProps {
  widgetId: string;
}

// Platform Value -> Key 매핑 (역방향 매핑용)
const PLATFORM_KEY_MAP: Record<string, string> = {
  'GitHub Projects': 'github',
  Jira: 'jira',
  Notion: 'notion',
  Linear: 'linear',
};

/**
 * Yjs 기반 Collaboration 위젯 훅
 */
export function useCollaborationYjs({ widgetId }: UseCollaborationYjsProps) {
  const content = useYjsWidgetContent<CollaborationContent>(widgetId);

  // PR Rules - Yjs Selector/MultiSelector → 단순 타입 변환
  const prRules = useMemo<CollaborationData['prRules']>(() => {
    const versionSelector = content?.prRules?.activeVersion;
    const strategySelector = content?.prRules?.activeStrategy;
    const labelSelector = content?.prRules?.labelRules;

    return {
      activeVersion: versionSelector?.selectedId ?? '',
      activeStrategy: strategySelector?.selectedId ?? '',
      selectedLabels: labelSelector?.selectedIds ?? [],
    };
  }, [content?.prRules]);

  // Review Policy - 그대로 전달
  const reviewPolicy = useMemo<CollaborationData['reviewPolicy']>(() => {
    return {
      approves: content?.reviewPolicy?.approves ?? 1,
      maxReviewHours: content?.reviewPolicy?.maxReviewHours ?? 24,
      blockMerge: content?.reviewPolicy?.blockMerge ?? true,
    };
  }, [content?.reviewPolicy]);

  // Workflow - Yjs Selector → 단순 string 변환
  // UI는 'GitHub Projects' 같은 Value를 기대하므로 options에서 value를 찾아 반환
  const workflow = useMemo<CollaborationData['workflow']>(() => {
    const platformSelector = content?.workflow?.platform;
    const selectedId = platformSelector?.selectedId;
    let platformValue = '';

    if (selectedId && platformSelector?.options?.[selectedId]) {
      platformValue = platformSelector.options[selectedId].value;
    }

    return {
      platform: platformValue,
      cycleValue: content?.workflow?.cycleValue ?? 2,
      cycleUnit: content?.workflow?.cycleUnit ?? '주',
    };
  }, [content?.workflow]);

  // PR Rules 업데이트
  const updatePRRules = useCallback(
    (key: keyof CollaborationData['prRules'], value: string | string[]) => {
      if (key === 'activeVersion') {
        updateSelectorPickAction(
          widgetId,
          'COLLABORATION',
          'activeVersion',
          value as string,
        );
      } else if (key === 'activeStrategy') {
        updateSelectorPickAction(
          widgetId,
          'COLLABORATION',
          'activeStrategy',
          value as string,
        );
      } else if (key === 'selectedLabels') {
        updateMultiSelectorPickAction(
          widgetId,
          'COLLABORATION',
          'labelRules',
          value as string[],
        );
      }
    },
    [widgetId],
  );

  // Review Policy 업데이트
  const updateReviewPolicy = useCallback(
    (key: keyof CollaborationData['reviewPolicy'], value: number | boolean) => {
      if (key === 'approves') {
        updatePrimitiveFieldAction(
          widgetId,
          'COLLABORATION',
          'approves',
          value as number,
        );
      } else if (key === 'maxReviewHours') {
        updatePrimitiveFieldAction(
          widgetId,
          'COLLABORATION',
          'maxReviewHours',
          value as number,
        );
      } else if (key === 'blockMerge') {
        updatePrimitiveFieldAction(
          widgetId,
          'COLLABORATION',
          'blockMerge',
          value as boolean,
        );
      }
    },
    [widgetId],
  );

  // Workflow 업데이트
  const updateWorkflow = useCallback(
    (key: keyof CollaborationData['workflow'], value: string | number) => {
      if (key === 'platform') {
        // Value ('GitHub Projects') -> Key ('github') 변환
        const platformKey = PLATFORM_KEY_MAP[value as string];
        if (platformKey) {
          updateSelectorPickAction(
            widgetId,
            'COLLABORATION',
            'platform',
            platformKey,
          );
        }
      } else if (key === 'cycleValue') {
        updatePrimitiveFieldAction(
          widgetId,
          'COLLABORATION',
          'cycleValue',
          value as number,
        );
      } else if (key === 'cycleUnit') {
        updatePrimitiveFieldAction(
          widgetId,
          'COLLABORATION',
          'cycleUnit',
          value as string,
        );
      }
    },
    [widgetId],
  );

  return {
    prRules,
    reviewPolicy,
    workflow,
    actions: {
      updatePRRules,
      updateReviewPolicy,
      updateWorkflow,
    },
  };
}
