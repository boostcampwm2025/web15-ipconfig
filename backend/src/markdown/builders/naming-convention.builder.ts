import { Injectable } from '@nestjs/common';
import type {
  YjsWidgetData,
  YjsNamingConventionContent,
} from '../../collaboration/types/yjs-widget.types';
import { createTableRow, addSeparator } from '../utils/markdown-table.util';
import type { ISectionBuilder } from './section-builder.interface';

@Injectable()
export class NamingConventionBuilder implements ISectionBuilder {
  readonly widgetType = 'NAMING_CONVENTION' as const;

  build(widgets: YjsWidgetData[]): string[] {
    if (!widgets || widgets.length === 0) return [];

    const lines: string[] = [];
    lines.push('## 📝 네이밍 컨벤션');

    widgets.forEach((widget) => {
      const content = widget.content as unknown as YjsNamingConventionContent;

      const categories = [
        {
          title: 'Frontend',
          items: [
            { label: '변수', value: content.frontend?.variable },
            { label: '함수', value: content.frontend?.function },
            { label: '컴포넌트', value: content.frontend?.component },
            { label: '상수', value: content.frontend?.constant },
          ],
        },
        {
          title: 'Backend',
          items: [
            { label: '변수', value: content.backend?.variable },
            { label: '함수', value: content.backend?.function },
            { label: '클래스', value: content.backend?.class },
            { label: '상수', value: content.backend?.constant },
          ],
        },
        {
          title: 'Database',
          items: [
            { label: '테이블', value: content.database?.table },
            { label: '컬럼', value: content.database?.column },
            { label: '인덱스', value: content.database?.index },
            { label: '제약조건', value: content.database?.constraint },
          ],
        },
        {
          title: 'Common',
          items: [
            { label: '유틸리티', value: content.common?.utility },
            { label: '상수', value: content.common?.constant },
            { label: '타입', value: content.common?.type },
            { label: '열거형', value: content.common?.enum },
          ],
        },
      ];

      categories.forEach((category) => {
        // 모든 아이템을 항상 표시
        lines.push(`### ${category.title}`);
        lines.push('| 구분 | 컨벤션 |');
        lines.push('| :--- | :--- |');
        category.items.forEach((item) => {
          lines.push(createTableRow(item.label, item.value || '-'));
        });
        lines.push('');
      });
    });

    addSeparator(lines);
    return lines;
  }
}
