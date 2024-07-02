import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdateShoppingItemDto {
  @ApiProperty({ description: 'id of family' })
  @IsNotEmpty()
  @IsNumber()
  id_family: number;

  @ApiProperty({ description: 'id of item' })
  @IsNotEmpty()
  @IsNumber()
  id_item: number;

  @ApiProperty({ description: 'id of list' })
  @IsNotEmpty()
  @IsNumber()
  id_list: number;

  @ApiProperty({ description: 'name of shopping item' })
  @IsOptional()
  @IsString()
  item_name: string;

  @ApiProperty({ description: 'quantity of shopping item' })
  @IsOptional()
  @IsNumber()
  quantity: number;

  @ApiProperty({ description: 'is purchased' })
  @IsOptional()
  @IsBoolean()
  is_purchased: boolean;

  @ApiProperty({ description: 'priority level of shopping item' })
  @IsOptional()
  @IsNumber()
  priority_level: number;

  @ApiProperty({
    description: 'reminder date of shopping item',
    example: '2024-06-01T00:00:00.000Z',
  })
  @IsOptional()
  @IsString()
  reminder_date: Date;

  @ApiProperty({ description: 'price of shopping item' })
  @IsOptional()
  @IsNumber()
  price: number;

  @ApiProperty({ description: 'description of shopping item' })
  @IsOptional()
  @IsString()
  description: string;

  @ApiProperty({ description: 'type of shopping item' })
  @IsOptional()
  @IsNumber()
  id_item_type: number;
}
