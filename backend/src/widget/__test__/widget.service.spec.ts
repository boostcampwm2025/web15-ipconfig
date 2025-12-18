import { Test, TestingModule } from '@nestjs/testing';
import { WidgetMemoryService } from '../widget.memory.service';
import { CreateWidgetDto, WidgetData } from '../dto/create-widget.dto';
import { WidgetType, TechStackContentDto } from '../dto/widget-content.dto';
import { NotFoundException } from '@nestjs/common';

describe('WidgetMemoryService', () => {
  let service: WidgetMemoryService;

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
    it('새로운 기술 스택 위젯을 생성하고 저장해야 한다', async () => {
      // given: 생성할 기술 스택 위젯 데이터가 주어졌을 때
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
      const result = await service.create(createDto);

      // then: 생성된 위젯이 반환되고, 조회 시 동일한 데이터가 존재해야 한다
      expect(result).toEqual(createDto);
      expect(await service.findOne('test-1')).toEqual(createDto);
    });
  });

  describe('findAll (전체 조회)', () => {
    it('저장된 모든 위젯 목록을 반환해야 한다', async () => {
      // given: 위젯 하나가 미리 저장되어 있을 때
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
      await service.create(createDto);

      // when: 전체 위젯 목록을 조회하면
      const result = await service.findAll();

      // then: 길이가 1인 배열에 저장된 위젯이 포함되어야 한다
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual(createDto);
    });
  });

  describe('update (위젯 수정)', () => {
    it('기존 위젯의 일부 속성(위치)만 수정해도 나머지 속성은 유지되어야 한다 (부분 업데이트)', async () => {
      // given: 초기 위젯이 저장되어 있을 때
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
      await service.create(initialDto);

      // when: 위젯의 x 좌표만 300으로 수정하면
      const updateResult = await service.update({
        widgetId: 'test-1',
        data: { x: 300 }, // content나 y좌표는 보내지 않음
      });

      // then: x 좌표는 300으로 변경되고, y 좌표와 content는 기존 값이 유지되어야 한다
      expect(updateResult.data.x).toBe(300);
      expect(updateResult.data.y).toBe(100);

      const content = updateResult.data.content as TechStackContentDto;
      expect(content.selectedItems).toEqual(['React']);
    });

    it('존재하지 않는 위젯을 수정하려 하면 NotFoundException을 던져야 한다', async () => {
      // given: 존재하지 않는 위젯 ID가 주어졌을 때
      // when: 수정을 시도하면
      // then: NotFoundException 에러가 발생해야 한다
      await expect(
        service.update({ widgetId: 'invalid-id', data: {} }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove (위젯 삭제)', () => {
    it('위젯을 성공적으로 삭제하고 삭제된 ID를 반환해야 한다', async () => {
      // given: 위젯 하나가 저장되어 있을 때
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
      await service.create(createDto);

      // when: 해당 위젯을 삭제하면
      const result = await service.remove('test-1');

      // then: 삭제된 위젯 ID가 반환되고, 다시 조회 시 NotFoundException이 발생해야 한다
      expect(result).toEqual({ widgetId: 'test-1' });
      await expect(service.findOne('test-1')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('존재하지 않는 위젯을 삭제하려 하면 NotFoundException을 던져야 한다', async () => {
      // given: 존재하지 않는 위젯 ID가 주어졌을 때
      // when: 삭제를 시도하면
      // then: NotFoundException 에러가 발생해야 한다
      await expect(service.remove('invalid-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
