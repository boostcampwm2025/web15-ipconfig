import { Test, TestingModule } from '@nestjs/testing';
import { MarkdownController } from '../markdown.controller';
import { MarkdownService } from '../markdown.service';
import { CreateMarkdownDto } from '../dto/create-markdown.dto';

describe('MarkdownController', () => {
  let controller: MarkdownController;
  let markdownServiceMock: Partial<MarkdownService>;

  beforeEach(async () => {
    markdownServiceMock = {
      createMarkdown: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [MarkdownController],
      providers: [
        MarkdownService,
        { provide: MarkdownService, useValue: markdownServiceMock },
      ],
    }).compile();

    controller = module.get<MarkdownController>(MarkdownController);
  });

  it('마크다운 컨트롤러 생성', () => {
    expect(controller).toBeDefined();
  });

  describe('createMarkdown', () => {
    it('마크다운 생성시 createMarkdown 메서드가 호출된다', () => {
      // GIVEN
      const createMarkdownDto: CreateMarkdownDto = {
        teamStyles: [],
        techStacks: [],
        groundRules: [],
        workspaceName: 'test',
      };

      // WHEN
      controller.createMarkdown(createMarkdownDto);

      // THEN
      expect(markdownServiceMock.createMarkdown).toHaveBeenCalledWith(
        createMarkdownDto,
      );
    });
  });
});
