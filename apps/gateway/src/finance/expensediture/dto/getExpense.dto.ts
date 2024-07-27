import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AbstractDto } from '../../../utils';
import { Transform } from 'class-transformer';
import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
} from 'class-validator';

export class GetExpenseDto extends AbstractDto {
  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsNumber()
  @Transform(({ value }) => parseInt(value, 10))
  id_family: number;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsDateString()
  fromDate: string;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsDateString()
  toDate: string;
}
