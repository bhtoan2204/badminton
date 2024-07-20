import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateDiscountDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  code: string;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  percentage: number;

  @ApiProperty()
  @IsOptional()
  @IsDateString()
  expired_at: Date;
}
