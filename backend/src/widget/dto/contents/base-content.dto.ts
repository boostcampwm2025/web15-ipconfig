import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { WidgetType } from '../widget-type.enum';

/**
 * 다형성 처리를 위한 추상 클래스
 */
export abstract class BaseContentDto {
  @ApiProperty({ enum: WidgetType, description: '콘텐츠 타입 식별자' })
  @IsEnum(WidgetType)
  readonly widgetType: WidgetType;
}
