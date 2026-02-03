import * as Y from 'yjs';

import { getRandomColor } from '@/utils/color';
import type { HocuspocusProvider } from '@hocuspocus/provider';
import { useUserStore } from '@/common/store/user';

// 문서 초기화: 필수 공유 타입(Root, Widgets)이 존재하는지 확인하고 없으면 생성
export function initializeYDoc(doc: Y.Doc, workspaceId: string) {
  const root = doc.getMap('root');

  if (!root.has('schemaVersion')) root.set('schemaVersion', 1);

  if (!root.has('workspace')) {
    const ws = new Y.Map();
    ws.set('id', workspaceId);
    ws.set('title', '제목 없는 워크스페이스');
    ws.set('createdAt', Date.now());
    root.set('workspace', ws);
  }

  if (!root.has('widgets')) {
    root.set('widgets', new Y.Map());
  }

  if (!root.has('meta')) {
    root.set('meta', new Y.Map());
  }

  return root;
}

export const initializeUserAwareness = (
  provider: HocuspocusProvider,
  userNickname: string,
) => {
  const clientId = provider?.awareness?.clientID;
  if (clientId) {
    // 내 정보 등록 (Awareness)
    provider?.awareness?.setLocalStateField('user', {
      id: clientId.toString(),
      nickname: userNickname,
      color: getRandomColor(),
    });
    // 커서 위치 등록 (Awareness)
    provider?.awareness?.setLocalStateField('cursor', {
      x: -100,
      y: -100,
      ts: Date.now(),
    });
    // 유저의 조작 상태 초기화 (Awareness)
    provider?.awareness?.setLocalStateField('manipulationState', null);

    // 내 ID Zustand 스토어에 등록
    const setMyId = useUserStore.getState().setMyId;
    setMyId(clientId.toString());
  }
};
