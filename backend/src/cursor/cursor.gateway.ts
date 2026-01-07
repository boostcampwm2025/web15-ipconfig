import {
  SubscribeMessage,
  WebSocketGateway,
  MessageBody,
  ConnectedSocket,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AsyncApiPub, AsyncApiSub } from 'nestjs-asyncapi';
import { WorkspaceService } from '../workspace/workspace.service';
import { MoveCursorDTO } from './dto/move-cursor.dto';
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
export class CursorGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly workspaceService: WorkspaceService) {}

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

    const cursorData: UpdateCursorDTO = {
      workspaceId: roomId,
      userId: payload.userId,
      x: payload.moveData.x,
      y: payload.moveData.y,
    };

    // 동일 room에 브로드캐스트
    this.server.to(roomId).emit('cursor:moved', cursorData);
  }
}
