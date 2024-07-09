import { ShoppingListsStatus } from '@app/common';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdateShoppingListDto {
  @ApiProperty({ description: 'id of list' })
  @IsNotEmpty()
  @IsNumber()
  id_list: number;

  @ApiProperty({ description: 'id of family' })
  @IsNotEmpty()
  @IsNumber()
  id_family: number;

  @ApiProperty({ description: 'id of shopping list type' })
  @IsOptional()
  @IsNumber()
  id_shopping_list_type: number;

  @ApiProperty({ description: 'title' })
  @IsOptional()
  @IsString()
  title: string;

  @ApiProperty({ description: 'description' })
  @IsOptional()
  @IsString()
  description: string;

  @ApiProperty({
    type: 'enum',
    enum: ShoppingListsStatus,
    description: 'Status of checklist',
  })
  @IsOptional()
  @IsEnum(ShoppingListsStatus)
  status: ShoppingListsStatus;
}
