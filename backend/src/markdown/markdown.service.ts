import { Injectable } from '@nestjs/common';
import { YjsDocReaderService } from '../collaboration/yjs-doc-reader.service';
import type {
  YjsWidgetData,
  YjsGitConventionContent,
  YjsTechStackContent,
  YjsPostItContent,
  YjsCollaborationContent,
  YjsCommunicationContent,
} from '../collaboration/types/yjs-widget.types';
import {
  getSelectedValue,
  getSelectedValues,
} from '../collaboration/utils/yjs-widget.utils';

@Injectable()
export class MarkdownService {
  constructor(private readonly yjsDocReader: YjsDocReaderService) {}

  private buildGitConventionStrategySection(
    gitConventionWidgets: YjsWidgetData[],
  ): string[] {
    if (!gitConventionWidgets || gitConventionWidgets.length === 0) {
      return [];
    }

    const lines: string[] = [];
    lines.push('### 깃 컨벤션');
    lines.push('| 전략 | 설명 |');
    lines.push('| :--- | :--- |');

    gitConventionWidgets.forEach((widget) => {
      const content = widget.content as unknown as YjsGitConventionContent;
      const strategy = getSelectedValue(content.strategy);

      let strategyName = '';
      let description = '';

      switch (strategy) {
        case 'GITHUB_FLOW':
          strategyName = 'GitHub Flow';
          description = 'main 브랜치를 중심으로 feature 브랜치에서 작업';
          break;
        case 'GIT_FLOW':
          strategyName = 'Git Flow';
          description =
            'main, develop 브랜치를 중심으로 feature, release, hotfix 브랜치 사용';
          break;
        case 'TRUNK_BASED':
          strategyName = 'Trunk Based';
          description = '단일 main 브랜치에서 직접 작업';
          break;
      }

      lines.push(`| ${strategyName} | ${description} |`);
    });

    lines.push('');
    return lines;
  }

  private buildGitBranchRulesSection(
    gitConventionWidgets: YjsWidgetData[],
  ): string[] {
    if (!gitConventionWidgets || gitConventionWidgets.length === 0) {
      return [];
    }

    const lines: string[] = [];
    lines.push('### 깃 브랜치 규칙');
    lines.push('| 메인 브랜치 | 개발 브랜치 | 브랜치 접두사 |');
    lines.push('| :--- | :--- | :--- |');

    gitConventionWidgets.forEach((widget) => {
      const content = widget.content as unknown as YjsGitConventionContent;
      const mainBranch = content.branchRules?.mainBranch || '-';
      const developBranch = content.branchRules?.developBranch || '-';
      const prefixes = getSelectedValues(content.branchRules?.prefixes);
      const prefixesStr = prefixes.length > 0 ? prefixes.join(', ') : '-';

      lines.push(`| ${mainBranch} | ${developBranch} | ${prefixesStr} |`);
    });

    lines.push('');
    return lines;
  }

  private buildGitCommitConventionSection(
    gitConventionWidgets: YjsWidgetData[],
  ): string[] {
    if (!gitConventionWidgets || gitConventionWidgets.length === 0) {
      return [];
    }

    const lines: string[] = [];
    lines.push('### 깃 커밋 규칙');
    lines.push('| 커밋 타입 |');
    lines.push('| :--- |');

    gitConventionWidgets.forEach((widget) => {
      const content = widget.content as unknown as YjsGitConventionContent;
      const commitTypes = getSelectedValues(
        content.commitConvention?.commitTypes,
      );
      const commitTypesStr =
        commitTypes.length > 0 ? commitTypes.join(', ') : '-';

      lines.push(`| ${commitTypesStr} |`);
    });

    lines.push('');
    return lines;
  }

  private buildGroundRuleSection(widgets: YjsWidgetData[]): string[] {
    if (!widgets || widgets.length === 0) return [];

    const lines: string[] = [];
    lines.push('## 📋 그라운드 룰');

    // Git Convention 위젯 필터링
    const gitConventionWidgets = widgets.filter(
      (widget) => widget.type === 'GIT_CONVENTION',
    );

    // 각 섹션별로 표 생성
    lines.push(...this.buildGitConventionStrategySection(gitConventionWidgets));
    lines.push(...this.buildGitBranchRulesSection(gitConventionWidgets));
    lines.push(...this.buildGitCommitConventionSection(gitConventionWidgets));

    return lines;
  }

  private buildTechStackSection(widgets: YjsWidgetData[]): string[] {
    if (!widgets || widgets.length === 0) return [];

    const lines: string[] = [];
    lines.push('## 🛠 기술 스택 선택');
    lines.push('| 기술 스택 이름 | 버전 |');
    lines.push('| :--- | :--- |');

    widgets.forEach((widget) => {
      const content = widget.content as unknown as YjsTechStackContent;
      if (content.techItems && content.techItems.length > 0) {
        content.techItems.forEach((item) => {
          lines.push(`| ${item.name} | 최신 버전 |`);
        });
      }
    });

    lines.push('');
    return lines;
  }

