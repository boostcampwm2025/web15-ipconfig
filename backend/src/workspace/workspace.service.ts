// workspace.service.ts (예시)

import { Injectable, NotFoundException } from '@nestjs/common';
import { JoindedUserDTO, JoinUserDTO } from './dto/join-user.dto';
import { LeaveUserDTO } from './dto/left-user.dto';

@Injectable()
export class WorkspaceService {
  private readonly rooms: Map<string, JoindedUserDTO[]> = new Map();

  public getRoomIdByUserId(userId: string): string {
    for (const [roomId, roomUsers] of this.rooms.entries()) {
      if (roomUsers.some((user) => user.id === userId)) {
        return roomId;
      }
    }

    throw new NotFoundException('방을 찾을 수 없습니다.');
  }

  public getRoomUsersByRoomId(roomId: string): JoindedUserDTO[] {
    const room = this.rooms.get(roomId);
    if (!room) {
      throw new NotFoundException('방을 찾을 수 없습니다.');
    }
    return room;
  }

  // 유저 입장
  public joinUser(payload: JoinUserDTO): {
    roomId: string;
    user: JoindedUserDTO;
  } {
    const roomId = payload.projectId;

    // 방이 없을 시 새로 방 하나 만들기
    if (!this.rooms.has(roomId)) {
      this.rooms.set(roomId, []);
    }

    const room = this.rooms.get(roomId)!;

    const user: JoindedUserDTO = {
      id: payload.user.id,
      nickname: payload.user.nickname,
      color: payload.user.color,
    };

    room.push(user);

    return { roomId, user };
  }

  // 유저 퇴장
  public leaveUser(payload: LeaveUserDTO): { roomId: string; userId: string } {
    const roomId = payload.projectId;
    const userId = payload.userId;

    const room = this.rooms.get(roomId);
    if (!room) {
      throw new NotFoundException('방을 찾을 수 없습니다.');
    }

    // 유저 제거
    const user = room.find((user) => user.id === userId);
    if (!user) {
      throw new NotFoundException('유저를 찾을 수 없습니다.');
    }
    room.splice(room.indexOf(user), 1);

    // 방이 비면 정리
    if (room.length === 0) {
      this.rooms.delete(roomId);
    }

    return { roomId, userId };
  }
}
