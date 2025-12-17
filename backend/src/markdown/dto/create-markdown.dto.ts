import { IsArray, IsString } from 'class-validator';

// 임시 팀 스타일
export class TeamStyle {
  name: string;
  score: number;
}

// 임시 기술 스택
export class TechStack {
  name: string;
  version: string;
  status: string;
}

// 임시 그라운드 룰
export class GroundRules {
  name: string;
  description: string;
}

export class CreateMarkdownDto {
  @IsArray()
  teamStyles: TeamStyle[];

  @IsArray()
  techStacks: TechStack[];

  @IsArray()
  groundRules: GroundRules[];

  @IsString()
  workspaceName: string;
}
