import { Injectable } from '@nestjs/common';
import { YjsDocReaderService } from '../collaboration/yjs-doc-reader.service';
import type {
  YjsWidgetData,
  YjsGitConventionContent,
  YjsTechStackContent,
  YjsPostItContent,
  YjsCollaborationContent,
  YjsCommunicationContent,
  YjsNamingConventionContent,
  YjsFormatContent,
} from '../collaboration/types/yjs-widget.types';
import {
  getSelectedValue,
  getSelectedValues,
} from '../collaboration/utils/yjs-widget.utils';

@Injectable()
export class MarkdownService {
  constructor(private readonly yjsDocReader: YjsDocReaderService) {}

  /**
   * 마크다운 표의 행(Row) 생성
   */
  private createTableRow(col1: string, col2: string, col3?: string): string {
    return col3 ? `| ${col1} | ${col2} | ${col3} |` : `| ${col1} | ${col2} |`;
  }

  /**
   * 섹션 간 구분선 추가
   */
  private addSeparator(lines: string[]) {
    lines.push('');
    lines.push('---');
    lines.push('');
  }

  private buildGitConventionSection(widgets: YjsWidgetData[]): string[] {
    if (!widgets || widgets.length === 0) return [];

    const lines: string[] = [];
    lines.push('## 🐙 Git 컨벤션');

    widgets.forEach((widget) => {
      const content = widget.content as unknown as YjsGitConventionContent;

      lines.push('### 🧩 브랜치 전략');
      const strategy = getSelectedValue(content.strategy);
      let strategyName = '';
      let description = '';

      switch (strategy) {
        case 'GITHUB_FLOW':
          strategyName = 'GitHub Flow';
          description = 'main 브랜치를 중심으로 feature 브랜치에서 작업합니다.';
          break;
        case 'GIT_FLOW':
          strategyName = 'Git Flow';
          description =
            'main, develop, feature, release, hotfix 브랜치를 사용하여 체계적으로 관리합니다.';
          break;
        case 'TRUNK_BASED':
          strategyName = 'Trunk Based';
          description = '단일 main 브랜치에서 짧은 주기로 빠르게 통합합니다.';
          break;
      }

      lines.push(`> **${strategyName}**`);
      lines.push(`> "${description}"`);
      lines.push('');

      lines.push('### 🌿 브랜치 규칙');
      lines.push('| 구분 | 브랜치명 / Prefix |');
      lines.push('| :--- | :--- |');

      const mainBranch = content.branchRules?.mainBranch || '-';
      const developBranch = content.branchRules?.developBranch || '-';
      const prefixes = getSelectedValues(content.branchRules?.prefixes);
      const prefixesStr =
        prefixes.length > 0 ? prefixes.map((p) => `\`${p}\``).join(', ') : '-';

      lines.push(this.createTableRow('**Main 브랜치**', `\`${mainBranch}\``));
      if (developBranch && developBranch !== '-') {
        lines.push(
          this.createTableRow('**Develop 브랜치**', `\`${developBranch}\``),
        );
      }
      lines.push(this.createTableRow('**Prefix 목록**', prefixesStr));
      lines.push('');

      lines.push('### 📝 커밋 컨벤션');
      const commitTypes = getSelectedValues(
        content.commitConvention?.commitTypes,
      );

      if (commitTypes.length > 0) {
        // 내용이 길어질 수 있으므로 접기/펼치기(Toggle) 적용
        lines.push('<details open>');
        lines.push(
          '<summary><b>허용된 커밋 타입(Commit Types) 보기</b></summary>',
        );
        lines.push(''); // 마크다운 렌더링용 공백

        commitTypes.forEach((type) => {
          lines.push(`- \`${type}\``);
        });

        lines.push('');
        lines.push('</details>');
      }
      lines.push('');
    });

    this.addSeparator(lines);
    return lines;
  }

  private buildTechStackSection(widgets: YjsWidgetData[]): string[] {
    if (!widgets || widgets.length === 0) return [];

    const lines: string[] = [];
    lines.push('## 🛠 기술 스택');

    widgets.forEach((widget) => {
      const content = widget.content as unknown as YjsTechStackContent;
      const subject = getSelectedValue(content.subject) || '';

      if (content.techItems && content.techItems.length > 0) {
        lines.push(`### ${subject}`);
        content.techItems.forEach((item) => {
          lines.push(`- **${item.name}**`);
        });
        lines.push('');
      }
    });

    this.addSeparator(lines);
    return lines;
  }

