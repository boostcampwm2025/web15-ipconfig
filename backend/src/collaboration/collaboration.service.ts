import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
} from '@nestjs/common';
import { Hocuspocus } from '@hocuspocus/server';
import { IncomingMessage } from 'http';
import { Duplex } from 'stream';
import { WebSocketServer } from 'ws';

@Injectable()
export class CollaborationService implements OnModuleInit, OnModuleDestroy {
  private hocuspocus: Hocuspocus;
  private wss: WebSocketServer;
  private readonly logger = new Logger(CollaborationService.name);

  onModuleInit() {
    // WebSocket 서버 생성 (noServer 모드)
    this.wss = new WebSocketServer({ noServer: true });

    // Hocuspocus 인스턴스 생성
    this.hocuspocus = new Hocuspocus({
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

    this.logger.log('Hocuspocus collaboration server initialized');
  }

  onModuleDestroy() {
    if (this.wss) {
      this.wss.close();
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
}
