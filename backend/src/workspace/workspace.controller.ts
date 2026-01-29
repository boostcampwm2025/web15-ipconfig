import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { WorkspaceService } from './workspace.service';
import { JoinWorkspaceResponse } from './dto/join-workspace-response.dto';
import { ApiBody, ApiResponse } from '@nestjs/swagger';
import { WorkspaceIdPipe } from './workspcae.pipe';
import { CreateWorkspaceRequest } from './dto/create-workspace-request.dto';
import { CreateWorkspaceResponse } from './dto/create-workspace-response.dto';

@Controller('workspace')
export class WorkspaceController {
  constructor(private readonly workspaceService: WorkspaceService) {}

  @Get('join/:workspaceId')
  @ApiResponse({
    status: 200,
    description: '워크스페이스 입장',
    type: JoinWorkspaceResponse,
  })
  joinWorkspaceById(
    @Param('workspaceId', WorkspaceIdPipe) workspaceId: string,
  ): JoinWorkspaceResponse {
    return this.workspaceService.joinWorkSpace(workspaceId);
  }

  @Post('make')
  @ApiResponse({
    status: 200,
    description: '워크스페이스 생성',
    type: CreateWorkspaceResponse,
  })
  @ApiBody({ type: CreateWorkspaceRequest, required: false })
  createWorkspaceWithRandomIdMake(
    @Body() body: CreateWorkspaceRequest,
  ): CreateWorkspaceResponse {
    return this.workspaceService.createWorkspace(body?.workspaceId);
  }
}
