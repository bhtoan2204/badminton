import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdateInvoiceDto {
  @ApiProperty({ required: true, type: Number })
  @IsNotEmpty()
  @IsNumber()
  id_invoice: number;

  @ApiProperty({ required: true, type: Number })
  @IsNotEmpty()
  @IsNumber()
  id_family: number;

  @ApiProperty({ required: true, type: Number })
  @IsOptional()
  @IsNumber()
  id_invoice_type: number;

  @ApiProperty({ required: true, type: Number })
  @IsOptional()
  @IsString()
  invoice_name: string;

  @ApiProperty({ required: true, type: String })
  @IsOptional()
  @IsDateString()
  invoice_date: string;

  @ApiProperty({ required: true, type: String })
  @IsOptional()
  @IsString()
  description: string;
}
