import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateShoppingItemDto {
  @ApiProperty({ description: 'id of list' })
  @IsNotEmpty()
  @IsNumber()
  id_list: number;

  @ApiProperty({ description: 'name of shopping item' })
  @IsNotEmpty()
  @IsString()
  item_name: string;

  @ApiProperty({ description: 'quantity of shopping item' })
  @IsNotEmpty()
  @IsNumber()
  quantity: number;

  @ApiProperty({ description: 'type of shopping item' })
  @IsNotEmpty()
  @IsNumber()
  id_item_type: number;

  @ApiProperty({ description: 'priority level of shopping item' })
  @IsNotEmpty()
  @IsNumber()
  priority_level: number;

  @ApiProperty({
    description: 'reminder date of shopping item',
    example: '2023-08-01T00:00:00.000Z',
  })
  @IsNotEmpty()
  @IsDateString()
  reminder_date: Date;

  @ApiProperty({ description: 'price of shopping item' })
  @IsNotEmpty()
  @IsNumber()
  price: number;

  @ApiProperty({ description: 'description of shopping item' })
  @IsOptional()
  @IsString()
  description: string;
}
