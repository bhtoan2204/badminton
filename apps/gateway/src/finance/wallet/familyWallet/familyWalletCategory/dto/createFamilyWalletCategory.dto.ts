import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateFamilyWalletCategoryDto {
  @ApiProperty({ description: 'id of family' })
  @IsNotEmpty()
  @IsNumber()
  id_family: number;

  @ApiProperty({ description: 'name of category' })
  @IsNotEmpty()
  @IsString()
  category_name: string;

  @ApiProperty({ description: 'description of category' })
  @IsOptional()
  @IsString()
  icon_url: string;
}