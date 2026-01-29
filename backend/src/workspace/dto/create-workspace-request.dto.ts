import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreateWorkspaceRequest {
  @ApiProperty({
    description: '워크스페이스 ID (선택 사항)',
    example: 'jowkys7uvi',
  })
  @IsString()
  @IsOptional()
  workspaceId?: string;
}
