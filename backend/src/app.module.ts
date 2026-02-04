import { Module } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WorkspaceModule } from './workspace/workspace.module';
import { MarkdownModule } from './markdown/markdown.module';
import { CollaborationModule } from './collaboration/collaboration.module';
import { createWinstonConfig } from './common/logger/logger.config';

@Module({
  imports: [
    WinstonModule.forRoot(createWinstonConfig()),
    WorkspaceModule,
    MarkdownModule,
    CollaborationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
