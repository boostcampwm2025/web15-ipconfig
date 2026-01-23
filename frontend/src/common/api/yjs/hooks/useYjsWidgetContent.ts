import { useSyncExternalStore, useCallback, useRef } from 'react';
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
 * 두 값을 JSON 문자열로 비교하여 동일한지 확인
 */
const isEqual = (a: unknown, b: unknown): boolean => {
  return JSON.stringify(a) === JSON.stringify(b);
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
  const cachedValueRef = useRef<T | null>(null);

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
    const newValue = yMapToJSON(contentMap) as T;

    // 캐시된 값과 동일하면 캐시된 참조를 반환 (무한 루프 방지)
    if (isEqual(cachedValueRef.current, newValue)) {
      return cachedValueRef.current;
    }

    cachedValueRef.current = newValue;
    return newValue;
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
  const cachedValueRef = useRef<T | null>(null);

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
    const newValue = yMapToJSON(value) as T;

    // 캐시된 값과 동일하면 캐시된 참조를 반환 (무한 루프 방지)
    if (isEqual(cachedValueRef.current, newValue)) {
      return cachedValueRef.current;
    }

    cachedValueRef.current = newValue;
    return newValue;
  }, [widgetId, fieldKey]);

  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}
