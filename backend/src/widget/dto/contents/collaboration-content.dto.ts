import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNumber,
  IsObject,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { WidgetType } from '../widget-type.enum';
import { BaseContentDto } from './base-content.dto';

export class PRRulesDto {
  @ApiProperty({ description: '활성 버전', example: 'semantic' })
  @IsString()
  readonly activeVersion: string;

  @ApiProperty({
    description: '선택된 라벨',
    example: ['feature', 'fix', 'refactor'],
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  readonly selectedLabels: string[];

  @ApiProperty({ description: '활성 전략', example: 'squash' })
  @IsString()
  readonly activeStrategy: string;
}

export class ReviewPolicyDto {
  @ApiProperty({ description: '승인 필요 수', example: 2 })
  @IsNumber()
  readonly approves: number;

  @ApiProperty({ description: '최대 리뷰 시간(시간)', example: 24 })
  @IsNumber()
  readonly maxReviewHours: number;

  @ApiProperty({ description: '머지 차단 여부', example: true })
  @IsBoolean()
  readonly blockMerge: boolean;
}

export class WorkflowDto {
  @ApiProperty({ description: '플랫폼', example: 'github' })
  @IsString()
  readonly platform: string;

  @ApiProperty({ description: '주기 값', example: 2 })
  @IsNumber()
  readonly cycleValue: number;

  @ApiProperty({ description: '주기 단위', example: 'week' })
  @IsString()
  readonly cycleUnit: string;
}

export class CollaborationContentDto implements BaseContentDto {
  @ApiProperty({ example: WidgetType.COLLABORATION })
  @IsEnum(WidgetType)
  readonly widgetType = WidgetType.COLLABORATION;

  @ApiProperty({ description: 'PR 규칙' })
  @IsObject()
  @ValidateNested()
  @Type(() => PRRulesDto)
  readonly prRules: PRRulesDto;

  @ApiProperty({ description: '리뷰 정책' })
  @IsObject()
  @ValidateNested()
  @Type(() => ReviewPolicyDto)
  readonly reviewPolicy: ReviewPolicyDto;

  @ApiProperty({ description: '워크플로우' })
  @IsObject()
  @ValidateNested()
  @Type(() => WorkflowDto)
  readonly workflow: WorkflowDto;
}

// Update용 Partial DTO Export
export class PartialCollaborationContentDto extends PartialType(
  CollaborationContentDto,
) {}
