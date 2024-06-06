import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class CreateFamilyDto {
  @IsString()
  @ApiProperty({ example: 'abc' })
  description: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'family' })
  name: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ example: 28 })
  id_order: number;
}
