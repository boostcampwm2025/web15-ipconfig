import { forwardRef, Module } from '@nestjs/common';
import { WorkspaceService } from './workspace.service';
import { WorkspaceGateway } from './workspace.gateway';
import { WidgetModule } from '../widget/widget.module';
import { WorkspaceController } from './workspace.controller';

@Module({
  imports: [forwardRef(() => WidgetModule)],
  controllers: [WorkspaceController],
  providers: [WorkspaceService, WorkspaceGateway],
  exports: [WorkspaceService],
})
export class WorkspaceModule {}
