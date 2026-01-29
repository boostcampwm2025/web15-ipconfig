import { useEffect } from 'react';
import { connectProvider } from '../api/yjs/instance';
import { bindYjsToZustand } from '../api/yjs/sync';

export function useCollaboration(documentName: string) {
  useEffect(() => {
    if (!documentName) return;

    // 싱글톤 Provider 연결
    connectProvider(documentName);

    const cleanupSync = bindYjsToZustand();

    return () => {
      cleanupSync();
    };
  }, [documentName]);
}
