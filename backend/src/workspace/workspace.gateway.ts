import {
  SubscribeMessage,
  WebSocketGateway,
  MessageBody,
  ConnectedSocket,
  WebSocketServer,
} from '@nestjs/websockets';

import { Server, Socket } from 'socket.io';
import { JoinUserDTO } from './dto/join-user.dto';
import { LeaveUserDTO } from './dto/left-user.dto';
import { MoveCursorDTO } from './dto/move-cursor.dto';
import { UserStatus } from './dto/user-status.dto';
import { WorkspaceService } from './workspace.service';
import { OnGatewayDisconnect } from '@nestjs/websockets';

@WebSocketGateway()
export class WorkspaceGateway implements OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private readonly workspaceService: WorkspaceService) {}

  handleDisconnect(client: Socket) {
    const result = this.workspaceService.handleDisconnect(client);
    if (!result) {
      return;
    }
    const { roomId, userId } = result;

    this.server.to(roomId).emit('user:status', {
      status: UserStatus.OFFLINE,
    });
    this.server.to(roomId).emit('user:left', userId);
  }

  @SubscribeMessage('user:join')
  async handleUserJoin(
    @MessageBody() payload: JoinUserDTO,
    @ConnectedSocket() client: Socket,
  ) {
    const { roomId, user } = this.workspaceService.joinUser(payload, client);

    await client.join(roomId);

    this.server.to(roomId).emit('user:status', {
      status: UserStatus.ONLINE,
    });
    this.server.to(roomId).emit('user:joined', user);
  }

  @SubscribeMessage('user:leave')
  async handleUserLeave(
    @MessageBody()
    payload: LeaveUserDTO,
    @ConnectedSocket() client: Socket,
  ) {
    const { roomId, userId } = this.workspaceService.leaveUser(payload, client);

    await client.leave(roomId);

    this.server.to(roomId).emit('user:status', {
      status: UserStatus.OFFLINE,
    });
    this.server.to(roomId).emit('user:left', userId);
  }

  // 커서 부분
  @SubscribeMessage('cursor:move')
  handleCursorMove(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    payload: MoveCursorDTO,
  ) {
    const roomId = (client.data as { roomId?: string })?.roomId;
    if (!roomId) return;

    // 서비스에서 처리하지 않고 바로 반환
    this.server.to(roomId).emit('cursor:moved', payload);
  }
}
