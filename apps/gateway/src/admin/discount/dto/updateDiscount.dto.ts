import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class UpdateDiscountDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  code: string;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  percentage: number;

  @ApiProperty()
  @IsOptional()
  @IsDateString()
  expired_at: Date;
}
