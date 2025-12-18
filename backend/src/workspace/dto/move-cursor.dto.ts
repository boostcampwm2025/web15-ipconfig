import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsObject, IsString } from 'class-validator';
import { Type } from 'class-transformer';

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

export class MoveCursorDTO {
  @ApiProperty({
    description: '유저 ID',
    example: 'u1',
    required: true,
  })
  @IsString()
  userId: string;

  @ApiProperty({
    description: '커서 이동 데이터',
    example: { x: 100, y: 200 },
    required: true,
  })
  @IsObject()
  @Type(() => MoveData)
  moveData: MoveData;
}
