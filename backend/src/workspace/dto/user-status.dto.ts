import { IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum UserStatus {
  ONLINE = 'ONLINE',
  OFFLINE = 'OFFLINE',
}
export class UserStatusDTO {
  @ApiProperty({
    description: '유저 상태',
    example: 'ONLINE',
    required: true,
  })
  @IsEnum(UserStatus)
  status: UserStatus;
}
