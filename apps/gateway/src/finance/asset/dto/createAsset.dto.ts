import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateAssetDto {
  @ApiProperty({ example: 96, description: 'Family ID' })
  @IsNumber()
  @IsNotEmpty()
  id_family: number;

  @ApiProperty({ example: 'House', description: 'Asset name' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 'A house', description: 'Asset description' })
  @IsOptional()
  @IsString()
  description: string;

  @ApiProperty({ example: 100000, description: 'Asset value' })
  @IsNumber()
  @IsNotEmpty()
  value: number;

  @ApiProperty({ example: '2021-06-01', description: 'Asset purchase date' })
  @IsDateString()
  purchase_date: Date;
}
