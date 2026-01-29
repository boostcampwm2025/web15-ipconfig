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
  async joinWorkspaceById(
    @Param('workspaceId', WorkspaceIdPipe) workspaceId: string,
  ) {
    if (!(await this.workspaceService.isExistsWorkspace(workspaceId))) {
      throw new NotFoundException(`'${workspaceId}' 는 존재하지 않습니다.`);
    }
    return { workspaceId };
  }

  @Post('make')
  async createWorkspaceWithRandomIdMake() {
    let workspaceId = customAlphabet(
      '0123456789abcdefghijklmnopqrstuvwxyz',
      10,
    )();
    while (await this.workspaceService.isExistsWorkspace(workspaceId)) {
      workspaceId = customAlphabet(
        '0123456789abcdefghijklmnopqrstuvwxyz',
        10,
      )();
    }

    this.workspaceService.createWorkspace(workspaceId);

    return { workspaceId };
  }

  @Post('make/:workspaceId')
  async createWorkspaceWithId(
    @Param('workspaceId', WorkspaceIdPipe) workspaceId: string,
  ) {
    if (await this.workspaceService.isExistsWorkspace(workspaceId)) {
      throw new ConflictException(
        `이미 '${workspaceId}' 워크스페이스가 존재합니다.`,
      );
    }

    this.workspaceService.createWorkspace(workspaceId);

    return { workspaceId };
  }
}
