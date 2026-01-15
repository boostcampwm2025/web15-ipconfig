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

/* 
  워크 스페이스 처음 접속 시 정보를 전달해줘야 함
  1. 위젯 데이터
  2. 유저 관련 정보
  */
export class JoindedUserDTO {
  // AllUsers 안에 포함되어 있긴 할텐데, 명확하게 나타내기 위해 따로 보내기
  @ApiProperty({
    description: '유저 정보',
    type: User,
    required: true,
  })
  @IsObject()
  user: User;

  // TODO: 위젯 정보, 유저 정보 넣기
}
