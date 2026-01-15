import type { GitConventionData } from '../types/gitConvention';

export const STRATEGY_OPTIONS = [
  { value: 'GITHUB_FLOW', label: 'GitHub Flow' },
  { value: 'GIT_FLOW', label: 'Git Flow' },
  { value: 'TRUNK_BASED', label: 'Trunk-based' },
] as const;

export const GIT_CONVENTION_PRESETS: Record<string, GitConventionData> = {
  GITHUB_FLOW: {
    strategy: 'GITHUB_FLOW',
    branchRules: {
      mainBranch: 'main',
      prefixes: ['feature', 'fix', 'refactor'],
    },
    commitConvention: {
      useGitmoji: false,
      commitTypes: ['feat', 'fix', 'refactor', 'chore', 'docs', 'test'],
    },
  },
  GIT_FLOW: {
    strategy: 'GIT_FLOW',
    branchRules: {
      mainBranch: 'main',
      developBranch: 'develop',
      prefixes: ['feature', 'release', 'hotfix', 'bugfix'],
    },
    commitConvention: {
      useGitmoji: false,
      commitTypes: ['feat', 'fix', 'refactor', 'chore', 'docs', 'test'],
    },
  },
  TRUNK_BASED: {
    strategy: 'TRUNK_BASED',
    branchRules: {
      mainBranch: 'trunk',
      prefixes: ['chore', 'fix'],
    },
    commitConvention: {
      useGitmoji: false,
      commitTypes: ['feat', 'fix', 'chore'],
    },
  },
};
