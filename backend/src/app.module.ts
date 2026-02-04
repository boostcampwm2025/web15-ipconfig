import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import { createWinstonConfig } from './common/logger/logger.config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WorkspaceModule } from './workspace/workspace.module';
import { MarkdownModule } from './markdown/markdown.module';
import { CollaborationModule } from './collaboration/collaboration.module';
import { LoggerMiddleware } from './common/middlewares/logger.middleware';

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
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
