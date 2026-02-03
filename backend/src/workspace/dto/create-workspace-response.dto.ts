import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateWorkspaceResponse {
  @ApiProperty({
    description: '워크스페이스 ID',
    example: 'jowkys7uvi',
    required: true,
  })
  @IsString()
  workspaceId: string;
}
