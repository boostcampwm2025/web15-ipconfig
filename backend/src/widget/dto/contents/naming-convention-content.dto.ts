import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsEnum, IsObject, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { WidgetType } from '../widget-type.enum';
import { BaseContentDto } from './base-content.dto';

export type NamingCase =
  | 'camelCase'
  | 'PascalCase'
  | 'snake_case'
  | 'UPPER_SNAKE_CASE'
  | 'kebab-case'
  | 'none';

export class FrontendNamingConventionDto {
  @ApiProperty({
    description: '변수 네이밍 케이스',
    enum: [
      'camelCase',
      'PascalCase',
      'snake_case',
      'UPPER_SNAKE_CASE',
      'kebab-case',
      'none',
    ],
  })
  @IsEnum([
    'camelCase',
    'PascalCase',
    'snake_case',
    'UPPER_SNAKE_CASE',
    'kebab-case',
    'none',
  ])
  readonly variable: NamingCase;

  @ApiProperty({
    description: '함수 네이밍 케이스',
    enum: [
      'camelCase',
      'PascalCase',
      'snake_case',
      'UPPER_SNAKE_CASE',
      'kebab-case',
      'none',
    ],
  })
  @IsEnum([
    'camelCase',
    'PascalCase',
    'snake_case',
    'UPPER_SNAKE_CASE',
    'kebab-case',
    'none',
  ])
  readonly function: NamingCase;

  @ApiProperty({
    description: '컴포넌트 네이밍 케이스',
    enum: [
      'camelCase',
      'PascalCase',
      'snake_case',
      'UPPER_SNAKE_CASE',
      'kebab-case',
      'none',
    ],
  })
  @IsEnum([
    'camelCase',
    'PascalCase',
    'snake_case',
    'UPPER_SNAKE_CASE',
    'kebab-case',
    'none',
  ])
  readonly component: NamingCase;

  @ApiProperty({
    description: '상수 네이밍 케이스',
    enum: [
      'camelCase',
      'PascalCase',
      'snake_case',
      'UPPER_SNAKE_CASE',
      'kebab-case',
      'none',
    ],
  })
  @IsEnum([
    'camelCase',
    'PascalCase',
    'snake_case',
    'UPPER_SNAKE_CASE',
    'kebab-case',
    'none',
  ])
  readonly constant: NamingCase;
}

export class BackendNamingConventionDto {
  @ApiProperty({
    description: '변수 네이밍 케이스',
    enum: [
      'camelCase',
      'PascalCase',
      'snake_case',
      'UPPER_SNAKE_CASE',
      'kebab-case',
      'none',
    ],
  })
  @IsEnum([
    'camelCase',
    'PascalCase',
    'snake_case',
    'UPPER_SNAKE_CASE',
    'kebab-case',
    'none',
  ])
  readonly variable: NamingCase;

  @ApiProperty({
    description: '함수 네이밍 케이스',
    enum: [
      'camelCase',
      'PascalCase',
      'snake_case',
      'UPPER_SNAKE_CASE',
      'kebab-case',
      'none',
    ],
  })
  @IsEnum([
    'camelCase',
    'PascalCase',
    'snake_case',
    'UPPER_SNAKE_CASE',
    'kebab-case',
    'none',
  ])
  readonly function: NamingCase;

  @ApiProperty({
    description: '클래스 네이밍 케이스',
    enum: [
      'camelCase',
      'PascalCase',
      'snake_case',
      'UPPER_SNAKE_CASE',
      'kebab-case',
      'none',
    ],
  })
  @IsEnum([
    'camelCase',
    'PascalCase',
    'snake_case',
    'UPPER_SNAKE_CASE',
    'kebab-case',
    'none',
  ])
  readonly class: NamingCase;

  @ApiProperty({
    description: '상수 네이밍 케이스',
    enum: [
      'camelCase',
      'PascalCase',
      'snake_case',
      'UPPER_SNAKE_CASE',
      'kebab-case',
      'none',
    ],
  })
  @IsEnum([
    'camelCase',
    'PascalCase',
    'snake_case',
    'UPPER_SNAKE_CASE',
    'kebab-case',
    'none',
  ])
  readonly constant: NamingCase;
}

export class DatabaseNamingConventionDto {
  @ApiProperty({
    description: '테이블 네이밍 케이스',
    enum: [
      'camelCase',
      'PascalCase',
      'snake_case',
      'UPPER_SNAKE_CASE',
      'kebab-case',
      'none',
    ],
  })
  @IsEnum([
    'camelCase',
    'PascalCase',
    'snake_case',
    'UPPER_SNAKE_CASE',
    'kebab-case',
    'none',
  ])
  readonly table: NamingCase;

