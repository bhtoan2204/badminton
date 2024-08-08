import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateChecklistTypeDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  id_family: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  id_calendar: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  icon_url: string;
}
