import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateGuidelineDto {
  @ApiProperty({ example: 93 })
  @IsNotEmpty()
  @IsNumber()
  id_family: number;

  @ApiProperty({ example: 4 })
  @IsNotEmpty()
  @IsNumber()
  id_guideline: number;

  @ApiProperty({ example: 'Tivi version 7749' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    example: 'Updated guideline - This guide show you how to use your TV',
  })
  @IsOptional()
  @IsString()
  description: string;
}
