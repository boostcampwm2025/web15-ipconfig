import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsArray, IsEnum, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { WidgetType } from '../widget-type.enum';
import { BaseContentDto } from './base-content.dto';

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

// Update용 Partial DTO Export
export class PartialTechStackContentDto extends PartialType(
  TechStackContentDto,
) {}
