import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator"

export class UpdateShoppingListDto {
  @ApiProperty({ description: 'id of list' })
  @IsNotEmpty()
  @IsNumber()
  id_list: number

  @ApiProperty({ description: 'id of family' })
  @IsNotEmpty()
  @IsNumber()
  id_family: number

  @ApiProperty({ description: 'title' })
  @IsOptional()
  @IsString()
  title: string

  @ApiProperty({ description: 'description' })
  @IsOptional()
  @IsString()
  description: string
}