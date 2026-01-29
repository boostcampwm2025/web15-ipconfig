import { StorageAdapter } from './storage.interface';
import Redis from 'ioredis';
import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';

@Injectable()
export class RedisStorageAdapter implements StorageAdapter, OnModuleDestroy {
  private readonly logger = new Logger(RedisStorageAdapter.name);

  constructor(private readonly redis: Redis) {}

  /**
   * Redis에서 키에 해당하는 바이너리 데이터를 조회합니다.
   * Redis의 getBuffer 메서드를 사용하여 Buffer 형태로 데이터를 가져옵니다.
   */
  async get(key: string): Promise<Uint8Array | null> {
    try {
      const buffer = await this.redis.getBuffer(key);
      if (!buffer) {
        return null;
      }
      return new Uint8Array(buffer);
    } catch (error) {
      this.logger.error(`Failed to get data for key ${key} from Redis`, error);
      throw error;
    }
  }

  /**
   * Redis에 바이너리 데이터를 저장합니다.
   * Buffer.from(data)를 통해 Uint8Array를 Buffer로 변환하여 저장합니다.
   */
  async set(key: string, data: Uint8Array): Promise<void> {
    try {
      // 3일 후 자동 만료
      const TTL_SECONDS = 60 * 60 * 24 * 3;
      await this.redis.set(key, Buffer.from(data), 'EX', TTL_SECONDS);
    } catch (error) {
      this.logger.error(`Failed to set data for key ${key} in Redis`, error);
      throw error;
    }
  }

  /**
   * Redis에서 데이터를 삭제합니다.
   */
  async delete(key: string): Promise<void> {
    try {
      await this.redis.del(key);
    } catch (error) {
      this.logger.error(`Failed to delete key ${key} from Redis`, error);
      throw error;
    }
  }

  /**
   * 모듈 종료 시 Redis 연결을 정리합니다.
   */
  onModuleDestroy() {
    this.logger.log('Closing Redis connection...');
    this.redis.disconnect();
  }
}
