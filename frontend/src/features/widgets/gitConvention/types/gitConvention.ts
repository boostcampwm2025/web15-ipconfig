import type { Selector, MultiSelector } from '@/common/types/yjsDoc';

export type GitStrategy = 'GITHUB_FLOW' | 'GIT_FLOW' | 'TRUNK_BASED';

export interface BranchRuleState {
  mainBranch: string;
  developBranch?: string;
  prefixes: MultiSelector;
}

export interface CommitConventionState {
  useGitmoji: boolean;
  commitTypes: MultiSelector;
}

export interface GitConventionData {
  strategy: Selector;
  branchRules: BranchRuleState;
  commitConvention: CommitConventionState;
}

export interface GitConventionWidgetProps {
  widgetId: string;
  data: GitConventionData;
  onDataChange: (data: GitConventionData) => void;
}
