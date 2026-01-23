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

/**
 * Yjs Doc 데이터를 Zustand Store와 동기화하는 함수 (Hook 아님)
 *
 * - 컴포넌트 생명주기와 무관하게 동작
 * - 반드시 반환된 cleanup 함수를 호출해 observer를 해제해야 함
 */
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

    const widgetList = orderedIds
      .map((id: string, index: number): WidgetData | null => {
        const yWidget = widgetsYMap.get(id);
        if (!yWidget || !(yWidget instanceof Y.Map)) return null;

        // zIndex는 widgetOrder 배열의 index를 그대로 사용
        const yjsWidgetData = yWidgetToWidgetData(id, yWidget, index);

        // yjsDoc.WidgetData를 widgetData.WidgetData로 변환
        return yjsWidgetData as unknown as WidgetData;
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
