import { Test, TestingModule } from '@nestjs/testing';
import { Server, Socket } from 'socket.io';

import { CursorGateway } from '../cursor.gateway';
import { MoveCursorDTO } from '../dto/move-cursor.dto';
import { WorkspaceService } from '../../workspace/workspace.service';

describe('CursorGateway', () => {
  let gateway: CursorGateway;
  let serverMock: Partial<Server>;
  let clientMock: Partial<Socket>;
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

  describe('cursor:move', () => {
    beforeEach(() => {
      serverMock.to = jest.fn().mockReturnValue(serverMock as Server);
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
      // 워크 스페이스 id가 추가되어서 불러져야 함
      expect(serverMock.emit).toHaveBeenCalledWith('cursor:moved', {
        workspaceId: 'w1',
        userId: 'u1',
        x: 100,
        y: 100,
      });
    });
  });
});
