import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class CheckWorkspaceResponse {
  @ApiProperty({
    description: '워크스페이스 존재 여부',
    example: true,
    required: true,
  })
  @IsBoolean()
  exists: boolean;
}
