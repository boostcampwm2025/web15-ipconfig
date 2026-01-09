import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WorkspaceModule } from './workspace/workspace.module';
import { WidgetModule } from './widget/widget.module';
import { CursorModule } from './cursor/cursor.module';

@Module({
  imports: [WorkspaceModule, WidgetModule, CursorModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
