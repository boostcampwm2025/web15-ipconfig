import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Inject } from '@nestjs/common';
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

  @SubscribeMessage('widget:load_all')
  async findAll(@ConnectedSocket() client: Socket) {
    const roomId = this.getRoomId(client);
    if (!roomId) return;

    const widgets = await this.widgetService.findAll(roomId);
    client.emit('widget:load_all_response', widgets);
  }
}
