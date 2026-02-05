import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { WorkspaceService } from './workspace.service';
import { JoinWorkspaceResponse } from './dto/join-workspace-response.dto';
import { ApiBody, ApiResponse } from '@nestjs/swagger';
import { WorkspaceIdPipe } from './workspace.pipe';
import { CreateWorkspaceRequest } from './dto/create-workspace-request.dto';
import { CreateWorkspaceResponse } from './dto/create-workspace-response.dto';
import { JoinWorkspaceRequest } from './dto/join-workspace-request.dto';
import { CheckWorkspaceResponse } from './dto/check-workspace-response.dto';

@Controller('workspace')
export class WorkspaceController {
  constructor(private readonly workspaceService: WorkspaceService) {}

  @Post('join')
  @ApiResponse({
    status: 200,
    description: '워크스페이스 입장',
    type: JoinWorkspaceResponse,
  })
  @ApiBody({ type: JoinWorkspaceRequest, required: true })
  joinWorkspaceById(
    @Body() body: JoinWorkspaceRequest,
  ): Promise<JoinWorkspaceResponse> {
    return this.workspaceService.joinWorkSpace(body.workspaceId);
  }

  @Post()
  @ApiResponse({
    status: 200,
    description: '워크스페이스 생성',
    type: CreateWorkspaceResponse,
  })
  @ApiBody({ type: CreateWorkspaceRequest, required: false })
  createWorkspaceWithRandomIdMake(
    @Body() body: CreateWorkspaceRequest,
  ): Promise<CreateWorkspaceResponse> {
    return this.workspaceService.createWorkspace(body?.workspaceId);
  }

  @Get('/check/:workspaceId')
  @ApiResponse({
    status: 200,
    description: '워크스페이스 존재 여부 조회',
    type: CheckWorkspaceResponse,
  })
  async getWorkspaceById(
    @Param('workspaceId', WorkspaceIdPipe) workspaceId: string,
  ): Promise<CheckWorkspaceResponse> {
    const exists = await this.workspaceService.isExistsWorkspace(workspaceId);
    return { exists };
  }
}
