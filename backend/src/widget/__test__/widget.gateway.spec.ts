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

  beforeEach(async () => {
    serviceMock = {
      create: jest.fn(),
      update: jest.fn(),
      updateLayout: jest.fn(),
      remove: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
    };

    workspaceServiceMock = {
      getUserBySocketId: jest.fn(),
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

  it('게이트웨이가 정의되어 있어야 한다', () => {
    expect(gateway).toBeDefined();
  });

  describe('create (위젯 생성 이벤트)', () => {
    it('위젯을 생성하고 특정 룸에 "widget:created" 이벤트를 전파해야 한다', async () => {
      // given: 클라이언트로부터 유효한 위젯 생성 데이터가 전달되었을 때
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

      // when: 클라이언트가 위젯 생성 이벤트를 요청하면
      await gateway.create(createDto, clientMock as unknown as Socket);

      // then: 서비스 로직을 통해 위젯을 생성하고, 해당 룸의 모든 클라이언트에게 생성된 위젯 정보를 브로드캐스트해야 한다
      expect(serviceMock.create).toHaveBeenCalledWith(roomId, createDto);
      expect(serverMock.to).toHaveBeenCalledWith(roomId);
      expect(serverToEmitMock).toHaveBeenCalledWith(
        'widget:created',
        createDto,
      );
    });
  });

  describe('move (위젯 이동/레이아웃 변경 이벤트)', () => {
    it('위젯 좌표를 수정하고 특정 룸에 "widget:moved" 이벤트를 전파해야 한다', async () => {
      // given: 클라이언트로부터 위젯 위치 이동(레이아웃) 데이터가 전달되었을 때
      const layoutDto: UpdateWidgetLayoutDto = {
        widgetId: 'w-1',
        x: 100,
        y: 50,
      };
      const updatedWidget = { widgetId: 'w-1', data: { x: 100, y: 50 } };

      workspaceServiceMock.getUserBySocketId.mockReturnValue({ roomId });
      serviceMock.updateLayout.mockResolvedValue(updatedWidget);

      // when: 클라이언트가 위젯 이동 이벤트를 요청하면
      await gateway.move(layoutDto, clientMock as unknown as Socket);

      // then: 서비스의 레이아웃 업데이트 메서드를 호출하고, 나를 제외한 다른 클라이언트들에게 변경된 위치 정보를 전송해야 한다
      expect(serviceMock.updateLayout).toHaveBeenCalledWith(roomId, layoutDto);
      expect(clientMock.to).toHaveBeenCalledWith(roomId);
      expect(clientToEmitMock).toHaveBeenCalledWith(
        'widget:moved',
        updatedWidget,
      );
    });
  });

  describe('update (위젯 콘텐츠 수정 이벤트)', () => {
    it('위젯 내용을 수정하고 특정 룸에 "widget:updated" 이벤트를 전파해야 한다', async () => {
      // given: 클라이언트로부터 위젯의 내부 콘텐츠 수정 데이터가 전달되었을 때
      const updateDto: UpdateWidgetDto = {
        widgetId: 'w-1',
        data: {
          content: {
            widgetType: WidgetType.TECH_STACK,
            selectedItems: ['NestJS'],
          },
        },
      };
      const updatedWidget = {
        widgetId: 'w-1',
        data: { content: { selectedItems: ['NestJS'] } },
      };

      workspaceServiceMock.getUserBySocketId.mockReturnValue({ roomId });
      serviceMock.update.mockResolvedValue(updatedWidget);

      // when: 클라이언트가 위젯 내용 수정 이벤트를 요청하면
      await gateway.update(updateDto, clientMock as unknown as Socket);

      // then: 서비스의 콘텐츠 업데이트 메서드를 호출하고, 나를 제외한 다른 클라이언트들에게 변경된 콘텐츠 정보를 전송해야 한다
      expect(serviceMock.update).toHaveBeenCalledWith(roomId, updateDto);
      expect(clientMock.to).toHaveBeenCalledWith(roomId);
      expect(clientToEmitMock).toHaveBeenCalledWith(
        'widget:updated',
        updatedWidget,
      );
    });
  });

  describe('remove (위젯 삭제 이벤트)', () => {
    it('위젯을 삭제하고 특정 룸에 "widget:deleted" 이벤트를 전파해야 한다', async () => {
      // given: 삭제할 위젯의 ID가 전달되었을 때
      const widgetId = 'w-1';
      const result = { widgetId };
      workspaceServiceMock.getUserBySocketId.mockReturnValue({ roomId });
      serviceMock.remove.mockResolvedValue(result);

      // when: 클라이언트가 위젯 삭제 이벤트를 요청하면
      await gateway.remove({ widgetId }, clientMock as unknown as Socket);

      // then: 서비스의 삭제 메서드를 호출하고, 룸의 모든 클라이언트에게 삭제된 위젯 ID를 브로드캐스트해야 한다
      expect(serviceMock.remove).toHaveBeenCalledWith(roomId, widgetId);
      expect(serverToEmitMock).toHaveBeenCalledWith('widget:deleted', result);
    });
  });

  describe('findAll (전체 위젯 로드 이벤트)', () => {
    it('워크스페이스의 모든 위젯을 조회하여 요청자에게 "widget:load_all_response"로 반환해야 한다', async () => {
      // given: 워크스페이스에 조회할 위젯 목록이 존재할 때
      const widgets = [{ widgetId: 'w-1' }];
      workspaceServiceMock.getUserBySocketId.mockReturnValue({ roomId });
      serviceMock.findAll.mockResolvedValue(widgets);

      // when: 클라이언트가 전체 위젯 목록 로드를 요청하면
      await gateway.findAll(clientMock as unknown as Socket);

      // then: 서비스에서 모든 위젯을 조회한 후, 요청을 보낸 클라이언트에게만 데이터를 응답해야 한다
      expect(serviceMock.findAll).toHaveBeenCalledWith(roomId);
      expect(clientMock.emit).toHaveBeenCalledWith(
        'widget:load_all_response',
        widgets,
      );
    });
  });
});
