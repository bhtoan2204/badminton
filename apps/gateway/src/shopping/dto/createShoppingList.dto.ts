import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateShoppingListDto {
  @ApiProperty({ description: 'id of family' })
  @IsNotEmpty()
  @IsNumber()
  id_family: number;

  @ApiProperty({ description: 'title of shopping list' })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({ description: 'description of shopping list' })
  @IsOptional()
  @IsString()
  description: string;
}