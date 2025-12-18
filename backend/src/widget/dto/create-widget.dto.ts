import { IsString, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

import {
  TechStackContentDto,
  PostItContentDto,
  GroundRuleContentDto,
} from './widget-content.dto';

export class WidgetData {
  @ApiProperty({ description: 'X 좌표', example: 100 })
  @IsNumber()
  x: number;

  @IsNumber()
  y: number;

  @IsNumber()
  width: number;

  @IsNumber()
  height: number;

  @IsNumber()
  zIndex: number;

  content: TechStackContentDto | PostItContentDto | GroundRuleContentDto;
}

export enum WidgetType {
  TECH_STACK = 'TECH_STACK',
  POST_IT = 'POST_IT',
  GROUND_RULE = 'GROUND_RULE',
}

export class CreateWidgetDto {
  @IsString()
  widgetId: string;

  type: WidgetType;
  data: WidgetData;
}
