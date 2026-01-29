import { Module, Global, Logger } from '@nestjs/common';
import { CollaborationService } from './collaboration.service';
import { YjsDocReaderService } from './yjs-doc-reader.service';
import { StorageAdapter } from './storage/storage.interface';
import { RedisStorageAdapter } from './storage/redis-storage.adapter';

import Redis from 'ioredis';

@Global()
@Module({
  providers: [
    CollaborationService,
    YjsDocReaderService,
    {
      provide: StorageAdapter,
      useClass: RedisStorageAdapter,
    },
    {
      provide: Redis,
      useFactory: () => {
        const logger = new Logger('RedisProvider');
        const redis = new Redis({
          host: process.env.REDIS_HOST || 'localhost',
          port: parseInt(process.env.REDIS_PORT || '6379', 10),
        });

        redis.on('connect', () => {
          logger.log('Redis connected for document storage');
        });

        redis.on('error', (err) => {
          logger.error('Redis connection error:', err.message);
        });

        return redis;
      },
    },
  ],
  exports: [CollaborationService, YjsDocReaderService, StorageAdapter],
})
export class CollaborationModule {}
