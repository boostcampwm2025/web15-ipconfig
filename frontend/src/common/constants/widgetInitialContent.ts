import type {
  TechStackContent,
  GitConventionContent,
  CollaborationContent,
  CommunicationContent,
  PostItContent,
} from '@/common/types/yjsWidgetContent';

/**
 * 위젯별 초기 Content 상수
 * Yjs 문서에 저장될 때 사용되는 기본값입니다.
 */

// TECH_STACK 초기값
export const TECH_STACK_INITIAL_CONTENT: TechStackContent = {
  subject: {
    selectedId: '',
    options: {},
  },
  techItems: [],
};

// GIT_CONVENTION 초기값
export const GIT_CONVENTION_INITIAL_CONTENT: GitConventionContent = {
  strategy: {
    selectedId: 'github_flow',
    options: {
      github_flow: { value: 'GITHUB_FLOW', createdAt: 0 },
      git_flow: { value: 'GIT_FLOW', createdAt: 0 },
      trunk_based: { value: 'TRUNK_BASED', createdAt: 0 },
    },
  },
  branchRules: {
    mainBranch: 'main',
    developBranch: '',
    prefixes: {
      selectedIds: [],
      options: {
        feature: { value: 'feature', createdAt: 0 },
        fix: { value: 'fix', createdAt: 0 },
        refactor: { value: 'refactor', createdAt: 0 },
        hotfix: { value: 'hotfix', createdAt: 0 },
        release: { value: 'release', createdAt: 0 },
      },
    },
  },
  commitConvention: {
    useGitmoji: false,
    commitTypes: {
      selectedIds: [],
      options: {
        feat: { value: 'feat', createdAt: 0 },
        fix: { value: 'fix', createdAt: 0 },
        refactor: { value: 'refactor', createdAt: 0 },
        chore: { value: 'chore', createdAt: 0 },
        docs: { value: 'docs', createdAt: 0 },
        test: { value: 'test', createdAt: 0 },
        style: { value: 'style', createdAt: 0 },
      },
    },
  },
};

// COLLABORATION 초기값
export const COLLABORATION_INITIAL_CONTENT: CollaborationContent = {
  prRules: {
    activeVersion: {
      selectedId: '',
      options: {
        semantic: { value: 'Semantic Versioning', createdAt: 0 },
        calendar: { value: 'Calendar Versioning', createdAt: 0 },
        conventional: { value: 'Conventional Commits', createdAt: 0 },
        custom: { value: 'Custom Versioning', createdAt: 0 },
      },
    },
    activeStrategy: {
      selectedId: '',
      options: {
        squash: { value: 'Squash and Merge', createdAt: 0 },
        merge: { value: 'Merge Commit', createdAt: 0 },
        rebase: { value: 'Rebase and Merge', createdAt: 0 },
      },
    },
    labelRules: {
      selectedIds: [],
      options: {
        bug: { value: 'bug', createdAt: 0 },
        feature: { value: 'feature', createdAt: 0 },
        enhancement: { value: 'enhancement', createdAt: 0 },
        documentation: { value: 'documentation', createdAt: 0 },
      },
    },
  },
  reviewPolicy: {
    approves: 1,
    maxReviewHours: 24,
    blockMerge: true,
  },
  workflow: {
    platform: {
      selectedId: '',
      options: {
        github: { value: 'GitHub Projects', createdAt: 0 },
        jira: { value: 'Jira', createdAt: 0 },
        notion: { value: 'Notion', createdAt: 0 },
        linear: { value: 'Linear', createdAt: 0 },
      },
    },
    cycleValue: 2,
    cycleUnit: '주',
  },
};

// COMMUNICATION 초기값
export const COMMUNICATION_INITIAL_CONTENT: CommunicationContent = {
  communication: {
    urgent: '',
    sync: '',
    async: '',
    official: '',
  },
  sla: {
    responseTime: 24,
  },
  timeManagement: {
    coreTimeStart: '10:00',
    coreTimeEnd: '18:00',
  },
  meeting: {
    noMeetingDay: '',
    feedbackStyle: '',
  },
};

// POST_IT 초기값
export const POST_IT_INITIAL_CONTENT: PostItContent = {
  text: '',
  color: '#FFE066',
};

// 위젯 타입별 초기 Content 매핑
export const WIDGET_INITIAL_CONTENT_MAP = {
  TECH_STACK: TECH_STACK_INITIAL_CONTENT,
  GIT_CONVENTION: GIT_CONVENTION_INITIAL_CONTENT,
  COLLABORATION: COLLABORATION_INITIAL_CONTENT,
  COMMUNICATION: COMMUNICATION_INITIAL_CONTENT,
  POST_IT: POST_IT_INITIAL_CONTENT,
} as const;
