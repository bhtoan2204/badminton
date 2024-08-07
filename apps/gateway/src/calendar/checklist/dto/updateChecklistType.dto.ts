import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateChecklistTypeDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  id_checklist_type: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  id_family: number;

  @ApiProperty()
  @IsOptional()
  @IsString()
  name_en: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  name_vn: string;
}
