import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNumber,
  IsOptional,
  IsString,
  IsEnum,
  Min,
  IsNotEmpty,
} from 'class-validator';

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

  @ApiProperty({
    description: 'type of package',
    example: 'ALL',
    enum: ['ALL', 'MAIN', 'EXTRA', 'COMBO'],
  })
  @IsEnum(['ALL', 'MAIN', 'EXTRA', 'COMBO'])
  @IsNotEmpty()
  type?: 'ALL' | 'MAIN' | 'EXTRA' | 'COMBO';

  @ApiPropertyOptional({
    description: 'Search keyword to filter results',
    example: 'john',
  })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiPropertyOptional({
    description: 'Sort by field',
    example: 'created_at',
  })
  @IsString()
  @IsOptional()
  sortBy?: string;

  @ApiPropertyOptional({
    description: 'Sort direction',
    example: 'DESC',
  })
  @IsEnum(['ASC', 'DESC'])
  @IsOptional()
  sortDirection?: 'ASC' | 'DESC';
}
