// 공통 Option 구조 (확장성 고려)
export interface WidgetOptionItem<T = string> {
  id: string;
  value: T; // 로직용 값 (예: 'GITHUB_FLOW')
  label: string; // UI 표시용 값 (예: 'GitHub Flow')
  emoji?: string;
  createdAt: number;
}

export interface WidgetOptionSet<T = string> {
  selectedId: string;
  options: Record<string, WidgetOptionItem<T>>;
}

// 위젯별 Content 타입 정의
export type WidgetType =
  | 'TECH_STACK'
  | 'GIT_CONVENTION'
  | 'COMMUNICATION'
  | 'POST_IT'
  | 'COLLABORATION';

// 예시: Git Convention 위젯 컨텐츠
export interface GitConventionContent {
  strategySet: WidgetOptionSet<'GITHUB_FLOW' | 'GIT_FLOW' | 'TRUNK_BASED'>;
  branchRules: {
    mainBranch: string;
    developBranch: string | null;
    prefixSet: WidgetOptionSet<string>;
  };
  // ... 필요한 필드 추가
}

// 통합 위젯 데이터 인터페이스
export interface WidgetData {
  widgetId: string;
  type: WidgetType;
  layout: {
    x: number;
    y: number;
    width: number;
    height: number;
    zIndex: number; // 렌더링 시 계산된 값 (저장될 땐 사용 안 함)
  };
  content: GitConventionContent | undefined;
  createdAt: number;
}
