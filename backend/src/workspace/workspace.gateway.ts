import {
  SubscribeMessage,
  WebSocketGateway,
  MessageBody,
  ConnectedSocket,
  WebSocketServer,
  OnGatewayDisconnect,
} from '@nestjs/websockets';

import { Server, Socket } from 'socket.io';
import { AsyncApiPub, AsyncApiSub } from 'nestjs-asyncapi';
import { Inject } from '@nestjs/common';
import { JoinUserDTO } from './dto/join-user.dto';
import { LeaveUserDTO } from './dto/left-user.dto';
import { UserStatus, UserStatusDTO } from './dto/user-status.dto';
import { WorkspaceService } from './workspace.service';
import {
  type IWidgetService,
  WIDGET_SERVICE,
} from '../widget/widget.interface';

const isProduction = process.env.NODE_ENV === 'production';
const allowedOrigins = isProduction ? process.env.HOST_URL : '*';

@WebSocketGateway({
  namespace: 'workspace',
  cors: {
    origin: allowedOrigins,
    credentials: true,
  },
})
export class WorkspaceGateway implements OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly workspaceService: WorkspaceService,
    @Inject(WIDGET_SERVICE)
    private readonly widgetService: IWidgetService,
  ) {}

  async handleDisconnect(client: Socket) {
    const result = this.workspaceService.handleDisconnect(client.id);
    if (!result) {
      return;
    }
    const { roomId, userId } = result;

    const unlockedWidgetIds = await this.widgetService.unlockAllByUser(
      roomId,
      userId,
    );

    unlockedWidgetIds.forEach((widgetId) => {
      this.server.to(roomId).emit('widget:unlocked', {
        widgetId,
        userId,
      });
    });

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
  @AsyncApiSub({
    channel: 'user:join',
    summary: '워크스페이스 입장',
    description:
      '사용자가 특정 워크스페이스(room)에 처음 접속할 때 클라이언트에서 보내는 이벤트',
    message: {
      payload: JoinUserDTO,
    },
  })
  @AsyncApiPub({
    channel: 'user:joined',
    summary: '워크스페이스 유저/커서 정보 브로드캐스트',
    description:
      '새 유저가 입장했을 때, 같은 워크스페이스의 모든 유저와 커서 목록을 브로드캐스트합니다.',
    message: {
      // allUsers, cursors 구조를 간단히 표현하기 위해 DTO 대신 any 사용
      payload: Object,
    },
  })
  @AsyncApiPub({
    channel: 'user:status',
    summary: '유저 온라인 상태 변경',
    description:
      '유저가 워크스페이스에 입장 또는 퇴장할 때 ONLINE / OFFLINE 상태를 브로드캐스트합니다.',
    message: {
      payload: UserStatusDTO,
    },
  })
  @SubscribeMessage('user:join')
  async handleUserJoin(
    @MessageBody() payload: JoinUserDTO,
    @ConnectedSocket() client: Socket,
  ) {
    const { roomId, user, allUsers } = this.workspaceService.joinUser(
      payload,
      client.id,
    );

    await client.join(roomId);

    this.server.to(roomId).emit('user:status', {
      userId: user.id,
      status: UserStatus.ONLINE,
    });

    this.server.to(roomId).emit('user:joined', allUsers);
  }

  @AsyncApiSub({
    channel: 'user:leave',
    summary: '워크스페이스 퇴장',
    description:
      '사용자가 워크스페이스(room)에서 나갈 때 클라이언트에서 보내는 이벤트',
    message: {
      payload: LeaveUserDTO,
    },
  })
  @AsyncApiPub({
    channel: 'user:left',
    summary: '유저 퇴장 브로드캐스트',
    description:
      '유저가 워크스페이스에서 나가면 동일 워크스페이스의 다른 유저에게 퇴장 사실을 브로드캐스트합니다.',
    message: {
      payload: Object,
    },
  })
  @AsyncApiPub({
    channel: 'user:status',
    summary: '유저 온라인 상태 변경',
    description:
      '유저가 워크스페이스에 입장 또는 퇴장할 때 ONLINE / OFFLINE 상태를 브로드캐스트합니다.',
    message: {
      payload: UserStatusDTO,
    },
  })
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

    // 위젯 락 정리
    const unlockedWidgetIds = await this.widgetService.unlockAllByUser(
      roomId,
      userId,
    );
    unlockedWidgetIds.forEach((widgetId) => {
      this.server.to(roomId).emit('widget:unlocked', {
        widgetId,
        userId,
      });
    });

    await client.leave(roomId);

    this.server.to(roomId).emit('user:status', {
      userId,
      status: UserStatus.OFFLINE,
    });
    this.server.to(roomId).emit('user:left', userId);
  }
}
