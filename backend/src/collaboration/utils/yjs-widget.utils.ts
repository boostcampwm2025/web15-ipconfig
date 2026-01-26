import type { YjsSelector, YjsMultiSelector } from '../types/yjs-widget.types';

/**
 * Selector에서 선택된 값 조회
 */
export function getSelectedValue(selector: YjsSelector): string | undefined {
  return selector.options[selector.selectedId]?.value;
}

/**
 * MultiSelector에서 선택된 값 목록 조회
 */
export function getSelectedValues(multiSelector: YjsMultiSelector): string[] {
  return multiSelector.selectedIds
    .map((id) => multiSelector.options[id]?.value)
    .filter((v): v is string => !!v);
}
