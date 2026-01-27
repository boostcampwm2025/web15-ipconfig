import * as Y from 'yjs';

import type { OptionItem, WidgetType } from '@/common/types/yjsDoc';
import { doc } from '../instance';
import { getMappedPath, getTargetMap } from '../utils/getWidgetPath';
import { toYType } from '../utils/translateData';

// 일반 값 수정
/**
 * Primitive Value (문자열, 숫자, 불리언) 필드를 업데이트합니다.
 * 주어진 위젯 타입과 필드 키를 기반으로 Yjs 내부 경로를 찾아 값을 설정합니다.
 *
 * @param widgetId - 대상 위젯 ID
 * @param type - 위젯 타입 (경로 매핑용)
 * @param fieldKey - 업데이트할 필드 식별자 (getWidgetPath에 정의됨)
 * @param value - 새로운 값
 */
export const updatePrimitiveFieldAction = (
  widgetId: string,
  type: WidgetType,
  fieldKey: string,
  value: string | number | boolean,
) => {
  doc.transact(() => {
    // 1. 전체 경로 가져오기 (예: ['commitConvention', 'useGitmoji'])
    const fullPath = getMappedPath(type, fieldKey);
    if (!fullPath) return;

    // 2. 부모 경로와 타겟 키 분리
    // parentPath: ['commitConvention']
    // targetKey: 'useGitmoji'
    const parentPath = fullPath.slice(0, -1);
    const targetKey = fullPath[fullPath.length - 1];

    // 3. 부모 맵 찾기
    const parentMap = getTargetMap(widgetId, parentPath);

    // 4. 값 설정
    if (parentMap) {
      parentMap.set(targetKey, value);
    }
  });
};

// Selector 선택 수정
/**
 * 단일 선택(Selector) 필드의 선택된 ID(selectedId)를 업데이트합니다.
 *
 * @param widgetId - 대상 위젯 ID
 * @param type - 위젯 타입
 * @param fieldKey - Selector가 위치한 필드 키
 * @param newSelectedId - 새로 선택된 옵션의 ID
 */
export const updateSelectorPickAction = (
  widgetId: string,
  type: WidgetType,
  fieldKey: string,
  newSelectedId: string,
) => {
  doc.transact(() => {
    const selectorPath = getMappedPath(type, fieldKey);
    if (!selectorPath) return;

    const selectorMap = getTargetMap(widgetId, selectorPath);

    if (selectorMap) {
      selectorMap.set('selectedId', newSelectedId);
    }
  });
};

// MultiSelector 선택 수정
/**
 * 다중 선택(MultiSelector) 필드의 선택된 ID 목록(selectedIds)을 업데이트합니다.
 * 내부적으로 Y.Array를 새로 생성하여 교체하는 방식을 사용합니다.
 *
 * @param widgetId - 대상 위젯 ID
 * @param type - 위젯 타입
 * @param fieldKey - MultiSelector가 위치한 필드 키
 * @param newSelectedIds - 새로 선택된 옵션 ID들의 배열
 */
export const updateMultiSelectorPickAction = (
  widgetId: string,
  type: WidgetType,
  fieldKey: string,
  newSelectedIds: string[],
) => {
  doc.transact(() => {
    const multiSelectorPath = getMappedPath(type, fieldKey);
    if (!multiSelectorPath) return;

    const selectorMap = getTargetMap(widgetId, multiSelectorPath);

    if (selectorMap) {
      const existingArray = selectorMap.get('selectedIds');
      const convertedItems = newSelectedIds.map(toYType);

      if (existingArray instanceof Y.Array) {
        existingArray.delete(0, existingArray.length);
        existingArray.push(convertedItems);
      } else {
        const yArray = new Y.Array();
        yArray.push(convertedItems);
        selectorMap.set('selectedIds', yArray);
      }
    }
  });
};

// 옵션(Options) 추가/수정/삭제

// 옵션 Upsert
/**
 * Selector 또는 MultiSelector 내의 옵션 목록에 새로운 옵션을 추가하거나 기존 옵션을 수정합니다.
 *
 * @param widgetId - 대상 위젯 ID
 * @param type - 위젯 타입
 * @param fieldKey - Selector가 위치한 필드 키
 * @param optionKey - 옵션의 고유 Key (ID)
 * @param optionValue - 옵션의 표시 값 (Value)
 */
export const upsertOptionAction = (
  widgetId: string,
  type: WidgetType,
  fieldKey: string,
  optionKey: string,
  optionValue: string,
) => {
  doc.transact(() => {
    const selectorPath = getMappedPath(type, fieldKey);
    if (!selectorPath) return;

    const selectorMap = getTargetMap(widgetId, selectorPath);
    if (!selectorMap) return;

    const optionsMap = selectorMap.get('options') as Y.Map<unknown>;

    if (optionsMap) {
      const newOption: OptionItem = {
        value: optionValue,
        createdAt: Date.now(),
      };
      optionsMap.set(optionKey, toYType(newOption));
    }
  });
};

// 옵션 삭제
/**
 * Selector 또는 MultiSelector 내의 특정 옵션을 삭제합니다.
 *
 * @param widgetId - 대상 위젯 ID
 * @param type - 위젯 타입
 * @param fieldKey - Selector가 위치한 필드 키
 * @param optionKey - 삭제할 옵션의 Key (ID)
 */
export const removeOptionAction = (
  widgetId: string,
  type: WidgetType,
  fieldKey: string,
  optionKey: string,
) => {
  doc.transact(() => {
    const selectorPath = getMappedPath(type, fieldKey);
    if (!selectorPath) return;

    const selectorMap = getTargetMap(widgetId, selectorPath);
    if (!selectorMap) return;

    const optionsMap = selectorMap.get('options') as Y.Map<unknown>;

    if (optionsMap && optionsMap.has(optionKey)) {
      optionsMap.delete(optionKey);
    }
  });
};

// 배열 형태의 Content 필드 업데이트 (Generic)
/**
 * 특정 필드의 배열 데이터를 통째로 교체합니다.
 * (예: TechStackWidget의 techItems 등)
 *
 * @param widgetId - 대상 위젯 ID
 * @param type - 위젯 타입
 * @param fieldKey - 필드 키
 * @param items - 교체할 아이템 배열
 */
export const updateArrayContentAction = (
  widgetId: string,
  type: WidgetType,
  fieldKey: string,
  items: unknown[],
) => {
  doc.transact(() => {
    const fieldPath = getMappedPath(type, fieldKey);
    if (!fieldPath) return;

    const parentPath = fieldPath.slice(0, -1);
    const targetKey = fieldPath[fieldPath.length - 1];
    const parentMap = getTargetMap(widgetId, parentPath);

    if (parentMap) {
      const convertedItems = items.map(toYType);
      const existingArray = parentMap.get(targetKey);

      if (existingArray instanceof Y.Array) {
        existingArray.delete(0, existingArray.length);
        existingArray.push(convertedItems);
      } else {
        const yArray = new Y.Array();
        yArray.push(convertedItems);
        parentMap.set(targetKey, yArray);
      }
    }
  });
};
