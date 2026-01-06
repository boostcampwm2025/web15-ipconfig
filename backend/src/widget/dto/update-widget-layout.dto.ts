import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateWidgetLayoutDto {
  @ApiProperty({ description: '수정할 위젯 ID', example: 'uuid-1234' })
  @IsString()
  readonly widgetId: string;

  @ApiProperty({ description: 'X 좌표', required: false })
  @IsOptional()
  @IsNumber()
  readonly x?: number;

  @ApiProperty({ description: 'Y 좌표', required: false })
  @IsOptional()
  @IsNumber()
  readonly y?: number;

  @ApiProperty({ description: '너비', required: false })
  @IsOptional()
  @IsNumber()
  readonly width?: number;

  @ApiProperty({ description: '높이', required: false })
  @IsOptional()
  @IsNumber()
  readonly height?: number;

  @ApiProperty({ description: 'Z-Index', required: false })
  @IsOptional()
  @IsNumber()
  readonly zIndex?: number;
}
