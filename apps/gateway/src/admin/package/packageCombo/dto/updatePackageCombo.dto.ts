import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { CreatePackageComboDto } from './createPackageCombo.dto';

export class UpdatePackageComboDto extends PartialType(CreatePackageComboDto) {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ type: [Number], required: false })
  @IsOptional()
  @IsArray()
  id_package_extra?: number[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  price?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}
