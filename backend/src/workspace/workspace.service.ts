import { Injectable } from '@nestjs/common';
import { JoindedUserDTO, JoinUserDTO } from './dto/join-user.dto';
import { LeaveUserDTO } from './dto/left-user.dto';
import { Socket } from 'socket.io';

@Injectable()
export class WorkspaceService {
  public handleDisconnect(
    client: Socket,
  ): { roomId: string; userId: string } | null {
    const data = client.data as { roomId?: string; userId?: string };
    const { roomId, userId } = data;

    client.data = {};

    if (!roomId || !userId) return null;
    return { roomId, userId };
  }

  // 유저 입장
  public joinUser(
    payload: JoinUserDTO,
    client: Socket,
  ): {
    roomId: string;
    user: JoindedUserDTO;
  } {
    const roomId = payload.workspaceId;

    const user: JoindedUserDTO = {
      id: payload.user.id,
      nickname: payload.user.nickname,
      color: payload.user.color,
    };

    // 소켓 자체에 데이터 저장하기
    client.data = {
      roomId,
      userId: user.id,
    };

    return { roomId, user };
  }

  // 유저 퇴장
  public leaveUser(
    payload: LeaveUserDTO,
    client: Socket,
  ): { roomId: string; userId: string } {
    const roomId = payload.workspaceId;
    const userId = payload.userId;

    client.data = {};

    return { roomId, userId };
  }
}
