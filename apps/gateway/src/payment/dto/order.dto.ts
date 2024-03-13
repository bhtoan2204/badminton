import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNumber } from 'class-validator';

export class OrderDTO {
  @IsNumber()
  @ApiProperty({ example: 1 })
  id_package: number;

  @IsString()
  @ApiProperty({ example: 'NCB' })
  bankCode: string;

  @IsNumber()
  @ApiProperty({ example: 1000 })
  amount: number;

  @IsString()
  @ApiProperty({ example: 'vn' })
  language: string;
}