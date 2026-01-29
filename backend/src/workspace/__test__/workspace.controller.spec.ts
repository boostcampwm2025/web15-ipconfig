import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { WorkspaceController } from '../workspace.controller';
import { WorkspaceService } from '../workspace.service';

describe('WorkspaceController', () => {
  let controller: WorkspaceController;
  let workspaceService: {
    isExistsWorkspace: jest.Mock;
    createWorkspace: jest.Mock;
  };

  beforeEach(async () => {
    workspaceService = {
      isExistsWorkspace: jest.fn(),
      createWorkspace: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [WorkspaceController],
      providers: [
        {
          provide: WorkspaceService,
          useValue: workspaceService,
        },
      ],
    }).compile();

    controller = module.get<WorkspaceController>(WorkspaceController);
  });

  describe('joinWorkspaceByPath', () => {
    it('워크스페이스가 존재하면 workspaceId를 반환한다', () => {
      const workspaceId = 'abc123def4';
      workspaceService.isExistsWorkspace.mockReturnValue(true);

      const result = controller.joinWorkspaceById(workspaceId);

      expect(workspaceService.isExistsWorkspace).toHaveBeenCalledWith(
        workspaceId,
      );
      expect(result).toEqual({ workspaceId });
    });

    it('워크스페이스가 존재하지 않으면 NotFoundException을 던진다', () => {
      const workspaceId = 'notexist1';
      workspaceService.isExistsWorkspace.mockReturnValue(false);

      expect(() => controller.joinWorkspaceById(workspaceId)).toThrow(
        NotFoundException,
      );
    });
  });

  describe('createWorkspaceWithRandomIdMake', () => {
    it('중복되지 않는 랜덤 workspaceId를 생성하고 반환한다', () => {
      let capturedId: string | undefined;
      workspaceService.isExistsWorkspace.mockReturnValue(false);
      workspaceService.createWorkspace.mockImplementation((id: string) => {
        capturedId = id;
      });

      const result = controller.createWorkspaceWithRandomIdMake();

      expect(workspaceService.isExistsWorkspace).toHaveBeenCalled();
      expect(workspaceService.createWorkspace).toHaveBeenCalledTimes(1);
      expect(capturedId).toBeDefined();
      expect(result).toEqual({ workspaceId: capturedId });
    });

    it('이미 존재하는 ID라면 새로운 ID를 생성해 사용한다', () => {
      const existingId = 'duplicate1';
      let createWorkspaceCalledWith: string | undefined;

      workspaceService.isExistsWorkspace
        .mockReturnValueOnce(true)
        .mockReturnValueOnce(false);

      workspaceService.createWorkspace.mockImplementation((id: string) => {
        createWorkspaceCalledWith = id;
      });

      const result = controller.createWorkspaceWithRandomIdMake();

      expect(workspaceService.isExistsWorkspace).toHaveBeenCalledTimes(2);
      expect(createWorkspaceCalledWith).toBeDefined();
      expect(result).toEqual({ workspaceId: createWorkspaceCalledWith });
      expect(createWorkspaceCalledWith).not.toBe(existingId);
    });
  });

  describe('createWorkspaceWithId', () => {
    it('존재하지 않는 워크스페이스라면 생성하고 workspaceId를 반환한다', () => {
      const workspaceId = 'newspace1';
      workspaceService.isExistsWorkspace.mockReturnValue(false);

      const result = controller.createWorkspaceWithId(workspaceId);

      expect(workspaceService.isExistsWorkspace).toHaveBeenCalledWith(
        workspaceId,
      );
      expect(workspaceService.createWorkspace).toHaveBeenCalledWith(
        workspaceId,
      );
      expect(result).toEqual({ workspaceId });
    });

    it('이미 존재하는 워크스페이스라면 ConflictException을 던진다', () => {
      const workspaceId = 'existspc1';
      workspaceService.isExistsWorkspace.mockReturnValue(true);

      expect(() => controller.createWorkspaceWithId(workspaceId)).toThrow(
        ConflictException,
      );
      expect(workspaceService.createWorkspace).not.toHaveBeenCalled();
    });
  });
});
