import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsEnum,
  IsNumber,
  IsObject,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { WidgetType } from '../widget-type.enum';
import { BaseContentDto } from './base-content.dto';

export class CommunicationDto {
  @ApiProperty({ description: '긴급', example: 'slack' })
  @IsString()
  readonly urgent: string;

  @ApiProperty({ description: '동기', example: 'zoom' })
  @IsString()
  readonly sync: string;

  @ApiProperty({ description: '비동기', example: 'slack' })
  @IsString()
  readonly async: string;

  @ApiProperty({ description: '공식', example: 'email' })
  @IsString()
  readonly official: string;
}

export class SLADto {
  @ApiProperty({ description: '응답 시간(시간)', example: 24 })
  @IsNumber()
  readonly responseTime: number;
}

export class TimeManagementDto {
  @ApiProperty({ description: '코어 타임 시작', example: '09:00' })
  @IsString()
  readonly coreTimeStart: string;

  @ApiProperty({ description: '코어 타임 종료', example: '18:00' })
  @IsString()
  readonly coreTimeEnd: string;
}

export type NoMeetingDay =
  | 'None'
  | 'Mon'
  | 'Tue'
  | 'Wed'
  | 'Thu'
  | 'Fri'
  | 'Sat'
  | 'Sun';
export type FeedbackStyle = 'Soft' | 'Honest' | 'Retrospective';

export class MeetingDto {
  @ApiProperty({
    description: '미팅 없는 날',
    example: 'Fri',
    enum: ['None', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  })
  @IsEnum(['None', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'])
  readonly noMeetingDay: NoMeetingDay;

  @ApiProperty({
    description: '피드백 스타일',
    example: 'Soft',
    enum: ['Soft', 'Honest', 'Retrospective'],
  })
  @IsEnum(['Soft', 'Honest', 'Retrospective'])
  readonly feedbackStyle: FeedbackStyle;
}

export class CommunicationContentDto implements BaseContentDto {
  @ApiProperty({ example: WidgetType.COMMUNICATION })
  @IsEnum(WidgetType)
  readonly widgetType = WidgetType.COMMUNICATION;

  @ApiProperty({ description: '커뮤니케이션 채널' })
  @IsObject()
  @ValidateNested()
  @Type(() => CommunicationDto)
  readonly communication: CommunicationDto;

  @ApiProperty({ description: 'SLA' })
  @IsObject()
  @ValidateNested()
  @Type(() => SLADto)
  readonly sla: SLADto;

  @ApiProperty({ description: '시간 관리' })
  @IsObject()
  @ValidateNested()
  @Type(() => TimeManagementDto)
  readonly timeManagement: TimeManagementDto;

  @ApiProperty({ description: '미팅 설정' })
  @IsObject()
  @ValidateNested()
  @Type(() => MeetingDto)
  readonly meeting: MeetingDto;
}

// Update용 Partial DTO Export
export class PartialCommunicationContentDto extends PartialType(
  CommunicationContentDto,
) {}