  private buildNamingConventionSection(widgets: YjsWidgetData[]): string[] {
    if (!widgets || widgets.length === 0) return [];

    const lines: string[] = [];
    lines.push('## 📝 네이밍 컨벤션');

    widgets.forEach((widget) => {
      const content = widget.content as unknown as YjsNamingConventionContent;

      // Frontend
      lines.push('### Frontend');
      lines.push('| 구분 | 컨벤션 |');
      lines.push('| :--- | :--- |');
      lines.push(
        this.createTableRow('변수', content.frontend?.variable || '-'),
      );
      lines.push(
        this.createTableRow('함수', content.frontend?.function || '-'),
      );
      lines.push(
        this.createTableRow('컴포넌트', content.frontend?.component || '-'),
      );
      lines.push(
        this.createTableRow('상수', content.frontend?.constant || '-'),
      );
      lines.push('');

      // Backend
      lines.push('### Backend');
      lines.push('| 구분 | 컨벤션 |');
      lines.push('| :--- | :--- |');
      lines.push(this.createTableRow('변수', content.backend?.variable || '-'));
      lines.push(this.createTableRow('함수', content.backend?.function || '-'));
      lines.push(this.createTableRow('클래스', content.backend?.class || '-'));
      lines.push(this.createTableRow('상수', content.backend?.constant || '-'));
      lines.push('');

      // Database
      lines.push('### Database');
      lines.push('| 구분 | 컨벤션 |');
      lines.push('| :--- | :--- |');
      lines.push(this.createTableRow('테이블', content.database?.table || '-'));
      lines.push(this.createTableRow('컬럼', content.database?.column || '-'));
      lines.push(this.createTableRow('인덱스', content.database?.index || '-'));
      lines.push(
        this.createTableRow('제약조건', content.database?.constraint || '-'),
      );
      lines.push('');

      // Common
      lines.push('### Common');
      lines.push('| 구분 | 컨벤션 |');
      lines.push('| :--- | :--- |');
      lines.push(
        this.createTableRow('유틸리티', content.common?.utility || '-'),
      );
      lines.push(this.createTableRow('상수', content.common?.constant || '-'));
      lines.push(this.createTableRow('타입', content.common?.type || '-'));
      lines.push(this.createTableRow('열거형', content.common?.enum || '-'));
      lines.push('');
    });

    this.addSeparator(lines);
    return lines;
  }

  private buildFormatSection(widgets: YjsWidgetData[]): string[] {
    if (!widgets || widgets.length === 0) return [];

    const lines: string[] = [];
    lines.push('## ⚙️ 코드 포맷 (Code Format)');

    widgets.forEach((widget) => {
      const content = widget.content as unknown as YjsFormatContent;

      lines.push('| 설정 (Setting) | 값 (Value) |');
      lines.push('| :--- | :--- |');
      lines.push(
        this.createTableRow('줄 길이', `${content.printWidth ?? '-'}`),
      );
      lines.push(
        this.createTableRow('탭 사용', content.useTabs ? '탭' : '스페이스'),
      );
      lines.push(
        this.createTableRow('들여쓰기 폭', `${content.tabWidth ?? '-'}`),
      );
      lines.push(
        this.createTableRow('세미콜론', content.semi ? '사용' : '생략'),
      );
      lines.push(
        this.createTableRow(
          '홑따옴표',
          content.singleQuote ? '홑따옴표' : '쌍따옴표',
        ),
      );
      lines.push(
        this.createTableRow(
          'JSX 홑따옴표',
          content.jsxSingleQuote ? '홑따옴표' : '쌍따옴표',
        ),
      );
      lines.push(
        this.createTableRow('후행 쉼표', content.trailingComma || '-'),
      );
      lines.push(
        this.createTableRow(
          '중괄호 공백',
          content.bracketSpacing ? '공백 사용' : '공백 없음',
        ),
      );
      lines.push(
        this.createTableRow(
          '화살표 괄호',
          content.arrowParens === 'avoid' ? '미사용' : '사용',
        ),
      );
      lines.push(
        this.createTableRow(
          '속성 줄바꿈',
          content.singleAttributePerLine ? '줄바꿈' : '한 줄에 배치',
        ),
      );
      lines.push('');
    });

    this.addSeparator(lines);
    return lines;
  }

