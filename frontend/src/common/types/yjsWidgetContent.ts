import type { MultiSelector, Selector } from './yjsDoc';

// Union Content Type
export type WidgetContent =
  | TechStackContent
  | GitConventionContent
  | CommunicationContent
  | CollaborationContent
  | PostItContent
  | Record<string, unknown>;

// 이 밑에서부터는 위젯별 컨텐츠 타입이라 각 위젯 연결할때 세분화하면 좋을 것 같습니다.

// 1. TECH_STACK
export interface TechStackContent {
  subject: Selector;
  techItems: Array<{
    id: string;
    name: string;
    category: string;
  }>;
}

// 2. GIT_CONVENTION
export interface GitConventionContent {
  strategy: Selector;
  branchRules: {
    mainBranch: string;
    developBranch?: string;
    prefixes: MultiSelector;
  };
  commitConvention: {
    useGitmoji: boolean;
    commitTypes: MultiSelector;
  };
}

// 3. COMMUNICATION
export interface CommunicationContent {
  strategy: Selector;
  branchRules: {
    mainBranch: string;
    developBranch?: string;
    prefixes: MultiSelector;
  };
  commitConvention: {
    useGitmoji: boolean;
    commitTypes: MultiSelector;
  };
}

// 4. GROUNDRULE_COLLABORATION
export interface CollaborationContent {
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

// 5. POST_IT (Example placeholder)
export interface PostItContent {
  text: string;
  color: string;
}
