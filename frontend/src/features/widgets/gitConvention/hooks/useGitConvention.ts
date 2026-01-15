import { useState } from 'react';
import type {
  GitConventionData,
  GitStrategy,
  BranchRuleState,
  CommitConventionState,
} from '../types/gitConvention';
import { GIT_CONVENTION_PRESETS } from '../constants/presets';

interface UseGitConventionProps {
  data: GitConventionData;
  onDataChange: (data: GitConventionData) => void;
}

export function useGitConvention({
  data,
  onDataChange,
}: UseGitConventionProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pendingStrategy, setPendingStrategy] = useState<GitStrategy | null>(
    null,
  );

  const requestChangeStrategy = (newStrategy: GitStrategy) => {
    if (newStrategy === data.strategy) return;
    setPendingStrategy(newStrategy);
    setIsModalOpen(true);
  };

  const confirmChangeStrategy = () => {
    if (pendingStrategy) {
      onDataChange(GIT_CONVENTION_PRESETS[pendingStrategy]);
      setPendingStrategy(null);
    }
    setIsModalOpen(false);
  };

  const cancelChangeStrategy = () => {
    setPendingStrategy(null);
    setIsModalOpen(false);
  };

  const updateBranchRules = (rules: Partial<BranchRuleState>) => {
    onDataChange({
      ...data,
      branchRules: { ...data.branchRules, ...rules },
    });
  };

  const updateCommitConvention = (
    convention: Partial<CommitConventionState>,
  ) => {
    onDataChange({
      ...data,
      commitConvention: { ...data.commitConvention, ...convention },
    });
  };

  return {
    strategy: data.strategy,
    branchRules: data.branchRules,
    commitConvention: data.commitConvention,
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
