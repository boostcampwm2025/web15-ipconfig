export const COLLABORATION_INITIAL_CONTENT = {
  prRules: {
    activeVersion: { selectedId: 'semantic', options: {} },
    labelRules: {
      selectedIds: ['feature', 'fix', 'refactor'],
      options: {},
    },
    activeStrategy: { selectedId: 'squash', options: {} },
  },
  reviewPolicy: {
    approves: 2,
    maxReviewHours: 24,
    blockMerge: true,
  },
  workflow: {
    platform: { selectedId: '', options: {} },
    cycleValue: 2,
    cycleUnit: 'week',
  },
};
