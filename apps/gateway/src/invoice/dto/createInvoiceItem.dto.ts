import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

class CreateInvoiceItem {
  @ApiProperty({ required: true, type: String })
  @IsNotEmpty()
  @IsString()
  item_name: string;

  @ApiProperty({ required: true, type: String })
  @IsOptional()
  @IsString()
  item_description: string;

  @ApiProperty({ required: true, type: Number })
  @IsNotEmpty()
  @IsNumber()
  quantity: number;

  @ApiProperty({ required: true, type: Number })
  @IsNotEmpty()
  @IsNumber()
  unit_price: number;
}

export class CreateInvoiceItemDto {
  @ApiProperty({ required: true, type: Number })
  @IsNotEmpty()
  @IsNumber()
  id_family: number;

  @ApiProperty({ required: true, type: Number })
  @IsNotEmpty()
  @IsNumber()
  id_invoice: number;

  @ApiProperty({ required: true, type: [CreateInvoiceItem] })
  @IsNotEmpty()
  items: CreateInvoiceItem[]; 
}