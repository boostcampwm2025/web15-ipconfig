import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

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

export class JoinUserDTO extends User {
  @ApiProperty({
    description: '프로젝트 ID',
    example: 'p1',
    required: true,
  })
  @IsString()
  projectId: string;
}

export class JoindedUserDTO extends User {}
