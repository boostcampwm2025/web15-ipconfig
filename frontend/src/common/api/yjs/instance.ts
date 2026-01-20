// src/features/collab/yjs/instance.ts
import * as Y from 'yjs';
import { HocuspocusProvider } from '@hocuspocus/provider';
import { ensureRoot } from './schema';

// Doc은 앱 실행 시 바로 생성 (싱글톤)
export const doc = new Y.Doc();

// Provider는 나중에 방(workspaceId)에 들어갈 때 초기화
let provider: HocuspocusProvider | null = null;

export const connectProvider = (workspaceId: string, token?: string) => {
  if (provider) {
    provider.destroy(); // 기존 연결 끊기
  }

  provider = new HocuspocusProvider({
    url: process.env.NEXT_PUBLIC_HOCUSPOCUS_URL || 'ws://localhost:1234',
    name: `workspace:${workspaceId}`, // 방 이름
    document: doc,
    onConnect: () => {
      console.log('✅ Connected');
      // 연결 성공 시 루트 구조 보장
      doc.transact(() => {
        ensureRoot(doc, workspaceId);
      });
    },
    onDisconnect: () => {
      console.log('❌ Disconnected');
    },
  });

  return provider;
};

export const getProvider = () => provider;
