import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateIncomeDto {
  @ApiProperty({ description: 'id of family' })
  @IsNotEmpty()
  @IsNumber()
  id_family: number;

  @ApiProperty({ description: 'id of user who caused the income' })
  @IsNotEmpty()
  @IsString()
  id_created_by: string;

  @ApiProperty({ description: 'id of income source' })
  @IsNotEmpty()
  @IsNumber()
  id_income_source: number;

  @ApiProperty({ description: 'amount of income' })
  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @ApiProperty({ description: 'date of income' })
  @IsNotEmpty()
  @IsDateString()
  income_date: Date;

  @ApiProperty({ description: 'description of income' })
  @IsOptional()
  @IsString()
  description: string;
}
