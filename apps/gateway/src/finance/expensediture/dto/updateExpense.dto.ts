import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdateExpenseDto {
  @ApiProperty({ description: 'id of family' })
  @IsNotEmpty()
  @IsNumber()
  id_expenditure: number;

  @ApiProperty({ description: 'id of user who caused the income' })
  @IsOptional()
  @IsString()
  id_created_by: string;

  @ApiProperty({ description: 'id of expense type' })
  @IsOptional()
  @IsNumber()
  id_expense_type: number;

  @ApiProperty({ description: 'amount of expense' })
  @IsOptional()
  @IsNumber()
  amount: number;

  @ApiProperty({ description: 'date of expense' })
  @IsOptional()
  @IsDateString()
  expenditure_date: Date;

  @ApiProperty({ description: 'description of expense' })
  @IsOptional()
  @IsString()
  description: string;
}
