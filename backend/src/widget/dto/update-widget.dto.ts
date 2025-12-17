import {
  ApiExtraModels,
  ApiProperty,
  PartialType,
  OmitType,
  getSchemaPath,
} from '@nestjs/swagger';
import {
  IsString,
  ValidateNested,
  IsObject,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';
import { WidgetData } from './create-widget.dto';
import {
  BaseContentDto,
  PartialGroundRuleContentDto,
  PartialPostItContentDto,
  PartialTechStackContentDto,
  WidgetType,
} from './widget-content.dto';

class PartialWidgetDataWithoutContent extends PartialType(
  OmitType(WidgetData, ['content'] as const),
) {}

@ApiExtraModels(
  PartialTechStackContentDto,
  PartialPostItContentDto,
  PartialGroundRuleContentDto,
)
class UpdateWidgetData extends PartialWidgetDataWithoutContent {
  @ApiProperty({
    description: '수정할 콘텐츠 데이터 (부분 수정 가능, widgetType 필수)',
    required: false,
    oneOf: [
      { $ref: getSchemaPath(PartialTechStackContentDto) },
      { $ref: getSchemaPath(PartialPostItContentDto) },
      { $ref: getSchemaPath(PartialGroundRuleContentDto) },
    ],
  })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => BaseContentDto, {
    keepDiscriminatorProperty: true,
    discriminator: {
      property: 'widgetType',
      subTypes: [
        { value: PartialTechStackContentDto, name: WidgetType.TECH_STACK },
        { value: PartialPostItContentDto, name: WidgetType.POST_IT },
        { value: PartialGroundRuleContentDto, name: WidgetType.GROUND_RULE },
      ],
    },
  })
  readonly content?:
    | PartialTechStackContentDto
    | PartialPostItContentDto
    | PartialGroundRuleContentDto;
}

export class UpdateWidgetDto {
  @ApiProperty({ description: '수정할 위젯 ID', example: 'uuid-1234' })
  @IsString()
  readonly widgetId: string;

  @ApiProperty({ description: '수정할 데이터 (변경된 필드만 보냄)' })
  @ValidateNested()
  @Type(() => UpdateWidgetData)
  readonly data: UpdateWidgetData;
}
