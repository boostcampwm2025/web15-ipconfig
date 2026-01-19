import { create } from 'zustand';
import type { Cursor } from '../types/cursor';
import type { Position } from '../types/canvas';

interface CursorStore {
  cursorList: Cursor[];
  setCursorList: (cursorList: Cursor[]) => void;
  updateCursorPosition: (userId: string, cursorPosition: Position) => void;
  removeCursor: (userId: string) => void;
}

export const useCursorStore = create<CursorStore>((set) => ({
  cursorList: [],
  setCursorList: (cursorList: Cursor[]) => set({ cursorList }),
  updateCursorPosition: (userId: string, cursorPosition: Position) => {
    set((state) => ({
      cursorList: state.cursorList.map((cursor) =>
        cursor.userId === userId ? { ...cursor, ...cursorPosition } : cursor,
      ),
    }));
  },
  removeCursor: (userId: string) =>
    set((state) => ({
      cursorList: state.cursorList.filter((cursor) => cursor.userId !== userId),
    })),
}));

export default useCursorStore;
