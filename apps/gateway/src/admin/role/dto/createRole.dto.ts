import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateRoleDto {
  @ApiProperty({ description: 'Role name in Vietnamese' })
  @IsNotEmpty()
  @IsString()
  role_name_vn: string;

  @ApiProperty({ description: 'Role name in English' })
  @IsNotEmpty()
  @IsString()
  role_name_en: string;
}
