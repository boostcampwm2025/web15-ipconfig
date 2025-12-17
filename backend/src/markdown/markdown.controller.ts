import { Controller, Post, Body } from '@nestjs/common';
import { MarkdownService } from './markdown.service';
import { CreateMarkdownDto } from './dto/create-markdown.dto';

@Controller('markdown')
export class MarkdownController {
  constructor(private readonly markdownService: MarkdownService) {}

  @Post()
  createMarkdown(@Body() createMarkdownDto: CreateMarkdownDto) {
    return this.markdownService.createMarkdown(createMarkdownDto);
  }
}
