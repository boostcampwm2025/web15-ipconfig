export interface Cursor {
  userId: string;
  nickname: string;
  color: string;
  x: number;
  y: number;
}

export type Cursors = Record<string, Cursor>;
