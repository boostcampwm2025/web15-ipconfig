import { Module } from '@nestjs/common';
import { WidgetGateway } from './widget.gateway';
import { WidgetMemoryService } from './widget.memory.service';
import { WIDGET_SERVICE } from './widget.interface';
import { WorkspaceModule } from '../workspace/workspace.module';

@Module({
  imports: [WorkspaceModule],
  providers: [
    WidgetGateway,
    {
      provide: WIDGET_SERVICE,
      useClass: WidgetMemoryService, // 나중에 WidgetRedisService로 교체 가능
    },
  ],
})
export class WidgetModule {}
