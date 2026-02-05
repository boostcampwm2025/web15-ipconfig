import { useState } from 'react';
import type {
  GitConventionData,
  BranchRuleState,
  CommitConventionState,
} from '../types/gitConvention';
import { GIT_CONVENTION_PRESETS } from '../constants/presets';
import { useWidgetIdAndType } from '@/common/components/widgetFrame/context/WidgetContext';
import { useWorkspaceWidgetStore } from '@/common/store/workspace';
import { useShallow } from 'zustand/react/shallow';
import {
  updatePrimitiveFieldAction,
  updateMultiSelectorPickAction,
  updateSelectorPickAction,
  upsertOptionAction,
  removeOptionAction,
} from '@/common/api/yjs/actions/widgetContent';
import { INITIAL_GIT_CONVENTION_DATA } from '../constants/initial';

export function useGitConvention() {
  const { widgetId, type } = useWidgetIdAndType();
  const content = useWorkspaceWidgetStore(
    useShallow(
      (state) =>
        state.widgetList.find((widget) => widget.widgetId === widgetId)
          ?.content,
    ),
  );

  const data = (content as GitConventionData) || INITIAL_GIT_CONVENTION_DATA;
  const strategy = data.strategy ?? INITIAL_GIT_CONVENTION_DATA.strategy;
  const branchRules =
    data.branchRules ?? INITIAL_GIT_CONVENTION_DATA.branchRules;
  const commitConvention =
    data.commitConvention ?? INITIAL_GIT_CONVENTION_DATA.commitConvention;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pendingStrategy, setPendingStrategy] = useState<string | null>(null);

  const requestChangeStrategy = (newStrategy: string) => {
    if (newStrategy === strategy.selectedId) return;
    setPendingStrategy(newStrategy);
    setIsModalOpen(true);
  };

  const syncOptions = (
    fieldKey: string,
    newOptions: Record<string, { value: string }> | undefined,
    currentOptions: Record<string, unknown> | undefined,
  ) => {
    if (!newOptions) return;

    const curOptions = currentOptions || {};

    // 1. New Options Upsert
    Object.entries(newOptions).forEach(([key, value]) => {
      upsertOptionAction(widgetId, type, fieldKey, key, value.value);
    });

    // 2. Removed Options Delete
    Object.keys(curOptions).forEach((key) => {
      if (!newOptions[key]) {
        removeOptionAction(widgetId, type, fieldKey, key);
      }
    });
  };

  const confirmChangeStrategy = () => {
    if (pendingStrategy) {
      const preset = GIT_CONVENTION_PRESETS[pendingStrategy];
      if (preset) {
        // 1. Git 전략
        if (preset.strategy) {
          updateSelectorPickAction(
            widgetId,
            type,
            'strategy',
            preset.strategy.selectedId,
          );
        }

        // 2. 브랜치 규칙
        const rules = preset.branchRules;
        if (rules) {
          updatePrimitiveFieldAction(
            widgetId,
            type,
            'mainBranch',
            rules.mainBranch,
          );
          updatePrimitiveFieldAction(
            widgetId,
            type,
            'developBranch',
            rules.developBranch || null,
          );

          if (rules.prefixes) {
            syncOptions(
              'prefixes',
              rules.prefixes.options as Record<string, { value: string }>,
              branchRules.prefixes.options,
            );

            updateMultiSelectorPickAction(
              widgetId,
              type,
              'prefixes',
              rules.prefixes.selectedIds,
            );
          }
        }

        // 3. 커밋 타입
        const conv = preset.commitConvention;
        if (conv) {
          updatePrimitiveFieldAction(
            widgetId,
            type,
            'useGitmoji',
            conv.useGitmoji,
          );

          if (conv.commitTypes?.selectedIds) {
            syncOptions(
              'commitTypes',
              conv.commitTypes.options as Record<string, { value: string }>,
              commitConvention.commitTypes.options,
            );

            updateMultiSelectorPickAction(
              widgetId,
              type,
              'commitTypes',
              conv.commitTypes.selectedIds,
            );
          }
        }
      }
      setPendingStrategy(null);
    }
    setIsModalOpen(false);
  };

  const cancelChangeStrategy = () => {
    setPendingStrategy(null);
    setIsModalOpen(false);
  };

  const updateBranchRules = (rules: Partial<BranchRuleState>) => {
    if (rules.mainBranch !== undefined) {
      updatePrimitiveFieldAction(
        widgetId,
        type,
        'mainBranch',
        rules.mainBranch,
      );
    }
    if (rules.developBranch !== undefined) {
      updatePrimitiveFieldAction(
        widgetId,
        type,
        'developBranch',
        rules.developBranch,
      );
    }
    if (rules.prefixes?.selectedIds) {
      updateMultiSelectorPickAction(
        widgetId,
        type,
        'prefixes',
        rules.prefixes.selectedIds,
      );
    }
  };

  const updateCommitConvention = (
    convention: Partial<CommitConventionState>,
  ) => {
    if (convention.useGitmoji) {
      updatePrimitiveFieldAction(
        widgetId,
        type,
        'useGitmoji',
        convention.useGitmoji,
      );
    }
    if (convention.commitTypes?.selectedIds) {
      updateMultiSelectorPickAction(
        widgetId,
        type,
        'commitTypes',
        convention.commitTypes.selectedIds,
      );
    }
  };

  return {
    strategy,
    branchRules,
    commitConvention,
    isModalOpen,
    pendingStrategy,
    actions: {
      requestChangeStrategy,
      confirmChangeStrategy,
      cancelChangeStrategy,
      updateBranchRules,
      updateCommitConvention,
    },
  };
}
