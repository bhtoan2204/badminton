import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UpdateIncomeSourceDto {
  @ApiProperty({ description: 'id of income source' })
  @IsNotEmpty()
  @IsNumber()
  id_income_source: number;

  @ApiProperty({ description: 'Id of family' })
  @IsNotEmpty()
  @IsNumber()
  id_family: number;

  @ApiProperty({ example: 'Ăn cướp mãi thôi' })
  @IsString()
  @IsNotEmpty()
  income_source_name: string;
}
