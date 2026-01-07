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
import { JoinUserDTO } from './dto/join-user.dto';
import { LeaveUserDTO } from './dto/left-user.dto';
import { UserStatus, UserStatusDTO } from './dto/user-status.dto';
import { WorkspaceService } from './workspace.service';
import { CursorService } from '../cursor/cursor.service';
import { SetCursorDTO } from '../cursor/dto/set-cursor.dto';

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
    private readonly cursorService: CursorService,
  ) {}

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

    this.cursorService.setCursor({
      workspaceId: roomId,
      userId: user.id,
      // 아예 처음에 안보이게 하기...
      x: 10000,
      y: 10000,
    } as SetCursorDTO);

    // 현재 워크스페이스의 커서 상태도 함께 내려줄 수 있도록 확장 여지 확보
    const cursors = this.cursorService.getCursorsByWorkspace(roomId);

    this.server.to(roomId).emit('user:status', {
      userId: user.id,
      status: UserStatus.ONLINE,
    });

    // 같은 workspace(room)에 있는 전체 유저 + 커서 목록 전달
    this.server.to(roomId).emit('user:joined', {
      allUsers,
      cursors,
    });
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

    // 커서 정보 정리
    this.cursorService.removeCursor(roomId, userId);

    await client.leave(roomId);

    this.server.to(roomId).emit('user:status', {
      userId,
      status: UserStatus.OFFLINE,
    });
    this.server.to(roomId).emit('user:left', userId);
  }
}
