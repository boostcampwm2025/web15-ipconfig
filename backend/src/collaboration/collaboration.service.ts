import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
} from '@nestjs/common';
import { Hocuspocus, Extension } from '@hocuspocus/server';
import { Redis as RedisExtension } from '@hocuspocus/extension-redis';
import { IncomingMessage } from 'http';
import { Duplex } from 'stream';
import { WebSocketServer } from 'ws';
import Redis from 'ioredis';

@Injectable()
export class CollaborationService implements OnModuleInit, OnModuleDestroy {
  private hocuspocus: Hocuspocus;
  private wss: WebSocketServer;
  private redis: Redis | null = null;
  private readonly logger = new Logger(CollaborationService.name);

  onModuleInit() {
    // WebSocket 서버 생성 (noServer 모드)
    this.wss = new WebSocketServer({ noServer: true });

    // Redis 설정
    const redisHost = process.env.REDIS_HOST || 'localhost';
    const redisPort = parseInt(process.env.REDIS_PORT || '6379', 10);
    const redisPassword = process.env.REDIS_PASSWORD;
    const useRedisExtension = process.env.USE_REDIS_EXTENSION === 'true';

    this.logger.log(`Connecting to Redis at ${redisHost}:${redisPort}`);

    // Redis 클라이언트 생성 (yjsdoc 저장용)
    this.redis = new Redis({
      host: redisHost,
      port: redisPort,
      password: redisPassword,
      retryStrategy: (times) => {
        // 재연결 시도 간격 (최대 3초)
        return Math.min(times * 100, 3000);
      },
      maxRetriesPerRequest: 3,
    });

    this.redis.on('connect', () => {
      this.logger.log('Redis connected for document storage');
    });

    this.redis.on('error', (err) => {
      this.logger.error('Redis connection error:', err.message);
    });

    // RedisExtension은 Scale-out 시에만 사용
    const extensions: Extension[] = [];

    if (useRedisExtension) {
      this.logger.log('Enabling Redis Extension for multi-server sync');
      extensions.push(
        new RedisExtension({
          host: redisHost,
          port: redisPort,
          options: redisPassword ? { password: redisPassword } : undefined,
        }),
      );
    }

    // Hocuspocus 인스턴스 생성
    this.hocuspocus = new Hocuspocus({
      extensions,

      // debounce 설정: 문서 저장 빈도 조절 (기본 2초)
      debounce: 2000,
      maxDebounce: 10000,

      onConnect: async (data) => {
        this.logger.log(`User connected to Hocuspocus: ${data.documentName}`);
        await Promise.resolve();
      },

      onDisconnect: async ({ documentName }) => {
        this.logger.log(`User disconnected from document: ${documentName}`);
        await Promise.resolve();
      },
    });

    this.logger.log(
      `Hocuspocus collaboration server initialized ${useRedisExtension ? 'with Redis Extension' : 'without Redis Extension'}`,
    );
  }

  onModuleDestroy() {
    if (this.wss) {
      this.wss.close();
    }
    if (this.redis) {
      this.redis.disconnect();
      this.logger.log('Redis connection closed');
    }
    if (this.hocuspocus) {
      this.hocuspocus.closeConnections();
      this.logger.log('Hocuspocus collaboration server destroyed');
    }
  }

  handleUpgrade(request: IncomingMessage, socket: Duplex, head: Buffer): void {
    this.wss.handleUpgrade(request, socket, head, (websocket) => {
      this.hocuspocus.handleConnection(websocket, request, {});
    });
  }

  isCollaborationPath(url: string | undefined): boolean {
    if (!url) return false;
    try {
      const { pathname } = new URL(url, 'http://localhost');
      return pathname.startsWith('/collaboration');
    } catch {
      return url.startsWith('/collaboration');
    }
  }

  getDocumentsCount(): number {
    return this.hocuspocus.getDocumentsCount();
  }

  getConnectionsCount(): number {
    return this.hocuspocus.getConnectionsCount();
  }

  /**
   * 특정 워크스페이스의 Hocuspocus Document 가져오기
   * @param workspaceId 워크스페이스 ID
   * @returns Hocuspocus Document 또는 null (문서가 로드되지 않은 경우)
   */
  getDocument(workspaceId: string) {
    const documentName = `workspace:${workspaceId}`;
    return this.hocuspocus.documents.get(documentName) ?? null;
  }
}
