import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, NotFoundException } from '@nestjs/common';

import { WorkspaceController } from '../workspace.controller';
import { WorkspaceService } from '../workspace.service';

jest.mock('nanoid', () => ({
  customAlphabet: jest
    .fn()
    .mockImplementation(() => jest.fn().mockReturnValue('generatedid')),
}));

describe('WorkspaceController', () => {
  let controller: WorkspaceController;
  let workspaceService: jest.Mocked<WorkspaceService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WorkspaceController],
      providers: [
        {
          provide: WorkspaceService,
          useValue: {
            isExistsWorkspace: jest.fn(),
            createWorkspace: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<WorkspaceController>(WorkspaceController);
    workspaceService = module.get<WorkspaceService>(
      WorkspaceService,
    ) as jest.Mocked<WorkspaceService>;
  });

  it('컨트롤러 인스턴스 생성', () => {
    expect(controller).toBeDefined();
  });

  describe('joinWorkspaceByPath', () => {
    it('존재하는 워크스페이스면 워크스페이스 ID를 반환한다', () => {
      workspaceService.isExistsWorkspace.mockReturnValue(true);

      const result = controller.joinWorkspaceByPath('abc123');

      expect(
        workspaceService.isExistsWorkspace.bind(workspaceService),
      ).toHaveBeenCalledWith('abc123');
      expect(result).toEqual({ workspaceId: 'abc123' });
    });

    it('존재하지 않는 워크스페이스면 NotFoundException을 던진다', () => {
      workspaceService.isExistsWorkspace.mockReturnValue(false);

      expect(() => controller.joinWorkspaceByPath('unknown')).toThrow(
        NotFoundException,
      );
    });
  });

  describe('createWorkspaceWithRandomIdMake', () => {
    it('중복되지 않는 랜덤 ID로 워크스페이스를 생성한다', () => {
      workspaceService.isExistsWorkspace.mockReturnValue(false);

      const result = controller.createWorkspaceWithRandomIdMake();

      expect(
        workspaceService.createWorkspace.bind(workspaceService),
      ).toHaveBeenCalledWith('generatedid');
      expect(result).toEqual({ workspaceId: 'generatedid' });
    });
  });

  describe('createWorkspaceWithId', () => {
    it('이미 존재하는 워크스페이스 ID면 ConflictException을 던진다', () => {
      workspaceService.isExistsWorkspace.mockReturnValue(true);

      expect(() => controller.createWorkspaceWithId('dup-id')).toThrow(
        ConflictException,
      );
    });

    it('존재하지 않는 워크스페이스 ID면 워크스페이스를 생성하고 ID를 반환한다', () => {
      workspaceService.isExistsWorkspace.mockReturnValue(false);

      const result = controller.createWorkspaceWithId('new-id');

      expect(
        workspaceService.createWorkspace.bind(workspaceService),
      ).toHaveBeenCalledWith('new-id');
      expect(result).toEqual({ workspaceId: 'new-id' });
    });
  });
});
