import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class GetAnalyticsDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  limit: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  date_geq: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  date_leq: string;
}