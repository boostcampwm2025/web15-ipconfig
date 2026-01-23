import { useState, useCallback, useMemo } from 'react';
import { useYjsWidgetContent } from '@/common/api/yjs/hooks/useYjsWidgetContent';
import {
  updatePrimitiveFieldAction,
  updateSelectorPickAction,
  updateMultiSelectorPickAction,
} from '@/common/api/yjs/actions/widgetContent';
import type { GitConventionContent } from '@/common/types/yjsWidgetContent';
import type {
  GitStrategy,
  BranchRuleState,
  CommitConventionState,
} from '../types/gitConvention';
import { GIT_CONVENTION_PRESETS } from '../constants/presets';

interface UseGitConventionYjsProps {
  widgetId: string;
}

/**
 * Yjs 기반 Git Convention 위젯 훅
 * Selector/MultiSelector 구조를 기존 string/string[] 인터페이스로 브릿지
 */
export function useGitConventionYjs({ widgetId }: UseGitConventionYjsProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pendingStrategy, setPendingStrategy] = useState<GitStrategy | null>(
    null,
  );

  const content = useYjsWidgetContent<GitConventionContent>(widgetId);

  // Yjs Selector → 단순 string 변환
  const strategy = useMemo<GitStrategy>(
    () => (content?.strategy?.selectedId as GitStrategy) || 'GITHUB_FLOW',
    [content?.strategy?.selectedId],
  );

  // Yjs MultiSelector → string[] 변환
  const branchRules = useMemo<BranchRuleState>(() => {
    const prefixSelector = content?.branchRules?.prefixes;
    return {
      mainBranch: content?.branchRules?.mainBranch ?? 'main',
      developBranch: content?.branchRules?.developBranch ?? '',
      prefixes: prefixSelector?.selectedIds ?? [],
    };
  }, [content?.branchRules]);

  const commitConvention = useMemo<CommitConventionState>(() => {
    const commitTypesSelector = content?.commitConvention?.commitTypes;
    return {
      useGitmoji: content?.commitConvention?.useGitmoji ?? false,
      commitTypes: commitTypesSelector?.selectedIds ?? [],
    };
  }, [content?.commitConvention]);

  const requestChangeStrategy = useCallback(
    (newStrategy: GitStrategy) => {
      if (newStrategy === strategy) return;
      setPendingStrategy(newStrategy);
      setIsModalOpen(true);
    },
    [strategy],
  );

  const confirmChangeStrategy = useCallback(() => {
    if (pendingStrategy) {
      const preset = GIT_CONVENTION_PRESETS[pendingStrategy];
      // Strategy 변경
      updateSelectorPickAction(
        widgetId,
        'GIT_CONVENTION',
        'strategy',
        pendingStrategy,
      );
      // Branch Rules 변경
      updatePrimitiveFieldAction(
        widgetId,
        'GIT_CONVENTION',
        'mainBranch',
        preset.branchRules.mainBranch,
      );
      updatePrimitiveFieldAction(
        widgetId,
        'GIT_CONVENTION',
        'developBranch',
        preset.branchRules.developBranch ?? '',
      );
      updateMultiSelectorPickAction(
        widgetId,
        'GIT_CONVENTION',
        'prefixes',
        preset.branchRules.prefixes,
      );
      // Commit Convention 변경
      updatePrimitiveFieldAction(
        widgetId,
        'GIT_CONVENTION',
        'useGitmoji',
        preset.commitConvention.useGitmoji,
      );
      updateMultiSelectorPickAction(
        widgetId,
        'GIT_CONVENTION',
        'commitTypes',
        preset.commitConvention.commitTypes,
      );

      setPendingStrategy(null);
    }
    setIsModalOpen(false);
  }, [widgetId, pendingStrategy]);

  const cancelChangeStrategy = useCallback(() => {
    setPendingStrategy(null);
    setIsModalOpen(false);
  }, []);

  const updateBranchRules = useCallback(
    (rules: Partial<BranchRuleState>) => {
      if (rules.mainBranch !== undefined) {
        updatePrimitiveFieldAction(
          widgetId,
          'GIT_CONVENTION',
          'mainBranch',
          rules.mainBranch,
        );
      }
      if (rules.developBranch !== undefined) {
        updatePrimitiveFieldAction(
          widgetId,
          'GIT_CONVENTION',
          'developBranch',
          rules.developBranch,
        );
      }
      if (rules.prefixes !== undefined) {
        updateMultiSelectorPickAction(
          widgetId,
          'GIT_CONVENTION',
          'prefixes',
          rules.prefixes,
        );
      }
    },
    [widgetId],
  );

  const updateCommitConvention = useCallback(
    (convention: Partial<CommitConventionState>) => {
      if (convention.useGitmoji !== undefined) {
        updatePrimitiveFieldAction(
          widgetId,
          'GIT_CONVENTION',
          'useGitmoji',
          convention.useGitmoji,
        );
      }
      if (convention.commitTypes !== undefined) {
        updateMultiSelectorPickAction(
          widgetId,
          'GIT_CONVENTION',
          'commitTypes',
          convention.commitTypes,
        );
      }
    },
    [widgetId],
  );

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
