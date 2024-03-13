import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNumber } from 'class-validator';

export class OrderDTO {
  @IsNumber()
  @ApiProperty({ example: 1 })
  readonly id_package: number;

  @IsString()
  @ApiProperty({ example: 'NCB' })
  readonly bankCode: string;

  @IsNumber()
  @ApiProperty({ example: 1000 })
  readonly amount: number;

  @IsString()
  @ApiProperty({ example: 'vn' })
  readonly language: string;
}