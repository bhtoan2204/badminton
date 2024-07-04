import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsNotEmpty,
  IsUUID,
  IsOptional,
} from 'class-validator';

export class VerifyOrderDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  id_order: string;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  id_family: number;

  @ApiProperty({ example: 'NCB' })
  @IsNotEmpty()
  @IsString()
  bankCode: string;
}
