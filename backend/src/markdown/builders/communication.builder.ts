import { Injectable } from '@nestjs/common';
import type {
  YjsWidgetData,
  YjsCommunicationContent,
} from '../../collaboration/types/yjs-widget.types';
import { getSelectedValue } from '../../collaboration/utils/yjs-widget.utils';
import { createTableRow, addSeparator } from '../utils/markdown-table.util';
import type { ISectionBuilder } from './section-builder.interface';

@Injectable()
export class CommunicationBuilder implements ISectionBuilder {
  readonly widgetType = 'COMMUNICATION' as const;

  build(widgets: YjsWidgetData[]): string[] {
    if (!widgets || widgets.length === 0) return [];

    const lines: string[] = [];
    lines.push('## 💬 커뮤니케이션');

    widgets.forEach((widget) => {
      const content = widget.content as unknown as YjsCommunicationContent;

      // 커뮤니케이션 수단 섹션
      lines.push('### 📢 채널 가이드');
      lines.push('| 상황 | 채널 |');
      lines.push('| :--- | :--- |');

      const urgent = getSelectedValue(content.communication?.urgent);
      const sync = getSelectedValue(content.communication?.sync);
      const async = getSelectedValue(content.communication?.async);
      const official = getSelectedValue(content.communication?.official);

      if (urgent)
        lines.push(createTableRow('**🚨 긴급 (Urgent)**', `\`${urgent}\``));
      if (sync) lines.push(createTableRow('**🗣️ 동기 (Sync)**', `\`${sync}\``));
      if (async)
        lines.push(createTableRow('**📨 비동기 (Async)**', `\`${async}\``));
      if (official)
        lines.push(createTableRow('**📝 공식 (Official)**', `\`${official}\``));
      lines.push('');

      // SLA & Time
      lines.push('### ⏳ 시간 관리 및 미팅');

      const responseTime = content.sla?.responseTime ?? 0;
      const coreStart = content.timeManagement?.coreTimeStart || '-';
      const coreEnd = content.timeManagement?.coreTimeEnd || '-';
      const noMeetingDay = content.meeting?.noMeetingDay || '-';
      const feedbackStyle = content.meeting?.feedbackStyle || '-';

      lines.push(
        `- **코어 타임 (Core Time)**: \`${coreStart}\` ~ \`${coreEnd}\``,
      );
      lines.push(`- **최대 응답 시간 (SLA)**: ${responseTime}h`);
      lines.push(`- **미팅 없는 날**: ${noMeetingDay}`);
      lines.push(`- **피드백 스타일**: ${feedbackStyle}`);
      lines.push('');
    });

    addSeparator(lines);
    return lines;
  }
}
