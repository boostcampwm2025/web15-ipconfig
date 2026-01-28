export type YjsWidgetType =
  | 'TECH_STACK'
  | 'POST_IT'
  | 'GIT_CONVENTION'
  | 'COLLABORATION'
  | 'COMMUNICATION'
  | 'NAMING_CONVENTION'
  | 'FORMAT';

// Selector 공통 타입
export interface YjsOptionItem {
  value: string;
  createdAt: number;
}

export interface YjsSelector {
  selectedId: string;
  options: Record<string, YjsOptionItem>;
}

export interface YjsMultiSelector {
  selectedIds: string[];
  options: Record<string, YjsOptionItem>;
}

// Widget Layout
export interface YjsWidgetLayout {
  x: number;
  y: number;
  width: number;
  height: number;
}

// Base Widget Data
export interface YjsWidgetData {
  widgetId: string;
  type: YjsWidgetType;
  layout: YjsWidgetLayout;
  content: Record<string, unknown>;
  createdAt: number;
}

// TECH_STACK
export interface YjsTechStackContent {
  subject: YjsSelector;
  techItems: Array<{
    id: string;
    name: string;
    category: string;
  }>;
}

// GIT_CONVENTION
export interface YjsGitConventionContent {
  strategy: YjsSelector;
  branchRules: {
    mainBranch: string;
    developBranch: string;
    prefixes: YjsMultiSelector;
  };
  commitConvention: {
    useGitmoji: boolean;
    commitTypes: YjsMultiSelector;
  };
}

// COMMUNICATION
export interface YjsCommunicationContent {
  communication: {
    urgent: YjsSelector;
    sync: YjsSelector;
    async: YjsSelector;
    official: YjsSelector;
  };
  sla: {
    responseTime: number;
  };
  timeManagement: {
    coreTimeStart: string;
    coreTimeEnd: string;
  };
  meeting: {
    noMeetingDay: string;
    feedbackStyle: string;
  };
}

// GROUNDRULE_COLLABORATION
export interface YjsCollaborationContent {
  prRules: {
    activeVersion: YjsSelector;
    activeStrategy: YjsSelector;
    labelRules: YjsMultiSelector;
  };
  reviewPolicy: {
    approves: number;
    maxReviewHours: number;
    blockMerge: boolean;
  };
  workflow: {
    platform: YjsSelector;
    cycleValue: number;
    cycleUnit: string;
  };
}

// POST_IT
export interface YjsPostItContent {
  text: string;
  backgroundColor: string;
  fontSize: number;
}

// NAMING_CONVENTION
export interface YjsNamingConventionContent {
  frontend: {
    variable: string;
    function: string;
    component: string;
    constant: string;
  };
  backend: {
    variable: string;
    function: string;
    class: string;
    constant: string;
  };
  database: {
    table: string;
    column: string;
    index: string;
    constraint: string;
  };
  common: {
    utility: string;
    constant: string;
    type: string;
    enum: string;
  };
}

// FORMAT
export interface YjsFormatContent {
  line: number;
  useTabs: boolean;
  tabWidth: number;
  semi: boolean;
  singleQuote: boolean;
  jsxSingleQuote: boolean;
  bracketSpacing: boolean;
  trailingComma: string;
  arrowParens: boolean;
  attributePerLine: boolean;
}
