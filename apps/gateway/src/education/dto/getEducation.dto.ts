import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AbstractDto } from '../../utils';
import { IsNotEmpty, IsNumber, IsOptional, IsUUID } from 'class-validator';
import { Transform } from 'class-transformer';

export class GetEducationDto extends AbstractDto {
  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsNumber()
  @Transform(({ value }) => parseInt(value, 10))
  id_family: number;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsUUID()
  id_user: string;
}
