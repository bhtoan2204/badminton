import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class UpdateFamilyWalletDto {
  @ApiProperty({ description: 'id of wallet' })
  @IsNotEmpty()
  @IsNumber()
  id_wallet: number;

  @ApiProperty({ description: 'id of family' })
  @IsNotEmpty()
  @IsNumber()
  id_family: number;

  @ApiProperty({ description: 'wallet category' })
  @IsOptional()
  @IsNumber()
  id_wallet_category: number;

  @ApiProperty({ description: 'wallet name' })
  @IsOptional()
  @IsString()
  wallet_name: string;

  @ApiProperty({ description: 'current balance' })
  @IsOptional()
  @IsNumber()
  current_balance: number;
}