import * as Y from 'yjs';

import {
  getRootMap,
  getWidgetOrderArray,
  getWidgetsMap,
} from './utils/getMaps';

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
    const widgetOrderYArr = getWidgetOrderArray();

    if (!widgetsYMap || !widgetOrderYArr) return;

    // widgetOrder 배열을 기준으로 정렬된 위젯 리스트 생성
    const orderedIds = widgetOrderYArr.toArray();

    const currentList = useWorkspaceWidgetStore.getState().widgetList;

    const widgetList = orderedIds
      .map((id: string, index: number): WidgetData | null => {
        const yWidget = widgetsYMap.get(id);
        if (!yWidget || !(yWidget instanceof Y.Map)) return null;

        // zIndex는 widgetOrder 배열의 index를 그대로 사용
        const yjsWidgetData = yWidgetToWidgetData(id, yWidget, index);
        const newWidgetData = yjsWidgetData as unknown as WidgetData;

        // 기존 위젯과 비교하여 동일한 경우, 기존 위젯을 반환
        const existingWidget = currentList.find((w) => w.widgetId === id);

        if (
          existingWidget &&
          isWidgetDataEqual(existingWidget, newWidgetData)
        ) {
          return existingWidget;
        }

        return newWidgetData;
      })
      .filter(isWidgetData);

    setWidgetList(widgetList);
  };

  /* ------------------------------------------------------------------
   * 2. widgets / widgetOrder observer 관리
   * ------------------------------------------------------------------ */
  let cleanupCurrentObservers: (() => void) | null = null;

  const attachObservers = (): (() => void) | null => {
    const widgetsYMap = getWidgetsMap();
    const widgetOrderYArr = getWidgetOrderArray();

    // Yjs 구조가 아직 준비되지 않은 경우
    if (!widgetsYMap || !widgetOrderYArr) return null;

    const observer = (): void => {
      syncWidgetsToStore();
    };

    widgetsYMap.observeDeep(observer);
    widgetOrderYArr.observe(observer);

    // observer 연결 직후 초기 동기화
    syncWidgetsToStore();

    return (): void => {
      widgetsYMap.unobserveDeep(observer);
      widgetOrderYArr.unobserve(observer);
    };
  };

  /* ------------------------------------------------------------------
   * 3. Root Map 관찰 (Yjs 초기화 지연 / 구조 교체 대응)
   * ------------------------------------------------------------------ */
  const rootMap = getRootMap();

  const rootObserver = (event: Y.YMapEvent<unknown>): void => {
    const keys = event.keysChanged;

    const shouldReattach =
      !cleanupCurrentObservers ||
      keys.has('widgets') ||
      keys.has('widgetOrder');

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
