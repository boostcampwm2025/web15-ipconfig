import { Test, TestingModule } from '@nestjs/testing';
import { MarkdownService } from '../markdown.service';

describe('MarkdownService', () => {
  let service: MarkdownService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MarkdownService],
    }).compile();

    service = module.get<MarkdownService>(MarkdownService);
  });

  it('마크다운 서비스 생성', () => {
    expect(service).toBeDefined();
  });
});
