import { Injectable } from '@nestjs/common';
import type {
  YjsWidgetData,
  YjsCollaborationContent,
} from '../../collaboration/types/yjs-widget.types';
import {
  getSelectedValue,
  getSelectedValues,
} from '../../collaboration/utils/yjs-widget.utils';
import { createTableRow, addSeparator } from '../utils/markdown-table.util';
import type { ISectionBuilder } from './section-builder.interface';

@Injectable()
export class CollaborationBuilder implements ISectionBuilder {
  readonly widgetType = 'COLLABORATION' as const;

  build(widgets: YjsWidgetData[]): string[] {
    if (!widgets || widgets.length === 0) return [];

    const lines: string[] = [];
    lines.push('## 🤝 협업 규칙');

    widgets.forEach((widget) => {
      const content = widget.content as unknown as YjsCollaborationContent;

      // PR 규칙 섹션
      lines.push('### 🔀 Pull Request 규칙');
      const version = getSelectedValue(content.prRules?.activeVersion) || '-';
      const strategy = getSelectedValue(content.prRules?.activeStrategy) || '-';
      const labels = getSelectedValues(content.prRules?.labelRules);
      const labelsStr =
        labels.length > 0 ? labels.map((l) => `\`${l}\``).join(', ') : '-';

      lines.push(`- **버전 관리 (VCS)**: \`${version}\``);
      lines.push(`- **Merge 전략**: \`${strategy}\``);
      lines.push(`- **필수 라벨**: ${labelsStr}`);
      lines.push('');

      // 리뷰 정책 섹션
      lines.push('### 🧐 리뷰 정책 (Review Policy)');
      lines.push('| 항목 | 설정값 | 비고 |');
      lines.push('| :--- | :--- | :--- |');

      const approves = content.reviewPolicy?.approves ?? 0;
      const maxHours = content.reviewPolicy?.maxReviewHours ?? 0;
      const blockMerge = content.reviewPolicy?.blockMerge
        ? '🔴 **YES**'
        : '⚪ No';

      lines.push(
        createTableRow(
          '**최소 승인(Approve)**',
          `🛡️ **${approves}명**`,
          '최소 승인 인원',
        ),
      );
      lines.push(
        createTableRow(
          '**리뷰 제한 시간**',
          `⏰ **${maxHours}h**`,
          '이내 리뷰 완료',
        ),
      );
      lines.push(
        createTableRow(
          '**Merge 차단 여부**',
          blockMerge,
          '승인 없으면 머지 불가',
        ),
      );
      lines.push('');

      // 워크플로우 섹션
      lines.push('### 🔄 워크플로우 (Workflow)');
      const platform = getSelectedValue(content.workflow?.platform) || '-';
      const cycleValue = content.workflow?.cycleValue ?? 0;
      const cycleUnit = content.workflow?.cycleUnit || '-';

      lines.push(`- **플랫폼**: ${platform}`);
      lines.push(`- **주기 (Cycle)**: ${cycleValue}${cycleUnit}`);
      lines.push('');
    });

    addSeparator(lines);
    return lines;
  }
}
