import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class BanUserDto {
  @ApiProperty({ description: 'User ID' })
  @IsNotEmpty()
  @IsUUID()
  id_user: string;
}
