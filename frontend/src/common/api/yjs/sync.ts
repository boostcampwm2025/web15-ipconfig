import * as Y from 'yjs';

import { getRootMap, getWidgetsMap } from './utils/getMaps';

import { useWorkspaceWidgetStore } from '@/common/store/workspace';
import { yWidgetToWidgetData } from './utils/translateData';
import type { WidgetData } from '@/common/types/widgetData';

function isWidgetData(value: WidgetData | null): value is WidgetData {
  return value !== null;
}

const isWidgetDataEqual = (prev: WidgetData, next: WidgetData): boolean => {
  if (prev.widgetId !== next.widgetId) return false;
  if (prev.type !== next.type) return false;

  if (prev.layout.x !== next.layout.x || prev.layout.y !== next.layout.y)
    return false;
  if (
    prev.layout.width !== next.layout.width ||
    prev.layout.height !== next.layout.height
  )
    return false;
  if (prev.layout.zIndex !== next.layout.zIndex) return false;

  return JSON.stringify(prev.content) === JSON.stringify(next.content);
};

export const bindYjsToZustand = (): (() => void) => {
  const { setWidgetList } = useWorkspaceWidgetStore.getState();

  /* ------------------------------------------------------------------
   * 1. Yjs → Zustand 동기화 로직
   * ------------------------------------------------------------------ */
  const syncWidgetsToStore = (): void => {
    const widgetsYMap = getWidgetsMap();

    // TODO: 리렌더링 개선
    const widgets = [...widgetsYMap.entries()]
      .map(([id, yWidget]) => {
        return yWidgetToWidgetData(id, yWidget);
      })
      .sort((a, b) => a.focusedAt - b.focusedAt);

    if (!widgetsYMap) return;

    setWidgetList(widgets as WidgetData[]);
  };

  /* ------------------------------------------------------------------
   * 2. widgets observer 관리
   * ------------------------------------------------------------------ */
  let cleanupCurrentObservers: (() => void) | null = null;

  const attachObservers = (): (() => void) | null => {
    const widgetsYMap = getWidgetsMap();

    // Yjs 구조가 아직 준비되지 않은 경우
    if (!widgetsYMap) return null;

    const observer = (): void => {
      syncWidgetsToStore();
    };

    widgetsYMap.observeDeep(observer);

    // observer 연결 직후 초기 동기화
    syncWidgetsToStore();

    return (): void => {
      widgetsYMap.unobserveDeep(observer);
    };
  };

  /* ------------------------------------------------------------------
   * 3. Root Map 관찰 (Yjs 초기화 지연 / 구조 교체 대응)
   * ------------------------------------------------------------------ */
  const rootMap = getRootMap();

  const rootObserver = (event: Y.YMapEvent<unknown>): void => {
    const keys = event.keysChanged;

    const shouldReattach = !cleanupCurrentObservers || keys.has('widgets');

    if (!shouldReattach) return;

    cleanupCurrentObservers?.();
    cleanupCurrentObservers = attachObservers();
  };

  // 최초 실행 시도 (이미 구조가 존재하는 경우)
  cleanupCurrentObservers = attachObservers();

  // Root Map observer 등록
  rootMap.observe(rootObserver);

  /* ------------------------------------------------------------------
   * 4. Cleanup
   * ------------------------------------------------------------------ */
  return (): void => {
    rootMap.unobserve(rootObserver);
    cleanupCurrentObservers?.();
  };
};
