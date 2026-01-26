export interface UserState {
  id: string;
  nickname: string;
  color: string;
  backgroundColor: string;
}

export interface CursorState {
  x: number;
  y: number;
  ts: number;
}

export interface EditingState {
  widgetId: string;
  kind: 'move' | 'resize';
  preview: {
    x: number;
    y: number;
    width?: number;
    height?: number;
  };
}
// Awareness 전체 상태 구조
export interface LocalState {
  user: UserState;
  cursor?: CursorState;
  editing?: EditingState;
}
