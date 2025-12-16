import { Test, TestingModule } from '@nestjs/testing';
import { Server, Socket } from 'socket.io';

import { WorkspaceGateway } from '../workspace.gateway';
import { WorkspaceService } from '../workspace.service';
import { JoinUserDTO } from '../dto/join-user.dto';
import { LeaveUserDTO } from '../dto/left-user.dto';
import { MoveCursorDTO } from '../dto/move-cursor.dto';

describe('WorkspaceGateway', () => {
  let gateway: WorkspaceGateway;
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
    };
    workspaceServiceMock = {
      getRoomIdByUserId: jest.fn(),
      joinUser: jest.fn(),
      leaveUser: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WorkspaceGateway,
        { provide: WorkspaceService, useValue: workspaceServiceMock },
      ],
    }).compile();

    gateway = module.get<WorkspaceGateway>(WorkspaceGateway);

    // WebSocket 서버 목킹 주입
    (gateway as unknown as { server: Server }).server = serverMock as Server;

    jest.clearAllMocks();
  });

  it('워크 스페이스 게이트웨이 생성', () => {
    expect(gateway).toBeDefined();
  });

  describe('user:join', () => {
    // 값 모킹해놓기
    beforeEach(() => {
      workspaceServiceMock.joinUser = jest.fn().mockReturnValue({
        roomId: 'p1',
        user: {
          id: 'u1',
          nickname: 'user1',
          color: '#000000',
        },
      });

      // this.server.to(roomId).emit(...) 체이닝을 위해 this를 반환
      serverMock.to = jest.fn().mockReturnValue(serverMock as Server);
    });

    it('user:join 이벤트 발생 시 일련의 과정을 거친 후 user:joined, user:status 이벤트 발생', async () => {
      // GIVEN
      const payload: JoinUserDTO = {
        projectId: 'p1',
        user: {
          id: 'u1',
          nickname: 'user1',
          color: '#000000',
        },
      };

      // WHEN
      await gateway.handleUserJoin(payload, clientMock as Socket);

      // THEN
      expect(serverMock.emit).toHaveBeenCalledWith('user:joined', payload.user);
      expect(serverMock.emit).toHaveBeenCalledWith('user:status', {
        status: 'ONLINE',
      });
    });

    it('user:join 이벤트 발생 시 client가 방에 들어가는지', async () => {
      // GIVEN
      const payload: JoinUserDTO = {
        projectId: 'p1',
        user: {
          id: 'u1',
          nickname: 'user1',
          color: '#000000',
        },
      };

      // WHEN
      await gateway.handleUserJoin(payload, clientMock as Socket);

      // THEN
      expect(clientMock.join).toHaveBeenCalledWith('p1');
    });

    it('user:join 이벤트 발생 시 workspaceService의 joinUser 메서드가 호출되는지', async () => {
      // GIVEN
      const payload: JoinUserDTO = {
        projectId: 'p1',
        user: {
          id: 'u1',
          nickname: 'user1',
          color: '#000000',
        },
      };

      // WHEN
      await gateway.handleUserJoin(payload, clientMock as Socket);

      // THEN
      expect(workspaceServiceMock.joinUser).toHaveBeenCalledWith(payload);
    });
  });

  describe('user:leave', () => {
    // 값 모킹해놓기
    beforeEach(() => {
      workspaceServiceMock.leaveUser = jest.fn().mockReturnValue({
        roomId: 'p1',
        userId: 'u1',
      });

      // this.server.to(roomId).emit(...) 체이닝을 위해 this를 반환
      serverMock.to = jest.fn().mockReturnValue(serverMock as Server);
    });

    it('user:leave 이벤트 발생 시 일련의 과정을 거친 후 user:left, user:status 이벤트 발생', async () => {
      // GIVEN
      const payload: LeaveUserDTO = {
        projectId: 'p1',
        userId: 'u1',
      };

      // WHEN
      await gateway.handleUserLeave(payload, clientMock as Socket);

      // THEN
      expect(serverMock.emit).toHaveBeenCalledWith('user:left', payload.userId);
      expect(serverMock.emit).toHaveBeenCalledWith('user:status', {
        status: 'OFFLINE',
      });
    });

    it('user:leave 이벤트 발생 시 client가 방에서 나가는지', async () => {
      // GIVEN
      const payload: LeaveUserDTO = {
        projectId: 'p1',
        userId: 'u1',
      };

      // WHEN
      await gateway.handleUserLeave(payload, clientMock as Socket);

      // THEN
      expect(clientMock.leave).toHaveBeenCalledWith('p1');
    });

    it('user:leave 이벤트 발생 시 workspaceService의 leaveUser 메서드가 호출되는지', async () => {
      // GIVEN
      const payload: LeaveUserDTO = {
        projectId: 'p1',
        userId: 'u1',
      };

      // WHEN
      await gateway.handleUserLeave(payload, clientMock as Socket);

      // THEN
      expect(workspaceServiceMock.leaveUser).toHaveBeenCalledWith(payload);
    });
  });

  describe('cursor:move', () => {
    beforeEach(() => {
      workspaceServiceMock.getRoomIdByUserId = jest.fn().mockReturnValue('p1');
      serverMock.to = jest.fn().mockReturnValue(serverMock as Server);
    });

    it('cursor:move 이벤트 발생 시 cursor:moved 이벤트 발생', () => {
      // GIVEN
      const payload: MoveCursorDTO = {
        userId: 'u1',
        moveData: {
          x: 100,
          y: 100,
        },
      };

      // WHEN
      gateway.handleCursorMove(payload, clientMock as Socket);

      // THEN
      expect(serverMock.emit).toHaveBeenCalledWith('cursor:moved', payload);
      expect(serverMock.to).toHaveBeenCalledWith('p1');
    });

    it('cursor:move 이벤트 발생 시 workspaceService의 getRoomIdByUserId 메서드가 호출되는지', () => {
      // GIVEN
      const payload: MoveCursorDTO = {
        userId: 'u1',
        moveData: {
          x: 100,
          y: 100,
        },
      };

      // WHEN
      gateway.handleCursorMove(payload, clientMock as Socket);

      // THEN
      expect(workspaceServiceMock.getRoomIdByUserId).toHaveBeenCalledWith(
        payload.userId,
      );
    });
  });
});
