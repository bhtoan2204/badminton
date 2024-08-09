import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty } from 'class-validator';

export class GetServiceCountLogsByTimeRangeDto {
  @ApiProperty({
    description:
      'Start date in ISO 8601 format (e.g., 2021-01-01T00:00:00.000Z)',
    example: '2024-05-01T00:00:00.000Z',
  })
  @IsDateString()
  @IsNotEmpty()
  timeStart: string;

  @ApiProperty({
    description: 'End date in ISO 8601 format (e.g., 2021-01-01T00:00:00.000Z)',
    example: '2024-05-30T00:00:00.000Z',
  })
  @ApiProperty()
  @IsDateString()
  @IsNotEmpty()
  timeEnd: string;
}
