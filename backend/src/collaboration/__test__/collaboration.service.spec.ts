import { CollaborationService } from '../collaboration.service';
import type { IncomingMessage } from 'http';
import type { Duplex } from 'stream';

// Hocuspocus, ws, ioredis 모킹
const hocuspocusInstance = {
  getDocumentsCount: jest.fn().mockReturnValue(0),
  getConnectionsCount: jest.fn().mockReturnValue(0),
  documents: new Map<string, unknown>(),
  handleConnection: jest.fn(),
  closeConnections: jest.fn(),
};

jest.mock('@hocuspocus/server', () => ({
  Hocuspocus: jest.fn().mockImplementation(() => hocuspocusInstance),
  Extension: class {},
}));

const webSocketServerInstance = {
  handleUpgrade: jest.fn(
    (
      _req: unknown,
      _socket: unknown,
      _head: unknown,
      callback: (ws: unknown) => void,
    ) => {
      callback({}); // 더미 websocket 객체
    },
  ),
  close: jest.fn(),
};

jest.mock('ws', () => ({
  WebSocketServer: jest.fn().mockImplementation(() => webSocketServerInstance),
}));

const redisInstance = {
  on: jest.fn(),
  disconnect: jest.fn(),
};

jest.mock('ioredis', () => {
  return jest.fn().mockImplementation(() => redisInstance);
});

describe('CollaborationService', () => {
  let service: CollaborationService;

  beforeEach(() => {
    // 환경 변수 초기화
    delete process.env.REDIS_HOST;
    delete process.env.REDIS_PORT;
    delete process.env.REDIS_PASSWORD;
    delete process.env.USE_REDIS_EXTENSION;

    jest.clearAllMocks();
    service = new CollaborationService();
  });

  it('모듈 초기화 시 Hocuspocus, WebSocketServer, Redis를 설정한다', () => {
    service.onModuleInit();

    // getDocumentsCount / getConnectionsCount 위임 확인
    hocuspocusInstance.getDocumentsCount.mockReturnValue(3);
    hocuspocusInstance.getConnectionsCount.mockReturnValue(5);

    expect(service.getDocumentsCount()).toBe(3);
    expect(service.getConnectionsCount()).toBe(5);
    expect(hocuspocusInstance.getDocumentsCount).toHaveBeenCalled();
    expect(hocuspocusInstance.getConnectionsCount).toHaveBeenCalled();
  });

  it('collaboration 경로 판별 유틸이 올바르게 동작한다', () => {
    service.onModuleInit();

    expect(service.isCollaborationPath('/collaboration/ws')).toBe(true);
    expect(
      service.isCollaborationPath(
        'http://localhost:4000/collaboration/workspace/123',
      ),
    ).toBe(true);
    expect(service.isCollaborationPath('/api/health')).toBe(false);
    expect(service.isCollaborationPath(undefined)).toBe(false);
  });

  it('handleUpgrade 호출 시 WebSocketServer와 Hocuspocus로 연결을 위임한다', () => {
    service.onModuleInit();

    const request = {} as IncomingMessage;
    const socket = {} as Duplex;
    const head = Buffer.alloc(0);

    service.handleUpgrade(request, socket, head);

    expect(webSocketServerInstance.handleUpgrade).toHaveBeenCalled();
    expect(hocuspocusInstance.handleConnection).toHaveBeenCalled();
  });

  it('모듈 destroy 시 WebSocket, Redis, Hocuspocus 리소스를 정리한다', () => {
    service.onModuleInit();

    service.onModuleDestroy();

    expect(webSocketServerInstance.close).toHaveBeenCalled();
    expect(redisInstance.disconnect).toHaveBeenCalled();
    expect(hocuspocusInstance.closeConnections).toHaveBeenCalled();
  });
});
