import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
} from 'class-validator';

export class InputConsumableItemDto {
  @ApiProperty({ example: 96, description: 'The ID of the family' })
  @IsNotEmpty()
  @IsNumber()
  id_family: number;

  @ApiProperty({ example: 11, description: 'The ID of the item' })
  @IsNotEmpty()
  @IsNumber()
  id_item: number;

  @ApiProperty({ example: 5, description: 'The quantity of the item' })
  @IsOptional()
  @IsNumber()
  quantity: number;

  @ApiProperty({ example: 5, description: 'The threshold of the item' })
  @IsNumber()
  @IsOptional()
  threshold: number;

  @ApiProperty({
    example: '2022-12-31',
    description: 'The expiry date of the item',
  })
  @IsDateString()
  @IsOptional()
  expired_date: Date;
}
