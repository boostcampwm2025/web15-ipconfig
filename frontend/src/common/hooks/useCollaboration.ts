import { useEffect } from 'react';
import { connectProvider } from '../api/yjs/instance';
import { bindYjsToZustand } from '../api/yjs/sync';

export function useCollaboration(
  documentName: string,
  userNickname: string | null,
) {
  useEffect(() => {
    if (!documentName || !userNickname) return;

    // 싱글톤 Provider 연결
    connectProvider(documentName, userNickname);

    const cleanupSync = bindYjsToZustand();

    return () => {
      cleanupSync();
    };
  }, [documentName, userNickname]);
}
