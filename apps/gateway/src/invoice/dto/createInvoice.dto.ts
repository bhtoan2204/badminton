import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateInvoiceDto {
  @ApiProperty({ required: true, type: Number })
  @IsNotEmpty()
  @IsNumber()
  id_family: number;

  @ApiProperty({ required: true, type: Number })
  @IsNotEmpty()
  @IsNumber()
  id_invoice_type: number;

  @ApiProperty({ required: true, type: Number })
  @IsNotEmpty()
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