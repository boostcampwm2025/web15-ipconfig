import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WorkspaceModule } from './workspace/workspace.module';
import { WidgetModule } from './widget/widget.module';
import { CursorModule } from './cursor/cursor.module';
import { MarkdownModule } from './markdown/markdown.module';
import { CollaborationModule } from './collaboration/collaboration.module';

@Module({
  imports: [
    WorkspaceModule,
    WidgetModule,
    CursorModule,
    MarkdownModule,
    CollaborationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
