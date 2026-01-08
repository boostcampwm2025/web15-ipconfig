import { Module } from '@nestjs/common';
import { CursorGateway } from './cursor.gateway';
import { WorkspaceModule } from 'src/workspace/workspace.module';

@Module({
  imports: [WorkspaceModule],
  providers: [CursorGateway],
})
export class CursorModule {}
