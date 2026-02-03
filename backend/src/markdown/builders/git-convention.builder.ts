import { Injectable } from '@nestjs/common';
import type {
  YjsWidgetData,
  YjsGitConventionContent,
} from '../../collaboration/types/yjs-widget.types';
import {
  getSelectedValue,
  getSelectedValues,
} from '../../collaboration/utils/yjs-widget.utils';
import { createTableRow, addSeparator } from '../utils/markdown-table.util';
import type { ISectionBuilder } from './section-builder.interface';

@Injectable()
export class GitConventionBuilder implements ISectionBuilder {
  readonly widgetType = 'GIT_CONVENTION' as const;

  build(widgets: YjsWidgetData[]): string[] {
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

      lines.push(createTableRow('**Main 브랜치**', `\`${mainBranch}\``));
      if (developBranch && developBranch !== '-') {
        lines.push(
          createTableRow('**Develop 브랜치**', `\`${developBranch}\``),
        );
      }
      lines.push(createTableRow('**Prefix 목록**', prefixesStr));
      lines.push('');

      lines.push('### 📝 커밋 컨벤션');
      const commitTypes = getSelectedValues(
        content.commitConvention?.commitTypes,
      );

      if (commitTypes.length > 0) {
        lines.push('<details open>');
        lines.push(
          '<summary><b>허용된 커밋 타입(Commit Types) 보기</b></summary>',
        );
        lines.push('');

        commitTypes.forEach((type) => {
          lines.push(`- \`${type}\``);
        });

        lines.push('');
        lines.push('</details>');
      }
      lines.push('');
    });

    addSeparator(lines);
    return lines;
  }
}
