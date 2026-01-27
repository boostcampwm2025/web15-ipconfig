import { Test, TestingModule } from '@nestjs/testing';
import { MarkdownController } from '../markdown.controller';
import { MarkdownService } from '../markdown.service';

describe('MarkdownController', () => {
  let controller: MarkdownController;
  const markdownServiceMock = {
    generateMarkdown: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MarkdownController],
      providers: [
        {
          provide: MarkdownService,
          useValue: markdownServiceMock,
        },
      ],
    }).compile();

    controller = module.get<MarkdownController>(MarkdownController);
  });

  it('컨트롤러가 정의되어 있어야 한다', () => {
    expect(controller).toBeDefined();
  });

  it('generateMarkdown 결과를 반환한다', () => {
    markdownServiceMock.generateMarkdown.mockReturnValue('# md');

    const result = controller.find('w1');

    expect(markdownServiceMock.generateMarkdown).toHaveBeenCalledWith('w1');
    expect(result).toEqual({ markdown: '# md' });
  });
});
