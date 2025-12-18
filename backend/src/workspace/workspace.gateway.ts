import {
  SubscribeMessage,
  WebSocketGateway,
  MessageBody,
  ConnectedSocket,
  WebSocketServer,
  OnGatewayDisconnect,
  OnGatewayConnection,
} from '@nestjs/websockets';

import { Server, Socket } from 'socket.io';
import { JoinUserDTO } from './dto/join-user.dto';
import { LeaveUserDTO } from './dto/left-user.dto';
import { MoveCursorDTO } from './dto/move-cursor.dto';
import { UserStatus } from './dto/user-status.dto';
import { WorkspaceService } from './workspace.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class WorkspaceGateway implements OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private readonly workspaceService: WorkspaceService) {}

  handleDisconnect(client: Socket) {
    const result = this.workspaceService.handleDisconnect(client.id);
    if (!result) {
      return;
    }
    const { roomId, userId } = result;

    this.server.to(roomId).emit('user:status', {
      userId,
      status: UserStatus.OFFLINE,
    });
    this.server.to(roomId).emit('user:left', userId);
  }

  /* 
  워크 스페이스 처음 접속 시 정보를 전달해줘야 함
  1. 위젯 데이터
  2. 유저 관련 정보
  */
  @SubscribeMessage('user:join')
  async handleUserJoin(
    @MessageBody() payload: JoinUserDTO,
    @ConnectedSocket() client: Socket,
  ) {
    const { roomId, user } = this.workspaceService.joinUser(payload, client.id);

    await client.join(roomId);

    this.server.to(roomId).emit('user:status', {
      userId: user.id,
      status: UserStatus.ONLINE,
    });
    this.server.to(roomId).emit('user:joined', user);
  }

  @SubscribeMessage('user:leave')
  async handleUserLeave(
    @MessageBody() payload: LeaveUserDTO,
    @ConnectedSocket() client: Socket,
  ) {
    const result = this.workspaceService.leaveUser(client.id);
    if (!result) {
      return;
    }
    const { roomId, userId } = result;

    await client.leave(roomId);

    this.server.to(roomId).emit('user:status', {
      userId,
      status: UserStatus.OFFLINE,
    });
    this.server.to(roomId).emit('user:left', userId);
  }

  @SubscribeMessage('cursor:move')
  handleCursorMove(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: MoveCursorDTO,
  ) {
    // 굳이 들어가야 하는 부분일까? 유저가 없다면 무시하긴 하는 로직이긴 한데...
    const userInfo = this.workspaceService.getUserBySocketId(client.id);
    if (!userInfo) {
      return;
    }

    const { roomId } = userInfo;

    this.server.to(roomId).emit('cursor:moved', payload);
  }
}
