import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class GetMarkdownDto {
  @ApiProperty({ description: 'Markdown 내용', example: '# Hello, World!' })
  @IsString()
  readonly markdown: string;
}
