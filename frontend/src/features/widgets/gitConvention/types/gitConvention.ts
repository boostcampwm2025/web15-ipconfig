export type GitStrategy = 'GITHUB_FLOW' | 'GIT_FLOW' | 'TRUNK_BASED';

export interface BranchRuleState {
  mainBranch: string;
  developBranch?: string;
  prefixes: string[];
}

export interface CommitConventionState {
  useGitmoji: boolean;
  commitTypes: string[];
}

export interface GitConventionData {
  strategy: GitStrategy;
  branchRules: BranchRuleState;
  commitConvention: CommitConventionState;
}

export interface GitConventionWidgetProps {
  data: GitConventionData;
  onDataChange: (data: GitConventionData) => void;
}
