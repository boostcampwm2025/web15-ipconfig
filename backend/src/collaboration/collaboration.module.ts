import { Module, Global } from '@nestjs/common';
import { CollaborationService } from './collaboration.service';

@Global()
@Module({
  providers: [CollaborationService],
  exports: [CollaborationService],
})
export class CollaborationModule {}
