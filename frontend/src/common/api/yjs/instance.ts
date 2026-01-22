import * as Y from 'yjs';
import { HocuspocusProvider } from '@hocuspocus/provider';
import { initializeRoot } from './utils/initializeRoot';

// Doc은 앱 실행 시 바로 생성 (싱글톤)
export const doc = new Y.Doc();

// Provider는 나중에 방(workspaceId)에 들어갈 때 초기화
let provider: HocuspocusProvider | null = null;

export const connectProvider = (workspaceId: string, token?: string) => {
  if (provider) {
    provider.destroy(); // 기존 연결 끊기
  }

  const url =
    import.meta.env.VITE_WEBSOCKET_URL || 'ws://localhost:3000/collaboration';

  provider = new HocuspocusProvider({
    url,
    name: `workspace:${workspaceId}`, // 방 이름
    document: doc,
    onConnect: () => {
      doc.transact(() => {
        initializeRoot(doc, workspaceId);
      });
    },
  });

  return provider;
};

export const getProvider = () => provider;
