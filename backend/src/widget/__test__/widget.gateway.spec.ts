import { Test, TestingModule } from '@nestjs/testing';
import { WidgetGateway } from '../widget.gateway';
import { IWidgetService, WIDGET_SERVICE } from '../widget.interface';
import { CreateWidgetDto } from '../dto/create-widget.dto';
import { UpdateWidgetDto } from '../dto/update-widget.dto';
import { WidgetType, TechStackContentDto } from '../dto/widget-content.dto';
import { Server, Socket } from 'socket.io';
import { WorkspaceService } from '../../workspace/workspace.service';

type MockWidgetService = {
  [P in keyof IWidgetService]: jest.Mock;
};

type MockWorkspaceService = {
  getUserBySocketId: jest.Mock;
};
type MockServer = Partial<Record<keyof Server, jest.Mock>>;

describe('WidgetGateway', () => {
  let gateway: WidgetGateway;
  let serviceMock: MockWidgetService;
  let workspaceServiceMock: MockWorkspaceService;
  let serverMock: MockServer;
  let clientMock: Partial<Socket>;

  const roomId = 'room-1';
  const socketId = 's1';

  beforeEach(async () => {
    serviceMock = {
      create: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
    };

    workspaceServiceMock = {
      getUserBySocketId: jest.fn(),
    };

    serverMock = {
      emit: jest.fn(),
      to: jest.fn().mockReturnThis(),
    };

    clientMock = {
      id: socketId,
      emit: jest.fn(),
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

  it('게이트웨이가 정의되어 있어야 한다', () => {
    expect(gateway).toBeDefined();
  });

  describe('create (위젯 생성 이벤트)', () => {
    it('위젯을 생성하고 특정 룸에 "widget:created" 이벤트를 전파해야 한다', async () => {
      // given: 클라이언트로부터 생성 요청 데이터가 왔을 때
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

      workspaceServiceMock.getUserBySocketId.mockReturnValue({ roomId });
      serviceMock.create.mockResolvedValue(createDto);

      // when: create 핸들러가 실행되면
      await gateway.create(createDto, clientMock as Socket);

      // then: 서비스의 create 메서드가 호출되고, 서버 전체에 "widget:created" 이벤트가 전송되어야 한다
      expect(workspaceServiceMock.getUserBySocketId).toHaveBeenCalledWith(
        socketId,
      );
      expect(serviceMock.create).toHaveBeenCalledWith(roomId, createDto);
      expect(serverMock.to).toHaveBeenCalledWith(roomId);
      expect(serverMock.emit).toHaveBeenCalledWith('widget:created', createDto);
    });
  });

  describe('update (위젯 수정 이벤트)', () => {
    it('위젯을 수정하고 특정 룸에 "widget:updated" 이벤트를 전파해야 한다', async () => {
      // given: 클라이언트로부터 수정 요청 데이터가 왔을 때
      const updateDto: UpdateWidgetDto = { widgetId: 'w-1', data: { x: 100 } };
      const updatedWidget = { widgetId: 'w-1', data: { x: 100, y: 0 } };
      workspaceServiceMock.getUserBySocketId.mockReturnValue({ roomId });
      serviceMock.update.mockResolvedValue(updatedWidget);

      // when: update 핸들러가 실행되면
      await gateway.update(updateDto, clientMock as Socket);

      // then: 서비스의 update 메서드가 호출되고, "widget:updated" 이벤트가 수정된 데이터와 함께 전송되어야 한다
      expect(serviceMock.update).toHaveBeenCalledWith(roomId, updateDto);
      expect(serverMock.to).toHaveBeenCalledWith(roomId);
      expect(serverMock.emit).toHaveBeenCalledWith(
        'widget:updated',
        updatedWidget,
      );
    });
  });

  describe('remove (위젯 삭제 이벤트)', () => {
    it('위젯을 삭제하고 특정 룸에 "widget:deleted" 이벤트를 전파해야 한다', async () => {
      // given: 클라이언트로부터 삭제할 위젯 ID가 왔을 때
      const widgetId = 'w-1';
      const result = { widgetId };
      workspaceServiceMock.getUserBySocketId.mockReturnValue({ roomId });
      serviceMock.remove.mockResolvedValue(result);

      // when: remove 핸들러가 실행되면
      await gateway.remove({ widgetId }, clientMock as Socket);

      // then: 서비스의 remove 메서드가 호출되고, "widget:deleted" 이벤트가 삭제된 ID와 함께 전송되어야 한다
      expect(serviceMock.remove).toHaveBeenCalledWith(roomId, widgetId);
      expect(serverMock.to).toHaveBeenCalledWith(roomId);
      expect(serverMock.emit).toHaveBeenCalledWith('widget:deleted', result);
    });
  });
});
