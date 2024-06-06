import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsDateString,
  IsOptional,
  IsBoolean,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
  Validate,
} from 'class-validator';

@ValidatorConstraint({ name: 'timeStartBeforeEnd', async: false })
export class TimeStartBeforeEndConstraint
  implements ValidatorConstraintInterface
{
  validate(timeStart: string, args: ValidationArguments) {
    const timeEnd = args.object[args.constraints[0]];
    return new Date(timeStart) <= new Date(timeEnd);
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.property} must be before or equal to ${args.constraints[0]}`;
  }
}

export class CreateCalendarDto {
  @ApiProperty({ example: 'Vinh Ha Long trip' })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    example:
      "The family's off to Ha Long Bay, bonding over its stunning vistas and creating lasting memories",
  })
  @IsString()
  description: string;

  @ApiProperty({ example: 28 })
  @IsNotEmpty()
  @IsNumber()
  id_family: number;

  @ApiProperty({ example: '2021-12-31T18:00:00.000Z' })
  @IsNotEmpty()
  @IsDateString()
  @Validate(TimeStartBeforeEndConstraint, ['time_end'])
  time_start: string;

  @ApiProperty({ example: '2021-12-31T18:00:00.000Z' })
  @IsNotEmpty()
  @IsDateString()
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
