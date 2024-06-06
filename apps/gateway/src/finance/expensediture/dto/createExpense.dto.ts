import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateExpenseDto {
  @ApiProperty({ description: 'id of family' })
  @IsNotEmpty()
  @IsNumber()
  id_family: number;

  @ApiProperty({ description: 'id of user who caused the income' })
  @IsNotEmpty()
  @IsString()
  id_created_by: string;

  @ApiProperty({ description: 'id of expense type' })
  @IsNotEmpty()
  @IsNumber()
  id_expense_type: number;

  @ApiProperty({ description: 'amount of expense' })
  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @ApiProperty({ description: 'date of expense' })
  @IsNotEmpty()
  @IsDateString()
  expenditure_date: Date;

  @ApiProperty({ description: 'description of expense' })
  @IsOptional()
  @IsString()
  description: string;
}
