import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class JoinWorkspaceResponse {
  @ApiProperty({
    description: '워크스페이스의 ID',
    example: '271acg455v',
    required: true,
  })
  @IsString()
  workspaceId: string;

  @ApiProperty({
    description: '워크스페이스 입장 시 사용자의 랜덤 닉네임',
    example: '행복한 고양이',
    required: true,
  })
  @IsString()
  nickname: string;
}
