import * as Y from 'yjs';
import type { WidgetData, WidgetType } from '../../../types/yjsDoc';
import type { WidgetContent } from '@/common/types/yjsWidgetContent';

/**
 * JS 객체/배열을 재귀적으로 Yjs 타입으로 변환
 *
 * - Array -> Y.Array
 * - Object -> Y.Map
 * - Primitives -> 그대로 반환
 *
 * 이 함수는 깊은 복사를 수행하며 Yjs 데이터 구조를 초기화할 때 유용합니다.
 *
 * @param value - 변환할 JavaScript 값 (객체, 배열, 원시값 등)
 * @returns Yjs 호환 타입 (Y.Map, Y.Array, 원시값)
 */
type YValue =
  | Y.Map<unknown>
  | Y.Array<unknown>
  | string
  | number
  | boolean
  | null
  | undefined;

export const toYType = (value: unknown): YValue => {
  if (value === null || value === undefined) return value;

  // 배열 -> Y.Array
  if (Array.isArray(value)) {
    const yArray = new Y.Array();
    const convertedList = value.map(toYType);
    yArray.push(convertedList);
    return yArray;
  }

  // 객체 -> Y.Map
  if (typeof value === 'object') {
    const yMap = new Y.Map();
    for (const [key, val] of Object.entries(value as Record<string, unknown>)) {
      const converted = toYType(val);
      if (converted !== undefined) {
        yMap.set(key, converted);
      }
    }
    return yMap;
  }

  // 기본 타입은 그대로 반환
  return value as YValue;
};

/**
 * Y.Map 데이터를 리액트용 WidgetData(JSON)로 변환
 *
 * Yjs의 공유 데이터(Y.Map)를 React 컴포넌트에서 렌더링하기 쉬운
 * 일반 JSON 객체 형태(WidgetData)로 변환합니다.
 *
 * @param widgetId - 변환할 위젯의 ID
 * @param widgetMap - Yjs 내부의 위젯 데이터 Map
 * @returns {WidgetData} - React에서 사용할 위젯 데이터 객체
 */
export const yWidgetToWidgetData = (
  widgetId: string,
  widgetMap: Y.Map<unknown>,
): WidgetData => {
  //layout이나 content가 없을 경우 빈 Map 처리
  const layout =
    (widgetMap.get('layout') as Y.Map<number>) || new Y.Map<number>();
  const content =
    (widgetMap.get('content') as Y.Map<unknown>) || new Y.Map<unknown>();

  return {
    widgetId: (widgetMap.get('id') as string) ?? widgetId,
    type: (widgetMap.get('type') ?? 'TECH_STACK') as WidgetType,
    layout: {
      x: layout.get('x') ?? 0,
      y: layout.get('y') ?? 0,
      width: layout.get('width'),
      height: layout.get('height'),
    },
    content: content.toJSON() as WidgetContent,
    createdAt: (widgetMap.get('createdAt') as number) ?? Date.now(),
    focusedAt: (widgetMap.get('focusedAt') as number) ?? Date.now(),
  };
};
