import { Injectable, Inject } from '@nestjs/common';
import type { IWidgetService } from '../widget/widget.interface';
import { WIDGET_SERVICE } from '../widget/widget.interface';
import {
  WidgetType,
  GroundRuleContentDto,
  GitConventionContentDto,
  TechStackContentDto,
  PostItContentDto,
} from '../widget/dto/widget-content.dto';
import { CreateWidgetDto } from '../widget/dto/create-widget.dto';

@Injectable()
export class MarkdownService {
  constructor(
    @Inject(WIDGET_SERVICE) private readonly widgetService: IWidgetService,
  ) {}

  private buildGitConventionStrategySection(
    gitConventionWidgets: GitConventionContentDto[],
  ): string[] {
    if (!gitConventionWidgets || gitConventionWidgets.length === 0) {
      return [];
    }

    const lines: string[] = [];
    lines.push('### 깃 컨벤션');
    lines.push('| 전략 | 설명 |');
    lines.push('| :--- | :--- |');

    gitConventionWidgets.forEach((content) => {
      let strategyName = '';
      let description = '';

      switch (content.data.strategy) {
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
    gitConventionWidgets: GitConventionContentDto[],
  ): string[] {
    if (!gitConventionWidgets || gitConventionWidgets.length === 0) {
      return [];
    }

    const lines: string[] = [];
    lines.push('### 깃 브랜치 규칙');
    lines.push('| 메인 브랜치 | 개발 브랜치 | 브랜치 접두사 |');
    lines.push('| :--- | :--- | :--- |');

    gitConventionWidgets.forEach((content) => {
      const mainBranch = content.data.branchRules.mainBranch || '-';
      const developBranch = content.data.branchRules.developBranch || '-';
      const prefixes =
        content.data.branchRules.prefixes.length > 0
          ? content.data.branchRules.prefixes.join(', ')
          : '-';

      lines.push(`| ${mainBranch} | ${developBranch} | ${prefixes} |`);
    });

    lines.push('');
    return lines;
  }

  private buildGitCommitConventionSection(
    gitConventionWidgets: GitConventionContentDto[],
  ): string[] {
    if (!gitConventionWidgets || gitConventionWidgets.length === 0) {
      return [];
    }

    const lines: string[] = [];
    lines.push('### 깃 커밋 규칙');
    lines.push('| 커밋 타입 |');
    lines.push('| :--- |');

    gitConventionWidgets.forEach((content) => {
      const commitTypes =
        content.data.commitConvention.commitTypes.length > 0
          ? content.data.commitConvention.commitTypes.join(', ')
          : '-';

      lines.push(`| ${commitTypes} |`);
    });

    lines.push('');
    return lines;
  }

  private buildGroundRuleSection(widgets: CreateWidgetDto[]): string[] {
    if (!widgets || widgets.length === 0) return [];

    const lines: string[] = [];
    lines.push('## 📋 그라운드 룰');

    // Git Convention 위젯 필터링
    const gitConventionWidgets = widgets
      .filter(
        (widget) =>
          widget.data.content.widgetType === WidgetType.GIT_CONVENTION,
      )
      .map((widget) => widget.data.content as GitConventionContentDto);

    // 각 섹션별로 표 생성
    lines.push(...this.buildGitConventionStrategySection(gitConventionWidgets));
    lines.push(...this.buildGitBranchRulesSection(gitConventionWidgets));
    lines.push(...this.buildGitCommitConventionSection(gitConventionWidgets));

    return lines;
  }

  private buildTechStackSection(widgets: CreateWidgetDto[]): string[] {
    if (!widgets || widgets.length === 0) return [];

    const lines: string[] = [];
    lines.push('## 🛠 기술 스택 선택');
    lines.push('| 기술 스택 이름 | 버전 |');
    lines.push('| :--- | :--- |');

    widgets.forEach((widget) => {
      const content = widget.data.content as TechStackContentDto;
      if (content.selectedItems && content.selectedItems.length > 0) {
        content.selectedItems.forEach((item) => {
          lines.push(`| ${item.name} | 최신 버전 |`);
        });
      }
    });

    lines.push('');
    return lines;
  }

  private buildElseSection(widgets: CreateWidgetDto[]): string[] {
    if (!widgets || widgets.length === 0) return [];

    const lines: string[] = [];

    lines.push('## 그 외');
    lines.push('---');

    widgets.forEach((widget) => {
      const content = widget.data.content as PostItContentDto;
      if (content.text) {
        lines.push(content.text);
      }
    });

    lines.push('');
    return lines;
  }

  async generateMarkdown(workspaceId: string): Promise<string> {
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

    const allWidgets = await this.widgetService.findAll(workspaceId);

    const groundRuleWidgets = allWidgets.filter(
      (widget) =>
        widget.data.content.widgetType === WidgetType.GROUND_RULE ||
        widget.data.content.widgetType === WidgetType.GIT_CONVENTION,
    );
    markdownParts.push(...this.buildGroundRuleSection(groundRuleWidgets));

    const techStackWidgets = allWidgets.filter(
      (widget) => widget.data.content.widgetType === WidgetType.TECH_STACK,
    );
    markdownParts.push(...this.buildTechStackSection(techStackWidgets));

    const postItWidgets = allWidgets.filter(
      (widget) => widget.data.content.widgetType === WidgetType.POST_IT,
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
