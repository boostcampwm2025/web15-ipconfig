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

      const meeting = getSelectedValue(content.communication?.meeting);
      const chat = getSelectedValue(content.communication?.chat);
      const doc = getSelectedValue(content.communication?.doc);
      const announce = getSelectedValue(content.communication?.announce);

      if (meeting)
        lines.push(createTableRow('**🚨 회의 (Meeting)**', `\`${meeting}\``));
      if (doc) lines.push(createTableRow('**📨 기록 (Doc)**', `\`${doc}\``));
      if (announce)
        lines.push(createTableRow('**📝 공지 (Announce)**', `\`${announce}\``));
      if (chat)
        lines.push(createTableRow('**🗣️ 그 외 소통 (Chat)**', `\`${chat}\``));

      lines.push('');

      // SLA & Time
      lines.push('### ⏳ 시간 관리 및 미팅');

      const responseTime = content.sla?.responseTime ?? 0;
      const coreStart = content.timeManagement?.coreTimeStart || '-';
      const coreEnd = content.timeManagement?.coreTimeEnd || '-';
      const noMeetingDay = content.meeting?.noMeetingDay || '-';
      const feedbackStyle = content.meeting?.feedbackStyle || '-';

      const FEEDBACK_STYLE_LABELS: Record<string, string> = {
        Soft: '부드럽게',
        Honest: '솔직하게',
        Retrospective: '회고 중심',
      };

      const feedbackLabel =
        FEEDBACK_STYLE_LABELS[feedbackStyle] || feedbackStyle;

      lines.push(
        `- **코어 타임 (Core Time)**: \`${coreStart}\` ~ \`${coreEnd}\``,
      );
      lines.push(`- **최대 응답 시간 (SLA)**: ${responseTime}h`);
      lines.push(`- **미팅 없는 날**: ${noMeetingDay}`);
      lines.push(`- **피드백 스타일**: ${feedbackLabel}`);
      lines.push('');
    });

    addSeparator(lines);
    return lines;
  }
}
