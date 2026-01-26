import {
  Controller,
  Get,
  Param,
  Post,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { WorkspaceService } from './workspace.service';
import { customAlphabet } from 'nanoid';

@Controller('workspace')
export class WorkspaceController {
  constructor(private readonly workspaceService: WorkspaceService) {}

  @Get(':workspaceId')
  getWorkspaceIsExists(@Param('workspaceId') workspaceId: string) {
    return this.workspaceService.isExistsWorkspace(workspaceId);
  }

  @Get(':workspaceId/join')
  joinWorkspace(@Param('workspaceId') workspaceId: string) {
    if (!this.workspaceService.isExistsWorkspace(workspaceId)) {
      throw new NotFoundException(
        `Workspace with ID '${workspaceId}' does not exist`,
      );
    }
    return { workspaceId };
  }

  @Post()
  createWorkspaceWithRandomId() {
    let workspaceId = customAlphabet(
      '0123456789abcdefghijklmnopqrstuvwxyz',
      6,
    )();
    while (this.workspaceService.isExistsWorkspace(workspaceId)) {
      workspaceId = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyz', 6)();
    }

    this.workspaceService.createWorkspace(workspaceId);

    return { workspaceId };
  }

  @Post(':workspaceId')
  createWorkspaceWithId(@Param('workspaceId') workspaceId: string) {
    if (this.workspaceService.isExistsWorkspace(workspaceId)) {
      throw new ConflictException(
        `Workspace with ID '${workspaceId}' already exists`,
      );
    }

    this.workspaceService.createWorkspace(workspaceId);

    return { workspaceId };
  }
}
