import { Module, Global } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { CollaborationService } from './collaboration.service';
import { YjsDocReaderService } from './yjs-doc-reader.service';
import { StorageAdapter } from './storage/storage.interface';
import { RedisStorageAdapter } from './storage/redis-storage.adapter';

import Redis from 'ioredis';
import { DEFAULT_REDIS_PORT } from '../common/constants/shared.constants';

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
      inject: [WINSTON_MODULE_PROVIDER],
      useFactory: (logger: Logger) => {
        const redis = new Redis({
          host: process.env.REDIS_HOST || 'localhost',
          port: parseInt(
            process.env.REDIS_PORT || DEFAULT_REDIS_PORT.toString(),
            10,
          ),
        });

        redis.on('connect', () => {
          logger.info('Redis connected for document storage', {
            context: 'RedisProvider',
          });
        });

        redis.on('error', (err) => {
          logger.error('Redis connection error:', {
            context: 'RedisProvider',
            message: err.message,
          });
        });

        return redis;
      },
    },
  ],
  exports: [CollaborationService, YjsDocReaderService, StorageAdapter],
})
export class CollaborationModule {}
