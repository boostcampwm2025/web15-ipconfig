export type WidgetType =
  | 'TECH_STACK'
  | 'POST_IT'
  | 'GROUND_RULE'
  | 'GIT_CONVENTION';

export type WidgetContent =
  | TechStackContentDto
  | PostItContentDto
  | GroundRuleContentDto
  | GitConventionContentDto;

export interface TechStackItem {
  id: string;
  category: string;
  name: string;
}

export interface TechStackContentDto {
  widgetType: WidgetType;
  selectedItems: TechStackItem[];
}

export interface PostItContentDto {
  widgetType: WidgetType;
  text: string;
  backgroundColor: string;
  fontSize: number;
}

export interface GroundRuleContentDto {
  widgetType: WidgetType;
  rules: string[];
}

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

export interface GitConventionContentDto {
  widgetType: WidgetType;
  data: GitConventionData;
}

export interface WidgetData {
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
  content: WidgetContent;
}

export interface CreateWidgetData {
  widgetId: string;
  type: WidgetType;
  data: WidgetData;
}

export interface UpdateWidgetData {
  widgetId: string;
  data: {
    // 임시로 이렇게 할게요...
    content: WidgetContent;
  };
}

export interface MoveWidgetData {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  zIndex?: number;
}

export interface UpdateWidgetLayoutData {
  widgetId: string;
  data: MoveWidgetData;
}
