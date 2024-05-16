import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateInvoiceItemDto {
  @ApiProperty({ required: true, type: Number })
  @IsNotEmpty()
  @IsNumber()
  id_family: number;

  @ApiProperty({ required: true, type: Number })
  @IsNotEmpty()
  @IsNumber()
  id_invoice: number;

  @ApiProperty({ required: true, type: Number })
  @IsNotEmpty()
  @IsString()
  item_description: number;

  @ApiProperty({ required: true, type: Number })
  @IsNotEmpty()
  @IsNumber()
  quantity: number;

  @ApiProperty({ required: true, type: Number })
  @IsNotEmpty()
  @IsNumber()
  unit_price: number;
}