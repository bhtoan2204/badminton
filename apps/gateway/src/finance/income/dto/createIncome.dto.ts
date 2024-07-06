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

  @ApiProperty({
    description: 'id of user who caused the income',
    example: 'bd94ba3a-b046-4a05-a260-890913e09df9',
  })
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

  @ApiProperty({ description: 'date of income', default: new Date() })
  @IsDateString()
  income_date: string;

  @ApiProperty({ description: 'description of income' })
  @IsOptional()
  @IsString()
  description: string;
}
