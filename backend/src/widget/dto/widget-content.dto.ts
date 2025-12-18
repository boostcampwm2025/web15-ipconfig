import { IsNumber, IsString } from 'class-validator';

export class TechStackContentDto {} // 나중에 기본 리스트 제공하고 사용자가 추가할 수 있게 문자열 배열로 받기

export class PostItContentDto {
  @IsString()
  text: string;

  @IsString()
  backgroundColor: string;

  @IsNumber()
  fontSize: number;
}

export class GroundRuleContentDto {}
