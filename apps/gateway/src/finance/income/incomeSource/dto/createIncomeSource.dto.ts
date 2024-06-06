import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateIncomeSourceDto {
  @ApiProperty({ description: 'Id of family' })
  @IsNotEmpty()
  @IsNumber()
  id_family: number;

  @ApiProperty({ example: 'Robbery' })
  @IsString()
  @IsNotEmpty()
  name: string;
}
