import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateShoppingListDto {
  @ApiProperty({ description: 'id of family' })
  @IsNotEmpty()
  @IsNumber()
  id_family: number;

  @ApiProperty({ description: 'id of shopping list type' })
  @IsNotEmpty()
  @IsNumber()
  id_shopping_list_type: number;

  @ApiProperty({ description: 'title of shopping list' })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({ description: 'description of shopping list' })
  @IsOptional()
  @IsString()
  description: string;
}
