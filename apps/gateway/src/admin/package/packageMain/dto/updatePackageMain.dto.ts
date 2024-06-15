import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdatePackageMainDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  id_main_package: number;

  @ApiProperty()
  @IsOptional()
  @IsString()
  name: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  description: string;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  price: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  duration_months: number;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  is_active: boolean;
}
