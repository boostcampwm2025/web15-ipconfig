import { Injectable } from '@nestjs/common';
import type {
  YjsWidgetData,
  YjsTechStackContent,
} from '../../collaboration/types/yjs-widget.types';
import { getSelectedValue } from '../../collaboration/utils/yjs-widget.utils';
import { addSeparator } from '../utils/markdown-table.util';
import type { ISectionBuilder } from './section-builder.interface';

@Injectable()
export class TechStackBuilder implements ISectionBuilder {
  readonly widgetType = 'TECH_STACK' as const;

  build(widgets: YjsWidgetData[]): string[] {
    if (!widgets || widgets.length === 0) return [];

    const lines: string[] = [];
    lines.push('## 🛠 기술 스택');

    widgets.forEach((widget) => {
      const content = widget.content as unknown as YjsTechStackContent;
      const subject = getSelectedValue(content.subject) || '';

      if (content.techItems && content.techItems.length > 0) {
        lines.push(`### ${subject}`);
        let techStackBadges = '';
        content.techItems.forEach((item) => {
          techStackBadges += `![${item.name}](https://img.shields.io/badge/${item.slug}-${item.color}?style=flat&logo=${item.slug}&logoColor=white)`;
        });
        lines.push(techStackBadges);
        lines.push('');
      }
    });

    addSeparator(lines);
    return lines;
  }
}
