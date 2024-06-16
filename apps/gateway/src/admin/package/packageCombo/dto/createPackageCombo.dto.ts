import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class CreatePackageComboDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({ type: [Number] })
  @IsNotEmpty()
  @IsArray()
  id_package_extra: number[];

  @ApiProperty()
  @IsNotEmpty()
  @IsNotEmpty()
  price: number;
}
