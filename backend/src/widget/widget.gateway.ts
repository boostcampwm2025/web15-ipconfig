import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Inject } from '@nestjs/common';
import { AsyncApiPub, AsyncApiSub } from 'nestjs-asyncapi';
import type { IWidgetService } from './widget.interface';
import { WIDGET_SERVICE } from './widget.interface';
import { CreateWidgetDto } from './dto/create-widget.dto';
import { UpdateWidgetDto } from './dto/update-widget.dto';
import { UpdateWidgetLayoutDto } from './dto/update-widget-layout.dto';
import { WorkspaceService } from '../workspace/workspace.service';

const isProduction = process.env.NODE_ENV === 'production';
const allowedOrigins = isProduction ? process.env.HOST_URL : '*';

@WebSocketGateway({
  namespace: 'workspace',
  cors: {
    origin: allowedOrigins,
    credentials: true,
  },
})
export class WidgetGateway {
  @WebSocketServer()
  server: Server;

  constructor(
    @Inject(WIDGET_SERVICE)
    private readonly widgetService: IWidgetService,
    private readonly workspaceService: WorkspaceService,
  ) {}

  private getRoomId(client: Socket): string | null {
    const userInfo = this.workspaceService.getUserBySocketId(client.id);

    if (!userInfo) {
      client.emit('error', 'User not found in workspace. Please join first.');
      return null;
    }

    return userInfo.roomId;
  }

  @AsyncApiSub({
    channel: 'widget:create',
    summary: '위젯 생성',
    description: '클라이언트가 새 위젯을 생성할 때 서버로 보내는 이벤트입니다.',
    message: {
      payload: CreateWidgetDto,
    },
  })
  @AsyncApiPub({
    channel: 'widget:created',
    summary: '위젯 생성 브로드캐스트',
    description:
      '특정 워크스페이스에서 위젯이 생성되면 같은 워크스페이스의 모든 클라이언트에게 브로드캐스트합니다.',
    message: {
      payload: Object,
    },
  })
  @SubscribeMessage('widget:create')
  async create(
    @MessageBody() createWidgetDto: CreateWidgetDto,
    @ConnectedSocket() client: Socket,
  ) {
    const roomId = this.getRoomId(client);
    if (!roomId) return;

    const widget = await this.widgetService.create(roomId, createWidgetDto);
    this.server.to(roomId).emit('widget:created', widget);
    return widget;
  }

  // 레이아웃 변경 (이동, 크기 조절 등)
  @AsyncApiSub({
    channel: 'widget:move',
    summary: '위젯 레이아웃 변경',
    description:
      '클라이언트에서 위젯의 위치 또는 크기를 변경할 때 서버로 보내는 이벤트입니다.',
    message: {
      payload: UpdateWidgetLayoutDto,
    },
  })
  @AsyncApiPub({
    channel: 'widget:moved',
    summary: '위젯 레이아웃 변경 브로드캐스트',
    description:
      '위젯의 레이아웃이 수정된 이후, 동일 워크스페이스의 모든 클라이언트에게 수정된 위젯 레이아웃 정보를 브로드캐스트합니다.',
    message: {
      payload: UpdateWidgetLayoutDto,
    },
  })
  @SubscribeMessage('widget:move')
  async move(
    @MessageBody() updateLayoutDto: UpdateWidgetLayoutDto,
    @ConnectedSocket() client: Socket,
  ) {
    const roomId = this.getRoomId(client);
    if (!roomId) return;

    const updatedWidget = await this.widgetService.updateLayout(
      roomId,
      updateLayoutDto,
    );

    client.to(roomId).emit('widget:moved', updatedWidget);

    return updatedWidget;
  }

  // 콘텐츠 변경 (내용 수정)
  @AsyncApiSub({
    channel: 'widget:update',
    summary: '위젯 수정',
    description:
      '클라이언트에서 위젯의 위치/내용 등을 수정할 때 서버로 보내는 이벤트입니다.',
    message: {
      payload: UpdateWidgetDto,
    },
  })
  @AsyncApiPub({
    channel: 'widget:updated',
    summary: '위젯 수정 브로드캐스트',
    description:
      '위젯이 수정된 이후, 동일 워크스페이스의 모든 클라이언트에게 수정된 위젯 정보를 브로드캐스트합니다.',
    message: {
      payload: Object,
    },
  })
  @SubscribeMessage('widget:update')
  async update(
    @MessageBody() updateWidgetDto: UpdateWidgetDto,
    @ConnectedSocket() client: Socket,
  ) {
    const roomId = this.getRoomId(client);
    if (!roomId) return;

    const updatedWidget = await this.widgetService.update(
      roomId,
      updateWidgetDto,
    );

    client.to(roomId).emit('widget:updated', updatedWidget);

    return updatedWidget;
  }

  @AsyncApiSub({
    channel: 'widget:delete',
    summary: '위젯 삭제',
    description:
      '특정 위젯을 삭제할 때 서버로 보내는 이벤트입니다. widgetId를 포함합니다. /* 현재는 DTO로 받지 않고 단일 widgetId로 받고 있어서 나오지 않음 */',
    message: {
      payload: Object,
    },
  })
  @AsyncApiPub({
    channel: 'widget:deleted',
    summary: '위젯 삭제 브로드캐스트',
    description:
      '위젯이 삭제된 후, 동일 워크스페이스의 모든 클라이언트에게 삭제 결과를 브로드캐스트합니다.',
    message: {
      payload: Object,
    },
  })
  @SubscribeMessage('widget:delete')
  async remove(
    @MessageBody() body: { widgetId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const roomId = this.getRoomId(client);
    if (!roomId) return;

    const result = await this.widgetService.remove(roomId, body.widgetId);
    this.server.to(roomId).emit('widget:deleted', result);
    return result;
  }

  @AsyncApiSub({
    channel: 'widget:load_all',
    summary: '워크스페이스 위젯 전체 조회',
    description:
      '클라이언트가 현재 워크스페이스의 전체 위젯 목록을 조회할 때 사용하는 이벤트입니다.',
    message: {
      payload: Object,
    },
  })
  @AsyncApiPub({
    channel: 'widget:load_all_response',
    summary: '위젯 전체 조회 응답',
    description:
      '요청한 클라이언트에게만 현재 워크스페이스의 전체 위젯 목록을 응답으로 보내는 이벤트입니다.',
    message: {
      payload: Array,
    },
  })
  @SubscribeMessage('widget:load_all')
  async findAll(@ConnectedSocket() client: Socket) {
    const roomId = this.getRoomId(client);
    if (!roomId) return;

    const widgets = await this.widgetService.findAll(roomId);
    client.emit('widget:load_all_response', widgets);
  }
}
