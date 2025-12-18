import { Injectable } from '@nestjs/common';
import { JoindedUserDTO, JoinUserDTO } from './dto/join-user.dto';
import { User } from './dto/join-user.dto';

// 유저 정보는 저장해야 함
interface UserSession {
  socketId: string;
  roomId: string;
  user: User;
}

@Injectable()
export class WorkspaceService {
  private readonly userSessions = new Map<string, UserSession>();

  public handleDisconnect(
    socketId: string,
  ): { roomId: string; userId: string } | null {
    const session = this.userSessions.get(socketId);
    if (!session) {
      return null;
    }

    const { roomId, user } = session;

    this.userSessions.delete(socketId);

    return { roomId, userId: user.id };
  }

  public joinUser(
    payload: JoinUserDTO,
    socketId: string,
  ): {
    roomId: string;
    user: User;
    otherUsers: User[];
  } {
    const roomId = payload.workspaceId;

    const user: User = {
      id: payload.user.id,
      nickname: payload.user.nickname,
      color: payload.user.color,
    };

    this.userSessions.set(socketId, {
      socketId,
      roomId,
      user,
    });

    return { roomId, user, otherUsers: this.getOtherUsers(user.id) };
  }

  public leaveUser(
    socketId: string,
  ): { roomId: string; userId: string } | null {
    const session = this.userSessions.get(socketId);
    if (!session) {
      return null;
    }

    const { roomId, user } = session;

    this.userSessions.delete(socketId);

    return { roomId, userId: user.id };
  }

  // 모든 유저 반환
  public getOtherUsers(userId: string): User[] {
    return Array.from(this.userSessions.values())
      .map((session) => session.user)
      .filter((user) => user.id !== userId);
  }

  // 소켓 Id로 유저 정보 조회
  public getUserBySocketId(socketId: string): {
    roomId: string;
    user: User;
  } | null {
    const session = this.userSessions.get(socketId);
    if (!session) {
      return null;
    }

    return {
      roomId: session.roomId,
      user: session.user,
    };
  }

  // 방 Id로 유저 정보 조회
  public getUsersByRoomId(roomId: string): User[] {
    return Array.from(this.userSessions.values())
      .filter((session) => session.roomId === roomId)
      .map((session) => session.user);
  }
}
