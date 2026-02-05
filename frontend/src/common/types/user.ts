interface Cursor {
  x: number;
  y: number;
  type: 'default' | 'chat';
  message?: string;
  ts: number;
}

// 유저가 조작하고 있는 위젯 레이아웃
export interface ManipulationLayout {
  x: number;
  y: number;
  width?: number;
  height?: number;
}

// 유저가 조작하고 있는 위젯 정보
export interface ManipulationState {
  widgetId: string;
  layout: ManipulationLayout;
}

export interface User {
  id: string; // 유저 ID
  nickname: string; // 유저 닉네임
  color: string; // 커서 색깔
  cursor: Cursor; // 커서 정보
  // 유저가 조작하고 있는 위젯 정보
  manipulationState: ManipulationState;
}

export interface UserWithoutCursor {
  id: string; // 유저 ID
  nickname: string; // 유저 닉네임
  color: string; // 커서 색깔
}

// TODO: 유저 카드를 위한 타입 (추후 수정)
export interface UserExtended extends User {
  role: string;
  textColor: string;
  style: string;
  time: string;
  status: string;
  activity: number[];
}
