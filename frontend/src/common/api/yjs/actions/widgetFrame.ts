import * as Y from 'yjs';
import { doc } from '@/common/api/yjs/instance';
import { getWidgetsMap, getWidgetMap } from '@/common/api/yjs/utils/getMaps';
import { toYType } from '@/common/api/yjs/utils/translateData';
import type { WidgetData } from '@/common/types/yjsDoc';

// 1. 위젯 생성
export interface CreateWidgetParams {
  type: WidgetData['type'];
  content: WidgetData['content'];
  layout: WidgetData['layout'];
  widgetId?: string;
}

/**
 * 위젯 생성 액션
 *
 * 새로운 위젯을 생성하여 Yjs Map에 추가합니다.
 *
 * @param params.type - 생성할 위젯의 타입 (예: TECH_STACK)
 * @param params.content - 위젯의 초기 데이터 콘텐츠, 아직은 위젯별 초기 데이터가 상수로 정의되어 있지 않은 상황입니다
 * @param params.layout - 위젯의 초기 위치 및 크기 (기본값: 0,0, 300x300)
 * @param params.widgetId - 위젯의 고유 ID (기본값: randomUUID)
 */
export const createWidgetAction = ({
  type,
  content,
  layout,
  widgetId = crypto.randomUUID(),
}: CreateWidgetParams) => {
  doc.transact(() => {
    const widgetsMap = getWidgetsMap();

    if (widgetsMap.has(widgetId)) return;

    // TECH_STACK 제외한 모든 위젯은 하나만 생성 가능
    if (type !== 'TECH_STACK') {
      let isExists = false;
      for (const widget of widgetsMap.values()) {
        const widgetType = (widget as Y.Map<unknown>).get('type');
        if (widgetType === type) {
          isExists = true;
          break;
        }
      }
      if (isExists) return;
    }

    // 기본 레이아웃 설정
    const newWidget: WidgetData = {
      widgetId,
      type,
      layout,
      content,
      createdAt: Date.now(),
      focusedAt: Date.now(),
    };

    // JSON -> Y.Map 자동 변환
    widgetsMap.set(widgetId, toYType(newWidget) as Y.Map<unknown>);
  });
};

// 2. 위젯 삭제
/**
 * 위젯 삭제 액션
 *
 * 특정 위젯의 데이터를 Yjs Map에서 제거합니다.
 *
 * @param widgetId - 삭제할 위젯의 ID
 */
export const deleteWidgetAction = (widgetId: string) => {
  doc.transact(() => {
    const widgetsMap = getWidgetsMap();

    // 데이터 삭제
    if (widgetsMap.has(widgetId)) {
      widgetsMap.delete(widgetId);
    }
  });
};

// 3. 위젯 레이아웃 업데이트 (이동/리사이즈)
/**
 * 위젯 레이아웃 업데이트 액션
 *
 * 위젯의 위치(x, y)나 크기(width, height)를 변경할 때 사용합니다.
 * 변경된 필드만 부분적으로 업데이트합니다.
 *
 * @param widgetId - 대상 위젯 ID
 * @param layoutChanges - 변경할 레이아웃 속성 (Partial)
 */
export const updateWidgetLayoutAction = (
  widgetId: string,
  layoutChanges: Partial<{
    x: number;
    y: number;
    width: number;
    height: number;
  }>,
) => {
  doc.transact(() => {
    const widgetMap = getWidgetMap(widgetId);
    if (!widgetMap) return;

    const layoutMap = widgetMap.get('layout') as Y.Map<number>;
    if (layoutMap) {
      Object.entries(layoutChanges).forEach(([key, value]) => {
        layoutMap.set(key, value);
      });
    }
  });
};

// 4. 위젯 최상단으로 가져오기

/**
 * bringToFront 순수 로직 (테스트 가능)
 *
 * 위젯 데이터 Map에 focusedAt 시간을 업데이트합니다.
 *
 * @param widgetMap - Yjs 위젯 데이터 Map
 */

export const bringToFrontLogic = (widgetMap: Y.Map<unknown>) => {
  if (!widgetMap) return;
  widgetMap.set('focusedAt', Date.now());
};

/**
 * 위젯 최상단으로 가져오기
 *
 * 위젯 데이터 Map에 focusedAt 시간을 업데이트합니다.
 * 렌더링 시 가장 높은 레이어에 위치하도록 합니다.
 *
 * @param widgetMap - Yjs 위젯 데이터 Map
 */
export const bringToFrontAction = (widgetId: string) => {
  doc.transact(() => {
    const widgetMap = getWidgetMap(widgetId);
    if (!widgetMap) return;
    bringToFrontLogic(widgetMap);
  });
};
