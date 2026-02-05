import * as Y from 'yjs';

import { getRootMap, getWidgetsMap } from './utils/getMaps';

import {
  useWorkspaceWidgetStore,
  useWorkspaceInfoStore,
} from '@/common/store/workspace';
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
    // 1. 위젯 데이터 변환
    const widgets = [...widgetsYMap.entries()].map(([id, yWidget]) => {
      return yWidgetToWidgetData(id, yWidget);
    });

    // 2. focusedAt 기준으로 정렬하여 zIndex 계산
    // (가장 최근에 포커스된 위젯이 가장 높은 zIndex를 가짐)
    const sortedByFocus = [...widgets].sort(
      (a, b) => a.focusedAt - b.focusedAt,
    );
    const zIndexMap = new Map(sortedByFocus.map((w, i) => [w.widgetId, i + 1]));

    // 3. 최종 위젯 리스트 생성
    // - zIndex를 layout에 주입
    // - DOM 순서는 createdAt(또는 고정된 기준)으로 정렬하여,
    //   포커스 변경 시 DOM 요소가 재정렬되어 클릭 이벤트가 취소되는 현상 방지
    const finalWidgets = widgets
      .map((w) => ({
        ...w,
        layout: {
          ...w.layout,
          zIndex: zIndexMap.get(w.widgetId) ?? 1,
        },
      }))
      .sort((a, b) => a.createdAt - b.createdAt);

    if (!widgetsYMap) return;

    setWidgetList(finalWidgets as WidgetData[]);
  };

  const syncWorkspaceToStore = (): void => {
    const root = getRootMap();
    const workspace = root.get('workspace') as Y.Map<unknown>;
    if (!workspace) return;

    const title = workspace.get('title') as string;
    const { setWorkspaceInfo } = useWorkspaceInfoStore.getState();

    setWorkspaceInfo({
      workspaceId: workspace.get('id') as string,
      workspaceName: title || '제목 없음',
    });
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

    const workspaceYMap = getRootMap().get('workspace') as Y.Map<unknown>;
    const workspaceObserver = (): void => {
      syncWorkspaceToStore();
    };

    widgetsYMap.observeDeep(observer);
    if (workspaceYMap) {
      workspaceYMap.observe(workspaceObserver);
    }

    // observer 연결 직후 초기 동기화
    syncWidgetsToStore();
    syncWorkspaceToStore();

    return (): void => {
      widgetsYMap.unobserveDeep(observer);
      if (workspaceYMap) {
        workspaceYMap.unobserve(workspaceObserver);
      }
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
