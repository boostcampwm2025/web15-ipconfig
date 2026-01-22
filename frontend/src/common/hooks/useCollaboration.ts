import { useEffect } from 'react';
import { connectProvider, doc } from '../api/yjs/instance';
import { bindYjsToZustand } from '../api/yjs/sync';

import { setLocalUser } from '../api/yjs/awareness';
import type { User } from '../types/user';
import useUserStore from '../store/user';

export const useCollaboration = (documentName: string) => {
  const user = useUserStore((state) => state.user);
  useEffect(() => {
    if (!documentName) return;

    // 1. 싱글톤 Provider 연결
    const newProvider = connectProvider(documentName);

    if (user) {
      setLocalUser(user);
    }

    // 2. Yjs -> Zustand 데이터 동기화 시작
    const cleanupSync = bindYjsToZustand();

    return () => {
      cleanupSync(); // 동기화 중단
      // newProvider.destroy(); // 연결 종료
    };
  }, [documentName, user]);
};
