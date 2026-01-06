import { Test, TestingModule } from '@nestjs/testing';
import { Server, Socket } from 'socket.io';

import { CursorGateway } from '../cursor.gateway';
import { CursorService } from '../cursor.service';
import { MoveCursorDTO } from '../dto/move-cursor.dto';
import { WorkspaceService } from '../../workspace/workspace.service';

describe('CursorGateway', () => {
  let gateway: CursorGateway;
  let serverMock: Partial<Server>;
  let clientMock: Partial<Socket>;
  let cursorServiceMock: Partial<CursorService>;
  let workspaceServiceMock: Partial<WorkspaceService>;

  beforeEach(async () => {
    serverMock = {
      to: jest.fn(),
      emit: jest.fn(),
    };
    clientMock = {
      join: jest.fn(),
      leave: jest.fn(),
      data: {},
    };
    cursorServiceMock = {
      setCursor: jest.fn(),
      updateCursor: jest.fn(),
      removeCursor: jest.fn(),
      getCursorsByWorkspace: jest.fn().mockReturnValue([]),
      hasCursor: jest.fn(),
    };
    workspaceServiceMock = {
      handleDisconnect: jest.fn().mockReturnValue({
        roomId: 'w1',
        userId: 'u1',
      }),
      getUserBySocketId: jest.fn().mockReturnValue({
        roomId: 'w1',
        userId: 'u1',
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CursorGateway,
        { provide: CursorService, useValue: cursorServiceMock },
        { provide: WorkspaceService, useValue: workspaceServiceMock },
      ],
    }).compile();

    gateway = module.get<CursorGateway>(CursorGateway);

    (gateway as unknown as { server: Server }).server = serverMock as Server;

    jest.clearAllMocks();
  });

  it('커서 게이트웨이 생성', () => {
    expect(gateway).toBeDefined();
  });

  describe('disconnect', () => {
    beforeEach(() => {
      serverMock.to = jest.fn().mockReturnValue(serverMock as Server);
    });

    it('disconnect 시 removeCursor 메서드가 호출되는지', () => {
      // GIVEN
      cursorServiceMock.removeCursor = jest.fn();

      // WHEN
      gateway.handleDisconnect(clientMock as Socket);

      // THEN
      expect(cursorServiceMock.removeCursor).toHaveBeenCalledWith('w1', 'u1');
    });
  });

  describe('cursor:move', () => {
    beforeEach(() => {
      cursorServiceMock.updateCursor = jest.fn().mockReturnValue({
        roomId: 'w1',
        userId: 'u1',
        x: 100,
        y: 100,
      });

      serverMock.to = jest.fn().mockReturnValue(serverMock as Server);
    });

    it('cursor:move 이벤트 발생 시 updateCursor 메서드가 호출되는지', () => {
      // GIVEN
      const payload: MoveCursorDTO = {
        userId: 'u1',
        moveData: {
          x: 100,
          y: 100,
        },
      };

      // WHEN
      gateway.handleCursorMove(clientMock as Socket, payload);

      // THEN
      // 워크 스페이스 id가 추가되어서 불러져야 함
      expect(cursorServiceMock.updateCursor).toHaveBeenCalledWith({
        workspaceId: 'w1',
        userId: 'u1',
        x: 100,
        y: 100,
      });
      expect(serverMock.emit).toHaveBeenCalledWith('cursor:moved', payload);
    });

    it('cursor:move 이벤트 발생 시 cursor:moved 이벤트가 발생하는지', () => {
      // GIVEN
      const payload: MoveCursorDTO = {
        userId: 'u1',
        moveData: {
          x: 100,
          y: 100,
        },
      };

      // WHEN
      gateway.handleCursorMove(clientMock as Socket, payload);

      // THEN
      expect(serverMock.emit).toHaveBeenCalledWith('cursor:moved', payload);
    });
  });
});
