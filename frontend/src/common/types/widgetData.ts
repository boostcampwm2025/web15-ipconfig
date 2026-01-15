export type WidgetType =
  | 'TECH_STACK'
  | 'POST_IT'
  | 'GROUND_RULE'
  | 'GROUNDRULE_COLLABORATION';

export type WidgetContent =
  | TechStackContentDto
  | PostItContentDto
  | GroundRuleContentDto;

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
