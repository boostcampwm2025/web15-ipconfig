import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';

import { WorkspaceService } from '../workspace.service';
import { JoinUserDTO } from '../dto/join-user.dto';
import { LeaveUserDTO } from '../dto/left-user.dto';

describe('WorkspaceService', () => {
  let service: WorkspaceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WorkspaceService],
    }).compile();

    service = module.get<WorkspaceService>(WorkspaceService);
  });

  it('서비스 인스턴스 생성', () => {
    expect(service).toBeDefined();
  });

  describe('joinUser', () => {
    it('방이 없으면 생성하고 유저 추가', () => {
      // GIVEN
      const payload: JoinUserDTO = {
        projectId: 'p1',
        user: { id: 'u1', nickname: 'user1', color: '#000000' },
      };

      // WHEN
      const result = service.joinUser(payload);

      // THEN
      expect(result).toEqual({
        roomId: 'p1',
        user: payload.user,
      });

      // 내부 상태 확인: roomId가 생성되고, 유저가 들어있다
      expect(service['rooms'].get('p1')).toEqual([payload.user]);
    });

    it('같은 방에 여러 유저를 순차적으로 추가하기', () => {
      // GIVEN
      const payload1: JoinUserDTO = {
        projectId: 'p1',
        user: { id: 'u1', nickname: 'user1', color: '#000000' },
      };
      const payload2: JoinUserDTO = {
        projectId: 'p1',
        user: { id: 'u2', nickname: 'user2', color: '#111111' },
      };

      // WHEN
      service.joinUser(payload1);
      const result2 = service.joinUser(payload2);

      // THEN
      expect(result2.roomId).toBe('p1');
      expect(service['rooms'].get('p1')).toEqual([
        payload1.user,
        payload2.user,
      ]);
    });
  });

  describe('getRoomIdByUserId', () => {
    it('해당 유저가 속한 roomId를 반환한다', () => {
      // GIVEN
      const payload: JoinUserDTO = {
        projectId: 'p1',
        user: { id: 'u1', nickname: 'user1', color: '#000000' },
      };
      service.joinUser(payload);

      // WHEN
      const roomId = service.getRoomIdByUserId('u1');

      // THEN
      expect(roomId).toBe('p1');
    });

    it('유저가 없으면 NotFoundException을 던진다', () => {
      // GIVEN
      const payload: JoinUserDTO = {
        projectId: 'p1',
        user: { id: 'u1', nickname: 'user1', color: '#000000' },
      };
      service.joinUser(payload);

      // WHEN + THEN
      expect(() => service.getRoomIdByUserId('u-not-exist')).toThrow(
        NotFoundException,
      );
    });
  });

  describe('leaveUser', () => {
    it('방에서 유저를 제거하고 roomId, userId를 반환한다', () => {
      // GIVEN
      const joinPayload: JoinUserDTO = {
        projectId: 'p1',
        user: { id: 'u1', nickname: 'user1', color: '#000000' },
      };
      service.joinUser(joinPayload);
      const leavePayload: LeaveUserDTO = { projectId: 'p1', userId: 'u1' };

      // WHEN
      const result = service.leaveUser(leavePayload);

      // THEN
      expect(result).toEqual({ roomId: 'p1', userId: 'u1' });
      expect(service['rooms'].has('p1')).toBe(false);
    });

    it('방이 없으면 NotFoundException을 던진다', () => {
      // GIVEN
      const leavePayload: LeaveUserDTO = { projectId: 'pX', userId: 'u1' };

      // WHEN + THEN
      expect(() => service.leaveUser(leavePayload)).toThrow(NotFoundException);
    });

    it('방은 있지만 유저가 없으면 NotFoundException을 던진다', () => {
      // GIVEN
      const joinPayload: JoinUserDTO = {
        projectId: 'p1',
        user: { id: 'u1', nickname: 'user1', color: '#000000' },
      };
      service.joinUser(joinPayload);
      const leavePayload: LeaveUserDTO = { projectId: 'p1', userId: 'uX' };

      // WHEN + THEN
      expect(() => service.leaveUser(leavePayload)).toThrow(NotFoundException);
    });
  });
});
