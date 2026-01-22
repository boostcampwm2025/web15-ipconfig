import { useEffect } from 'react';
import { connectProvider } from '../api/yjs/instance';

export const useCollaboration = (documentName: string) => {
  useEffect(() => {
    if (!documentName) return;

    // 싱글톤 Provider 연결
    const newProvider = connectProvider(documentName);

    //TODO: 내 유저 정보 Awareness 등록

    return () => {
      newProvider.destroy();
    };
  }, [documentName]);
};
