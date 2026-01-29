import { Test, TestingModule } from '@nestjs/testing';
import { WorkspaceService } from '../workspace.service';
import { JoinUserDTO } from '../dto/join-user.dto';
import { StorageAdapter } from '../../collaboration/storage/storage.interface';

interface WorkspaceInfo {
  expirationTime: Date;
}

describe('WorkspaceService', () => {
  let service: WorkspaceService;
  let storageAdapter: jest.Mocked<StorageAdapter>;

  beforeEach(async () => {
    const mockStorageAdapter = {
      get: jest.fn(),
      set: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WorkspaceService,
        {
          provide: StorageAdapter,
          useValue: mockStorageAdapter,
        },
      ],
    }).compile();

    service = module.get<WorkspaceService>(WorkspaceService);
    storageAdapter = module.get(StorageAdapter);
  });

  it('서비스 인스턴스 생성', () => {
    expect(service).toBeDefined();
  });

  describe('joinUser', () => {
    it('유저 정보를 Map에 저장하고 반환한다', () => {
      // GIVEN
      const payload: JoinUserDTO = {
        workspaceId: 'w1',
        user: {
          id: 'u1',
          nickname: 'user1',
          color: '#000000',
        },
      };
      const socketId = 's1';

      // WHEN
      const result = service.joinUser(payload, socketId);

      // THEN
      expect(result).toEqual({
        roomId: 'w1',
        user: payload.user,
        allUsers: [payload.user],
      });

      // Map에 저장되었는지 확인
      const userInfo = service.getUserBySocketId(socketId);
      expect(userInfo).toEqual({
        roomId: 'w1',
        user: payload.user,
      });
    });
  });

  describe('leaveUser', () => {
    it('Map에서 유저 정보를 삭제하고 roomId/userId를 반환한다', () => {
      // GIVEN
      const payload: JoinUserDTO = {
        workspaceId: 'w1',
        user: {
          id: 'u1',
          nickname: 'user1',
          color: '#000000',
        },
      };
      const socketId = 's1';
      service.joinUser(payload, socketId);

      // WHEN
      const result = service.leaveUser(socketId);

      // THEN
      expect(result).toEqual({ roomId: 'w1', userId: 'u1' });

      // Map에서 삭제되었는지 확인
      const userInfo = service.getUserBySocketId(socketId);
      expect(userInfo).toBeNull();
    });

    it('유저가 없으면 null을 반환한다', () => {
      // GIVEN
      const socketId = 's1';

      // WHEN
      const result = service.leaveUser(socketId);

      // THEN
      expect(result).toBeNull();
    });
  });

  describe('handleDisconnect', () => {
    it('유저 정보가 없으면 null을 반환한다', () => {
      // GIVEN
      const socketId = 's1';

      // WHEN
      const result = service.handleDisconnect(socketId);

      // THEN
      expect(result).toBeNull();
    });

    it('유저 정보가 있으면 반환하고 Map에서 삭제한다', () => {
      // GIVEN
      const payload: JoinUserDTO = {
        workspaceId: 'w1',
        user: {
          id: 'u1',
          nickname: 'user1',
          color: '#000000',
        },
      };
      const socketId = 's1';
      service.joinUser(payload, socketId);

      // WHEN
      const result = service.handleDisconnect(socketId);

      // THEN
      expect(result).toEqual({ roomId: 'w1', userId: 'u1' });

      // Map에서 삭제되었는지 확인
      const userInfo = service.getUserBySocketId(socketId);
      expect(userInfo).toBeNull();
    });
  });

  describe('getUserBySocketId', () => {
    it('소켓 ID로 유저 정보를 조회한다', () => {
      // GIVEN
      const payload: JoinUserDTO = {
        workspaceId: 'w1',
        user: {
          id: 'u1',
          nickname: 'user1',
          color: '#000000',
        },
      };
      const socketId = 's1';
      service.joinUser(payload, socketId);

      // WHEN
      const result = service.getUserBySocketId(socketId);

      // THEN
      expect(result).toEqual({
        roomId: 'w1',
        user: payload.user,
      });
    });

    it('유저 정보가 없으면 null을 반환한다', () => {
      // GIVEN
      const socketId = 's1';

      // WHEN
      const result = service.getUserBySocketId(socketId);

      // THEN
      expect(result).toBeNull();
    });
  });

  describe('getUsersByRoomId', () => {
    it('Room ID로 해당 방의 모든 유저를 조회한다', () => {
      // GIVEN
      const roomId = 'w1';
      const payload1: JoinUserDTO = {
        workspaceId: roomId,
        user: {
          id: 'u1',
          nickname: 'user1',
          color: '#000000',
        },
      };
      const payload2: JoinUserDTO = {
        workspaceId: roomId,
        user: {
          id: 'u2',
          nickname: 'user2',
          color: '#FF0000',
        },
      };
      service.joinUser(payload1, 's1');
      service.joinUser(payload2, 's2');

      // WHEN
      const result = service.getUsersByRoomId(roomId);

      // THEN
      expect(result).toHaveLength(2);
      expect(result).toContainEqual(payload1.user);
      expect(result).toContainEqual(payload2.user);
    });

    it('다른 방의 유저는 조회하지 않는다', () => {
      // GIVEN
      const payload1: JoinUserDTO = {
        workspaceId: 'w1',
        user: {
          id: 'u1',
          nickname: 'user1',
          color: '#000000',
        },
      };
      const payload2: JoinUserDTO = {
        workspaceId: 'w2',
        user: {
          id: 'u2',
          nickname: 'user2',
          color: '#FF0000',
        },
      };
      service.joinUser(payload1, 's1');
      service.joinUser(payload2, 's2');

      // WHEN
      const result = service.getUsersByRoomId('w1');

      // THEN
      expect(result).toHaveLength(1);
      expect(result).toContainEqual(payload1.user);
      expect(result).not.toContainEqual(payload2.user);
    });

    it('유저가 없는 방이면 빈 배열을 반환한다', () => {
      // GIVEN
      const roomId = 'w1';

      // WHEN
      const result = service.getUsersByRoomId(roomId);

      // THEN
      expect(result).toEqual([]);
    });
  });

  describe('isExistsWorkspace', () => {
    it('메모리에 있으면 true를 반환한다', async () => {
      const workspaceId = 'w1';
      service.createWorkspace(workspaceId);

      const result = await service.isExistsWorkspace(workspaceId);
      expect(result).toBe(true);
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(storageAdapter.get).not.toHaveBeenCalled();
    });

    it('메모리에 없지만 Redis에 있으면 메모리에 복구하고 true를 반환한다', async () => {
      const workspaceId = 'w1';
      const dummyData = new Uint8Array([1, 2, 3]);
      storageAdapter.get.mockResolvedValue(dummyData);

      const result = await service.isExistsWorkspace(workspaceId);

      expect(result).toBe(true);
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(storageAdapter.get).toHaveBeenCalledWith(
        `yjs:doc:workspace:${workspaceId}`,
      );

      // 메모리에 복구되었는지 확인 (동기적으로 has 체크를 못하므로 다시 호출해서 storage 호출 안되는지 확인)
      storageAdapter.get.mockClear();
      const result2 = await service.isExistsWorkspace(workspaceId);
      expect(result2).toBe(true);
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(storageAdapter.get).not.toHaveBeenCalled();
    });

    it('메모리에도 없고 Redis에도 없으면 false를 반환한다', async () => {
      const workspaceId = 'w1';
      storageAdapter.get.mockResolvedValue(null);

      const result = await service.isExistsWorkspace(workspaceId);
      expect(result).toBe(false);
    });
  });

  describe('expiration logic', () => {
    it('워크스페이스 생성 시 만료 시간은 현재로부터 약 3일 후여야 한다', () => {
      const workspaceId = 'w1';
      const before = Date.now();
      service.createWorkspace(workspaceId);
      const after = Date.now();

      // private 필드 접근을 위해 타입 우회
      const workspaces = (
        service as unknown as { workspaces: Map<string, WorkspaceInfo> }
      ).workspaces;
      const workspaceInfo = workspaces.get(workspaceId);

      if (!workspaceInfo) {
        throw new Error('Workspace info not found');
      }

      const expireTime = workspaceInfo.expirationTime.getTime();

      const expectedTimeLower = before + 3 * 24 * 60 * 60 * 1000;
      const expectedTimeUpper = after + 3 * 24 * 60 * 60 * 1000;

      expect(expireTime).toBeGreaterThanOrEqual(expectedTimeLower);
      expect(expireTime).toBeLessThanOrEqual(expectedTimeUpper);
    });
  });
});
