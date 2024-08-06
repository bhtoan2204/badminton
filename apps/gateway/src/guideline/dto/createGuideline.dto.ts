import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateGuidelineDto {
  @ApiProperty({ example: 92 })
  @IsNotEmpty()
  @IsNumber()
  id_family: number;

  @ApiProperty({ example: 'Tivi' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 'This guide show you how to use your TV' })
  @IsOptional()
  @IsString()
  description: string;

  @ApiProperty({ example: 'Id Household' })
  @IsOptional()
  @IsNumber()
  id_household_item: number;
}
