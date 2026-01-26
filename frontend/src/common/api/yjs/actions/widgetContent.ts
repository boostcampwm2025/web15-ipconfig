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
      const yArray = new Y.Array();
      yArray.push(newSelectedIds);
      selectorMap.set('selectedIds', yArray);
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
      const yArray = new Y.Array();
      const convertedItems = items.map(toYType);
      yArray.push(convertedItems);
      parentMap.set(targetKey, yArray);
    }
  });
};

// Map 형태의 Content 필드 업데이트 (Generic)
/**
 * 특정 필드의 Map 데이터를 통째로 교체합니다.
 * (예: Selector/MultiSelector의 options 등)
 *
 * @param widgetId - 대상 위젯 ID
 * @param type - 위젯 타입
 * @param fieldKey - 필드 키 (예: 'branchRules') -> 내부 경로 매핑 필요?
 *                   NOTE: getMappedPath는 최하위 필드까지의 경로를 반환함.
 *                   options 맵을 교체하려면 fieldKey가 'prefixes'일 때 그 아래 'options'를 타겟팅해야 함.
 *                   이 함수는 'fieldKey'가 가리키는 Map 자체를 교체하거나, subKey를 받을 수 있어야 함.
 *                   여기서는 fieldKey가 가리키는 대상이 Map이면 그것을, 아니면 그 안의 특정 키를 찾도록 유연성 확보가 필요하나,
 *                   단순화를 위해 "fieldKey가 가리키는 경로의 값(Map)"을 교체하는 것으로 정의.
 * @param newMapData - 새로운 데이터 객체
 */
export const replaceMapAction = (
  widgetId: string,
  type: WidgetType,
  fieldKey: string, // 예: 'prefixes' (이 경로의 selectedIds는 냅두고 options만 바꾸려면? 별도 액션 필요)
  // 'options'를 바꾸려면 fieldKey='prefixes'가 아니라 path=['branchRules', 'prefixes', 'options'] 여야 함.
  // getMappedPath는 ['branchRules', 'prefixes'] 만 리턴함.
  // 따라서 추가 subPath 인자가 필요함.
  subPath: string[], // 예: ['options']
  newMapData: Record<string, unknown>,
) => {
  doc.transact(() => {
    const basePath = getMappedPath(type, fieldKey);
    if (!basePath) return;

    const fullPath = [...basePath, ...subPath];
    const parentPath = fullPath.slice(0, -1);
    const targetKey = fullPath[fullPath.length - 1];

    // 타겟의 부모 맵을 찾음
    const parentMap = getTargetMap(widgetId, parentPath);
    if (!parentMap) return;

    // 타겟(예: 'options')이 Map이어야 함.
    // 기존 맵을 가져오거나 새로 생성?
    // 보통 options는 이미 존재.
    // 내용을 싹 비우고 새로 채움.

    // 만약 parentMap에 targetKey가 없다면 set으로 넣어야 함.
    // 있으면 get해서 clear.
    let targetMap: Y.Map<unknown>;

    if (parentMap.has(targetKey)) {
      const existing = parentMap.get(targetKey);
      if (existing instanceof Y.Map) {
        targetMap = existing as Y.Map<unknown>;
        targetMap.clear();
      } else {
        // 맵이 아니면 덮어쓰기 위해 새로 만듦
        targetMap = new Y.Map();
        parentMap.set(targetKey, targetMap);
      }
    } else {
      targetMap = new Y.Map();
      parentMap.set(targetKey, targetMap);
    }

    Object.entries(newMapData).forEach(([key, value]) => {
      targetMap.set(key, toYType(value));
    });
  });
};
