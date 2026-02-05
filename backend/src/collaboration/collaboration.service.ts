import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Inject,
} from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { Hocuspocus, Extension } from '@hocuspocus/server';
import { Redis as RedisExtension } from '@hocuspocus/extension-redis';
import { Database } from '@hocuspocus/extension-database';
import { IncomingMessage } from 'node:http';
import { Duplex } from 'node:stream';
import { WebSocketServer } from 'ws';
import { StorageAdapter } from './storage/storage.interface';

@Injectable()
export class CollaborationService implements OnModuleInit, OnModuleDestroy {
  private hocuspocus: Hocuspocus;
  private wss: WebSocketServer;

  constructor(
    private readonly storageAdapter: StorageAdapter,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  onModuleInit() {
    // WebSocket 서버 생성 (noServer 모드)
    this.wss = new WebSocketServer({ noServer: true });

    // Redis 설정 (Extension용)
    const redisHost = process.env.REDIS_HOST || 'localhost';
    const redisPort = Number.parseInt(process.env.REDIS_PORT || '6379', 10);
    const redisPassword = process.env.REDIS_PASSWORD;
    const useRedisExtension = process.env.USE_REDIS_EXTENSION === 'true';

    // RedisExtension은 Scale-out 시에만 사용
    const extensions: Extension[] = [];

    // Database Extension (영속성)
    extensions.push(
      new Database({
        fetch: async ({ documentName }) => {
          this.logger.debug(`Fetching document ${documentName} from storage`, {
            context: CollaborationService.name,
          });
          return this.storageAdapter.get(`yjs:doc:${documentName}`);
        },
        store: async ({ documentName, state }) => {
          this.logger.debug(`Storing document ${documentName} to storage`, {
            context: CollaborationService.name,
          });
          await this.storageAdapter.set(`yjs:doc:${documentName}`, state);
        },
      }),
    );

    // Redis Extension (Scale-out Pub/Sub)
    if (useRedisExtension) {
      this.logger.info('Enabling Redis Extension for multi-server sync', {
        context: CollaborationService.name,
      });
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
        this.logger.info(`User connected to Hocuspocus: ${data.documentName}`, {
          context: CollaborationService.name,
        });
        await Promise.resolve();
      },

      onDisconnect: async ({ documentName }) => {
        this.logger.info(`User disconnected from document: ${documentName}`, {
          context: CollaborationService.name,
        });
        await Promise.resolve();
      },
    });

    this.logger.info(
      `Hocuspocus collaboration server initialized with StorageAdapter and ${useRedisExtension ? 'Redis Extension' : 'no Redis Extension'}`,
      { context: CollaborationService.name },
    );
  }

  onModuleDestroy() {
    if (this.wss) {
      this.wss.close();
    }
    if (this.hocuspocus) {
      this.hocuspocus.closeConnections();
      this.logger.info('Hocuspocus collaboration server destroyed', {
        context: CollaborationService.name,
      });
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
