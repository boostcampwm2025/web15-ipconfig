import { IsArray, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

// 임시 팀 스타일
export class TeamStyle {
  @ApiProperty({ description: '팀 스타일 이름', example: '작업 시간' })
  name: string;

  @ApiProperty({ description: '팀 스타일 점수', example: 100 })
  score: number;
}

// 임시 기술 스택
export class TechStack {
  @ApiProperty({ description: '기술 스타일 이름', example: 'React' })
  name: string;

  @ApiProperty({ description: '기술 스타일 버전', example: '18.2.0' })
  version: string;
  // 선택된 거만 기록하기 때문에 이건 필요 없지 않을까?
  @ApiProperty({ description: '기술 스타일 상태', example: '사용' })
  status: string;
}

// 임시 그라운드 룰
export class GroundRules {
  @ApiProperty({ description: '그라운드 룰 이름', example: '네이밍 컨벤션' })
  name: string;

  @ApiProperty({ description: '그라운드 룰 설명', example: 'camelCase' })
  description: string;
}

export class CreateMarkdownDto {
  @ApiProperty({ description: '팀 스타일', type: [TeamStyle] })
  @IsArray()
  teamStyles: TeamStyle[];

  @ApiProperty({ description: '기술 스타일', type: [TechStack] })
  @IsArray()
  techStacks: TechStack[];

  @ApiProperty({ description: '그라운드 룰', type: [GroundRules] })
  @IsArray()
  groundRules: GroundRules[];

  @ApiProperty({ description: '워크스페이스 이름', example: 'test' })
  @IsString()
  workspaceName: string;
}
