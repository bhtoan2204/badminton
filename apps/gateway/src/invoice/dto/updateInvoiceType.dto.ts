import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class UpdateInvoiceTypeDto {
  @IsNotEmpty()
  @IsNumber()
  id_invoice_type: number;

  @IsNotEmpty()
  @IsNumber()
  id_family: number;

  @IsNotEmpty()
  @IsString()
  type_name: string
}