import { Module, Global } from '@nestjs/common';
import { CollaborationService } from './collaboration.service';
import { YjsDocReaderService } from './yjs-doc-reader.service';
import { StorageAdapter } from './storage/storage.interface';
import { RedisStorageAdapter } from './storage/redis-storage.adapter';

@Global()
@Module({
  providers: [
    CollaborationService,
    YjsDocReaderService,
    {
      provide: StorageAdapter,
      useClass: RedisStorageAdapter,
    },
  ],
  exports: [CollaborationService, YjsDocReaderService, StorageAdapter],
})
export class CollaborationModule {}
