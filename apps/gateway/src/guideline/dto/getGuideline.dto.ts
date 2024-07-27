import { ApiProperty } from '@nestjs/swagger';
import { AbstractDto } from '../../utils';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { Transform } from 'class-transformer';

export class GetGuidelineDto extends AbstractDto {
  @ApiProperty({ type: Number })
  @IsNotEmpty()
  @IsNumber()
  @Transform(({ value }) => parseInt(value, 10))
  id_family: number;
}