  private buildCollaborationSection(widgets: YjsWidgetData[]): string[] {
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
        this.createTableRow(
          '**최소 승인(Approve)**',
          `🛡️ **${approves}명**`,
          '최소 승인 인원',
        ),
      );
      lines.push(
        this.createTableRow(
          '**리뷰 제한 시간**',
          `⏰ **${maxHours}h**`,
          '이내 리뷰 완료',
        ),
      );
      lines.push(
        this.createTableRow(
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

    this.addSeparator(lines);
    return lines;
  }

  private buildCommunicationSection(widgets: YjsWidgetData[]): string[] {
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
        lines.push(
          this.createTableRow('**🚨 긴급 (Urgent)**', `\`${urgent}\``),
        );
      if (sync)
        lines.push(this.createTableRow('**🗣️ 동기 (Sync)**', `\`${sync}\``));
      if (async)
        lines.push(
          this.createTableRow('**📨 비동기 (Async)**', `\`${async}\``),
        );
      if (official)
        lines.push(
          this.createTableRow('**📝 공식 (Official)**', `\`${official}\``),
        );
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

    this.addSeparator(lines);
    return lines;
  }

  private buildElseSection(widgets: YjsWidgetData[]): string[] {
    if (!widgets || widgets.length === 0) return [];

    const lines: string[] = [];

    lines.push('## 📌 그 외');

    widgets.forEach((widget) => {
      const content = widget.content as unknown as YjsPostItContent;
      if (content.text) {
        lines.push(content.text);
        lines.push('');
      }
    });

    lines.push('');
    return lines;
  }

  generateMarkdown(workspaceId: string): string {
    const now = new Date();
    const formattedDate = now.toLocaleString('ko-KR', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });

    const markdownParts: string[] = [];

    markdownParts.push(`> **문서 생성 일시**: ${formattedDate}`);
    markdownParts.push('');

    const allWidgets = this.yjsDocReader.getWidgets(workspaceId);

    // 기술 스택
    const techStackWidgets = allWidgets.filter(
      (widget) => widget.type === 'TECH_STACK',
    );
    markdownParts.push(...this.buildTechStackSection(techStackWidgets));

    // 네이밍 컨벤션
    const namingConventionWidgets = allWidgets.filter(
      (widget) => widget.type === 'NAMING_CONVENTION',
    );
    markdownParts.push(
      ...this.buildNamingConventionSection(namingConventionWidgets),
    );

    // 코드 포맷
    const formatWidgets = allWidgets.filter(
      (widget) => widget.type === 'CODE_FORMAT',
    );
    markdownParts.push(...this.buildFormatSection(formatWidgets));

    // Git 컨벤션
    const groundRuleWidgets = allWidgets.filter(
      (widget) => widget.type === 'GIT_CONVENTION',
    );
    markdownParts.push(...this.buildGitConventionSection(groundRuleWidgets));

    // 협업 규칙
    const collaborationWidgets = allWidgets.filter(
      (widget) => widget.type === 'COLLABORATION',
    );
    markdownParts.push(...this.buildCollaborationSection(collaborationWidgets));

    // 커뮤니케이션
    const communicationWidgets = allWidgets.filter(
      (widget) => widget.type === 'COMMUNICATION',
    );
    markdownParts.push(...this.buildCommunicationSection(communicationWidgets));

    // 그 외
    const postItWidgets = allWidgets.filter(
      (widget) => widget.type === 'POST_IT',
    );
    markdownParts.push(...this.buildElseSection(postItWidgets));

    // 내용 없음 처리
    if (
      groundRuleWidgets.length === 0 &&
      collaborationWidgets.length === 0 &&
      communicationWidgets.length === 0 &&
      techStackWidgets.length === 0 &&
      namingConventionWidgets.length === 0 &&
      formatWidgets.length === 0 &&
      postItWidgets.length === 0
    ) {
      markdownParts.push('### 🚀 아직 작성된 내용이 없습니다.');
      markdownParts.push('위젯을 추가하여 팀의 규칙을 정의해보세요!');
      markdownParts.push('');
    }

    markdownParts.push('*Generated by TeamConfig*');

    return markdownParts.join('\n');
  }
}
