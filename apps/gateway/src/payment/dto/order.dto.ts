import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNumber, IsNotEmpty } from 'class-validator';

export class OrderDTO {
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ example: 1 })
  id_package: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'NCB' })
  bankCode: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ example: 100000 })
  amount: number;

  @IsString()
  @ApiProperty({ example: 'vn' })
  language: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'vnpay' })
  method: string;

  @ApiProperty({ example:  ''})
  id_family: number;
}