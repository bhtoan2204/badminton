import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UpdateInvoiceTypeDto {
  @ApiProperty({ required: true, type: Number })
  @IsNotEmpty()
  @IsNumber()
  id_invoice_type: number;

  @ApiProperty({ required: true, type: Number })
  @IsNotEmpty()
  @IsNumber()
  id_family: number;

  @ApiProperty({ required: true, type: String })
  @IsNotEmpty()
  @IsString()
  type_name: string;
}
