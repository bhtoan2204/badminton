import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

// Transformer function to convert empty string to null
function emptyStringToNull({ value }) {
  return value.trim() === '' ? null : value;
}

export class UpdateExpenseDto {
  @ApiProperty({ description: 'id of family' })
  @IsNotEmpty()
  @IsNumber()
  id_expenditure: number;

  @ApiProperty({ description: 'id of family' })
  @IsNotEmpty()
  @IsNumber()
  id_family: number;

  @ApiProperty({ description: 'id of user who caused the income' })
  @IsOptional()
  @Transform(emptyStringToNull)
  @IsUUID()
  id_created_by: string;

  @ApiProperty({ description: 'id of expense type' })
  @IsOptional()
  @Transform(emptyStringToNull)
  @IsNumber()
  id_expenditure_type: number;

  @ApiProperty({ description: 'amount of expense' })
  @IsOptional()
  @Transform(emptyStringToNull)
  @IsNumber()
  amount: number;

  @ApiProperty({ description: 'date of expense' })
  @IsOptional()
  @Transform(emptyStringToNull)
  @IsDateString()
  expenditure_date: Date;

  @ApiProperty({ description: 'description of expense' })
  @IsOptional()
  @Transform(emptyStringToNull)
  @IsString()
  description: string;
}
