import type {
  YjsWidgetData,
  YjsWidgetType,
} from '../../collaboration/types/yjs-widget.types';

/**
 * 마크다운 섹션 빌더 인터페이스
 */
export interface ISectionBuilder {
  /**
   * 이 빌더가 담당하는 위젯 타입
   */
  readonly widgetType: YjsWidgetType;

  /**
   * 위젯 데이터를 마크다운 문자열 배열로 변환
   * @param widgets 해당 타입의 위젯 데이터 배열
   * @returns 마크다운 라인 배열
   */
  build(widgets: YjsWidgetData[]): string[];
}

export const SECTION_BUILDERS = 'SECTION_BUILDERS';
