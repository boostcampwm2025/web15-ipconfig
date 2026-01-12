export type WidgetType = 'TECH_STACK' | 'POST_IT' | 'GROUND_RULE';

export type WidgetContent =
  | TechStackContentDto
  | PostItContentDto
  | GroundRuleContentDto;

export interface TechStackItem {
  readonly id: string;
  readonly category: string;
  readonly name: string;
}

export interface TechStackContentDto {
  readonly widgetType: WidgetType;
  readonly selectedItems: TechStackItem[];
}

export interface PostItContentDto {
  readonly widgetType: WidgetType;
  readonly text: string;
  readonly backgroundColor: string;
  readonly fontSize: number;
}

export interface GroundRuleContentDto {
  readonly widgetType: WidgetType;
  readonly rules: string[];
}

export interface WidgetData {
  readonly x: number;

  readonly y: number;

  readonly width: number;

  readonly height: number;

  readonly zIndex: number;

  readonly content:
    | TechStackContentDto
    | PostItContentDto
    | GroundRuleContentDto;
}
