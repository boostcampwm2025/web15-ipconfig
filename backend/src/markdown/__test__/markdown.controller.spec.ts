import { Test, TestingModule } from '@nestjs/testing';
import { MarkdownController } from '../markdown.controller';
import { MarkdownService } from '../markdown.service';

describe('MarkdownController', () => {
  let controller: MarkdownController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MarkdownController],
      providers: [MarkdownService],
    }).compile();

    controller = module.get<MarkdownController>(MarkdownController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
