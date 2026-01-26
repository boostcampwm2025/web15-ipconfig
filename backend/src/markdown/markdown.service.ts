import { Injectable } from '@nestjs/common';
import { YjsDocReaderService } from '../collaboration/yjs-doc-reader.service';
import type {
  YjsWidgetData,
  YjsGitConventionContent,
  YjsTechStackContent,
  YjsPostItContent,
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
      const mainBranch = content.branchRules.mainBranch || '-';
      const developBranch = content.branchRules.developBranch || '-';
      const prefixes = getSelectedValues(content.branchRules.prefixes);
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
        content.commitConvention.commitTypes,
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
