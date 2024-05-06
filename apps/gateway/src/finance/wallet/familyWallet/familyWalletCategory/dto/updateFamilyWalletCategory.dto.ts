import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class UpdateFamilyWalletCategoryDto {
  @ApiProperty({ description: 'id of wallet category' })
  @IsNotEmpty()
  @IsNumber()
  id_wallet_category: number;
  
  @ApiProperty({ description: 'id of family' })
  @IsNotEmpty()
  @IsNumber()
  id_family: number;

  @ApiProperty({ description: 'name of category' })
  @IsOptional()
  @IsString()
  category_name: string;

  @ApiProperty({ description: 'description of category' })
  @IsOptional()
  @IsString()
  icon_url: string;
}