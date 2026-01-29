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
import { WorkspaceIdPipe } from './workspcae.pipe';

@Controller('workspace')
export class WorkspaceController {
  constructor(private readonly workspaceService: WorkspaceService) {}

  @Get('join/:workspaceId')
  joinWorkspaceById(
    @Param('workspaceId', WorkspaceIdPipe) workspaceId: string,
  ) {
    if (!this.workspaceService.isExistsWorkspace(workspaceId)) {
      throw new NotFoundException(`'${workspaceId}' 는 존재하지 않습니다.`);
    }
    return { workspaceId };
  }

  @Post('make')
  createWorkspaceWithRandomIdMake() {
    let workspaceId = customAlphabet(
      '0123456789abcdefghijklmnopqrstuvwxyz',
      10,
    )();
    while (this.workspaceService.isExistsWorkspace(workspaceId)) {
      workspaceId = customAlphabet(
        '0123456789abcdefghijklmnopqrstuvwxyz',
        10,
      )();
    }

    this.workspaceService.createWorkspace(workspaceId);

    return { workspaceId };
  }

  @Post('make/:workspaceId')
  createWorkspaceWithId(
    @Param('workspaceId', WorkspaceIdPipe) workspaceId: string,
  ) {
    if (this.workspaceService.isExistsWorkspace(workspaceId)) {
      throw new ConflictException(
        `이미 '${workspaceId}' 워크스페이스가 존재합니다.`,
      );
    }

    this.workspaceService.createWorkspace(workspaceId);

    return { workspaceId };
  }
}
