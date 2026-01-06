import { Test, TestingModule } from '@nestjs/testing';

import { MarkdownService } from '../markdown.service';
import { IWidgetService, WIDGET_SERVICE } from '../../widget/widget.interface';
import { WidgetType } from '../../widget/dto/widget-content.dto';

type MockWidgetService = {
  [P in keyof IWidgetService]: jest.Mock;
};

describe('MarkdownService', () => {
  let service: MarkdownService;
  let widgetServiceMock: MockWidgetService;
  const workspaceId = 'w1';

  beforeEach(async () => {
    widgetServiceMock = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      findOneByWidgetType: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MarkdownService,
        {
          provide: WIDGET_SERVICE,
          useValue: widgetServiceMock,
        },
      ],
    }).compile();

    service = module.get<MarkdownService>(MarkdownService);
    jest.useFakeTimers().setSystemTime(new Date('2024-01-01T12:00:00Z'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('모든 위젯이 없으면 기본 헤더와 Else 섹션만 반환한다', async () => {
    widgetServiceMock.findOneByWidgetType.mockResolvedValue(null);

    const markdown = await service.generateMarkdown(workspaceId);

    expect(markdown).toContain('# 🚀 Project Team Align Report');
    expect(markdown).toContain('## 3. Else');
  });

  it('각 위젯을 마크다운 섹션으로 변환한다', async () => {
    widgetServiceMock.findOneByWidgetType
      .mockImplementationOnce(() => ({
        data: {
          content: {
            widgetType: WidgetType.GROUND_RULE,
            rules: ['Folder', 'Commit'],
          },
        },
      }))
      .mockImplementationOnce(() => ({
        data: {
          content: {
            widgetType: WidgetType.TECH_STACK,
            selectedItems: ['React', 'NestJS'],
          },
        },
      }))
      .mockImplementationOnce(() => ({
        data: {
          content: {
            widgetType: WidgetType.POST_IT,
            text: '기타 메모',
          },
        },
      }));

    const markdown = await service.generateMarkdown(workspaceId);
    const lines = markdown.split('\n');

    // Ground Rule 섹션
    expect(lines).toContain('## 1. 📋 Ground Rule');
    expect(lines).toContain('| Folder | - |');
    expect(lines).toContain('| Commit | - |');

    // Tech Stack 섹션
    expect(lines).toContain('## 2. 🛠 Tech Stack Selection');
    expect(lines).toContain('| React | vLatest |');
    expect(lines).toContain('| NestJS | vLatest |');

    // Else 섹션 (Post-it)
    expect(lines).toContain('## 3. Else');
    expect(lines).toContain('기타 메모');
  });
});
