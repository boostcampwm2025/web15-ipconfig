import { Controller, Post, Body } from '@nestjs/common';
import { ApiOperation, ApiCreatedResponse, ApiResponse } from '@nestjs/swagger';
import { MarkdownService } from './markdown.service';
import { CreateMarkdownDto } from './dto/create-markdown.dto';

@Controller('markdown')
export class MarkdownController {
  constructor(private readonly markdownService: MarkdownService) {}

  // TODO: 현재는 POST로 되어 있는데, 나중에 GET 요청으로 바꾸고, 위젯을 읽어와서 DTO를 만들고 createMarkdown 메서드를 호출하도록 수정해야 합니다.
  @Post()
  @ApiOperation({ summary: '마크다운 생성' })
  @ApiCreatedResponse({
    description: '마크다운 생성 성공',
    type: String,
  })
  @ApiResponse({
    status: 400,
    description: '잘못된 요청 (예: DTO validation 실패)',
  })
  @ApiResponse({
    status: 500,
    description: '서버 내부 오류',
  })
  createMarkdown(@Body() createMarkdownDto: CreateMarkdownDto) {
    return this.markdownService.createMarkdown(createMarkdownDto);
  }
}
