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

      // Frontend
      lines.push('### Frontend');
      lines.push('| 구분 | 컨벤션 |');
      lines.push('| :--- | :--- |');
      lines.push(createTableRow('변수', content.frontend?.variable || '-'));
      lines.push(createTableRow('함수', content.frontend?.function || '-'));
      lines.push(
        createTableRow('컴포넌트', content.frontend?.component || '-'),
      );
      lines.push(createTableRow('상수', content.frontend?.constant || '-'));
      lines.push('');

      // Backend
      lines.push('### Backend');
      lines.push('| 구분 | 컨벤션 |');
      lines.push('| :--- | :--- |');
      lines.push(createTableRow('변수', content.backend?.variable || '-'));
      lines.push(createTableRow('함수', content.backend?.function || '-'));
      lines.push(createTableRow('클래스', content.backend?.class || '-'));
      lines.push(createTableRow('상수', content.backend?.constant || '-'));
      lines.push('');

      // Database
      lines.push('### Database');
      lines.push('| 구분 | 컨벤션 |');
      lines.push('| :--- | :--- |');
      lines.push(createTableRow('테이블', content.database?.table || '-'));
      lines.push(createTableRow('컬럼', content.database?.column || '-'));
      lines.push(createTableRow('인덱스', content.database?.index || '-'));
      lines.push(
        createTableRow('제약조건', content.database?.constraint || '-'),
      );
      lines.push('');

      // Common
      lines.push('### Common');
      lines.push('| 구분 | 컨벤션 |');
      lines.push('| :--- | :--- |');
      lines.push(createTableRow('유틸리티', content.common?.utility || '-'));
      lines.push(createTableRow('상수', content.common?.constant || '-'));
      lines.push(createTableRow('타입', content.common?.type || '-'));
      lines.push(createTableRow('열거형', content.common?.enum || '-'));
      lines.push('');
    });

    addSeparator(lines);
    return lines;
  }
}
