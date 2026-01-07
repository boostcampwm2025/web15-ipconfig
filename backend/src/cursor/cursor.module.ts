import { Module, forwardRef } from '@nestjs/common';
import { CursorService } from './cursor.service';
import { CursorGateway } from './cursor.gateway';
import { WorkspaceModule } from '../workspace/workspace.module';

@Module({
  imports: [forwardRef(() => WorkspaceModule)],
  providers: [CursorService, CursorGateway],
  exports: [CursorService],
})
export class CursorModule {}
