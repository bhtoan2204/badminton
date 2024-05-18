import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class UpdateInvoiceItemDto {
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
  @IsNumber()
  id_item: number;

  @ApiProperty({ required: true, type: Number })
  @IsOptional()
  @IsString()
  item_name: number;

  @ApiProperty({ required: true, type: Number })
  @IsOptional()
  @IsString()
  item_description: number;

  @ApiProperty({ required: true, type: Number })
  @IsOptional()
  @IsNumber()
  quantity: number;

  @ApiProperty({ required: true, type: Number })
  @IsOptional()
  @IsNumber()
  unit_price: number;
}