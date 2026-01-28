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
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('workspace')
@Controller('workspace')
export class WorkspaceController {
  constructor(private readonly workspaceService: WorkspaceService) {}

  @Get('join/:workspaceId')
  @ApiResponse({
    status: 200,
    description: '워크스페이스 ID',
    type: String,
  })
  joinWorkspaceByPath(@Param('workspaceId') workspaceId: string) {
    if (!this.workspaceService.isExistsWorkspace(workspaceId)) {
      throw new NotFoundException(`'${workspaceId}' 는 존재하지 않습니다.`);
    }
    return { workspaceId };
  }

  @Post('make')
  @ApiResponse({
    status: 200,
    description: '워크스페이스 ID',
    type: String,
  })
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
  @ApiResponse({
    status: 200,
    description: '워크스페이스 ID',
    type: String,
  })
  createWorkspaceWithId(@Param('workspaceId') workspaceId: string) {
    if (this.workspaceService.isExistsWorkspace(workspaceId)) {
      throw new ConflictException(
        `이미 '${workspaceId}' 워크스페이스가 존재합니다.`,
      );
    }

    this.workspaceService.createWorkspace(workspaceId);

    return { workspaceId };
  }
}
