import type { GitConventionData } from '@/features/widgets/gitConvention/types/gitConvention';
import type { TechStack } from '@/features/widgets/techStack/types/techStack';

export type WidgetType =
  | 'TECH_STACK'
  | 'POST_IT'
  | 'GROUND_RULE'
  | 'GIT_CONVENTION'
  | 'GROUNDRULE_COLLABORATION'
  | 'COMMUNICATION';

export type WidgetContent =
  | TechStackContentDto
  | PostItContentDto
  | GroundRuleContentDto
  | GitConventionContentDto;

export interface TechStackContentDto {
  widgetType: WidgetType;
  selectedItems: TechStack[];
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

export interface GitConventionContentDto {
  widgetType: WidgetType;
  data: GitConventionData;
}

export interface WidgetData {
  x: number;
  y: number;
  width?: number;
  height?: number;
  zIndex?: number;
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
