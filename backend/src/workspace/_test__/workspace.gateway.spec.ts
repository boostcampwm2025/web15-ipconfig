import { Test, TestingModule } from '@nestjs/testing';
import { WorkspaceGateway } from '../workspace.gateway';

describe('WorkspaceGateway', () => {
  let gateway: WorkspaceGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WorkspaceGateway],
    }).compile();

    gateway = module.get<WorkspaceGateway>(WorkspaceGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
