import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { WorkspaceController } from '../workspace.controller';
import { WorkspaceService } from '../workspace.service';

describe('WorkspaceController', () => {
  let controller: WorkspaceController;
  let workspaceService: {
    isExistsWorkspace: jest.Mock;
    createWorkspace: jest.Mock;
    joinWorkSpace: jest.Mock;
  };

  beforeEach(async () => {
    workspaceService = {
      isExistsWorkspace: jest.fn(),
      createWorkspace: jest.fn(),
      joinWorkSpace: jest.fn(),
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

  describe('joinWorkspaceById', () => {
    it('워크스페이스가 존재하면 workspaceId와 nickname을 반환한다', async () => {
      const workspaceId = 'abc123def4';
      const mockResponse = { workspaceId, nickname: '행복한 고양이' };
      workspaceService.joinWorkSpace.mockResolvedValue(mockResponse);

      const result = await controller.joinWorkspaceById({ workspaceId });

      expect(workspaceService.joinWorkSpace).toHaveBeenCalledWith(workspaceId);
      expect(result).toEqual(mockResponse);
    });

    it('워크스페이스가 존재하지 않으면 NotFoundException을 던진다', async () => {
      const workspaceId = 'notexist1';
      workspaceService.joinWorkSpace.mockRejectedValue(
        new NotFoundException(`'${workspaceId}' 는 존재하지 않습니다.`),
      );

      await expect(
        controller.joinWorkspaceById({ workspaceId }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('createWorkspaceWithRandomIdMake', () => {
    it('workspaceId 없이 호출하면 랜덤 ID로 생성하고 반환한다', async () => {
      const mockResponse = { workspaceId: 'random1234' };
      workspaceService.createWorkspace.mockResolvedValue(mockResponse);

      const result = await controller.createWorkspaceWithRandomIdMake({});

      expect(workspaceService.createWorkspace).toHaveBeenCalledWith(undefined);
      expect(result).toEqual(mockResponse);
    });

    it('workspaceId를 지정하면 해당 ID로 생성하고 반환한다', async () => {
      const workspaceId = 'myworkspace';
      const mockResponse = { workspaceId };
      workspaceService.createWorkspace.mockResolvedValue(mockResponse);

      const result = await controller.createWorkspaceWithRandomIdMake({
        workspaceId,
      });

      expect(workspaceService.createWorkspace).toHaveBeenCalledWith(
        workspaceId,
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('getWorkspaceById', () => {
    it('워크스페이스가 존재하면 { exists: true }를 반환한다', async () => {
      const workspaceId = 'abc123def4';
      workspaceService.isExistsWorkspace.mockResolvedValue(true);

      const result = await controller.getWorkspaceById(workspaceId);

      expect(workspaceService.isExistsWorkspace).toHaveBeenCalledWith(
        workspaceId,
      );
      expect(result).toEqual({ exists: true });
    });

    it('워크스페이스가 존재하지 않으면 { exists: false }를 반환한다', async () => {
      const workspaceId = 'notexist1';
      workspaceService.isExistsWorkspace.mockResolvedValue(false);

      const result = await controller.getWorkspaceById(workspaceId);

      expect(workspaceService.isExistsWorkspace).toHaveBeenCalledWith(
        workspaceId,
      );
      expect(result).toEqual({ exists: false });
    });
  });
});
