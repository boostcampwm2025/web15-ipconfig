import { Test, TestingModule } from '@nestjs/testing';
import { Server, Socket } from 'socket.io';
import { WorkspaceGateway } from '../workspace.gateway';
import { WorkspaceService } from '../workspace.service';
import { CursorService } from '../../cursor/cursor.service';
import { JoinUserDTO } from '../dto/join-user.dto';
import { LeaveUserDTO } from '../dto/left-user.dto';
import { IWidgetService, WIDGET_SERVICE } from '../../widget/widget.interface';

describe('WorkspaceGateway', () => {
  let gateway: WorkspaceGateway;
  let serverMock: { to: jest.Mock; emit: jest.Mock };
  let clientMock: Partial<Socket>;
  let workspaceServiceMock: Partial<WorkspaceService>;
  let cursorServiceMock: Partial<CursorService>;
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

    cursorServiceMock = {
      setCursor: jest.fn(),
      updateCursor: jest.fn(),
      removeCursor: jest.fn(),
      getCursorsByWorkspace: jest.fn().mockReturnValue([]),
      hasCursor: jest.fn(),
    };

    widgetServiceMock = {
      unlockAllByUser: jest.fn().mockResolvedValue([]),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WorkspaceGateway,
        { provide: WorkspaceService, useValue: workspaceServiceMock },
        { provide: CursorService, useValue: cursorServiceMock },
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
      expect(cursorServiceMock.removeCursor).toHaveBeenCalledWith(
        workspaceId,
        userId,
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
    it('새로운 유저가 참여하면, 참여자 정보를 설정하고 다른 유저들에게 알려야 한다', async () => {
      // given
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

      // [수정 2] 불필요한 타입 단언(as jest.Mock) 제거
      // serverMock 정의 시점에 이미 타입이 지정되어 있습니다.
      serverMock.to.mockClear();
      serverMock.emit.mockClear();

      // when
      await gateway.handleUserJoin(payload, clientMock as Socket);

      // then
      expect(workspaceServiceMock.joinUser).toHaveBeenCalledWith(
        payload,
        socketId,
      );
      expect(clientMock.join).toHaveBeenCalledWith(workspaceId);
      expect(cursorServiceMock.setCursor).toHaveBeenCalled();
      expect(serverMock.to).toHaveBeenCalledWith(workspaceId);
      expect(serverToEmitMock).toHaveBeenCalledWith('user:status', {
        userId: userId,
        status: 'ONLINE',
      });
      expect(serverToEmitMock).toHaveBeenCalledWith('user:joined', {
        allUsers: [payload.user],
        cursors: [],
      });
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
      expect(cursorServiceMock.removeCursor).toHaveBeenCalledWith(
        workspaceId,
        userId,
      );
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
