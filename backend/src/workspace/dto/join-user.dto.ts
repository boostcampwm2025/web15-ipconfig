import { ApiProperty } from '@nestjs/swagger';
import { IsObject, IsString } from 'class-validator';

export class User {
  @ApiProperty({
    description: '유저의 ID',
    example: 'u1',
    required: true,
  })
  @IsString()
  id: string;

  @ApiProperty({
    description: '유저의 닉네임',
    example: 'SnailW',
    required: true,
  })
  @IsString()
  nickname: string;

  @ApiProperty({
    description: '유저의 커서 색깔',
    example: '#FF5733',
    required: true,
  })
  @IsString()
  color: string;
}

export class JoinUserDTO {
  @ApiProperty({
    description: '워크스페이스 ID',
    example: 'w1',
    required: true,
  })
  @IsString()
  workspaceId: string;

  @ApiProperty({
    description: '유저 정보',
    type: User,
    required: true,
  })
  @IsObject()
  user: User;
}

export class JoindedUserDTO extends User {}
