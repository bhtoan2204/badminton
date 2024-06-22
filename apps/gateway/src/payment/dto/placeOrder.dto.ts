import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class PlaceOrderDto {
  @ApiProperty()
  @IsOptional()
  @IsNumber()
  id_main_package: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  id_extra_package: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  id_combo_package: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  id_family: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  bankCode: string;
}
