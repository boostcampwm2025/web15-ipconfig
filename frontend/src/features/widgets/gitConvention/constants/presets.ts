import type { GitConventionData } from '../types/gitConvention';
import type { OptionItem } from '@/common/types/yjsDoc';

const createOptions = (items: readonly string[]) => {
  return items.reduce(
    (acc, item) => {
      acc[item] = { value: item, createdAt: Date.now() };
      return acc;
    },
    {} as Record<string, OptionItem>,
  );
};

export const STRATEGY_OPTIONS = [
  { value: 'GITHUB_FLOW', label: 'GitHub Flow' },
  { value: 'GIT_FLOW', label: 'Git Flow' },
  { value: 'TRUNK_BASED', label: 'Trunk-based' },
] as const;

const STRATEGY_OPTS = STRATEGY_OPTIONS.map((opt) => opt.value);

// Common extended options from initial data
const EXTENDED_PREFIX_OPTIONS = [
  'feature',
  'fix',
  'refactor',
  'chore',
  'docs',
  'test',
  'style',
  'perf',
  'ci',
  'build',
  'revert',
  'release',
  'hotfix',
  'bugfix',
] as const;

const EXTENDED_COMMIT_TYPE_OPTIONS = [
  'feat',
  'fix',
  'chore',
  'refactor',
  'docs',
  'style',
  'test',
  'perf',
  'ci',
  'build',
  'revert',
] as const;

export const GIT_CONVENTION_PRESETS: Record<string, GitConventionData> = {
  GITHUB_FLOW: {
    strategy: {
      selectedId: 'GITHUB_FLOW',
      options: createOptions(STRATEGY_OPTS),
    },
    branchRules: {
      mainBranch: 'main',
      developBranch: null,
      prefixes: {
        selectedIds: ['feature', 'fix', 'refactor'],
        options: createOptions(EXTENDED_PREFIX_OPTIONS),
      },
    },
    commitConvention: {
      useGitmoji: false,
      commitTypes: {
        selectedIds: ['feat', 'fix', 'refactor', 'chore', 'docs', 'test'],
        options: createOptions(EXTENDED_COMMIT_TYPE_OPTIONS),
      },
    },
  },
  GIT_FLOW: {
    strategy: {
      selectedId: 'GIT_FLOW',
      options: createOptions(STRATEGY_OPTS),
    },
    branchRules: {
      mainBranch: 'main',
      developBranch: 'develop',
      prefixes: {
        selectedIds: ['feature', 'release', 'hotfix', 'bugfix'],
        options: createOptions(['feature', 'release', 'hotfix', 'bugfix']),
      },
    },
    commitConvention: {
      useGitmoji: false,
      commitTypes: {
        selectedIds: ['feat', 'fix', 'refactor', 'chore', 'docs', 'test'],
        options: createOptions([
          'feat',
          'fix',
          'refactor',
          'chore',
          'docs',
          'test',
        ]),
      },
    },
  },
  TRUNK_BASED: {
    strategy: {
      selectedId: 'TRUNK_BASED',
      options: createOptions(STRATEGY_OPTS),
    },
    branchRules: {
      mainBranch: 'trunk',
      developBranch: null,
      prefixes: {
        selectedIds: ['chore', 'fix'],
        options: createOptions(['chore', 'fix']),
      },
    },
    commitConvention: {
      useGitmoji: false,
      commitTypes: {
        selectedIds: ['feat', 'fix', 'chore'],
        options: createOptions(['feat', 'fix', 'chore']),
      },
    },
  },
};
