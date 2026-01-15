import { Test, TestingModule } from '@nestjs/testing';
import { Server, Socket } from 'socket.io';
import { WorkspaceGateway } from '../workspace.gateway';
import { WorkspaceService } from '../workspace.service';
import { JoinUserDTO } from '../dto/join-user.dto';
import { LeaveUserDTO } from '../dto/left-user.dto';
import { IWidgetService, WIDGET_SERVICE } from '../../widget/widget.interface';

describe('WorkspaceGateway', () => {
  let gateway: WorkspaceGateway;
  let serverMock: { to: jest.Mock; emit: jest.Mock };
  let clientMock: Partial<Socket>;
  let workspaceServiceMock: Partial<WorkspaceService>;
  let widgetServiceMock: Partial<IWidgetService>;
  let serverToEmitMock: jest.Mock;

  const workspaceId = 'w1';
  const userId = 'u1';
  const socketId = 's1';

  beforeEach(async () => {
    serverToEmitMock = jest.fn();
    serverMock = {
      to: jest.fn().mockReturnValue({ emit: serverToEmitMock }),
      emit: jest.fn(),
    };

    clientMock = {
      id: socketId,
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

    widgetServiceMock = {
      findAll: jest.fn().mockResolvedValue([]),
      unlockAllByUser: jest.fn().mockResolvedValue([]),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WorkspaceGateway,
        { provide: WorkspaceService, useValue: workspaceServiceMock },
        { provide: WIDGET_SERVICE, useValue: widgetServiceMock },
      ],
    }).compile();

    gateway = module.get<WorkspaceGateway>(WorkspaceGateway);

    gateway.server = serverMock as unknown as Server;

    jest.clearAllMocks();
  });

  it('게이트웨이가 정상적으로 생성되어야 한다', () => {
    expect(gateway).toBeDefined();
  });

  describe('handleDisconnect (연결 해제)', () => {
    it('유저의 연결이 끊어지면, 퇴장처리 및 관련 리소스(커서, 위젯 잠금)를 해제해야 한다', async () => {
      // given
      workspaceServiceMock.handleDisconnect = jest
        .fn()
        .mockReturnValue({ roomId: workspaceId, userId: userId });
      widgetServiceMock.unlockAllByUser = jest
        .fn()
        .mockResolvedValue(['widget-1']);

      // when
      await gateway.handleDisconnect(clientMock as Socket);

      // then
      expect(workspaceServiceMock.handleDisconnect).toHaveBeenCalledWith(
        socketId,
      );
      expect(widgetServiceMock.unlockAllByUser).toHaveBeenCalledWith(
        workspaceId,
        userId,
      );
      expect(serverMock.to).toHaveBeenCalledWith(workspaceId);
      expect(serverToEmitMock).toHaveBeenCalledWith('widget:unlocked', {
        widgetId: 'widget-1',
        userId: userId,
      });
      expect(serverToEmitMock).toHaveBeenCalledWith('user:status', {
        userId,
        status: 'OFFLINE',
      });
      expect(serverToEmitMock).toHaveBeenCalledWith('user:left', userId);
    });

    it('유효하지 않은 유저의 연결 해제는 무시되어야 한다', async () => {
      // given
      workspaceServiceMock.handleDisconnect = jest.fn().mockReturnValue(null);

      // when
      await gateway.handleDisconnect(clientMock as Socket);

      // then
      expect(serverMock.to).not.toHaveBeenCalled();
      expect(serverToEmitMock).not.toHaveBeenCalled();
    });
  });

  describe('user:join (워크스페이스 참여)', () => {
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

      serverMock.to = jest
        .fn()
        .mockReturnValue(serverMock as unknown as Server);
      clientMock = {
        id: 's1',
        join: jest.fn().mockResolvedValue(undefined),
        leave: jest.fn().mockResolvedValue(undefined),
      } as Partial<Socket>;
    });

    it('user:join 이벤트 발생 시 일련의 과정을 거친 후 user:status(ONLINE), user:joined 이벤트 발생', async () => {
      // GIVEN
      const payload: JoinUserDTO = {
        workspaceId: workspaceId,
        user: {
          id: userId,
          nickname: 'user1',
          color: '#000000',
          backgroundColor: '#ffffff',
        },
      };
      workspaceServiceMock.joinUser = jest.fn().mockReturnValue({
        roomId: workspaceId,
        user: payload.user,
        allUsers: [payload.user],
      });

      serverMock.to.mockClear();
      serverMock.emit.mockClear();

      // when
      await gateway.handleUserJoin(payload, clientMock as Socket);

      // THEN
      expect(workspaceServiceMock.joinUser).toHaveBeenCalledWith(payload, 's1');
      expect(clientMock.join).toHaveBeenCalledWith('w1');
      expect(serverMock.emit).toHaveBeenCalledWith('user:status', {
        userId: 'u1',
        status: 'ONLINE',
      });
      expect(serverMock.emit).toHaveBeenCalledWith('user:joined', {
        allUsers: [
          {
            id: 'u1',
            nickname: 'user1',
            color: '#000000',
            backgroundColor: '#ffffff',
          },
        ],
        allWidgets: [],
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

  describe('user:leave (워크스페이스 퇴장)', () => {
    it('유저가 퇴장하면, 퇴장처리 및 관련 리소스(커서, 위젯 잠금)를 해제해야 한다', async () => {
      // given
      const payload: LeaveUserDTO = {
        workspaceId: workspaceId,
        userId: userId,
      };
      workspaceServiceMock.leaveUser = jest
        .fn()
        .mockReturnValue({ roomId: workspaceId, userId: userId });

      // when
      await gateway.handleUserLeave(payload, clientMock as Socket);

      // then
      expect(workspaceServiceMock.leaveUser).toHaveBeenCalledWith(socketId);
      expect(clientMock.leave).toHaveBeenCalledWith(workspaceId);
      expect(widgetServiceMock.unlockAllByUser).toHaveBeenCalledWith(
        workspaceId,
        userId,
      );
      expect(serverMock.to).toHaveBeenCalledWith(workspaceId);
      expect(serverToEmitMock).toHaveBeenCalledWith('user:status', {
        userId,
        status: 'OFFLINE',
      });
      expect(serverToEmitMock).toHaveBeenCalledWith('user:left', userId);
    });
  });
});
