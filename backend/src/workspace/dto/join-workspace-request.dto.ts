import { ApiProperty } from '@nestjs/swagger';
import { IsString, Matches } from 'class-validator';

export class JoinWorkspaceRequest {
  @ApiProperty({
    description: '워크스페이스 ID',
    example: 'jowkys7uvi',
  })
  @IsString()
  @Matches(/^[a-z0-9]{1,32}$/, {
    message: '워크스페이스 ID는 영소문자와 숫자만 1~32자 사용 가능합니다',
  })
  workspaceId: string;
}
