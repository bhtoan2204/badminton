import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsDateString,
  IsOptional,
  IsBoolean,
} from 'class-validator';

export class UpdateCalendarDto {
  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsNumber()
  id_calendar: number;

  @ApiProperty({ example: 96 })
  @IsNotEmpty()
  @IsNumber()
  id_family: number;

  @ApiProperty({ example: 'Vinh Ha Long trip' })
  @IsString()
  @IsOptional()
  title: string;

  @ApiProperty({
    example:
      "The family's off to Ha Long Bay, bonding over its stunning vistas and creating lasting memories",
  })
  @IsString()
  @IsOptional()
  description: string;

  @ApiProperty({ example: '2021-12-31T18:00:00.000Z' })
  @IsDateString()
  @IsOptional()
  time_start: string;

  @ApiProperty({ example: '2021-12-31T18:00:00.000Z' })
  @IsDateString()
  @IsOptional()
  time_end: string;

  @ApiProperty({ example: 'red' })
  @IsString()
  @IsOptional()
  color: string;

  @ApiProperty({ example: false })
  @IsBoolean()
  @IsOptional()
  is_all_day: boolean;

  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsNumber()
  category: number;

  @ApiProperty({ example: 'Hanoi' })
  @IsString()
  @IsOptional()
  location: string;

  @ApiProperty({ example: '2021-05-24' })
  @IsString()
  @IsOptional()
  recurrence_exception: string;

  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsOptional()
  recurrence_id: number;

  @ApiProperty({ example: 'FREQ=DAILY;COUNT=10' })
  @IsString()
  @IsOptional()
  recurrence_rule: string;

  @ApiProperty({ example: 'Asia/Ho_Chi_Minh' })
  @IsString()
  @IsOptional()
  start_timezone: string;

  @ApiProperty({ example: 'Asia/Ho_Chi_Minh' })
  @IsString()
  @IsOptional()
  end_timezone: string;
}
