export type WidgetType = 'tech' | 'git-convention';

export interface WidgetPosition {
  x: number;
  y: number;
}

export interface WidgetData {
  id: string;
  type: WidgetType;
  position: WidgetPosition;
  content: string;
  width?: number;
  height?: number;
}
