import {
  LuLayers,
  LuCalendarDays,
  LuListChecks,
  LuWrench,
  LuMerge,
  LuGitBranch,
  LuGitMerge,
} from 'react-icons/lu';

export const versionTypes = [
  {
    key: 'semantic',
    title: '시맨틱',
    desc: 'MAJOR.MINOR.PATCH 기반 버전 증가',
    icon: <LuLayers size={20} />,
  },
  {
    key: 'calendar',
    title: '캘린더',
    desc: 'YYYY.MM 또는 YYYY.MM.DD 날짜 기반',
    icon: <LuCalendarDays size={20} />,
  },
  {
    key: 'conventional',
    title: '컨벤셔널',
    desc: '커밋 메시지 규칙 기반 자동 릴리즈',
    icon: <LuListChecks size={20} />,
  },
  {
    key: 'custom',
    title: '커스텀',
    desc: '팀에서 정의한 맞춤 버저닝',
    icon: <LuWrench size={20} />,
  },
];

export const labelCandidates = [
  'feature',
  'fix',
  'refactor',
  'docs',
  'chore',
  'performance',
  'test',
  'ci',
  'build',
  'style',
  'hotfix',
];

export const strategies = [
  {
    key: 'squash',
    title: 'Squash',
    desc: '여러 커밋을 하나로 압축하여 병합',
    icon: <LuMerge size={20} />,
  },
  {
    key: 'rebase',
    title: 'Rebase',
    desc: '선형 히스토리 유지',
    icon: <LuGitBranch size={20} />,
  },
  {
    key: 'merge',
    title: 'Merge',
    desc: '병합 커밋 생성 방식',
    icon: <LuGitMerge size={20} />,
  },
];

export const platforms = ['GitHub Projects', 'Jira', 'Linear', 'Notion'];
