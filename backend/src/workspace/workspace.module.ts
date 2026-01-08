import { forwardRef, Module } from '@nestjs/common';
import { WorkspaceService } from './workspace.service';
import { WorkspaceGateway } from './workspace.gateway';
import { WidgetModule } from '../widget/widget.module';

@Module({
  imports: [forwardRef(() => WidgetModule)],
  providers: [WorkspaceService, WorkspaceGateway],
  exports: [WorkspaceService],
})
export class WorkspaceModule {}
