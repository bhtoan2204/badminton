import { IsOptional, IsString, IsInt, Min, IsIn } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class GetLogsFilterDto {
  @ApiPropertyOptional({
    description: 'Log level (e.g., info, error, warn)',
    example: 'info',
  })
  @IsOptional()
  @IsString()
  logLevel?: string;

  @ApiPropertyOptional({
    description: 'Client Public IP address',
    example: '192.168.1.10',
  })
  @IsOptional()
  @IsString()
  ip?: string;

  @ApiPropertyOptional({
    description: 'Requested URL path',
    example: '/api/users',
  })
  @IsOptional()
  @IsString()
  url?: string;

  @ApiPropertyOptional({
    description: 'HTTP method (e.g., GET, POST, PUT)',
    example: 'GET',
  })
  @IsOptional()
  @IsString()
  method?: string;

  @ApiPropertyOptional({
    description: 'Status code (e.g., 200, 404, 500)',
    example: 200,
  })
  @IsOptional()
  @IsString()
  statusCode?: string;

  @ApiPropertyOptional({
    description: 'Log message content',
    example: 'User created successfully',
  })
  @IsOptional()
  @IsString()
  message?: string;

  @ApiPropertyOptional({
    description: 'Page number (starting from 1)',
    example: 1,
  })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Number of items per page',
    example: 10,
  })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  @Min(1)
  itemsPerPage?: number = 10;

  @ApiPropertyOptional({
    description: 'Field to sort by (e.g., @timestamp, responseTimeMs, contentLength)',
    enum: ['@timestamp', 'responseTimeMs', 'contentLength'],
    example: '@timestamp',
  })
  @IsOptional()
  @IsString()
  @IsIn(['@timestamp', 'responseTimeMs', 'contentLength'])
  sortBy?: string = '@timestamp';

  @ApiPropertyOptional({
    description: 'Sort direction',
    enum: ['asc', 'desc'],
    example: 'desc',
  })
  @IsOptional()
  @IsString()
  @IsIn(['asc', 'desc'])
  sortDirection?: 'asc' | 'desc' = 'desc';
}