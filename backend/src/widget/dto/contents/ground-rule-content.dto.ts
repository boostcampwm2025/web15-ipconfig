import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsArray, IsEnum, IsOptional, IsString } from 'class-validator';
import { WidgetType } from '../widget-type.enum';
import { BaseContentDto } from './base-content.dto';

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
export class PartialGroundRuleContentDto extends PartialType(
  GroundRuleContentDto,
) {}
