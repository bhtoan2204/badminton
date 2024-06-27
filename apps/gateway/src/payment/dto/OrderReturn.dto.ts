import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsNotEmpty, IsUUID } from 'class-validator';

export class OrderReturnDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  id_order: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  id_family: number;

  @ApiProperty({ example: 'NCB' })
  @IsNotEmpty()
  @IsString()
  bankCode: string;

  @ApiProperty({ example: 10000000 })
  @IsNotEmpty()
  @IsNumber()
  amount: number;
}
