import { useEffect } from 'react';
import { getProvider } from '../api/yjs/instance';
import type { Cursor } from '../types/cursor';
import type { LocalState } from '../types/yjsawareness';
import useCursorStore from '../store/cursor';

let awarenessHandler: (() => void) | null = null;

export const useAwareness = () => {
  useEffect(() => {
    const setupAwarenessListener = () => {
      const provider = getProvider();

      // 기다리는 로직을 넣어서 Provider랑 타이밍 문제를 해결했습니다.
      // 더 좋은 방법이 있나요?
      if (!provider?.awareness) {
        setTimeout(setupAwarenessListener, 100);
        return;
      }

      const awareness = provider.awareness;

      // 이미 리스너가 등록되어 있으면 스킵
      if (awarenessHandler) return;

      const handleAwarenessChange = () => {
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

      // 싱글톤 핸들러로 등록
      awarenessHandler = handleAwarenessChange;

      // 초기 상태 로드 및 변경 이벤트 리스너 등록
      handleAwarenessChange();
      awareness.on('change', handleAwarenessChange);
    };

    setupAwarenessListener();
  }, []);
};
