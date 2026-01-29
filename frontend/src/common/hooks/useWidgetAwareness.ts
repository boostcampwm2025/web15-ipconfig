import { useEffect } from 'react';
import { onProviderReady } from '../api/yjs/instance';
import { handleWidgetInteractionChange } from '../api/yjs/awareness';

// 싱글톤 패턴으로 이벤트 리스너가 중복 등록되지 않도록 관리
let widgetAwarenessHandler: (() => void) | null = null;

export function useWidgetAwareness() {
  useEffect(() => {
    onProviderReady((provider) => {
      const awareness = provider.awareness;
      if (!awareness) return;

      if (widgetAwarenessHandler) return;

      widgetAwarenessHandler = () => handleWidgetInteractionChange(awareness);

      // 1. 초기 상태 반영
      handleWidgetInteractionChange(awareness);
      // 2. 변경 사항 구독
      awareness.on('change', widgetAwarenessHandler);
    });
  }, []);
}
