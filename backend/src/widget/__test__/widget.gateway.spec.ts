import { Test, TestingModule } from '@nestjs/testing';
import { WidgetGateway } from '../widget.gateway';
import { IWidgetService, WIDGET_SERVICE } from '../widget.interface';
import { CreateWidgetDto } from '../dto/create-widget.dto';
import { UpdateWidgetDto } from '../dto/update-widget.dto';
import { UpdateWidgetLayoutDto } from '../dto/update-widget-layout.dto';
import { WidgetType, TechStackContentDto } from '../dto/widget-content.dto';
import { Server, Socket } from 'socket.io';
import { WorkspaceService } from '../../workspace/workspace.service';

type MockWidgetService = {
  [P in keyof IWidgetService]: jest.Mock;
};

type MockWorkspaceService = {
  getUserBySocketId: jest.Mock;
};

describe('WidgetGateway', () => {
  let gateway: WidgetGateway;
  let serviceMock: MockWidgetService;
  let workspaceServiceMock: MockWorkspaceService;
  let serverMock: { to: jest.Mock; emit: jest.Mock };
  let clientMock: { id: string; to: jest.Mock; emit: jest.Mock };
  let serverToEmitMock: jest.Mock;
  let clientToEmitMock: jest.Mock;

  const roomId = 'room-1';
  const socketId = 's1';
  const userId = 'u1';
  const otherUserId = 'u2';

  beforeEach(async () => {
    serviceMock = {
      create: jest.fn(),
      update: jest.fn(),
      updateLayout: jest.fn(),
      remove: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      lock: jest.fn(),
      unlock: jest.fn(),
      getLockOwner: jest.fn(),
      unlockAllByUser: jest.fn(),
    };

    workspaceServiceMock = {
      getUserBySocketId: jest.fn().mockReturnValue({
        roomId,
        user: { id: userId },
      }),
    };

    serverToEmitMock = jest.fn();
    serverMock = {
      emit: jest.fn(),
      to: jest.fn().mockReturnValue({ emit: serverToEmitMock }),
    };

    clientToEmitMock = jest.fn();
    clientMock = {
      id: socketId,
      emit: jest.fn(),
      to: jest.fn().mockReturnValue({ emit: clientToEmitMock }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WidgetGateway,
        {
          provide: WIDGET_SERVICE,
          useValue: serviceMock,
        },
        {
          provide: WorkspaceService,
          useValue: workspaceServiceMock,
        },
      ],
    }).compile();

    gateway = module.get<WidgetGateway>(WidgetGateway);
    gateway.server = serverMock as unknown as Server;
  });

  it('게이트웨이가 정상적으로 정의되어야 한다', () => {
    expect(gateway).toBeDefined();
  });

  describe('widget:create (위젯 생성)', () => {
    it('새로운 위젯을 생성하고 해당 워크스페이스에 브로드캐스트해야 한다', async () => {
      // given: 위젯 생성을 위한 유효한 데이터가 준비된 상태
      const createDto: CreateWidgetDto = {
        widgetId: 'w-1',
        type: WidgetType.TECH_STACK,
        data: {
          x: 0,
          y: 0,
          width: 0,
          height: 0,
          zIndex: 0,
          content: {
            widgetType: WidgetType.TECH_STACK,
            selectedItems: [],
          } as TechStackContentDto,
        },
      };
      serviceMock.create.mockResolvedValue(createDto);

      // when: 클라이언트가 `widget:create` 이벤트를 전송했을 때
      await gateway.create(createDto, clientMock as unknown as Socket);

      // then: 위젯 서비스의 create가 호출되고, 같은 방의 모든 클라이언트에게 `widget:created` 이벤트가 전송된다
      expect(serviceMock.create).toHaveBeenCalledWith(roomId, createDto);
      expect(serverMock.to).toHaveBeenCalledWith(roomId);
      expect(serverToEmitMock).toHaveBeenCalledWith(
        'widget:created',
        createDto,
      );
    });
  });

  describe('widget:lock (위젯 잠금)', () => {
    const lockDto: UpdateWidgetLayoutDto = {
      widgetId: 'w-1',
      data: {
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        zIndex: 0,
      },
    };

    it('위젯 잠금에 성공하면 다른 사용자에게 잠금 사실을 알려야 한다', async () => {
      // given: 위젯 서비스가 잠금 성공(true)을 반환하도록 설정
      serviceMock.lock.mockResolvedValue(true);

      // when: 클라이언트가 `widget:lock` 이벤트를 전송했을 때
      await gateway.lock(lockDto, clientMock as unknown as Socket);

      // then: 위젯 서비스의 lock이 호출되고, 자신을 제외한 다른 클라이언트에게 `widget:locked` 이벤트가 전송된다
      expect(serviceMock.lock).toHaveBeenCalledWith(roomId, 'w-1', userId);
      expect(clientToEmitMock).toHaveBeenCalledWith('widget:locked', {
        widgetId: 'w-1',
        userId,
      });
      expect(clientMock.emit).not.toHaveBeenCalledWith(
        'error',
        expect.any(String),
      );
    });

    it('위젯 잠금에 실패하면 요청한 사용자에게 에러를 전송해야 한다', async () => {
      // given: 위젯 서비스가 잠금 실패(false)를 반환하도록 설정
      serviceMock.lock.mockResolvedValue(false);

      // when: 클라이언트가 `widget:lock` 이벤트를 전송했을 때
      await gateway.lock(lockDto, clientMock as unknown as Socket);

      // then: 위젯 서비스의 lock이 호출되고, 요청한 클라이언트에게만 'error' 이벤트가 전송된다
      expect(serviceMock.lock).toHaveBeenCalledWith(roomId, 'w-1', userId);
      expect(clientMock.emit).toHaveBeenCalledWith('error', expect.any(String));
    });
  });

  describe('widget:unlock (위젯 잠금 해제)', () => {
    const unlockDto = { widgetId: 'w-1' };

    it('위젯 잠금 해제에 성공하면 다른 사용자에게 잠금 해제 사실을 알려야 한다', async () => {
      // given: 위젯 서비스가 잠금 해제 성공(true)을 반환하도록 설정
      serviceMock.unlock.mockResolvedValue(true);

      // when: 클라이언트가 `widget:unlock` 이벤트를 전송했을 때
      await gateway.unlock(
        {
          widgetId: 'w-1',
          data: { x: 0, y: 0, width: 0, height: 0, zIndex: 0 },
        } as UpdateWidgetLayoutDto,
        clientMock as unknown as Socket,
      );

      // then: 위젯 서비스의 unlock이 호출되고, 자신을 제외한 다른 클라이언트에게 `widget:unlocked` 이벤트가 전송된다
      expect(serviceMock.unlock).toHaveBeenCalledWith(roomId, 'w-1', userId);
      expect(clientToEmitMock).toHaveBeenCalledWith('widget:unlocked', {
        widgetId: 'w-1',
        userId,
      });
    });

    it('위젯 잠금 해제에 실패하면 아무런 이벤트를 전송하지 않아야 한다', async () => {
      // given: 위젯 서비스가 잠금 해제 실패(false)를 반환하도록 설정
      serviceMock.unlock.mockResolvedValue(false);

      // when: 클라이언트가 `widget:unlock` 이벤트를 전송했을 때
      await gateway.unlock(
        {
          widgetId: 'w-1',
          data: { x: 0, y: 0, width: 0, height: 0, zIndex: 0 },
        } as UpdateWidgetLayoutDto,
        clientMock as unknown as Socket,
      );

      // then: 위젯 서비스의 unlock은 호출되지만, 다른 클라이언트에게는 아무런 이벤트도 전송되지 않는다
      expect(serviceMock.unlock).toHaveBeenCalledWith(roomId, 'w-1', userId);
      expect(clientToEmitMock).not.toHaveBeenCalled();
    });
  });

  describe('widget:move (위젯 이동)', () => {
    const layoutDto: UpdateWidgetLayoutDto = {
      widgetId: 'w-1',
      data: { x: 100, y: 50, width: 0, height: 0, zIndex: 0 },
    };

    it('잠금을 소유한 사용자가 요청 시, 위젯 위치를 변경하고 브로드캐스트해야 한다', async () => {
      // given: 사용자가 해당 위젯의 잠금을 소유하고 있는 상황
      serviceMock.getLockOwner.mockResolvedValue(userId);
      const updatedWidget: UpdateWidgetLayoutDto = {
        widgetId: 'w-1',
        data: { x: 100, y: 50, width: 0, height: 0, zIndex: 0 },
      };
      serviceMock.updateLayout.mockResolvedValue(updatedWidget);

      // when: 클라이언트가 `widget:move` 이벤트를 전송했을 때
      await gateway.move(updatedWidget, clientMock as unknown as Socket);

      // then: 잠금 소유자를 확인하고, 레이아웃을 업데이트한 뒤, 다른 사용자에게 `widget:moved`로 변경사항을 알린다
      expect(serviceMock.getLockOwner).toHaveBeenCalledWith(roomId, 'w-1');
      expect(serviceMock.updateLayout).toHaveBeenCalledWith(
        roomId,
        updatedWidget,
      );
      expect(serverToEmitMock).toHaveBeenCalledWith(
        'widget:moved',
        updatedWidget,
      );
    });

    it('다른 사용자가 잠금한 위젯에 대해서는 이동 요청을 무시해야 한다', async () => {
      // given: 다른 사용자가 위젯의 잠금을 소유하고 있는 상황
      serviceMock.getLockOwner.mockResolvedValue(otherUserId);

      // when: 클라이언트가 `widget:move` 이벤트를 전송했을 때
      await gateway.move(layoutDto, clientMock as unknown as Socket);

      // then: 잠금 소유자를 확인 후, 자신의 잠금이 아니므로 아무 작업도 수행하지 않는다
      expect(serviceMock.getLockOwner).toHaveBeenCalledWith(roomId, 'w-1');
      expect(serviceMock.updateLayout).not.toHaveBeenCalled();
      expect(clientToEmitMock).not.toHaveBeenCalled();
    });
  });

  describe('widget:update (위젯 내용 수정)', () => {
    const updateDto: UpdateWidgetDto = {
      widgetId: 'w-1',
      data: {
        content: {
          widgetType: WidgetType.TECH_STACK,
          selectedItems: [
            { id: 'nestjs', name: 'NestJS', category: 'Backend' },
          ],
        } as TechStackContentDto,
      },
    };

    it('잠금을 소유한 사용자가 요청 시, 위젯 내용을 수정하고 브로드캐스트해야 한다', async () => {
      // given: 사용자가 해당 위젯의 잠금을 소유하고 있는 상황
      serviceMock.getLockOwner.mockResolvedValue(userId);
      const updatedWidget = { widgetId: 'w-1', data: updateDto.data };
      serviceMock.update.mockResolvedValue(updatedWidget);

      // when: 클라이언트가 `widget:update` 이벤트를 전송했을 때
      await gateway.update(updateDto, clientMock as unknown as Socket);

      // then: 잠금 소유자를 확인하고, 위젯 내용을 업데이트한 뒤, 다른 사용자에게 `widget:updated`로 변경사항을 알린다
      expect(serviceMock.getLockOwner).toHaveBeenCalledWith(roomId, 'w-1');
      expect(serviceMock.update).toHaveBeenCalledWith(roomId, updateDto);
      expect(clientToEmitMock).toHaveBeenCalledWith(
        'widget:updated',
        updatedWidget,
      );
    });

    it('잠금되지 않은 위젯은 누구나 수정하고 브로드캐스트할 수 있다', async () => {
      // given: 위젯이 잠금되어 있지 않은 상황 (소유자 null)
      serviceMock.getLockOwner.mockResolvedValue(null);
      const updatedWidget = { widgetId: 'w-1', data: updateDto.data };
      serviceMock.update.mockResolvedValue(updatedWidget);

      // when: 클라이언트가 `widget:update` 이벤트를 전송했을 때
      await gateway.update(updateDto, clientMock as unknown as Socket);

      // then: 위젯 내용을 즉시 업데이트하고, 다른 사용자에게 `widget:updated`로 변경사항을 알린다
      expect(serviceMock.update).toHaveBeenCalledWith(roomId, updateDto);
      expect(clientToEmitMock).toHaveBeenCalledWith(
        'widget:updated',
        updatedWidget,
      );
    });

    it('다른 사용자가 잠금한 위젯에 대해서는 수정 요청 시 에러를 발생시켜야 한다', async () => {
      // given: 다른 사용자가 위젯의 잠금을 소유하고 있는 상황
      serviceMock.getLockOwner.mockResolvedValue(otherUserId);

      // when: 클라이언트가 `widget:update` 이벤트를 전송했을 때
      await gateway.update(updateDto, clientMock as unknown as Socket);

      // then: 잠금 소유자를 확인 후, 자신의 잠금이 아니므로 업데이트를 수행하지 않고 요청자에게 에러를 보낸다
      expect(serviceMock.update).not.toHaveBeenCalled();
      expect(clientMock.emit).toHaveBeenCalledWith('error', expect.any(String));
    });
  });

  describe('widget:delete (위젯 삭제)', () => {
    const widgetId = 'w-1';

    it('잠금을 소유한 사용자가 요청 시, 위젯을 삭제하고 브로드캐스트해야 한다', async () => {
      // given: 사용자가 해당 위젯의 잠금을 소유하고 있는 상황
      serviceMock.getLockOwner.mockResolvedValue(userId);
      serviceMock.remove.mockResolvedValue({ widgetId });

      // when: 클라이언트가 `widget:delete` 이벤트를 전송했을 때
      await gateway.remove({ widgetId }, clientMock as unknown as Socket);

      // then: 잠금 소유자를 확인하고, 위젯을 삭제한 뒤, 전체 사용자에게 `widget:deleted`로 삭제 사실을 알린다
      expect(serviceMock.remove).toHaveBeenCalledWith(roomId, widgetId);
      expect(serverToEmitMock).toHaveBeenCalledWith('widget:deleted', {
        widgetId,
      });
    });

    it('잠금되지 않은 위젯은 누구나 삭제하고 브로드캐스트할 수 있다', async () => {
      // given: 위젯이 잠금되어 있지 않은 상황 (소유자 null)
      serviceMock.getLockOwner.mockResolvedValue(null);
      serviceMock.remove.mockResolvedValue({ widgetId });

      // when: 클라이언트가 `widget:delete` 이벤트를 전송했을 때
      await gateway.remove({ widgetId }, clientMock as unknown as Socket);

      // then: 위젯을 즉시 삭제하고, 전체 사용자에게 `widget:deleted`로 삭제 사실을 알린다
      expect(serviceMock.remove).toHaveBeenCalledWith(roomId, widgetId);
      expect(serverToEmitMock).toHaveBeenCalledWith('widget:deleted', {
        widgetId,
      });
    });

    it('다른 사용자가 잠금한 위젯에 대해서는 삭제 요청 시 에러를 발생시켜야 한다', async () => {
      // given: 다른 사용자가 위젯의 잠금을 소유하고 있는 상황
      serviceMock.getLockOwner.mockResolvedValue(otherUserId);

      // when: 클라이언트가 `widget:delete` 이벤트를 전송했을 때
      await gateway.remove({ widgetId }, clientMock as unknown as Socket);

      // then: 잠금 소유자를 확인 후, 자신의 잠금이 아니므로 삭제를 수행하지 않고 요청자에게 에러를 보낸다
      expect(serviceMock.remove).not.toHaveBeenCalled();
      expect(clientMock.emit).toHaveBeenCalledWith('error', expect.any(String));
    });
  });

  describe('widget:load_all (전체 위젯 조회)', () => {
    it('요청한 사용자에게만 전체 위젯 목록을 반환해야 한다', async () => {
      // given: 서비스에 여러 위젯이 저장되어 있는 상황
      const widgets = [{ widgetId: 'w-1' }];
      serviceMock.findAll.mockResolvedValue(widgets);

      // when: 클라이언트가 `widget:load_all` 이벤트를 전송했을 때
      await gateway.findAll(clientMock as unknown as Socket);

      // then: 위젯 서비스의 findAll이 호출되고, 요청한 클라이언트에게만 `widget:load_all_response`로 목록이 전송된다
      expect(serviceMock.findAll).toHaveBeenCalledWith(roomId);
      expect(clientMock.emit).toHaveBeenCalledWith(
        'widget:load_all_response',
        widgets,
      );
    });
  });
});
