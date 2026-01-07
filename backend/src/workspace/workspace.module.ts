import { Module, forwardRef } from '@nestjs/common';
import { WorkspaceService } from './workspace.service';
import { WorkspaceGateway } from './workspace.gateway';
import { CursorModule } from '../cursor/cursor.module';
import { WidgetModule } from '../widget/widget.module';

@Module({
  imports: [forwardRef(() => CursorModule), forwardRef(() => WidgetModule)],
  providers: [WorkspaceService, WorkspaceGateway],
  exports: [WorkspaceService],
})
export class WorkspaceModule {}
