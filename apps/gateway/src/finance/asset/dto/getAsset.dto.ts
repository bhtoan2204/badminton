import { ApiProperty } from '@nestjs/swagger';
import { AbstractDto } from '../../../utils';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class GetAssetDto extends AbstractDto {
  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsNumber()
  @Transform(({ value }) => parseInt(value, 10))
  id_family: number;
}
