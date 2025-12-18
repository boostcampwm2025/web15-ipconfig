import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class LeaveUserDTO {
  @ApiProperty({
    description: '워크스페이스 ID',
    example: 'w1',
    required: true,
  })
  @IsString()
  workspaceId: string;

  @ApiProperty({
    description: '유저 ID',
    example: 'u1',
    required: true,
  })
  @IsString()
  userId: string;
}

export class LeftUserDTO {
  @ApiProperty({
    description: '유저 ID',
    example: 'u1',
    required: true,
  })
  @IsString()
  userId: string;
}
