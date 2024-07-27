import { AbstractDto } from '../../utils';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class GetHouseholdDto extends AbstractDto {
  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsNumber()
  @Transform(({ value }) => parseInt(value, 10))
  id_family: number;
}
