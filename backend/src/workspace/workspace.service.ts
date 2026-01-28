import { Injectable } from '@nestjs/common';
import { User } from './entity/user';

// 유저 정보는 저장해야 함
interface UserSession {
  socketId: string;
  roomId: string;
  user: User;
}

// 7일 저장하기(만료되면 삭제)
interface WorkspaceInfo {
  expirationTime: Date;
}

@Injectable()
export class WorkspaceService {
  private readonly workspaces = new Map<string, WorkspaceInfo>();
  private readonly userSessions = new Map<string, UserSession>();

  public createWorkspace(workspaceId: string): void {
    this.workspaces.set(workspaceId, {
      // 7일 후 만료
      expirationTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });
  }

  public isExistsWorkspace(workspaceId: string): boolean {
    return this.workspaces.has(workspaceId);
  }

  public updateWorkspace(workspaceId: string): void {
    this.workspaces.set(workspaceId, {
      // 만약 유저가 접속했으면 만료 시간 업데이트
      expirationTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });
  }

  public deleteWorkspace(workspaceId: string): void {
    this.workspaces.forEach((workspace) => {
      if (workspace.expirationTime < new Date()) {
        this.workspaces.delete(workspaceId);
      }
    });
  }
}
