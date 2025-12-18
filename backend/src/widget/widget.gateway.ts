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
import { WorkspaceService } from '../workspace/workspace.service';

@WebSocketGateway({ namespace: 'workspace', cors: { origin: '*' } })
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
    this.server.to(roomId).emit('widget:updated', updatedWidget);
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
