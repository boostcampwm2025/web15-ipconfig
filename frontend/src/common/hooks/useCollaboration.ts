import { useEffect } from 'react';
import useUserStore from '../store/user';
import { connectProvider } from '../api/yjs/instance';
import { setLocalUser } from '../api/yjs/awareness';
import { bindYjsToZustand } from '../api/yjs/sync';

export function useCollaboration(documentName: string) {
  const user = useUserStore((state) => state.user);

  useEffect(() => {
    if (!documentName) return;

    // 싱글톤 Provider 연결
    connectProvider(documentName);

    // 유저 정보가 있으면 Awareness에 등록
    if (user) {
      setLocalUser({
        id: user.id,
        nickname: user.nickname,
        color: user.color,
        backgroundColor: user.backgroundColor,
      });
    }

    const cleanupSync = bindYjsToZustand();

    return () => {
      cleanupSync();
    };
  }, [documentName, user]);
}
