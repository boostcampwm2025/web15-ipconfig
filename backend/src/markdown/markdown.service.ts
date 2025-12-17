import { Injectable } from '@nestjs/common';

import {
  CreateMarkdownDto,
  TeamStyle,
  TechStack,
  GroundRules,
} from './dto/create-markdown.dto';

@Injectable()
export class MarkdownService {
  createMarkdown(createMarkdownDto: CreateMarkdownDto) {
    const teamStyleString = this.createTeamStyleString(
      createMarkdownDto.teamStyles,
    );
    const techStackString = this.createTechStackString(
      createMarkdownDto.techStacks,
    );
    const groundRulesString = this.createGroundRulesString(
      createMarkdownDto.groundRules,
    );

    return `
# 🚀 ${createMarkdownDto.workspaceName}팀 보고서
> 생성된 시간: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}

## 1. 🧠 팀 스타일 분석
팀은 다음과 같은 작업 스타일을 가지고 있습니다:
${teamStyleString}

## 2. 🛠 기술 스택 선택
팀은 다음과 같은 기술 스택을 사용합니다:
| Tech Name | Version | Status |
| :--- | :--- | :--- |
${techStackString}

## 3. 📜 그라운드 룰
팀은 다음과 같은 그라운드 룰을 가지고 있습니다:
${groundRulesString}

## 4. 📝 노트
(노트가 없습니다)

---
*${createMarkdownDto.workspaceName}에서 생성됨*
      `;
  }

  createTeamStyleString(teamStyles: TeamStyle[]) {
    return teamStyles
      .map(
        (style) =>
          `- **${style.name}:** ${style.score} ⚖️ (Score: ${style.score}/100)`,
      )
      .join('\n');
  }

  createTechStackString(techStacks: TechStack[]) {
    return techStacks
      .map((stack) => `| ${stack.name} | ${stack.version} | ${stack.status} |`)
      .join('\n');
  }

  createGroundRulesString(groundRules: GroundRules[]) {
    return groundRules
      .map((rule) => `- [x] **${rule.name}:** ${rule.description}`)
      .join('\n');
  }
}
