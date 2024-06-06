import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class CreateCategoryEventDto {
  @ApiProperty({ example: 'Birthday' })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({ example: 'white' })
  @IsNotEmpty()
  @IsString()
  color: string;

  @ApiProperty({ example: 96 })
  @IsNotEmpty()
  @IsNumber()
  id_family: number;
}
