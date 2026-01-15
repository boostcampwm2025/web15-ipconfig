import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsArray,
  IsEnum,
  IsNumber,
  IsString,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export enum WidgetType {
  TECH_STACK = 'TECH_STACK',
  POST_IT = 'POST_IT',
  GROUND_RULE = 'GROUND_RULE',
}

/**
 * 다형성 처리를 위한 추상 클래스
 */
export abstract class BaseContentDto {
  @ApiProperty({ enum: WidgetType, description: '콘텐츠 타입 식별자' })
  @IsEnum(WidgetType)
  readonly widgetType: WidgetType;
}

export class TechStackItem {
  @ApiProperty({ description: '기술 스택 ID', example: 'react' })
  @IsString()
  readonly id: string;

  @ApiProperty({ description: '카테고리', example: 'Frontend' })
  @IsString()
  readonly category: string;

  @ApiProperty({ description: '기술 스택 이름', example: 'React' })
  @IsString()
  readonly name: string;
}

export class TechStackContentDto implements BaseContentDto {
  @ApiProperty({ example: WidgetType.TECH_STACK })
  @IsEnum(WidgetType)
  readonly widgetType = WidgetType.TECH_STACK;

  @ApiProperty({
    description: '선택된 기술 스택 리스트',
    example: [
      { id: 'react', category: 'Frontend', name: 'React' },
      { id: 'nestjs', category: 'Backend', name: 'NestJS' },
    ],
    type: [TechStackItem],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TechStackItem)
  readonly selectedItems: TechStackItem[];
}

export class PostItContentDto implements BaseContentDto {
  @ApiProperty({ example: WidgetType.POST_IT })
  @IsEnum(WidgetType)
  readonly widgetType = WidgetType.POST_IT;

  @ApiProperty({ description: '포스트잇 내용', example: 'API 설계 회의' })
  @IsString()
  readonly text: string;

  @ApiProperty({ description: '배경 색상 코드', example: '#FFF000' })
  @IsString()
  readonly backgroundColor: string;

  @ApiProperty({ description: '폰트 크기', example: 16, default: 14 })
  @IsNumber()
  readonly fontSize: number;
}

export class GroundRuleContentDto implements BaseContentDto {
  @ApiProperty({ example: WidgetType.GROUND_RULE })
  @IsEnum(WidgetType)
  readonly widgetType = WidgetType.GROUND_RULE;

  @ApiProperty({
    description: '그라운드 룰 목록',
    example: ['지각하지 않기', '상호 존중하기'],
    type: [String],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  readonly rules?: string[];
}

// Update용 Partial DTO Export
export class PartialTechStackContentDto extends PartialType(
  TechStackContentDto,
) {}
export class PartialPostItContentDto extends PartialType(PostItContentDto) {}
export class PartialGroundRuleContentDto extends PartialType(
  GroundRuleContentDto,
) {}
