import type { WidgetContent } from './yjsWidgetContent';

// Selector 공통 타입
export interface OptionItem {
  value: string;
  createdAt: number;
}

export interface Selector {
  selectedId: string;
  options: Record<string, OptionItem>;
}

export interface MultiSelector {
  selectedIds: string[];
  options: Record<string, OptionItem>;
}

// Main Widget Data Interface
export interface WidgetData<T extends WidgetContent = WidgetContent> {
  widgetId: string;
  type: WidgetType;
  layout: {
    x: number;
    y: number;
    width: number;
    height: number;
    zIndex: number;
  };
  content: T; // 위젯별 커스텀
  createdAt: number;
}

export interface WorkspaceData {
  root: {
    schemaVersion: number;
    workspace: {
      id: string;
      createdAt: number;
    };
    widgets: Record<string, WidgetData>;
    widgetOrder: string[];
  };
}

// Widget Types
export type WidgetType =
  | 'TECH_STACK'
  | 'POST_IT'
  | 'GIT_CONVENTION'
  | 'GROUNDRULE_COLLABORATION'
  | 'COMMUNICATION';
