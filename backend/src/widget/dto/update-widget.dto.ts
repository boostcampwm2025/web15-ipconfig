import { ApiExtraModels, ApiProperty, getSchemaPath } from '@nestjs/swagger';
import {
  IsString,
  ValidateNested,
  IsObject,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  BaseContentDto,
  PartialGroundRuleContentDto,
  PartialPostItContentDto,
  PartialTechStackContentDto,
  PartialGitConventionContentDto,
  PartialCollaborationContentDto,
  PartialCommunicationContentDto,
  PartialNamingConventionContentDto,
  WidgetType,
} from './widget-content.dto';

@ApiExtraModels(
  PartialTechStackContentDto,
  PartialPostItContentDto,
  PartialGroundRuleContentDto,
  PartialGitConventionContentDto,
  PartialCollaborationContentDto,
  PartialCommunicationContentDto,
  PartialNamingConventionContentDto,
)
class UpdateWidgetContentData {
  @ApiProperty({
    description: '수정할 콘텐츠 데이터 (부분 수정 가능, widgetType 필수)',
    oneOf: [
      { $ref: getSchemaPath(PartialTechStackContentDto) },
      { $ref: getSchemaPath(PartialPostItContentDto) },
      { $ref: getSchemaPath(PartialGroundRuleContentDto) },
      { $ref: getSchemaPath(PartialGitConventionContentDto) },
      { $ref: getSchemaPath(PartialCollaborationContentDto) },
      { $ref: getSchemaPath(PartialCommunicationContentDto) },
      { $ref: getSchemaPath(PartialNamingConventionContentDto) },
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
        {
          value: PartialGitConventionContentDto,
          name: WidgetType.GIT_CONVENTION,
        },
        {
          value: PartialCollaborationContentDto,
          name: WidgetType.COLLABORATION,
        },
        {
          value: PartialCommunicationContentDto,
          name: WidgetType.COMMUNICATION,
        },
        {
          value: PartialNamingConventionContentDto,
          name: WidgetType.NAMING_CONVENTION,
        },
      ],
    },
  })
  readonly content:
    | PartialTechStackContentDto
    | PartialPostItContentDto
    | PartialGroundRuleContentDto
    | PartialGitConventionContentDto
    | PartialCollaborationContentDto
    | PartialCommunicationContentDto
    | PartialNamingConventionContentDto;
}

export class UpdateWidgetDto {
  @ApiProperty({ description: '수정할 위젯 ID', example: 'uuid-1234' })
  @IsString()
  readonly widgetId: string;

  @ApiProperty({ description: '수정할 콘텐츠 데이터' })
  @ValidateNested()
  @Type(() => UpdateWidgetContentData)
  readonly data: UpdateWidgetContentData;
}
