import type { MultiSelector, Selector } from '@/common/types/yjsDoc';

export interface CollaborationData {
  prRules: {
    activeVersion: Selector;
    activeStrategy: Selector;
    labelRules: MultiSelector;
  };
  reviewPolicy: {
    approves: number;
    maxReviewHours: number;
    blockMerge: boolean;
  };
  workflow: {
    platform: Selector;
    cycleValue: number;
    cycleUnit: string;
  };
}
