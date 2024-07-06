import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateIncomeSourceDto {
  @ApiProperty({ description: 'Id of family' })
  @IsNotEmpty()
  @IsNumber()
  id_family: number;

  @ApiProperty({ example: 'Đi ăn cướp' })
  @IsString()
  @IsNotEmpty()
  income_source_name: string;
}
