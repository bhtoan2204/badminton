import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class GetEventDTO {
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ example: 96 })
  id_family: number;

  @IsString()
  @ApiProperty({ example: '2024-04-04' })
  date: string;
}
