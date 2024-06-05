import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, IsEnum, Min } from 'class-validator';

export class GetListOrdersDto {
  @ApiProperty({
    description: 'The page number for pagination',
    example: 1,
  })
  @IsNumber()
  @Min(1)
  page: number;

  @ApiProperty({
    description: 'Number of items per page',
    example: 10,
  })
  @IsNumber()
  @Min(1)
  itemsPerPage: number;

  @ApiPropertyOptional({
    description: 'Search keyword to filter results',
    example: 'john',
  })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiPropertyOptional({
    description: 'Sort by field',
    enum: ['created_at', 'updated_at', 'status'],
    example: 'created_at',
  })
  @IsString()
  @IsOptional()
  @IsEnum(['created_at', 'updated_at', 'status'])
  sort?: string;

  @ApiPropertyOptional({
    description: 'Package ID to filter results',
    example: 2,
  })
  @IsNumber()
  @IsOptional()
  packageId?: number;
}
