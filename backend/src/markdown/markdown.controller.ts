import { Controller, Get, Query } from '@nestjs/common';
import { ApiQuery, ApiResponse } from '@nestjs/swagger';
import { MarkdownService } from './markdown.service';
import { GetMarkdownDto } from './dto/get-markdown.dto';

@Controller('markdown')
export class MarkdownController {
  constructor(private readonly markdownService: MarkdownService) {}

  @Get()
  @ApiQuery({
    name: 'workspaceId',
    required: true,
    description: '워크스페이스 ID',
    example: 'w1',
  })
  @ApiResponse({
    status: 200,
    description: '생성된 마크다운 문서',
    type: GetMarkdownDto,
  })
  find(@Query('workspaceId') workspaceId: string): GetMarkdownDto {
    const markdown = this.markdownService.generateMarkdown(workspaceId);
    return { markdown };
  }
}
