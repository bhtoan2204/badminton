import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, IsString, Max } from 'class-validator';

export class AbstractDto {
  @ApiProperty({ type: Number, default: 1 })
  @IsNumber()
  @Transform(({ value }) => parseInt(value, 10))
  page: number;

  @ApiProperty({ type: Number, default: 10 })
  @IsNumber()
  @Max(100)
  @Transform(({ value }) => parseInt(value, 10))
  itemsPerPage: number;

  @ApiProperty({ type: String, default: 'created_at' })
  @IsOptional()
  @IsString()
  sortBy: string;

  @ApiProperty({ type: String, default: 'DESC' })
  @IsOptional()
  @IsString()
  sortDirection: 'ASC' | 'DESC';
}
