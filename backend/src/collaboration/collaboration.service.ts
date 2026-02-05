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
import {
  HOCUSPOCUS_DEBOUNCE_MS,
  HOCUSPOCUS_MAX_DEBOUNCE_MS,
  DOCUMENT_NAME_PREFIX,
  WEBSOCKET_PATHS,
  REDIS_KEY_PREFIX,
} from './constants/collaboration.constants';
import { DEFAULT_REDIS_PORT } from '../common/constants/shared.constants';

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
    const redisPort = parseInt(
      process.env.REDIS_PORT || DEFAULT_REDIS_PORT.toString(),
      10,
    );
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
          return this.storageAdapter.get(
            `${REDIS_KEY_PREFIX.YJS_DOC}${documentName}`,
          );
        },
        store: async ({ documentName, state }) => {
          this.logger.debug(`Storing document ${documentName} to storage`, {
            context: CollaborationService.name,
          });
          await this.storageAdapter.set(
            `${REDIS_KEY_PREFIX.YJS_DOC}${documentName}`,
            state,
          );
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
      debounce: HOCUSPOCUS_DEBOUNCE_MS,
      maxDebounce: HOCUSPOCUS_MAX_DEBOUNCE_MS,

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
      return pathname.startsWith(WEBSOCKET_PATHS.COLLABORATION);
    } catch {
      return url.startsWith(WEBSOCKET_PATHS.COLLABORATION);
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
    const documentName = `${DOCUMENT_NAME_PREFIX.WORKSPACE}${workspaceId}`;
    return this.hocuspocus.documents.get(documentName) ?? null;
  }
}
