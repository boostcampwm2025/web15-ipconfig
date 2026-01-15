import { Test, TestingModule } from '@nestjs/testing';
import { WidgetMemoryService } from '../widget.memory.service';
import { CreateWidgetDto } from '../dto/create-widget.dto';
import { WidgetType, TechStackContentDto } from '../dto/widget-content.dto';
import { NotFoundException } from '@nestjs/common';
import { UpdateWidgetLayoutDto } from '../dto/update-widget-layout.dto';

describe('WidgetMemoryService', () => {
  let service: WidgetMemoryService;
  const workspaceId = 'workspace-1';
  const widgetId = 'widget-1';
  const userId1 = 'user-1';
  const userId2 = 'user-2';

  let initialDto: CreateWidgetDto;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WidgetMemoryService],
    }).compile();

    service = module.get<WidgetMemoryService>(WidgetMemoryService);

    // given: 테스트에 사용할 초기 위젯 데이터 생성
    initialDto = {
      widgetId,
      type: WidgetType.TECH_STACK,
      data: {
        x: 100,
        y: 100,
        width: 200,
        height: 200,
        zIndex: 1,
        content: {
          widgetType: WidgetType.TECH_STACK,
          selectedItems: [{ id: 'react', name: 'React', category: 'Frontend' }],
        } as unknown as TechStackContentDto,
      },
    };
    // given: 모든 테스트 시작 전 위젯 생성
    await service.create(workspaceId, initialDto);
  });

  it('서비스가 정의되어 있어야 한다', () => {
    expect(service).toBeDefined();
  });

  describe('create (위젯 생성)', () => {
    it('새로운 기술 스택 위젯을 특정 워크스페이스에 생성하고 저장해야 한다', async () => {
      // given: 생성할 위젯의 초기 데이터
      const newWidget: CreateWidgetDto = {
        widgetId: 'new-widget',
        type: WidgetType.TECH_STACK,
        data: {
          x: 10,
          y: 10,
          width: 10,
          height: 10,
          zIndex: 1,
          content: {
            widgetType: WidgetType.TECH_STACK,
            selectedItems: [],
          } as unknown as TechStackContentDto,
        },
      };

      // when: 위젯 생성 메서드를 호출하면
      const result = await service.create(workspaceId, newWidget);

      // then: 생성된 위젯 객체가 반환되고, 실제 메모리 저장소에서도 조회가 가능해야 한다
      expect(result).toEqual(newWidget);
      expect(await service.findOne(workspaceId, 'new-widget')).toEqual(
        newWidget,
      );
    });
  });

  describe('findAll (전체 조회)', () => {
    it('해당 워크스페이스의 모든 위젯 목록을 반환해야 한다', async () => {
      // given: beforeEach에서 위젯 하나가 이미 저장됨
      // when: 전체 위젯 목록 조회를 요청하면
      const result = await service.findAll(workspaceId);

      // then: 저장된 위젯을 포함한 배열이 반환되어야 한다
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual(initialDto);
    });
  });

  describe('findOne (단일 조회)', () => {
    it('존재하는 위젯 ID로 조회하면 해당 위젯을 반환해야 한다', async () => {
      // given: beforeEach에서 위젯이 이미 저장됨
      // when: 해당 위젯 ID로 조회를 요청하면
      const result = await service.findOne(workspaceId, widgetId);

      // then: 저장된 위젯 정보와 일치하는 데이터가 반환되어야 한다
      expect(result).toEqual(initialDto);
    });

    it('존재하지 않는 위젯 ID로 조회하면 NotFoundException을 던져야 한다', async () => {
      // given: 존재하지 않는 위젯 ID
      // when: 조회를 요청하면
      // then: NotFoundException 예외가 발생해야 한다
      await expect(
        service.findOne(workspaceId, 'non-existent'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateLayout (위치 변경)', () => {
    it('위젯의 좌표를 수정하면 해당 값만 변경되어야 한다', async () => {
      // given: beforeEach에서 위젯이 이미 저장됨
      // when: 위젯의 x 좌표만 300으로 변경하는 레이아웃 업데이트를 요청하면
      const updateResult = await service.updateLayout(workspaceId, {
        widgetId: widgetId,
        x: 300,
      } as UpdateWidgetLayoutDto);

      // then: x 좌표는 300으로 업데이트되고, y 좌표나 내부 콘텐츠는 유지되어야 한다
      expect(updateResult.data.x).toBe(300);
      expect(updateResult.data.y).toBe(100);
      const content = updateResult.data.content as TechStackContentDto;
      expect(content.selectedItems).toEqual([
        { id: 'react', name: 'React', category: 'Frontend' },
      ]);
    });
  });

  describe('update (콘텐츠 수정)', () => {
    it('위젯의 콘텐츠 내용을 수정하면 해당 내용이 반영되어야 한다', async () => {
      // given: beforeEach에서 위젯이 이미 저장됨
      // when: 위젯의 내부 콘텐츠를 변경하는 업데이트를 요청하면
      const updateResult = await service.update(workspaceId, {
        widgetId: widgetId,
        data: {
          content: {
            widgetType: WidgetType.TECH_STACK,
            selectedItems: [
              { id: 'nestjs', name: 'NestJS', category: 'Backend' },
            ],
          },
        },
      });

      // then: 콘텐츠 내용은 변경되고, 위치는 유지되어야 한다
      const content = updateResult.data.content as TechStackContentDto;
      expect(content.selectedItems).toEqual([
        { id: 'nestjs', name: 'NestJS', category: 'Backend' },
      ]);
    });
  });

  describe('remove (위젯 삭제)', () => {
    it('존재하는 위젯을 삭제하면 삭제된 위젯 ID를 반환하고, 관련 lock도 해제해야 한다', async () => {
      // given: 위젯이 생성되어 있고, 특정 유저가 lock을 점유하고 있을 때
      await service.lock(workspaceId, widgetId, userId1);
      expect(await service.getLockOwner(workspaceId, widgetId)).toBe(userId1);

      // when: 해당 위젯에 대한 삭제를 요청하면
      const result = await service.remove(workspaceId, widgetId);

      // then: 삭제된 위젯 ID가 반환되고, 이후 조회 시 NotFoundException이 발생하며, lock도 해제되어야 한다
      expect(result).toEqual({ widgetId: widgetId });
      await expect(service.findOne(workspaceId, widgetId)).rejects.toThrow(
        NotFoundException,
      );
      expect(await service.getLockOwner(workspaceId, widgetId)).toBeNull();
    });

    it('존재하지 않는 위젯을 삭제하려 하면 NotFoundException을 던져야 한다', async () => {
      // given: 존재하지 않는 위젯 ID
      // when: 삭제를 요청하면
      // then: NotFoundException 예외가 발생해야 한다
      await expect(service.remove(workspaceId, 'non-existent')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('Widget Locking (위젯 잠금 관리)', () => {
    describe('lock', () => {
      it('아무도 점유하지 않은 위젯에 lock을 설정하면 true를 반환한다', async () => {
        // given: 점유되지 않은 위젯
        // when: user1이 lock을 요청하면
        const result = await service.lock(workspaceId, widgetId, userId1);
        // then: 성공(true)해야 하고, lock의 소유자는 user1이어야 한다
        expect(result).toBe(true);
        expect(await service.getLockOwner(workspaceId, widgetId)).toBe(userId1);
      });

      it('이미 다른 유저가 점유한 위젯에 lock을 설정하면 false를 반환한다', async () => {
        // given: user1이 이미 위젯을 점유하고 있을 때
        await service.lock(workspaceId, widgetId, userId1);
        // when: user2가 동일한 위젯에 lock을 요청하면
        const result = await service.lock(workspaceId, widgetId, userId2);
        // then: 실패(false)해야 하고, lock의 소유자는 여전히 user1이어야 한다
        expect(result).toBe(false);
        expect(await service.getLockOwner(workspaceId, widgetId)).toBe(userId1);
      });

      it('이미 자신이 점유한 위젯에 다시 lock을 설정하면 true를 반환한다', async () => {
        // given: user1이 이미 위젯을 점유하고 있을 때
        await service.lock(workspaceId, widgetId, userId1);
        // when: user1이 다시 동일한 위젯에 lock을 요청하면
        const result = await service.lock(workspaceId, widgetId, userId1);
        // then: 성공(true)해야 하고, lock의 소유자는 계속 user1이어야 한다
        expect(result).toBe(true);
        expect(await service.getLockOwner(workspaceId, widgetId)).toBe(userId1);
      });

      it('존재하지 않는 위젯에 lock을 설정하려 하면 NotFoundException을 던진다', async () => {
        // given: 존재하지 않는 위젯 ID
        // when: lock을 요청하면
        // then: NotFoundException 예외가 발생해야 한다
        await expect(
          service.lock(workspaceId, 'non-existent', userId1),
        ).rejects.toThrow(NotFoundException);
      });
    });

    describe('unlock', () => {
      it('lock 소유자가 unlock을 요청하면 true를 반환하고 lock을 해제한다', async () => {
        // given: user1이 위젯을 점유하고 있을 때
        await service.lock(workspaceId, widgetId, userId1);
        // when: user1이 unlock을 요청하면
        const result = await service.unlock(workspaceId, widgetId, userId1);
        // then: 성공(true)해야 하고, lock은 해제되어 소유자가 없어야 한다
        expect(result).toBe(true);
        expect(await service.getLockOwner(workspaceId, widgetId)).toBeNull();
      });

      it('lock 소유자가 아닌 유저가 unlock을 요청하면 false를 반환하고 lock은 유지된다', async () => {
        // given: user1이 위젯을 점유하고 있을 때
        await service.lock(workspaceId, widgetId, userId1);
        // when: user2가 unlock을 요청하면
        const result = await service.unlock(workspaceId, widgetId, userId2);
        // then: 실패(false)해야 하고, lock 소유자는 여전히 user1이어야 한다
        expect(result).toBe(false);
        expect(await service.getLockOwner(workspaceId, widgetId)).toBe(userId1);
      });

      it('점유되지 않은 위젯에 unlock을 요청하면 false를 반환한다', async () => {
        // given: 점유되지 않은 위젯
        // when: unlock을 요청하면
        const result = await service.unlock(workspaceId, widgetId, userId1);
        // then: 실패(false)해야 한다
        expect(result).toBe(false);
      });
    });

    describe('unlockAllByUser', () => {
      it('특정 유저가 점유한 모든 위젯의 lock을 해제하고, 해제된 위젯 ID 목록을 반환한다', async () => {
        // given: user1이 두 개의 위젯을, user2가 하나의 위젯을 점유하고 있을 때
        const widgetId2 = 'widget-2';
        const widgetId3 = 'widget-3';
        await service.create(workspaceId, {
          ...initialDto,
          widgetId: widgetId2,
        });
        await service.create(workspaceId, {
          ...initialDto,
          widgetId: widgetId3,
        });

        await service.lock(workspaceId, widgetId, userId1);
        await service.lock(workspaceId, widgetId2, userId1);
        await service.lock(workspaceId, widgetId3, userId2);

        // when: user1에 대해 모든 lock 해제를 요청하면
        const unlockedIds = await service.unlockAllByUser(workspaceId, userId1);

        // then: user1이 점유했던 위젯 ID 목록이 반환되고, 해당 위젯들의 lock은 해제되어야 한다
        expect(unlockedIds).toHaveLength(2);
        expect(unlockedIds).toContain(widgetId);
        expect(unlockedIds).toContain(widgetId2);

        expect(await service.getLockOwner(workspaceId, widgetId)).toBeNull();
        expect(await service.getLockOwner(workspaceId, widgetId2)).toBeNull();
        // and: user2의 lock은 그대로 유지되어야 한다
        expect(await service.getLockOwner(workspaceId, widgetId3)).toBe(
          userId2,
        );
      });
    });
  });
});