  private buildCollaborationSection(widgets: YjsWidgetData[]): string[] {
    if (!widgets || widgets.length === 0) return [];

    const lines: string[] = [];
    lines.push('## 🤝 협업 규칙');

    widgets.forEach((widget) => {
      const content = widget.content as unknown as YjsCollaborationContent;

      // PR 규칙 섹션
      lines.push('### PR 규칙');
      const version = getSelectedValue(content.prRules?.activeVersion) || '-';
      const strategy = getSelectedValue(content.prRules?.activeStrategy) || '-';
      const labels = getSelectedValues(content.prRules?.labelRules);
      const labelsStr = labels.length > 0 ? labels.join(', ') : '-';
      lines.push(`| 버전 관리 | 머지 전략 | 라벨 |`);
      lines.push(`| :--- | :--- | :--- |`);
      lines.push(`| ${version} | ${strategy} | ${labelsStr} |`);
      lines.push('');

      // 리뷰 정책 섹션
      lines.push('### 리뷰 정책');
      lines.push(`| 필요 승인 수 | 최대 리뷰 시간 | 승인 전 머지 차단 |`);
      lines.push(`| :--- | :--- | :--- |`);
      const approves = content.reviewPolicy?.approves ?? 0;
      const maxHours = content.reviewPolicy?.maxReviewHours ?? 0;
      const blockMerge = content.reviewPolicy?.blockMerge ? '예' : '아니오';
      lines.push(`| ${approves}명 | ${maxHours}시간 | ${blockMerge} |`);
      lines.push('');

      // 워크플로우 섹션
      lines.push('### 워크플로우');
      const platform = getSelectedValue(content.workflow?.platform) || '-';
      const cycleValue = content.workflow?.cycleValue ?? 0;
      const cycleUnit = content.workflow?.cycleUnit || '-';
      lines.push(`| 플랫폼 | 스프린트 주기 |`);
      lines.push(`| :--- | :--- |`);
      lines.push(`| ${platform} | ${cycleValue}${cycleUnit} |`);
      lines.push('');
    });

    return lines;
  }

  private buildCommunicationSection(widgets: YjsWidgetData[]): string[] {
    if (!widgets || widgets.length === 0) return [];

    const lines: string[] = [];
    lines.push('## 💬 커뮤니케이션');

    widgets.forEach((widget) => {
      const content = widget.content as unknown as YjsCommunicationContent;

      // 커뮤니케이션 수단 섹션
      lines.push('### 커뮤니케이션 수단');
      lines.push('| 긴급 | 동기 | 비동기 | 공식 |');
      lines.push('| :--- | :--- | :--- | :--- |');
      const urgent = getSelectedValue(content.communication?.urgent) || '-';
      const sync = getSelectedValue(content.communication?.sync) || '-';
      const async = getSelectedValue(content.communication?.async) || '-';
      const official = getSelectedValue(content.communication?.official) || '-';
      lines.push(`| ${urgent} | ${sync} | ${async} | ${official} |`);
      lines.push('');

      // SLA 섹션
      lines.push('### 응답 시간');
      const responseTime = content.sla?.responseTime ?? 0;
      lines.push(`- 최대 응답 시간: ${responseTime}시간 이내`);
      lines.push('');

      // 코어 타임 섹션
      lines.push('### 코어 타임');
      const coreStart = content.timeManagement?.coreTimeStart || '-';
      const coreEnd = content.timeManagement?.coreTimeEnd || '-';
      lines.push(`- ${coreStart} ~ ${coreEnd}`);
      lines.push('');

      // 미팅 섹션
      lines.push('### 미팅');
      const noMeetingDay = content.meeting?.noMeetingDay || '-';
      const feedbackStyle = content.meeting?.feedbackStyle || '-';
      lines.push(`| 미팅 없는 날 | 피드백 스타일 |`);
      lines.push(`| :--- | :--- |`);
      lines.push(`| ${noMeetingDay} | ${feedbackStyle} |`);
      lines.push('');
    });

    return lines;
  }

  private buildElseSection(widgets: YjsWidgetData[]): string[] {
    if (!widgets || widgets.length === 0) return [];

    const lines: string[] = [];

    lines.push('## 그 외');
    lines.push('---');

    widgets.forEach((widget) => {
      const content = widget.content as unknown as YjsPostItContent;
      if (content.text) {
        lines.push(content.text);
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

    markdownParts.push(`> 생성 일시: ${formattedDate}`);
    markdownParts.push('');

    const allWidgets = this.yjsDocReader.getWidgets(workspaceId);

    const groundRuleWidgets = allWidgets.filter(
      (widget) => widget.type === 'GIT_CONVENTION',
    );
    markdownParts.push(...this.buildGroundRuleSection(groundRuleWidgets));

    const collaborationWidgets = allWidgets.filter(
      (widget) => widget.type === 'COLLABORATION',
    );
    markdownParts.push(...this.buildCollaborationSection(collaborationWidgets));

    const communicationWidgets = allWidgets.filter(
      (widget) => widget.type === 'COMMUNICATION',
    );
    markdownParts.push(...this.buildCommunicationSection(communicationWidgets));

    const techStackWidgets = allWidgets.filter(
      (widget) => widget.type === 'TECH_STACK',
    );
    markdownParts.push(...this.buildTechStackSection(techStackWidgets));

    const postItWidgets = allWidgets.filter(
      (widget) => widget.type === 'POST_IT',
    );
    markdownParts.push(...this.buildElseSection(postItWidgets));

    if (
      groundRuleWidgets.length === 0 &&
      collaborationWidgets.length === 0 &&
      communicationWidgets.length === 0 &&
      techStackWidgets.length === 0 &&
      postItWidgets.length === 0
    ) {
      markdownParts.push(
        '아직 적은 내용이 없는 것 같습니다! 위젯에 내용을 추가해보세요! 🚀',
      );
      markdownParts.push('');
    }

    markdownParts.push('*Generated by TeamConfig*');

    return markdownParts.join('\n');
  }
}
