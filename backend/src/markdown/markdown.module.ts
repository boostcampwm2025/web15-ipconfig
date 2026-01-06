import { Module } from '@nestjs/common';
import { MarkdownService } from './markdown.service';
import { MarkdownController } from './markdown.controller';

@Module({
  controllers: [MarkdownController],
  providers: [MarkdownService],
})
export class MarkdownModule {}
