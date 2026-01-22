import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsString } from 'class-validator';
import { WidgetType } from '../widget-type.enum';
import { BaseContentDto } from './base-content.dto';

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

// Update용 Partial DTO Export
export class PartialPostItContentDto extends PartialType(PostItContentDto) {}
