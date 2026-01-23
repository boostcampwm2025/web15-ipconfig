import { useEffect } from 'react';
import { onProviderReady } from '../api/yjs/instance';
import { handleAwarenessChange } from '../lib/awareness';

// 싱글톤
let awarenessHandler: (() => void) | null = null;

export const useCursorAwareness = () => {
  useEffect(() => {
    onProviderReady((provider) => {
      const awareness = provider.awareness;

      // awareness가 없으면 스킵
      if (!awareness) return;

      // 이미 리스너가 등록되어 있으면 스킵
      if (awarenessHandler) return;

      // 싱글톤 핸들러로 등록
      awarenessHandler = () => handleAwarenessChange(awareness);

      // 초기 상태 로드 및 변경 이벤트 리스너 등록
      handleAwarenessChange(awareness);
      awareness.on('change', awarenessHandler);
    });
  }, []);
};
