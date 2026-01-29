import { Injectable } from '@nestjs/common';
import { JoinUserDTO } from './dto/join-user.dto';
import { User } from './dto/join-user.dto';
import { StorageAdapter } from '../collaboration/storage/storage.interface';

// 유저 정보는 저장해야 함
interface UserSession {
  socketId: string;
  roomId: string;
  user: User;
}

// 3일 저장하기(만료되면 삭제)
interface WorkspaceInfo {
  expirationTime: Date;
}

@Injectable()
export class WorkspaceService {
  private readonly workspaces = new Map<string, WorkspaceInfo>();
  private readonly userSessions = new Map<string, UserSession>();

  constructor(private readonly storageAdapter: StorageAdapter) {}

  public createWorkspace(workspaceId: string): void {
    this.workspaces.set(workspaceId, {
      // 3일 후 만료
      expirationTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    });
  }

  public async isExistsWorkspace(workspaceId: string): Promise<boolean> {
    // 메모리에 있는지 확인
    if (this.workspaces.has(workspaceId)) {
      return true;
    }

    // Redis(Storage)에 있는지 확인 (Lazy Loading)
    const existsInStorage = await this.storageAdapter.get(
      `yjs:doc:workspace:${workspaceId}`,
    );

    if (existsInStorage) {
      // Redis에는 있는데 메모리에 없으면, 메모리에 복구 (TTL 3일 연장)
      this.createWorkspace(workspaceId);
      return true;
    }

    return false;
  }

  public updateWorkspace(workspaceId: string): void {
    this.workspaces.set(workspaceId, {
      // 만약 유저가 접속했으면 만료 시간 업데이트 (3일)
      expirationTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    });
  }

  public deleteWorkspace(workspaceId: string): void {
    this.workspaces.forEach((workspace) => {
      if (workspace.expirationTime < new Date()) {
        this.workspaces.delete(workspaceId);
      }
    });
  }

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
    allUsers: User[];
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

    const allUsers = this.getUsersByRoomId(roomId);

    return { roomId, user, allUsers };
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
