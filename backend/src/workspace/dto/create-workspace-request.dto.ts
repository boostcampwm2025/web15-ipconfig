import { PartialType } from '@nestjs/swagger';
import { JoinWorkspaceRequest } from './join-workspace-request.dto';

export class CreateWorkspaceRequest extends PartialType(JoinWorkspaceRequest) {}