  @ApiProperty({
    description: '컬럼 네이밍 케이스',
    enum: [
      'camelCase',
      'PascalCase',
      'snake_case',
      'UPPER_SNAKE_CASE',
      'kebab-case',
      'none',
    ],
  })
  @IsEnum([
    'camelCase',
    'PascalCase',
    'snake_case',
    'UPPER_SNAKE_CASE',
    'kebab-case',
    'none',
  ])
  readonly column: NamingCase;

  @ApiProperty({
    description: '인덱스 네이밍 케이스',
    enum: [
      'camelCase',
      'PascalCase',
      'snake_case',
      'UPPER_SNAKE_CASE',
      'kebab-case',
      'none',
    ],
  })
  @IsEnum([
    'camelCase',
    'PascalCase',
    'snake_case',
    'UPPER_SNAKE_CASE',
    'kebab-case',
    'none',
  ])
  readonly index: NamingCase;

  @ApiProperty({
    description: '제약조건 네이밍 케이스',
    enum: [
      'camelCase',
      'PascalCase',
      'snake_case',
      'UPPER_SNAKE_CASE',
      'kebab-case',
      'none',
    ],
  })
  @IsEnum([
    'camelCase',
    'PascalCase',
    'snake_case',
    'UPPER_SNAKE_CASE',
    'kebab-case',
    'none',
  ])
  readonly constraint: NamingCase;
}

export class CommonNamingConventionDto {
  @ApiProperty({
    description: '유틸리티 네이밍 케이스',
    enum: [
      'camelCase',
      'PascalCase',
      'snake_case',
      'UPPER_SNAKE_CASE',
      'kebab-case',
      'none',
    ],
  })
  @IsEnum([
    'camelCase',
    'PascalCase',
    'snake_case',
    'UPPER_SNAKE_CASE',
    'kebab-case',
    'none',
  ])
  readonly utility: NamingCase;

  @ApiProperty({
    description: '상수 네이밍 케이스',
    enum: [
      'camelCase',
      'PascalCase',
      'snake_case',
      'UPPER_SNAKE_CASE',
      'kebab-case',
      'none',
    ],
  })
  @IsEnum([
    'camelCase',
    'PascalCase',
    'snake_case',
    'UPPER_SNAKE_CASE',
    'kebab-case',
    'none',
  ])
  readonly constant: NamingCase;

  @ApiProperty({
    description: '타입 네이밍 케이스',
    enum: [
      'camelCase',
      'PascalCase',
      'snake_case',
      'UPPER_SNAKE_CASE',
      'kebab-case',
      'none',
    ],
  })
  @IsEnum([
    'camelCase',
    'PascalCase',
    'snake_case',
    'UPPER_SNAKE_CASE',
    'kebab-case',
    'none',
  ])
  readonly type: NamingCase;

  @ApiProperty({
    description: '열거형 네이밍 케이스',
    enum: [
      'camelCase',
      'PascalCase',
      'snake_case',
      'UPPER_SNAKE_CASE',
      'kebab-case',
      'none',
    ],
  })
  @IsEnum([
    'camelCase',
    'PascalCase',
    'snake_case',
    'UPPER_SNAKE_CASE',
    'kebab-case',
    'none',
  ])
  readonly enum: NamingCase;
}

export class NamingConventionContentDto implements BaseContentDto {
  @ApiProperty({ example: WidgetType.NAMING_CONVENTION })
  @IsEnum(WidgetType)
  readonly widgetType = WidgetType.NAMING_CONVENTION;

  @ApiProperty({ description: '프론트엔드 네이밍 컨벤션' })
  @IsObject()
  @ValidateNested()
  @Type(() => FrontendNamingConventionDto)
  readonly frontend: FrontendNamingConventionDto;

  @ApiProperty({ description: '백엔드 네이밍 컨벤션' })
  @IsObject()
  @ValidateNested()
  @Type(() => BackendNamingConventionDto)
  readonly backend: BackendNamingConventionDto;

  @ApiProperty({ description: '데이터베이스 네이밍 컨벤션' })
  @IsObject()
  @ValidateNested()
  @Type(() => DatabaseNamingConventionDto)
  readonly database: DatabaseNamingConventionDto;

  @ApiProperty({ description: '공통 네이밍 컨벤션' })
  @IsObject()
  @ValidateNested()
  @Type(() => CommonNamingConventionDto)
  readonly common: CommonNamingConventionDto;
}

// Update용 Partial DTO Export
export class PartialNamingConventionContentDto extends PartialType(
  NamingConventionContentDto,
) {}
