import * as Y from 'yjs';
import { doc } from '../instance';
import {
  getWidgetsMap,
  getWidgetOrderArray,
  getWidgetMap,
} from '../utils/getMaps';
import { toYType, yWidgetToWidgetData } from '../utils/translateData';
import type { WidgetData } from '../../../types/yjsDoc';

// 1. 위젯 생성
export type CreateWidgetParams = {
  type: WidgetData['type'];
  content: WidgetData['content'];
  layout?: Partial<WidgetData['layout']>;
  widgetId?: string;
};

/**
 * 위젯 생성 액션
 *
 * 새로운 위젯을 생성하여 Yjs Map에 추가하고, 위젯 순서 배열(widgetOrder)에 등록합니다.
 *
 * @param params.type - 생성할 위젯의 타입 (예: TECH_STACK)
 * @param params.content - 위젯의 초기 데이터 콘텐츠, 아직은 위젯별 초기 데이터가 상수로 정의되어 있지 않은 상황입니다
 * @param params.layout - 위젯의 초기 위치 및 크기 (기본값: 0,0, 300x300)
 * @param params.widgetId - 위젯의 고유 ID (기본값: randomUUID)
 */
export const createWidgetAction = ({
  type,
  content,
  layout = {},
  widgetId = crypto.randomUUID(),
}: CreateWidgetParams) => {
  doc.transact(() => {
    const widgetsMap = getWidgetsMap();
    const widgetOrder = getWidgetOrderArray();

    if (widgetsMap.has(widgetId)) return;

    // 기본 레이아웃 설정
    const newWidget: WidgetData = {
      widgetId,
      type,
      layout: {
        x: 0,
        y: 0,
        zIndex: 0,
        ...layout,
      },
      content,
      createdAt: Date.now(),
    };

    // JSON -> Y.Map 자동 변환
    widgetsMap.set(widgetId, toYType(newWidget) as Y.Map<unknown>);

    // 순서 배열에 ID 추가 (가장 마지막이 최상단 zIndex)
    widgetOrder.push([widgetId]);
  });
};

// 2. 위젯 삭제
/**
 * 위젯 삭제 액션
 *
 * 특정 위젯의 데이터를 Yjs Map에서 제거하고, 순서 배열(widgetOrder)에서도 제거합니다.
 *
 * @param widgetId - 삭제할 위젯의 ID
 */
export const deleteWidgetAction = (widgetId: string) => {
  doc.transact(() => {
    const widgetsMap = getWidgetsMap();
    const widgetOrder = getWidgetOrderArray();

    // 데이터 삭제
    if (widgetsMap.has(widgetId)) {
      widgetsMap.delete(widgetId);
    }

    const index = widgetOrder.toArray().indexOf(widgetId);
    if (index > -1) {
      widgetOrder.delete(index, 1);
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

// 4. 위젯 최상단으로 가져오기 (z-Index 변경)
/**
 * 위젯 최상단으로 가져오기 (z-Index 변경 효과)
 *
 * 위젯 순서 배열(widgetOrder)에서 해당 위젯 ID를 맨 뒤로 이동시켜,
 * 렌더링 시 가장 높은 z-index를 갖게 합니다.
 *
 * @param widgetId - 최상단으로 올릴 위젯 ID
 */
export const bringToFrontAction = (widgetId: string) => {
  doc.transact(() => {
    const widgetOrder = getWidgetOrderArray();
    const index = widgetOrder.toArray().indexOf(widgetId);
    if (index > -1) {
      widgetOrder.delete(index, 1);
      widgetOrder.push([widgetId]);
    }
  });
};
