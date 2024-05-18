import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class GetExpenseByMonth {
  @ApiProperty({ description: 'id of family' })
  @IsNotEmpty()
  @IsNumber()
  id_family: number;

  @ApiProperty({ description: 'expense month' })
  @IsNotEmpty()
  @IsNumber()
  month: number;

  @ApiProperty({ description: 'expense year' })
  @IsNotEmpty()
  @IsNumber()
  year: number;
}