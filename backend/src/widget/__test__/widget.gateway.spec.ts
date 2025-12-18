import { Test, TestingModule } from '@nestjs/testing';
import { WidgetGateway } from '../widget.gateway';
import { IWidgetService, WIDGET_SERVICE } from '../widget.interface';
import { CreateWidgetDto } from '../dto/create-widget.dto';
import { WidgetType, TechStackContentDto } from '../dto/widget-content.dto';
import { Server } from 'socket.io';

// IWidgetService의 모든 메서드를 Mock 함수로 정의
type MockWidgetService = {
  [P in keyof IWidgetService]: jest.Mock;
};

// Socket Server의 Mock 타입 정의
type MockServer = Partial<Record<keyof Server, jest.Mock>>;

describe('WidgetGateway', () => {
  let gateway: WidgetGateway;
  let serviceMock: MockWidgetService;
  let serverMock: MockServer;

  beforeEach(async () => {
    serviceMock = {
      create: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
    };

    serverMock = {
      emit: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WidgetGateway,
        {
          provide: WIDGET_SERVICE,
          useValue: serviceMock,
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
    it('위젯을 생성하고 "widget:created" 이벤트를 브로드캐스트해야 한다', async () => {
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
      serviceMock.create.mockResolvedValue(createDto);

      // when: create 핸들러가 실행되면
      await gateway.create(createDto);

      // then: 서비스의 create 메서드가 호출되고, 서버 전체에 "widget:created" 이벤트가 전송되어야 한다
      expect(serviceMock.create).toHaveBeenCalledWith(createDto);
      expect(serverMock.emit).toHaveBeenCalledWith('widget:created', createDto);
    });
  });

  describe('update (위젯 수정 이벤트)', () => {
    it('위젯을 수정하고 "widget:updated" 이벤트를 브로드캐스트해야 한다', async () => {
      // given: 클라이언트로부터 수정 요청 데이터가 왔을 때
      const updateDto = { widgetId: 'w-1', data: { x: 100 } };
      const updatedWidget = { widgetId: 'w-1', data: { x: 100, y: 0 } };
      serviceMock.update.mockResolvedValue(updatedWidget);

      // when: update 핸들러가 실행되면
      await gateway.update(updateDto);

      // then: 서비스의 update 메서드가 호출되고, "widget:updated" 이벤트가 수정된 데이터와 함께 전송되어야 한다
      expect(serviceMock.update).toHaveBeenCalledWith(updateDto);
      expect(serverMock.emit).toHaveBeenCalledWith(
        'widget:updated',
        updatedWidget,
      );
    });
  });

  describe('remove (위젯 삭제 이벤트)', () => {
    it('위젯을 삭제하고 "widget:deleted" 이벤트를 브로드캐스트해야 한다', async () => {
      // given: 클라이언트로부터 삭제할 위젯 ID가 왔을 때
      const widgetId = 'w-1';
      const result = { widgetId };
      serviceMock.remove.mockResolvedValue(result);

      // when: remove 핸들러가 실행되면
      await gateway.remove({ widgetId });

      // then: 서비스의 remove 메서드가 호출되고, "widget:deleted" 이벤트가 삭제된 ID와 함께 전송되어야 한다
      expect(serviceMock.remove).toHaveBeenCalledWith(widgetId);
      expect(serverMock.emit).toHaveBeenCalledWith('widget:deleted', result);
    });
  });
});
