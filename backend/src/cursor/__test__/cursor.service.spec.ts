import { Test, TestingModule } from '@nestjs/testing';

import { CursorService } from '../cursor.service';
import { SetCursorDTO } from '../dto/set-cursor.dto';
import { UpdateCursorDTO } from '../dto/update-cursor.dto';

describe('CursorService', () => {
  let service: CursorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CursorService],
    }).compile();

    service = module.get<CursorService>(CursorService);
  });

  it('서비스 인스턴스 생성', () => {
    expect(service).toBeDefined();
  });

  describe('setCursor', () => {
    it('커서 정보를 Map에 저장한다', () => {
      // GIVEN
      const payload: SetCursorDTO = {
        workspaceId: 'w1',
        userId: 'u1',
        x: 100,
        y: 100,
      };

      // WHEN
      service.setCursor(payload);

      // THEN
      expect(service.getCursorsByWorkspace('w1')).toContainEqual(payload);
    });
  });

  describe('updateCursor', () => {
    beforeEach(() => {
      service.setCursor({
        workspaceId: 'w1',
        userId: 'u1',
        x: 100,
        y: 100,
      });
    });

    it('워크스페이스 정보가 없으면 return한다.', () => {
      // GIVEN
      const payload: UpdateCursorDTO = {
        workspaceId: 'w2',
        userId: 'u1',
        x: 200,
        y: 200,
      };

      // WHEN
      const result = service.updateCursor(payload);

      // THEN
      expect(result).toBeUndefined();
    });

    // 근데 커서 정보 없으면 그냥 새로 추가하면 되지 않을까?
    it('커서 정보가 없으면 return한다.', () => {
      // GIVEN
      const payload: UpdateCursorDTO = {
        workspaceId: 'w1',
        userId: 'u2',
        x: 200,
        y: 200,
      };

      // WHEN
      const result = service.updateCursor(payload);

      // THEN
      expect(result).toBeUndefined();
    });

    it('커서 정보가 있으면 Map에서 업데이트한다', () => {
      // GIVEN
      const payload: UpdateCursorDTO = {
        workspaceId: 'w1',
        userId: 'u1',
        x: 200,
        y: 200,
      };

      // WHEN
      service.updateCursor(payload);

      // THEN
      expect(service.getCursorsByWorkspace('w1')).toContainEqual(payload);
    });
  });

  describe('hasCursor', () => {
    beforeEach(() => {
      service.setCursor({
        workspaceId: 'w1',
        userId: 'u1',
        x: 100,
        y: 100,
      });
    });

    it('워크스페이스 id가 없으면 false를 반환한다', () => {
      // GIVEN
      const workspaceId = 'w2';
      const userId = 'u1';

      // WHEN
      const result = service.hasCursor(workspaceId, userId);

      // THEN
      expect(result).toBeFalsy();
    });

    it('유저 id가 없으면 false를 반환한다', () => {
      // GIVEN
      const workspaceId = 'w1';
      const userId = 'u2';

      // WHEN
      const result = service.hasCursor(workspaceId, userId);

      // THEN
      expect(result).toBeFalsy();
    });

    it('둘 다 있으면 true를 반환한다', () => {
      // GIVEN
      const workspaceId = 'w1';
      const userId = 'u1';

      // WHEN
      const result = service.hasCursor(workspaceId, userId);

      // THEN
      expect(result).toBeTruthy();
    });
  });

  describe('removeCursor', () => {
    beforeEach(() => {
      service.setCursor({
        workspaceId: 'w1',
        userId: 'u1',
        x: 100,
        y: 100,
      });
      service.setCursor({
        workspaceId: 'w1',
        userId: 'u2',
        x: 200,
        y: 200,
      });
    });

    it('워크스페이스 id가 없으면 아무것도 삭제하지 않는다', () => {
      // GIVEN
      const workspaceId = 'w2';
      const userId = 'u1';

      // WHEN
      service.removeCursor(workspaceId, userId);

      // THEN
      expect(service.getCursorsByWorkspace('w1')).toHaveLength(2);
      expect(service.hasCursor('w1', 'u1')).toBeTruthy();
      expect(service.hasCursor('w1', 'u2')).toBeTruthy();
    });

    it('유저 id가 없으면 아무것도 삭제하지 않는다', () => {
      // GIVEN
      const workspaceId = 'w1';
      const userId = 'u3';

      // WHEN
      service.removeCursor(workspaceId, userId);

      // THEN
      expect(service.getCursorsByWorkspace('w1')).toHaveLength(2);
      expect(service.hasCursor('w1', 'u1')).toBeTruthy();
      expect(service.hasCursor('w1', 'u2')).toBeTruthy();
    });

    it('특정 유저의 커서를 삭제한다', () => {
      // GIVEN
      const workspaceId = 'w1';
      const userId = 'u1';

      // WHEN
      service.removeCursor(workspaceId, userId);

      // THEN
      expect(service.getCursorsByWorkspace('w1')).toHaveLength(1);
      expect(service.hasCursor('w1', 'u1')).toBeFalsy();
      expect(service.hasCursor('w1', 'u2')).toBeTruthy();
    });
  });

  describe('getCursorsByWorkspace', () => {
    it('워크스페이스 id가 없으면 빈 배열을 반환한다', () => {
      // GIVEN
      const workspaceId = 'w1';

      // WHEN
      const result = service.getCursorsByWorkspace(workspaceId);

      // THEN
      expect(result).toEqual([]);
    });

    it('워크스페이스에 커서가 있으면 배열로 반환한다', () => {
      // GIVEN
      service.setCursor({
        workspaceId: 'w1',
        userId: 'u1',
        x: 100,
        y: 100,
      });
      service.setCursor({
        workspaceId: 'w1',
        userId: 'u2',
        x: 200,
        y: 200,
      });

      // WHEN
      const result = service.getCursorsByWorkspace('w1');

      // THEN
      expect(result).toHaveLength(2);
      expect(result).toContainEqual({
        userId: 'u1',
        workspaceId: 'w1',
        x: 100,
        y: 100,
      });
      expect(result).toContainEqual({
        userId: 'u2',
        workspaceId: 'w1',
        x: 200,
        y: 200,
      });
    });

    it('다른 워크스페이스의 커서는 포함하지 않는다', () => {
      // GIVEN
      service.setCursor({
        workspaceId: 'w1',
        userId: 'u1',
        x: 100,
        y: 100,
      });
      service.setCursor({
        workspaceId: 'w2',
        userId: 'u2',
        x: 200,
        y: 200,
      });

      // WHEN
      const result = service.getCursorsByWorkspace('w1');

      // THEN
      expect(result).toHaveLength(1);
      expect(result).toContainEqual({
        userId: 'u1',
        workspaceId: 'w1',
        x: 100,
        y: 100,
      });
      expect(result).not.toContainEqual({
        userId: 'u2',
        workspaceId: 'w2',
        x: 200,
        y: 200,
      });
    });
  });

  describe('clearWorkspace', () => {
    beforeEach(() => {
      service.setCursor({
        workspaceId: 'w1',
        userId: 'u1',
        x: 100,
        y: 100,
      });
      service.setCursor({
        workspaceId: 'w1',
        userId: 'u2',
        x: 200,
        y: 200,
      });
      service.setCursor({
        workspaceId: 'w2',
        userId: 'u3',
        x: 300,
        y: 300,
      });
    });

    it('워크스페이스 id가 없으면 아무것도 삭제하지 않는다', () => {
      // GIVEN
      const workspaceId = 'w3';

      // WHEN
      service.clearWorkspace(workspaceId);

      // THEN
      expect(service.getCursorsByWorkspace('w1')).toHaveLength(2);
      expect(service.getCursorsByWorkspace('w2')).toHaveLength(1);
    });

    it('특정 워크스페이스의 모든 커서를 삭제한다', () => {
      // GIVEN
      const workspaceId = 'w1';

      // WHEN
      service.clearWorkspace(workspaceId);

      // THEN
      expect(service.getCursorsByWorkspace('w1')).toHaveLength(0);
      expect(service.hasCursor('w1', 'u1')).toBeFalsy();
      expect(service.hasCursor('w1', 'u2')).toBeFalsy();
      // 다른 워크스페이스는 영향받지 않음
      expect(service.getCursorsByWorkspace('w2')).toHaveLength(1);
      expect(service.hasCursor('w2', 'u3')).toBeTruthy();
    });
  });
});
