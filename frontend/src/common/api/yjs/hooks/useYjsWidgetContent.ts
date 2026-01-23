import { useSyncExternalStore, useCallback } from 'react';
import * as Y from 'yjs';
import { getWidgetMap } from '../utils/getMaps';
import type { WidgetContent } from '@/common/types/yjsWidgetContent';

/**
 * Yjs Y.Map을 일반 JSON 객체로 재귀적으로 변환
 */
const yMapToJSON = (yValue: unknown): unknown => {
  if (yValue instanceof Y.Map) {
    const obj: Record<string, unknown> = {};
    yValue.forEach((val, key) => {
      obj[key] = yMapToJSON(val);
    });
    return obj;
  }
  if (yValue instanceof Y.Array) {
    return yValue.toArray().map(yMapToJSON);
  }
  return yValue;
};

/**
 * Yjs 위젯 Content를 읽어오는 훅
 *
 * @param widgetId - 위젯 ID
 * @returns 위젯 Content (Yjs에서 실시간 동기화)
 *
 * @example
 * ```tsx
 * const content = useYjsWidgetContent<TechStackContent>(widgetId);
 * ```
 */
export function useYjsWidgetContent<T extends WidgetContent = WidgetContent>(
  widgetId: string,
): T | null {
  const subscribe = useCallback(
    (onStoreChange: () => void) => {
      const widgetMap = getWidgetMap(widgetId);
      if (!widgetMap) {
        return () => {};
      }
      const contentMap = widgetMap.get('content') as Y.Map<unknown> | undefined;
      if (!contentMap) {
        return () => {};
      }

      contentMap.observeDeep(onStoreChange);
      return () => {
        contentMap.unobserveDeep(onStoreChange);
      };
    },
    [widgetId],
  );

  const getSnapshot = useCallback((): T | null => {
    const widgetMap = getWidgetMap(widgetId);
    if (!widgetMap) {
      return null;
    }
    const contentMap = widgetMap.get('content') as Y.Map<unknown> | undefined;
    if (!contentMap) {
      return null;
    }
    return yMapToJSON(contentMap) as T;
  }, [widgetId]);

  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

/**
 * Yjs 위젯 Content의 특정 필드를 읽어오는 훅
 *
 * @param widgetId - 위젯 ID
 * @param fieldKey - 필드 키 (예: 'subject', 'branchRules')
 * @returns 필드 값
 */
export function useYjsWidgetField<T = unknown>(
  widgetId: string,
  fieldKey: string,
): T | null {
  const subscribe = useCallback(
    (onStoreChange: () => void) => {
      const widgetMap = getWidgetMap(widgetId);
      if (!widgetMap) {
        return () => {};
      }
      const contentMap = widgetMap.get('content') as Y.Map<unknown> | undefined;
      if (!contentMap) {
        return () => {};
      }

      contentMap.observeDeep(onStoreChange);
      return () => {
        contentMap.unobserveDeep(onStoreChange);
      };
    },
    [widgetId],
  );

  const getSnapshot = useCallback((): T | null => {
    const widgetMap = getWidgetMap(widgetId);
    if (!widgetMap) {
      return null;
    }
    const contentMap = widgetMap.get('content') as Y.Map<unknown> | undefined;
    if (!contentMap) {
      return null;
    }
    const value = contentMap.get(fieldKey);
    return yMapToJSON(value) as T;
  }, [widgetId, fieldKey]);

  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}
