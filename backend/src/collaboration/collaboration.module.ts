import { Module, Global } from '@nestjs/common';
import { CollaborationService } from './collaboration.service';
import { YjsDocReaderService } from './yjs-doc-reader.service';

@Global()
@Module({
  providers: [CollaborationService, YjsDocReaderService],
  exports: [CollaborationService, YjsDocReaderService],
})
export class CollaborationModule {}
