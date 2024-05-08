import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class UpdateIncomeSourceDto {
  @ApiProperty({ description: 'id of income source' })
  @IsNotEmpty()
  @IsNumber()
  id_income: number;

  @ApiProperty({ description: 'Id of family' })
  @IsNotEmpty()
  @IsNumber()
  id_family: number;

  @ApiProperty({ example: "Robbery" })
  @IsString()
  @IsNotEmpty()
  name: string;
}