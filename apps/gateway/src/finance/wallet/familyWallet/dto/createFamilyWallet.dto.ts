import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateFamilyWalletDto {
  @ApiProperty({ description: 'id of family' })
  @IsNotEmpty()
  @IsNumber()
  id_family: number;

  @ApiProperty({ description: 'wallet name' })
  @IsNotEmpty()
  @IsString()
  wallet_name: string;

  @ApiProperty({ description: 'wallet category' })
  @IsNotEmpty()
  @IsNumber()
  id_wallet_category: number;

  @ApiProperty({ description: 'current balance' })
  @IsNotEmpty()
  @IsNumber()
  current_balance: number;
}