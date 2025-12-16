import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class MoveData {
  @ApiProperty({
    description: 'X 좌표',
    example: 100,
    required: true,
  })
  @IsNumber()
  x: number;
  @ApiProperty({
    description: 'Y 좌표',
    example: 200,
    required: true,
  })
  @IsNumber()
  y: number;
}

export class CursorMoveDTO {
  @ApiProperty({
    description: '유저 ID',
    example: 'u1',
    required: true,
  })
  @IsString()
  userId: string;
  moveData: MoveData;
}
