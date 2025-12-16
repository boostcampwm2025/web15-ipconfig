import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class LeaveUserDTO {
  @ApiProperty({
    description: '프로젝트 ID',
    example: 'p1',
    required: true,
  })
  @IsString()
  projectId: string;
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
