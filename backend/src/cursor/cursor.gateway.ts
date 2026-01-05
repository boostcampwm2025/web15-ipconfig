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
import { WorkspaceService } from '../workspace/workspace.service';
import { MoveCursorDTO } from './dto/move-cursor.dto';
import { CursorService } from '../cursor/cursor.service';
import { UpdateCursorDTO } from '../cursor/dto/update-cursor.dto';

const isProduction = process.env.NODE_ENV === 'production';
const allowedOrigins = isProduction ? process.env.HOST_URL : '*';

@WebSocketGateway({
  namespace: 'workspace',
  cors: {
    origin: allowedOrigins,
    credentials: true,
  },
})
export class CursorGateway implements OnGatewayDisconnect {
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

    // 커서 정보 정리
    this.cursorService.removeCursor(roomId, userId);
  }

  @AsyncApiSub({
    channel: 'cursor:move',
    summary: '커서 이동',
    description:
      '사용자가 워크스페이스 내에서 마우스를 움직일 때, 커서 위치를 서버로 보냅니다.',
    message: {
      payload: MoveCursorDTO,
    },
  })
  @AsyncApiPub({
    channel: 'cursor:moved',
    summary: '커서 이동 브로드캐스트',
    description:
      '특정 유저의 커서 위치가 변경되었을 때, 같은 워크스페이스의 다른 유저들에게 브로드캐스트합니다.',
    message: {
      payload: MoveCursorDTO,
    },
  })
  @SubscribeMessage('cursor:move')
  handleCursorMove(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: MoveCursorDTO,
  ) {
    const userInfo = this.workspaceService.getUserBySocketId(client.id);
    if (!userInfo) {
      return;
    }

    const { roomId } = userInfo;

    this.cursorService.updateCursor({
      workspaceId: roomId,
      userId: payload.userId,
      x: payload.moveData.x,
      y: payload.moveData.y,
    } as UpdateCursorDTO);

    // 동일 room에 브로드캐스트
    this.server.to(roomId).emit('cursor:moved', payload);
  }
}
