import {
  IsString,
  IsNumber,
  IsEnum,
  ValidateNested,
  IsObject,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiExtraModels, ApiProperty, getSchemaPath } from '@nestjs/swagger';

import {
  WidgetType,
  TechStackContentDto,
  PostItContentDto,
  GroundRuleContentDto,
  BaseContentDto,
} from './widget-content.dto';

// 위젯의 공통 속성 및 가변 콘텐츠 정의
@ApiExtraModels(TechStackContentDto, PostItContentDto, GroundRuleContentDto)
export class WidgetData {
  @ApiProperty({ description: 'X 좌표 (Canvas 기준)', example: 100 })
  @IsNumber()
  readonly x: number;

  @ApiProperty({ description: 'Y 좌표 (Canvas 기준)', example: 200 })
  @IsNumber()
  readonly y: number;

  @ApiProperty({ description: '위젯 너비', example: 300 })
  @IsNumber()
  readonly width: number;

  @ApiProperty({ description: '위젯 높이', example: 200 })
  @IsNumber()
  readonly height: number;

  @ApiProperty({ description: '레이어 순서 (Z-Index)', example: 1, default: 1 })
  @IsNumber()
  readonly zIndex: number;

  @ApiProperty({
    description: '위젯 타입별 상세 콘텐츠 데이터',
    oneOf: [
      { $ref: getSchemaPath(TechStackContentDto) },
      { $ref: getSchemaPath(PostItContentDto) },
      { $ref: getSchemaPath(GroundRuleContentDto) },
    ],
  })
  @IsObject()
  @ValidateNested()
  @Type(() => BaseContentDto, {
    keepDiscriminatorProperty: true,
    discriminator: {
      property: 'widgetType',
      subTypes: [
        { value: TechStackContentDto, name: WidgetType.TECH_STACK },
        { value: PostItContentDto, name: WidgetType.POST_IT },
        { value: GroundRuleContentDto, name: WidgetType.GROUND_RULE },
      ],
    },
  })
  readonly content:
    | TechStackContentDto
    | PostItContentDto
    | GroundRuleContentDto;
}

// 최종 생성 DTO
export class CreateWidgetDto {
  @ApiProperty({
    description: '클라이언트에서 생성한 UUID',
    example: 'uuid-1234',
  })
  @IsString()
  readonly widgetId: string;

  @ApiProperty({ enum: WidgetType, description: '위젯 타입' })
  @IsEnum(WidgetType)
  readonly type: WidgetType;

  @ApiProperty({ description: '위젯 위치 및 콘텐츠 데이터' })
  @ValidateNested()
  @Type(() => WidgetData)
  readonly data: WidgetData;
}
