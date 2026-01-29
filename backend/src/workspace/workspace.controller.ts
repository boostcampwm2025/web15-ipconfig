import { Controller, Get, Param, Post } from '@nestjs/common';
import { WorkspaceService } from './workspace.service';
import { WorkSpaceResponse } from './dto/workspace-response.dto';
import { ApiResponse } from '@nestjs/swagger';
import { WorkspaceIdPipe } from './workspcae.pipe';

@Controller('workspace')
export class WorkspaceController {
  constructor(private readonly workspaceService: WorkspaceService) {}

  @Get('join/:workspaceId')
  @ApiResponse({
    status: 200,
    description: '워크스페이스 입장',
    type: WorkSpaceResponse,
  })
  joinWorkspaceById(
    @Param('workspaceId', WorkspaceIdPipe) workspaceId: string,
  ): WorkSpaceResponse {
    return this.workspaceService.joinWorkSpace(workspaceId);
  }

  @Post('make')
  @ApiResponse({
    status: 200,
    description: '워크스페이스 생성',
    type: WorkSpaceResponse,
  })
  createWorkspaceWithRandomIdMake(): WorkSpaceResponse {
    return this.workspaceService.makeWorkspace();
  }

  @Post('make/:workspaceId')
  @ApiResponse({
    status: 200,
    description: '지정된 ID로 워크스페이스 생성',
    type: WorkSpaceResponse,
  })
  createWorkspaceWithId(
    @Param('workspaceId', WorkspaceIdPipe) workspaceId: string,
  ) {
    return this.workspaceService.makeWorkspace(workspaceId);
  }
}
