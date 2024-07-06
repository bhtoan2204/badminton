import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateExpenseDto {
  @ApiProperty({ description: 'id of family' })
  @IsNotEmpty()
  @IsNumber()
  id_family: number;

  @ApiProperty({
    description: 'id of user who caused the income',
    default: 'bd94ba3a-b046-4a05-a260-890913e09df9',
  })
  @IsNotEmpty()
  @IsUUID()
  id_created_by: string;

  @ApiProperty({ description: 'id of expense type' })
  @IsNotEmpty()
  @IsNumber()
  id_expenditure_type: number;

  @ApiProperty({ description: 'amount of expense' })
  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @ApiProperty({ description: 'date of expense' })
  @IsDateString()
  expenditure_date: Date;

  @ApiProperty({ description: 'description of expense' })
  @IsOptional()
  @IsString()
  description: string;
}
