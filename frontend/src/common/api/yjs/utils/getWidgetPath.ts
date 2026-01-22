import type { WidgetType } from '@/common/types/yjsDoc';
import { getWidgetMap } from './getMaps';
import * as Y from 'yjs';
import { WIDGET_PATH_MAP } from '../constants/widgetPathMap';

/**
 * 헬퍼: 위젯 타입과 필드명으로 실제 경로 배열 찾기
 *
 * @param type - 위젯 타입 (예: GIT_CONVENTION)
 * @param fieldKey - 필드 식별자 (예: useGitmoji)
 * @returns {string[] | null} - Yjs 경로 배열 (예: ['commitConvention', 'useGitmoji']) 또는 null
 */
export const getMappedPath = (
  type: WidgetType,
  fieldKey: string,
): string[] | null => {
  const typeMap = WIDGET_PATH_MAP[type];
  if (!typeMap || !typeMap[fieldKey]) {
    console.warn(`[PathMap] 매핑되지 않은 필드: ${type} -> ${fieldKey}`);
    return null;
  }
  return typeMap[fieldKey];
};

// 공통 헬퍼: 경로를 따라가서 Target Y.Map 찾기
/**
 * 주어진 경로 배열을 순회하며 최종적으로 도달하는 Y.Map 객체를 반환합니다.
 * 중간 경로가 없거나 Y.Map이 아닌 경우 null을 반환합니다.
 *
 * @param widgetId - 탐색할 위젯의 ID
 * @param path - 도달하고자 하는 경로 (문자열 배열)
 * @returns {Y.Map<unknown> | null} - 대상 Y.Map 객체
 */
export const getTargetMap = (
  widgetId: string,
  path: string[],
): Y.Map<unknown> | null => {
  const widgetMap = getWidgetMap(widgetId);
  if (!widgetMap) return null;

  let currentMap = widgetMap.get('content') as Y.Map<unknown>;
  // path가 빈 배열이면 content 루트 맵 반환
  if (!currentMap) return null;

  for (const key of path) {
    if (currentMap.has(key)) {
      const next = currentMap.get(key);
      if (next instanceof Y.Map) {
        currentMap = next as Y.Map<unknown>;
      } else {
        console.warn(`[Yjs] 경로 탐색 실패 (Map이 아님): ${key}`);
        return null;
      }
    } else {
      console.warn(`[Yjs] 경로 탐색 실패 (키 없음): ${key}`);
      return null;
    }
  }
  return currentMap;
};
