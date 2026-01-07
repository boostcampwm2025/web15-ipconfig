import { Test, TestingModule } from '@nestjs/testing';
import { Server, Socket } from 'socket.io';

import { WorkspaceGateway } from '../workspace.gateway';
import { WorkspaceService } from '../workspace.service';
import { CursorService } from '../../cursor/cursor.service';
import { JoinUserDTO } from '../dto/join-user.dto';
import { LeaveUserDTO } from '../dto/left-user.dto';

describe('WorkspaceGateway', () => {
  let gateway: WorkspaceGateway;
  let serverMock: Partial<Server>;
  let clientMock: Partial<Socket>;
  let workspaceServiceMock: Partial<WorkspaceService>;
  let cursorServiceMock: Partial<CursorService>;

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
      joinUser: jest.fn(),
      leaveUser: jest.fn(),
      handleDisconnect: jest.fn(),
      getUserBySocketId: jest.fn(),
    };
    cursorServiceMock = {
      setCursor: jest.fn(),
      updateCursor: jest.fn(),
      removeCursor: jest.fn(),
      getCursorsByWorkspace: jest.fn().mockReturnValue([]),
      hasCursor: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WorkspaceGateway,
        { provide: WorkspaceService, useValue: workspaceServiceMock },
        { provide: CursorService, useValue: cursorServiceMock },
      ],
    }).compile();

    gateway = module.get<WorkspaceGateway>(WorkspaceGateway);

    (gateway as unknown as { server: Server }).server = serverMock as Server;

    jest.clearAllMocks();
  });

  it('워크 스페이스 게이트웨이 생성', () => {
    expect(gateway).toBeDefined();
  });

  describe('disconnect', () => {
    beforeEach(() => {
      serverMock.to = jest.fn().mockReturnValue(serverMock as Server);
      clientMock = {
        id: 's1',
        join: jest.fn().mockResolvedValue(undefined),
        leave: jest.fn().mockResolvedValue(undefined),
      } as Partial<Socket>;
    });

    it('disconnect 시 handleDisconnect가 null이면 emit 하지 않는다', () => {
      // GIVEN
      workspaceServiceMock.handleDisconnect = jest.fn().mockReturnValue(null);

      // WHEN
      gateway.handleDisconnect(clientMock as Socket);

      // THEN
      expect(workspaceServiceMock.handleDisconnect).toHaveBeenCalledWith('s1');
      expect(serverMock.emit).not.toHaveBeenCalled();
      expect(serverMock.to).not.toHaveBeenCalled();
    });

    it('disconnect 시 user:left, user:status(OFFLINE) 이벤트를 발생시킨다', () => {
      // GIVEN
      workspaceServiceMock.handleDisconnect = jest.fn().mockReturnValue({
        roomId: 'w1',
        userId: 'u1',
      });

      // WHEN
      gateway.handleDisconnect(clientMock as Socket);

      // THEN
      expect(workspaceServiceMock.handleDisconnect).toHaveBeenCalledWith('s1');
      expect(serverMock.to).toHaveBeenCalledWith('w1');
      expect(serverMock.emit).toHaveBeenCalledWith('user:status', {
        userId: 'u1',
        status: 'OFFLINE',
      });
      expect(serverMock.emit).toHaveBeenCalledWith('user:left', 'u1');
    });
  });

  describe('user:join', () => {
    beforeEach(() => {
      workspaceServiceMock.joinUser = jest.fn().mockReturnValue({
        roomId: 'w1',
        user: {
          id: 'u1',
          nickname: 'user1',
          color: '#000000',
          backgroundColor: '#ffffff',
        },
        allUsers: [
          {
            id: 'u1',
            nickname: 'user1',
            color: '#000000',
            backgroundColor: '#ffffff',
          },
        ],
      });

      serverMock.to = jest.fn().mockReturnValue(serverMock as Server);
      clientMock = {
        id: 's1',
        join: jest.fn().mockResolvedValue(undefined),
        leave: jest.fn().mockResolvedValue(undefined),
      } as Partial<Socket>;
    });

    it('user:join 이벤트 발생 시 일련의 과정을 거친 후 user:joined, user:status 이벤트 발생', async () => {
      // GIVEN
      const payload: JoinUserDTO = {
        workspaceId: 'w1',
        user: {
          id: 'u1',
          nickname: 'user1',
          color: '#000000',
          backgroundColor: '#ffffff',
        },
      };

      // WHEN
      await gateway.handleUserJoin(payload, clientMock as Socket);

      // THEN
      expect(workspaceServiceMock.joinUser).toHaveBeenCalledWith(payload, 's1');
      expect(cursorServiceMock.setCursor).toHaveBeenCalled();
      expect(cursorServiceMock.getCursorsByWorkspace).toHaveBeenCalledWith(
        'w1',
      );
      expect(clientMock.join).toHaveBeenCalledWith('w1');
      expect(serverMock.emit).toHaveBeenCalledWith('user:joined', {
        allUsers: [
          {
            id: 'u1',
            nickname: 'user1',
            color: '#000000',
            backgroundColor: '#ffffff',
          },
        ],
        cursors: [],
      });
      expect(serverMock.emit).toHaveBeenCalledWith('user:status', {
        userId: 'u1',
        status: 'ONLINE',
      });
    });

    it('user:join 이벤트 발생 시 client가 방에 들어가는지', async () => {
      // GIVEN
      const payload: JoinUserDTO = {
        workspaceId: 'w1',
        user: {
          id: 'u1',
          nickname: 'user1',
          color: '#000000',
          backgroundColor: '#ffffff',
        },
      };

      // WHEN
      await gateway.handleUserJoin(payload, clientMock as Socket);

      // THEN
      expect(clientMock.join).toHaveBeenCalledWith('w1');
    });

    it('user:join 이벤트 발생 시 workspaceService의 joinUser 메서드가 호출되는지', async () => {
      // GIVEN
      const payload: JoinUserDTO = {
        workspaceId: 'w1',
        user: {
          id: 'u1',
          nickname: 'user1',
          color: '#000000',
          backgroundColor: '#ffffff',
        },
      };

      // WHEN
      await gateway.handleUserJoin(payload, clientMock as Socket);

      // THEN
      expect(workspaceServiceMock.joinUser).toHaveBeenCalledWith(payload, 's1');
    });
  });

  describe('user:leave', () => {
    beforeEach(() => {
      workspaceServiceMock.leaveUser = jest.fn().mockReturnValue({
        roomId: 'w1',
        userId: 'u1',
      });

      serverMock.to = jest.fn().mockReturnValue(serverMock as Server);
      clientMock = {
        id: 's1',
        join: jest.fn().mockResolvedValue(undefined),
        leave: jest.fn().mockResolvedValue(undefined),
      } as unknown as Partial<Socket>;
    });

    it('user:leave 이벤트 발생 시 일련의 과정을 거친 후 user:left, user:status 이벤트 발생', async () => {
      // GIVEN
      const payload: LeaveUserDTO = {
        workspaceId: 'w1',
        userId: 'u1',
      };

      // WHEN
      await gateway.handleUserLeave(payload, clientMock as Socket);

      // THEN
      expect(workspaceServiceMock.leaveUser).toHaveBeenCalledWith('s1');
      expect(cursorServiceMock.removeCursor).toHaveBeenCalledWith('w1', 'u1');
      expect(clientMock.leave).toHaveBeenCalledWith('w1');
      expect(serverMock.emit).toHaveBeenCalledWith('user:left', payload.userId);
      expect(serverMock.emit).toHaveBeenCalledWith('user:status', {
        userId: 'u1',
        status: 'OFFLINE',
      });
    });

    it('user:leave 이벤트 발생 시 client가 방에서 나가는지', async () => {
      // GIVEN
      const payload: LeaveUserDTO = {
        workspaceId: 'w1',
        userId: 'u1',
      };

      // WHEN
      await gateway.handleUserLeave(payload, clientMock as Socket);

      // THEN
      expect(clientMock.leave).toHaveBeenCalledWith('w1');
    });

    it('user:leave 이벤트 발생 시 workspaceService의 leaveUser 메서드가 호출되는지', async () => {
      // GIVEN
      const payload: LeaveUserDTO = {
        workspaceId: 'w1',
        userId: 'u1',
      };

      // WHEN
      await gateway.handleUserLeave(payload, clientMock as Socket);

      // THEN
      expect(workspaceServiceMock.leaveUser).toHaveBeenCalledWith('s1');
    });
  });
});
