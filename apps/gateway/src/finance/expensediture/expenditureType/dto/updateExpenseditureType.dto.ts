import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UpdateExpenseditureTypeDto {
  @ApiProperty({ description: 'Id of expenditure type' })
  @IsNotEmpty()
  @IsNumber()
  id_expenditure_type: number;

  @ApiProperty({ description: 'Id of family' })
  @IsNotEmpty()
  @IsNumber()
  id_family: number;

  @ApiProperty({ description: 'Name of the expenditure type' })
  @IsString()
  @IsNotEmpty()
  expense_type_name: string;
}
