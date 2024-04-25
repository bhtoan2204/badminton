import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateInvestmentDto {
  @ApiProperty({ description: 'Id family', example: 96 })
  @IsNumber()
  @IsNotEmpty()
  id_family: number;

  @ApiProperty({ description: 'Id risk level', example: 1 })
  @IsNumber()
  @IsNotEmpty()
  id_risk_level: number;

  @ApiProperty({ description: 'Id investment type', example: 1 })
  @IsNumber()
  @IsNotEmpty()
  id_investment_type: number;

  @ApiProperty({ description: 'Amount', example: 1000000 })
  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @ApiProperty({ description: 'Purchase date', example: '2024-04-24' })
  @IsNotEmpty()
  @IsDateString()
  purchase_date: Date;

  @ApiProperty({ description: 'Maturity date', example: '2024-09-10' })
  @IsNotEmpty()
  @IsOptional()
  maturity_date: Date;

  @ApiProperty({ description: 'Notes', example: 'This is a note' })
  @IsOptional()
  @IsString()
  notes: string;
}