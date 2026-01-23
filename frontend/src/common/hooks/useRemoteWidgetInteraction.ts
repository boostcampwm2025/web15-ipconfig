import { useEffect, useState } from 'react';
import { getProvider } from '../api/yjs/instance';
import type { LocalState, UserState } from '@/common/types/yjsawareness';
import useUserStore from '@/common/store/user';

interface RemoteInteraction {
  user: UserState;
  x: number;
  y: number;
  width?: number;
  height?: number;
}

export function useRemoteWidgetInteraction(widgetId: string) {
  const myUserId = useUserStore((s) => s.user?.id);
  const [interaction, setInteraction] = useState<RemoteInteraction | null>(
    null,
  );

  useEffect(() => {
    const provider = getProvider();
    if (!provider?.awareness) return;
    const awareness = provider.awareness;

    const handleAwarenessChange = () => {
      const states = awareness.getStates();
      let found: RemoteInteraction | null = null;

      for (const [clientId, state] of states.entries()) {
        const localState = state as LocalState;
        if (!localState.user || !localState.editing) continue;

        // 내 자신의 변경사항은 무시 (로컬 state로 처리됨)
        if (localState.user.id === myUserId) continue;

        // 해당 위젯에 대한 변경사항인지 확인
        if (localState.editing.widgetId === widgetId) {
          found = {
            user: localState.user,
            x: localState.editing.preview.x,
            y: localState.editing.preview.y,
            width: localState.editing.preview.width,
            height: localState.editing.preview.height,
          };
          break; // 한 번에 하나의 유저만 반영한다고 가정 (Last writer wins or similar)
        }
      }

      setInteraction(found);
    };

    awareness.on('update', handleAwarenessChange);
    // 초기 상태 확인
    handleAwarenessChange();

    return () => {
      awareness.off('update', handleAwarenessChange);
    };
  }, [widgetId, myUserId]);

  return interaction;
}
