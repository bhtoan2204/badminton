import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator';

enum ItemCondition {
  New = 'new',
  Good = 'good',
  Fair = 'fair',
  Poor = 'poor',
  Refurbished = 'refurbished',
  Worn = 'worn',
}

export class InputDurableItemDto {
  @ApiProperty({ example: 96, description: 'The ID of the family' })
  @IsNotEmpty()
  @IsNumber()
  id_family: number;

  @ApiProperty({ example: 11, description: 'The ID of the item' })
  @IsNotEmpty()
  @IsNumber()
  id_item: number;

  @ApiProperty({ example: 'good', description: 'The condition of the item' })
  @IsNotEmpty()
  @IsEnum(ItemCondition)
  condition: string;
}
