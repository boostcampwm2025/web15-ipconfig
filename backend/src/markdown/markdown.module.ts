import { Module } from '@nestjs/common';
import { MarkdownController } from './markdown.controller';
import { MarkdownService } from './markdown.service';
import { WidgetModule } from '../widget/widget.module';

@Module({
  imports: [WidgetModule],
  controllers: [MarkdownController],
  providers: [MarkdownService],
})
export class MarkdownModule {}
