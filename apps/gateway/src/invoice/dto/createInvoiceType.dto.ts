import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateInvoiceTypeDto {
  @IsNotEmpty()
  @IsNumber()
  id_family: number;

  @IsNotEmpty()
  @IsString()
  type_name: string
}