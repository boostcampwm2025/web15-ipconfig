import type { LocalState } from '../types/yjsawareness';
import useCursorStore from '../store/cursor';
import type { Cursor } from '../types/cursor';
import type { Awareness } from 'y-protocols/awareness';

export const handleAwarenessChange = (awareness: Awareness) => {
  const states = awareness.getStates() as Map<number, LocalState>;
  const newCursorList: Cursor[] = [];
  const currentClientID = awareness.clientID;

  states.forEach((state: LocalState, clientId: number) => {
    // 자기 자신의 커서는 제외
    if (clientId === currentClientID) return;

    // 유저 정보와 커서 정보가 모두 있는 경우만 추가
    if (state.user && state.cursor) {
      newCursorList.push({
        userId: state.user.id,
        nickname: state.user.nickname,
        color: state.user.color,
        x: state.cursor.x,
        y: state.cursor.y,
      });
    }
  });

  useCursorStore.getState().setCursorList(newCursorList);
};
