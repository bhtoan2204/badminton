import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class UpdateCategoryEventDto {
  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsNumber()
  id_category_event: number;

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
