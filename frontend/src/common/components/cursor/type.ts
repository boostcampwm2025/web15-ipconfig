export type CursorType = 'default' | 'chat';

export interface CursorProps {
  nickname: string;
  color: string;
  type: CursorType;
  message?: string;
}
