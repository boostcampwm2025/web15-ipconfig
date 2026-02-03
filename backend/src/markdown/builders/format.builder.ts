import { Injectable } from '@nestjs/common';
import type {
  YjsWidgetData,
  YjsFormatContent,
} from '../../collaboration/types/yjs-widget.types';
import { createTableRow, addSeparator } from '../utils/markdown-table.util';
import type { ISectionBuilder } from './section-builder.interface';

@Injectable()
export class FormatBuilder implements ISectionBuilder {
  readonly widgetType = 'CODE_FORMAT' as const;

  build(widgets: YjsWidgetData[]): string[] {
    if (!widgets || widgets.length === 0) return [];

    const lines: string[] = [];
    lines.push('## ⚙️ 코드 포맷 (Code Format)');

    widgets.forEach((widget) => {
      const content = widget.content as unknown as YjsFormatContent;

      lines.push('| 설정 (Setting) | 값 (Value) |');
      lines.push('| :--- | :--- |');
      lines.push(createTableRow('줄 길이', `${content.printWidth ?? '-'}`));
      lines.push(
        createTableRow('탭 사용', content.useTabs ? '탭' : '스페이스'),
      );
      lines.push(createTableRow('들여쓰기 폭', `${content.tabWidth ?? '-'}`));
      lines.push(createTableRow('세미콜론', content.semi ? '사용' : '생략'));
      lines.push(
        createTableRow(
          '홑따옴표',
          content.singleQuote ? '홑따옴표' : '쌍따옴표',
        ),
      );
      lines.push(
        createTableRow(
          'JSX 홑따옴표',
          content.jsxSingleQuote ? '홑따옴표' : '쌍따옴표',
        ),
      );
      lines.push(createTableRow('후행 쉼표', content.trailingComma || '-'));
      lines.push(
        createTableRow(
          '중괄호 공백',
          content.bracketSpacing ? '공백 사용' : '공백 없음',
        ),
      );
      lines.push(
        createTableRow(
          '화살표 괄호',
          content.arrowParens === 'avoid' ? '미사용' : '사용',
        ),
      );
      lines.push(
        createTableRow(
          '속성 줄바꿈',
          content.singleAttributePerLine ? '줄바꿈' : '한 줄에 배치',
        ),
      );
      lines.push('');
    });

    addSeparator(lines);
    return lines;
  }
}
