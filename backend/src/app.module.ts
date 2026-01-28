import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WorkspaceModule } from './workspace/workspace.module';
import { MarkdownModule } from './markdown/markdown.module';
import { CollaborationModule } from './collaboration/collaboration.module';

@Module({
  imports: [WorkspaceModule, MarkdownModule, CollaborationModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
