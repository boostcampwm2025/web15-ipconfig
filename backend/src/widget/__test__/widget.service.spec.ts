import { Test, TestingModule } from '@nestjs/testing';
import { WidgetMemoryService } from '../widget.memory.service';
import { CreateWidgetDto, WidgetData } from '../dto/create-widget.dto';
import { WidgetType, TechStackContentDto } from '../dto/widget-content.dto';
import { NotFoundException } from '@nestjs/common';
import { UpdateWidgetLayoutDto } from '../dto/update-widget-layout.dto';

describe('WidgetMemoryService', () => {
  let service: WidgetMemoryService;
  const workspaceId = 'workspace-1';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WidgetMemoryService],
    }).compile();

    service = module.get<WidgetMemoryService>(WidgetMemoryService);
  });

  it('서비스가 정의되어 있어야 한다', () => {
    expect(service).toBeDefined();
  });

  describe('create (위젯 생성)', () => {
    it('새로운 기술 스택 위젯을 특정 워크스페이스에 생성하고 저장해야 한다', async () => {
      // given: 생성할 위젯의 초기 데이터(위치, 크기, 콘텐츠)가 주어졌을 때
      const widgetData: WidgetData = {
        x: 100,
        y: 200,
        width: 100,
        height: 100,
        zIndex: 1,
        content: {
          widgetType: WidgetType.TECH_STACK,
          selectedItems: ['React'],
        } as TechStackContentDto,
      };

      const createDto: CreateWidgetDto = {
        widgetId: 'test-1',
        type: WidgetType.TECH_STACK,
        data: widgetData,
      };

      // when: 위젯 생성 메서드를 호출하면
      const result = await service.create(workspaceId, createDto);

      // then: 생성된 위젯 객체가 반환되고, 실제 메모리 저장소에서도 조회가 가능해야 한다
      expect(result).toEqual(createDto);
      expect(await service.findOne(workspaceId, 'test-1')).toEqual(createDto);
    });
  });

  describe('findAll (전체 조회)', () => {
    it('해당 워크스페이스의 모든 위젯 목록을 반환해야 한다', async () => {
      // given: 워크스페이스에 하나의 위젯이 미리 저장되어 있을 때
      const createDto: CreateWidgetDto = {
        widgetId: 'test-1',
        type: WidgetType.TECH_STACK,
        data: {
          x: 0,
          y: 0,
          width: 0,
          height: 0,
          zIndex: 0,
          content: {
            widgetType: WidgetType.TECH_STACK,
            selectedItems: [],
          } as TechStackContentDto,
        },
      };
      await service.create(workspaceId, createDto);

      // when: 전체 위젯 목록 조회를 요청하면
      const result = await service.findAll(workspaceId);

      // then: 저장된 위젯을 포함한 배열이 반환되어야 한다
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual(createDto);
    });
  });

  describe('findOne (단일 조회)', () => {
    it('존재하는 위젯 ID로 조회하면 해당 위젯을 반환해야 한다', async () => {
      // given: 특정 위젯이 저장되어 있을 때
      const createDto: CreateWidgetDto = {
        widgetId: 'test-1',
        type: WidgetType.TECH_STACK,
        data: {
          x: 0,
          y: 0,
          width: 0,
          height: 0,
          zIndex: 0,
          content: {
            widgetType: WidgetType.TECH_STACK,
            selectedItems: [],
          } as TechStackContentDto,
        },
      };
      await service.create(workspaceId, createDto);

      // when: 해당 위젯 ID로 조회를 요청하면
      const result = await service.findOne(workspaceId, 'test-1');

      // then: 저장된 위젯 정보와 일치하는 데이터가 반환되어야 한다
      expect(result).toEqual(createDto);
    });

    it('존재하지 않는 위젯 ID로 조회하면 NotFoundException을 던져야 한다', async () => {
      // given: 존재하지 않는 위젯 ID가 주어졌을 때
      // when: 조회를 요청하면
      // then: NotFoundException 예외가 발생해야 한다
      await expect(
        service.findOne(workspaceId, 'non-existent'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateLayout (위치 변경)', () => {
    it('위젯의 좌표를 수정하면 해당 값만 변경되어야 한다', async () => {
      // given: 초기 상태의 위젯이 저장되어 있을 때
      const initialDto: CreateWidgetDto = {
        widgetId: 'test-1',
        type: WidgetType.TECH_STACK,
        data: {
          x: 100,
          y: 100,
          width: 200,
          height: 200,
          zIndex: 1,
          content: {
            widgetType: WidgetType.TECH_STACK,
            selectedItems: ['React'],
          } as TechStackContentDto,
        },
      };
      await service.create(workspaceId, initialDto);

      // when: 위젯의 x 좌표만 300으로 변경하는 레이아웃 업데이트를 요청하면
      const updateResult = await service.updateLayout(workspaceId, {
        widgetId: 'test-1',
        x: 300,
      } as UpdateWidgetLayoutDto);

      // then: x 좌표는 300으로 업데이트되고, y 좌표나 내부 콘텐츠(selectedItems)는 변경되지 않고 유지되어야 한다
      expect(updateResult.data.x).toBe(300);
      expect(updateResult.data.y).toBe(100);
      const content = updateResult.data.content as TechStackContentDto;
      expect(content.selectedItems).toEqual(['React']);
    });
  });

  describe('update (콘텐츠 수정)', () => {
    it('위젯의 콘텐츠 내용을 수정하면 해당 내용이 반영되어야 한다', async () => {
      // given: 초기 상태의 위젯이 저장되어 있을 때
      const initialDto: CreateWidgetDto = {
        widgetId: 'test-1',
        type: WidgetType.TECH_STACK,
        data: {
          x: 100,
          y: 100,
          width: 200,
          height: 200,
          zIndex: 1,
          content: {
            widgetType: WidgetType.TECH_STACK,
            selectedItems: ['React'],
          } as TechStackContentDto,
        },
      };
      await service.create(workspaceId, initialDto);

      // when: 위젯의 내부 콘텐츠(기술 스택 목록)를 변경하는 업데이트를 요청하면
      const updateResult = await service.update(workspaceId, {
        widgetId: 'test-1',
        data: {
          content: {
            widgetType: WidgetType.TECH_STACK,
            selectedItems: ['NestJS'],
          },
        },
      });

      // then: 콘텐츠 내용은 'NestJS'로 변경되어야 하고, 위젯의 위치(x 좌표)는 변경되지 않아야 한다
      const content = updateResult.data.content as TechStackContentDto;
      expect(content.selectedItems).toEqual(['NestJS']);
      expect(updateResult.data.x).toBe(100); // 위치는 유지
    });
  });

  describe('remove (위젯 삭제)', () => {
    it('존재하는 위젯을 삭제하면 삭제된 위젯 ID를 반환해야 한다', async () => {
      // given: 삭제할 위젯이 미리 생성되어 있을 때
      const createDto: CreateWidgetDto = {
        widgetId: 'test-1',
        type: WidgetType.TECH_STACK,
        data: {
          x: 0,
          y: 0,
          width: 0,
          height: 0,
          zIndex: 0,
          content: {
            widgetType: WidgetType.TECH_STACK,
            selectedItems: [],
          } as TechStackContentDto,
        },
      };
      await service.create(workspaceId, createDto);

      // when: 해당 위젯에 대한 삭제를 요청하면
      const result = await service.remove(workspaceId, 'test-1');

      // then: 삭제된 위젯 ID가 반환되고, 이후 조회 시 NotFoundException이 발생해야 한다
      expect(result).toEqual({ widgetId: 'test-1' });
      await expect(service.findOne(workspaceId, 'test-1')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('존재하지 않는 위젯을 삭제하려 하면 NotFoundException을 던져야 한다', async () => {
      // given: 존재하지 않는 위젯 ID가 주어졌을 때
      // when: 삭제를 요청하면
      // then: NotFoundException 예외가 발생해야 한다
      await expect(service.remove(workspaceId, 'non-existent')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
