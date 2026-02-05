import type { YjsSelector, YjsMultiSelector } from '../types/yjs-widget.types';

/**
 * Selector에서 선택된 값 조회
 * - options에 해당 키가 있으면 options[selectedId].value 반환
 * - options가 비어있거나 키가 없으면 selectedId 자체를 반환
 */
export function getSelectedValue(
  selector: YjsSelector | undefined | null,
): string | undefined {
  if (!selector?.selectedId) {
    return undefined;
  }
  return selector.options?.[selector.selectedId]?.value ?? selector.selectedId;
}

/**
 * MultiSelector에서 선택된 값 목록 조회
 * - options에 해당 키가 있으면 options[id].value 반환
 * - options가 비어있거나 키가 없으면 id 자체를 반환
 */
export function getSelectedValues(
  multiSelector: YjsMultiSelector | undefined | null,
): string[] {
  if (!multiSelector?.selectedIds) {
    return [];
  }
  return multiSelector.selectedIds.map((id) => {
    return multiSelector.options?.[id]?.value ?? id;
  });
}
