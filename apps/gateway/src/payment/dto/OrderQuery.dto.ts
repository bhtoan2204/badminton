import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsNotEmpty } from 'class-validator';

export class OrderQueryDTO {
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ example: 1 })
  id_order: number;

  @ApiProperty({ example: '20240313204124' })
  Transdate: string;
}
