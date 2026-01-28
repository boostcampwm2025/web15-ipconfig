import { Test, TestingModule } from '@nestjs/testing';

import { WorkspaceService } from '../workspace.service';
import { User } from '../entity/user';

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
});
